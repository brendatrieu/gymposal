import 'dotenv/config';
import express from 'express';
import errorMiddleware from './lib/error-middleware.js';
import pg from 'pg';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear.js';

dayjs.extend(weekOfYear);

pg.types.setTypeParser(pg.types.builtins.NUMERIC, parseFloat);

// eslint-disable-next-line no-unused-vars -- Remove when used
const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/build', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

app.get('/api/exercise-types', async (req, res, next) => {
  try {
    const sql = `
      SELECT "type"
        FROM "exerciseTypes"
    `;
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
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
  } catch (err) {
    next(err);
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
  } catch (err) {
    next(err);
  }
});

app.get('/api/group-logs/:groupId', async (req, res, next) => {
  try {
    const sql = `
      SELECT "groups"."groupName",
        "firstName",
        "exercises"."exerciseId",
        "exercises"."type",
        "exercises"."date",
        "exercises"."totalMinutes"
      FROM "groups"
      JOIN "groupUsers" USING ("groupId")
      JOIN "exercises" USING ("userId")
      JOIN "users" USING ("userId")
      WHERE "groups"."groupId" = $1
    `;
    const params = [req.params.groupId];
    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
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
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.get('/api/personal-penalties/:userId', async (req, res, next) => {
  try {
    const sql = `
      SELECT "exercises"."week" AS "week",
        "exercises"."month" AS "month",
        "groups"."groupName" AS "groupName",
        "groups"."groupId" AS "groupId",
        "groups"."intervalReq" AS "intervalReq",
        "groups"."frequencyReq" AS "frequencyReq"
      FROM "exercises"
      JOIN "groupUsers" USING ("userId")
      JOIN "groups" USING ("groupId")
      WHERE "userId" = $1
        AND "groups"."durationReq" <= "exercises"."totalMinutes"
    `;
    const lastWeek = dayjs().week() === 1 ? 51 : dayjs().week() - 1;
    const lastMonth = dayjs().month() === 0 ? 12 : dayjs().month();
    const params = [req.params.userId];
    const result = await db.query(sql, params);
    const data = result.rows;
    const tracker = {
      groups: [],
      penalties: []
    };
    for (let d = 0; d < data.length; d++) {
      const { week, month, groupId, groupName, frequencyReq, intervalReq } = data[d];
      if (tracker.groups.indexOf(groupName) === -1) {
        tracker.groups.push(groupName);
        tracker[groupName] = { id: groupId, frequency: frequencyReq, interval: intervalReq, count: 0 };
      }
      if (tracker[groupName].interval === 'Weekly') {
        if (week === lastWeek) {
          tracker[groupName].count++;
        }
      } else {
        if (month === lastMonth) {
          tracker[groupName].count++;
        }
      }
    }
    for (let g = 0; g < tracker.groups.length; g++) {
      const currGroup = tracker[tracker.groups[g]];
      if (currGroup.count < currGroup.frequency) {
        tracker.penalties.push(currGroup.id);
      }
    }
    let sql2 = `
      INSERT INTO "penalties" ("groupId", "userId")
      VALUES
      `;
    for (let p = 0; p < tracker.penalties.length; p++) {
      if (p !== tracker.penalties.length - 1) {
        sql2 = sql2.concat(`($${p + 2}, $1), `);
      } else {
        sql2 = sql2.concat(`($${p + 2}, $1) `);
      }
    }
    sql2 = sql2.concat('RETURNING *');
    const params2 = [req.params.userId, ...tracker.penalties];
    await db.query(sql2, params2);
    const sql3 = `
      SELECT "groups"."groupName",
        "date",
        "status"
      FROM "penalties"
      JOIN "groups" USING ("groupId")
      WHERE "userId" = $1;
    `;
    const results3 = await db.query(sql3, params);
    res.json(results3.rows);
  } catch (err) {
    next(err);
  }
});

app.post('/api/exercises', async (req, res, next) => {
  try {
    const sql = `
      INSERT INTO "exercises" ("userId", "date", "totalMinutes", "type", "typeId", "week", "month")
        VALUES($1, $2, $3, $4,(SELECT "typeId" FROM "exerciseTypes" WHERE "type"=$4), $5, $6)
      RETURNING *;
    `;
    const { userId, date, totalMinutes, type, week, month } = req.body;
    const params = [userId, date, totalMinutes, type, week, month];
    const result = await db.query(sql, params);
    const [log] = result.rows;
    res.status(201).json(log);
  } catch (err) {
    next(err);
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
  } catch (err) {
    next(err);
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
  } catch (err) {
    next(err);
  }
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
