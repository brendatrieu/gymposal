import 'dotenv/config';
import express from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import ClientError from './lib/client-error.js';
import errorMiddleware from './lib/error-middleware.js';
import pg from 'pg';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear.js';
import weekday from 'dayjs/plugin/weekday.js';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(weekOfYear);
dayjs.extend(weekday);
dayjs.extend(utc);

pg.types.setTypeParser(pg.types.builtins.NUMERIC, parseFloat);

// eslint-disable-next-line no-unused-vars -- Remove when used
const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();
const currentWeek = dayjs().week();

app.use(express.json());

app.get('/api/exercise-types', async (req, res, next) => {
  try {
    const sql = `
      SELECT "type"
      FROM "exerciseTypes"
    `;
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.get('/api/exercises/:userId', async (req, res, next) => {
  try {
    const sql = `
      SELECT "exerciseId",
        "type",
        "date",
        "totalMinutes"
      FROM "users"
      JOIN "exercises" USING ("userId")
      WHERE "userId" = $1
    `;
    const params = [req.params.userId];
    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.get('/api/chart-exercises/:userId', async (req, res, next) => {
  try {
    const sql = `
      SELECT DATE("date") AS "date",
        SUM("totalMinutes") AS "totalMinutes",
        "users"."firstName" AS "firstName"
      FROM "exercises"
      JOIN "users" USING ("userId")
      WHERE "userId" = $1 AND "week" = $2
      GROUP BY DATE("date"), "firstName"
    `;
    const params = [req.params.userId, currentWeek];
    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.get('/api/chart-group-exercises/:groupId', async (req, res, next) => {
  try {
    const sql = `
      SELECT DATE("date") AS "date",
        SUM("totalMinutes") AS "totalMinutes",
        "users"."firstName" AS "firstName"
      FROM "exercises"
      JOIN "users" USING ("userId")
      JOIN "groupUsers" USING ("userId")
      WHERE "groupId" = $1 AND "week" = $2
      GROUP BY DATE("date"), "firstName"
    `;
    const params = [req.params.groupId, currentWeek];
    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.get('/api/groups/:userId', async (req, res, next) => {
  try {
    const sql = `
      SELECT "groups"."groupName",
        SUM("exercises"."totalMinutes") AS "totalMinutes",
        "groups"."groupId"
      FROM "groups"
      JOIN "groupUsers" USING ("groupId")
      JOIN "exercises" USING ("userId")
      JOIN "users" USING ("userId")
      WHERE "groups"."groupId" IN
        (SELECT "groupId"
        FROM "groupUsers"
        WHERE "userId" = $1)
      GROUP BY "groups"."groupId"
    `;
    const params = [req.params.userId];
    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.get('/api/group-users/:groupId', async (req, res, next) => {
  try {
    const sql = `SELECT "userId",
      "users"."firstName"
      FROM "groupUsers"
      JOIN "users" USING ("userId")
      WHERE "groupId" = $1`;
    const params = [req.params.groupId];
    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.get('/api/group-logs/:groupId', async (req, res, next) => {
  try {
    const sql = `
      SELECT "groups"."groupName" AS "groupName",
        "firstName",
        "exercises"."exerciseId" AS "exerciseId",
        "exercises"."type" AS "type",
        "exercises"."date" AS "date",
        "exercises"."totalMinutes" AS "totalMinutes"
      FROM "groups"
      JOIN "groupUsers" USING ("groupId")
      JOIN "exercises" USING ("userId")
      JOIN "users" USING ("userId")
      WHERE "groups"."groupId" = $1
    `;
    const params = [req.params.groupId];
    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.get('/api/group-settings/:groupId', async (req, res, next) => {
  try {
    const sql = `
      SELECT "frequencyReq",
        "intervalReq",
        "durationReq",
        "passQty",
        "groupId",
        "betAmount",
        "groupName",
        "inviteLink"
      FROM "groups"
      WHERE "groupId" = $1
    `;
    const params = [req.params.groupId];
    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.get('/api/user-penalties/:userId', async (req, res, next) => {
  try {
    const sql = `
    SELECT "exercises"."date" AS "date",
      "groups"."groupName" AS "groupName",
      "groups"."groupId" AS "groupId",
      "groups"."intervalReq" AS "intervalReq",
      "groups"."frequencyReq" AS "frequencyReq"
    FROM "groups"
    JOIN "groupUsers" USING ("groupId")
    JOIN "exercises" USING ("userId")
    WHERE "userId" = $1
      AND "groups"."durationReq" <= "exercises"."totalMinutes"
      AND EXTRACT("year" FROM "exercises"."date") = $2
      AND EXTRACT("week" FROM "exercises"."date") = $3
      AND (EXTRACT("week" FROM "groupUsers"."activeDate") != $3 AND EXTRACT("year" FROM "groupUsers"."activeDate") = $2)
    `;
    const currentWeek = dayjs().utc().week();
    const lastWeek = currentWeek === 1 ? 52 : currentWeek - 1;
    const params = [req.params.userId, dayjs().utc().year(), lastWeek];
    const results = await db.query(sql, params);
    const data = results.rows;
    const tracker = {
      groups: [],
      penalties: []
    };
    for (let d = 0; d < data.length; d++) {
      const { groupId, groupName, frequencyReq, intervalReq } = data[d];
      if (tracker.groups.indexOf(groupName) === -1) {
        tracker.groups.push(groupName);
        tracker[groupName] = { id: groupId, frequency: frequencyReq, interval: intervalReq, count: 0 };
      }
      tracker[groupName].count++;
    }
    for (let g = 0; g < tracker.groups.length; g++) {
      const currGroup = tracker[tracker.groups[g]];
      if (currGroup.count < currGroup.frequency) {
        tracker.penalties.push(currGroup.id);
      }
    }
    const sql2 = `
      SELECT "penaltyId"
      FROM "penalties"
    `;
    const result2 = await db.query(sql2);
    const penaltyIds = result2.rows.map(id => id.penaltyId);
    if (penaltyIds.length) {
      const totalPenalties = tracker.penalties.length;
      if (totalPenalties) {
        for (let p = 0; p < totalPenalties; p++) {
          tracker.penalties = tracker.penalties.filter((penalty) => penaltyIds.indexOf(String(penalty).concat(req.params.userId, currentWeek)) === -1);
        }
      }
    }
    let sql3 = `
      INSERT INTO "penalties" ("groupId", "userId", "week", "year")
      VALUES
      `;
    if (tracker.penalties.length) {
      for (let p = 0; p < tracker.penalties.length; p++) {
        if (p !== tracker.penalties.length - 1) {
          sql3 = sql3.concat(`($${p + 4}, $1, $2), `);
        } else {
          sql3 = sql3.concat(`($${p + 4}, $1, $2) `);
        }
      }
      sql3 = sql3.concat('RETURNING *');
      const params3 = [req.params.userId, currentWeek, dayjs().utc().year(), ...tracker.penalties];
      await db.query(sql3, params3);
    }
    const sql4 = `
      SELECT "groups"."groupName" AS "groupName",
        "date",
        "status",
        "groups"."betAmount" AS "betAmount",
        "penaltyId"
      FROM "penalties"
      JOIN "groups" USING ("groupId")
      WHERE "userId" = $1;
    `;
    const params4 = [req.params.userId];
    const results4 = await db.query(sql4, params4);
    res.json(results4.rows);
  } catch (error) {
    next(error);
  }
});

app.post('/api/users', async (req, res, next) => {
  try {
    const sql = `
      INSERT INTO "users"
        ("firstName", "lastName", "email", "username", "password")
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const { firstName, lastName, email, username, password } = req.body;
    const hashedPassword = await argon2.hash(password);
    const params = [firstName, lastName, email, username, hashedPassword];
    const result = await db.query(sql, params);
    const [user] = result.rows;
    if (user) {
      res.status(201).json(user);
    }
  } catch (error) {
    if (error.message.includes('users_email_key') || error.message.includes('users_username_key')) {
      res.status(400).json(error);
    }
    next(error);
  }
});

app.post('/api/sign-in', async (req, res, next) => {
  try {
    const sql = `
      SELECT "userId",
        "firstName",
        "password"
      FROM "users"
      WHERE "username" = $1;
    `;
    const params = [req.body.username];
    const result = await db.query(sql, params);
    const [user] = result.rows;
    const { userId, firstName, password } = user;
    if (!user || !await argon2.verify(password, req.body.password)) {
      throw new ClientError(400, 'Invalid username or password.');
    }
    const payload = { userId, firstName };
    const token = jwt.sign(payload, process.env.TOKEN_SECRET);
    res.json({ token, user: payload });
  } catch (error) {
    next(error);
  }
});

app.post('/api/exercises', async (req, res, next) => {
  try {
    const sql = `
      INSERT INTO "exercises"
        ("userId", "date", "totalMinutes", "type", "typeId", "week", "month")
      VALUES
        ($1, $2, $3, $4,(SELECT "typeId" FROM "exerciseTypes" WHERE "type"=$4), $5, $6)
      RETURNING *;
    `;
    const { userId, date, totalMinutes, type, week, month } = req.body;
    const params = [userId, date, totalMinutes, type, week, month];
    const result = await db.query(sql, params);
    const [log] = result.rows;
    res.status(201).json(log);
  } catch (error) {
    next(error);
  }
});

app.post('/api/new-group', async (req, res, next) => {
  try {
    const sqlGroup = `
      INSERT INTO "groups" ("groupName", "betAmount", "frequencyReq", "intervalReq", "durationReq", "passQty")
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const { groupName, betAmount, frequencyReq, intervalReq, durationReq, passQty, userId } = req.body;
    const paramsGroup = [groupName, betAmount, frequencyReq, intervalReq, durationReq, passQty];
    const newGroup = await db.query(sqlGroup, paramsGroup);
    const [log] = newGroup.rows;
    if (log) {
      const sqlGroupUsers = `
      INSERT INTO "groupUsers" ("userId", "passQty", "remainingPasses", "groupId")
      VALUES ($1, $2, $2, (SELECT "groupId" FROM "groups" WHERE "groupId" = $3))
      RETURNING *;
    `; const paramsGroupUser = [userId, passQty, log.groupId];
      const newGroupUser = await db.query(sqlGroupUsers, paramsGroupUser);
      const [logUser] = newGroupUser.rows;
      res.status(201).json(logUser);
    }
  } catch (error) {
    next(error);
  }
});

app.post('/api/new-group-member', async (req, res, next) => {
  try {
    const sqlGroup = `
      INSERT INTO "groupUsers" ("groupId", "userId", "passQty", "remainingPasses")
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const { groupId, userId, passQty, remainingPasses } = req.body;
    const paramsGroup = [groupId, userId, passQty, remainingPasses];
    const result = await db.query(sqlGroup, paramsGroup);
    res.status(201).json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.patch('/api/group-settings/:groupId', async (req, res, next) => {
  try {
    const sql = `
      UPDATE "groups"
      SET "groupName" = $2,
        "betAmount" = $3,
        "frequencyReq" = $4,
        "intervalReq" = $5,
        "durationReq" = $6,
        "passQty" = $7
      WHERE "groupId" = $1
      RETURNING *;
    `;
    const { groupName, betAmount, frequencyReq, intervalReq, durationReq, passQty } = req.body;
    const params = [
      req.params.groupId,
      groupName,
      betAmount,
      frequencyReq,
      intervalReq,
      durationReq,
      passQty
    ];
    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
