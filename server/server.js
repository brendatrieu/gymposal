import 'dotenv/config';
import express from 'express';
import errorMiddleware from './lib/error-middleware.js';
import pg from 'pg';

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
        FROM "exercises"
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
      SELECT "groupName",
          "type",
          "date",
          "totalMinutes"
        FROM "exercises"
        WHERE "userId" = $1
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
      SELECT "groupName",
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

app.post('/api/exercises', async (req, res, next) => {
  try {
    const sql = `
      INSERT INTO "exercises" ("userId", "date", "totalMinutes", "type", "typeId")
        VALUES($1, $2, $3, $4, (SELECT "typeId" FROM "exerciseTypes" WHERE "type"=$4))
      RETURNING *;
    `;
    const { userId, date, totalMinutes, type } = req.body;
    const params = [userId, date, totalMinutes, type];
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
        VALUES ($1, $2, $2, (SELECT "groupId" FROM "groups" WHERE "groupName" = $3))
      RETURNING *;
    `; const paramsGroupUser = [userId, passQty, groupName];
      const newGroupUser = await db.query(sqlGroupUsers, paramsGroupUser);
      const [logUser] = newGroupUser.rows;
      res.status(201).json(logUser);
    }
  } catch (err) {
    next(err);
  }
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
