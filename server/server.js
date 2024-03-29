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
import timezone from 'dayjs/plugin/timezone.js';
import schedule from 'node-schedule';
import { assessUsers } from './lib/scheduled-jobs.js';

dayjs.extend(weekOfYear);
dayjs.extend(weekday);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Los_Angeles');

pg.types.setTypeParser(pg.types.builtins.NUMERIC, parseFloat);

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();
const reactStaticDir = new URL('../client/build', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
app.use(express.static(uploadsStaticDir));
app.use(express.json());

// Set up a job with a recurrence rule to run every Sunday at 8AM UTC, which is equivalent to Saturday at 1AM PDT or 12AM PST
schedule.scheduleJob({ hour: 8, minute: 0, dayOfWeek: 0, tz: 'Etc/UTC' }, async function () {
  try {
    await assessUsers(db);
  } catch (error) {
    console.error(error);
  }
});

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
      SELECT "date",
        "totalMinutes",
        "week"
      FROM "exercises"
      WHERE "userId" = $1
    `;
    const currentWeek = dayjs.tz().week();
    const params = [req.params.userId];
    const result = await db.query(sql, params);
    const data = result.rows.filter(entry => dayjs.tz(entry.date).week() === currentWeek);
    data.sort((a, b) => a.date - b.date);
    let byDate = [];
    data.forEach((entry) => {
      entry.date = dayjs(entry.date).tz('America/Los_Angeles').format('MM/DD/YY');
      if (!Object.prototype.hasOwnProperty.call(byDate, entry.date)) {
        byDate[entry.date] = entry.totalMinutes;
      } else {
        byDate[entry.date] += entry.totalMinutes;
      }
    });
    byDate = Object.entries(byDate).map((entry) => ({ date: entry[0], totalMinutes: entry[1] }));
    res.json(byDate);
  } catch (error) {
    next(error);
  }
});

app.get('/api/chart-group-exercises/:groupId', async (req, res, next) => {
  try {
    const sql = `
      SELECT "date",
        "totalMinutes",
        "userId",
        "users"."firstName" AS "firstName"
      FROM "exercises"
      JOIN "users" USING ("userId")
      JOIN "groupUsers" USING ("userId")
      WHERE "groupId" = $1 AND "week" = $2
    `;
    const currentWeek = dayjs().week();
    const params = [req.params.groupId, currentWeek];
    const result = await db.query(sql, params);
    const data = result.rows;
    data.sort((a, b) => a.date - b.date);
    const byUser = {};
    data.forEach((entry) => {
      entry.date = dayjs(entry.date).tz('America/Los_Angeles').format('MM/DD/YY');
      if (!Object.prototype.hasOwnProperty.call(byUser, entry.userId)) {
        byUser[entry.userId] = { dates: [entry.date], entries: [{ date: entry.date, userId: entry.userId, firstName: entry.firstName, totalMinutes: entry.totalMinutes }] };
      } else {
        const index = byUser[entry.userId].dates.indexOf(entry.date);
        if (index === -1) {
          byUser[entry.userId].dates.push(entry.date);
          byUser[entry.userId].entries.push({ date: entry.date, userId: entry.userId, firstName: entry.firstName, totalMinutes: entry.totalMinutes });
        } else {
          byUser[entry.userId].entries[index].totalMinutes += entry.totalMinutes;
        }
      }
    });
    const userEntries = Object.values(byUser).map((user) => user.entries);
    let consolidated = [];
    userEntries.forEach((user) => (consolidated = [...consolidated, ...user]));
    res.json(consolidated);
  } catch (error) {
    next(error);
  }
});

app.get('/api/groups/:userId', async (req, res, next) => {
  try {
    const sql = `
      SELECT "groups"."groupName",
        COALESCE(SUM("exercises"."totalMinutes"), 0) as "totalMinutes",
        "groups"."groupId"
      FROM "groups"
      JOIN "groupUsers" USING ("groupId")
      LEFT JOIN "exercises" USING ("userId")
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
        "groupName"
      FROM "groups"
      WHERE "groupId" = $1
    `;
    const params = [req.params.groupId];
    const result = await db.query(sql, params);
    if (result.rows.length === 0) {
      throw new ClientError(404, 'Invalid group ID.');
    }
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.get('/api/user-penalties/:userId', async (req, res, next) => {
  try {
    const sql = `
      SELECT "groups"."groupName" AS "groupName",
        "date",
        "status",
        "groups"."betAmount" AS "betAmount",
        "penaltyId"
      FROM "penalties"
      JOIN "groups" USING ("groupId")
      WHERE "userId" = $1;
    `;
    const params = [req.params.userId];
    const results = await db.query(sql, params);
    res.json(results.rows);
  } catch (error) {
    next(error);
  }
});

app.get('/api/group-penalties/:groupId', async (req, res, next) => {
  try {
    const sql4 = `
      SELECT "users"."firstName" AS "firstName",
        "date",
        "status",
        "groups"."betAmount" AS "betAmount",
        "penaltyId"
      FROM "penalties"
      JOIN "groups" USING ("groupId")
      JOIN "users" USING ("userId")
      WHERE "groupId" = $1;
    `;
    const params4 = [req.params.groupId];
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
    if (error.message?.includes('users_email_key') || error.message?.includes('users_username_key')) {
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
    `;
      const paramsGroupUser = [userId, passQty, log.groupId];
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

app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
