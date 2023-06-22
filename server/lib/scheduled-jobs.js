import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear.js';
import weekday from 'dayjs/plugin/weekday.js';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(weekOfYear);
dayjs.extend(weekday);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Los_Angeles');

/**
 * Queries for exercise data of active users.
 * @param {Object} db used for SQL queries
 * @returns {Array} Includes the userId at the current exercise data for all active users where the exercise total minutes are equal to or greater than the group duration requirements. If user does not have any, an empty row will be returned for that respective group and user combination.
 */
export async function assessUsers(db) {
  const sqlUsers = `
      SELECT "userId"
      FROM "users"
      WHERE "active" = true;
    `;
  const result = await db.query(sqlUsers);
  const userIds = result.rows.map(user => user.userId);
  if (userIds.length) {
    userIds.forEach(async (userId) => {
      const existingExercises = await initialExercises(db, userId);
      const tracker = await qualifyExercises(db, existingExercises);
      let updatedTracker = null;
      if (tracker.penalties.length) {
        updatedTracker = await queryPenalties(db, userId, tracker);
        if (updatedTracker.penalties.length) {
          await createPenalties(db, userId, updatedTracker);
        }
      }
    });
  }
}

/**
 * Queries for exercises in the database.
 * @param {Object} db used for SQL queries
 * @param {Number} userId used for SQL queries
 * @returns {Array} Current exercise data for the user where the exercise total minutes are equal to or greater than the group duration requirements. If user does not have any, an empty row will be returned for that respective group and user combination.
 */
export async function initialExercises(db, userId) {
  const sql = `
    SELECT "groupUsers"."userId",
      "groups"."groupName" AS "groupName",
      "groups"."groupId" AS "keyGroupId",
      "groups"."intervalReq" AS "intervalReq",
      "groups"."frequencyReq" AS "frequencyReq",
      "groupUsers"."activeDate" AS "activeDate",
      "Count".*
    FROM "groups"
    JOIN "groupUsers" USING ("groupId")
    FULL OUTER JOIN (SELECT "exercises"."date",
    "groupUsers"."groupId"
    FROM "groups"
    JOIN "groupUsers" USING ("groupId")
    JOIN "exercises" USING ("userId")
    WHERE "groupUsers"."userId" = $1 and "groups"."durationReq" <= "exercises"."totalMinutes") AS "Count" USING ("groupId")
    WHERE "groupUsers"."userId" = $1
    `;
  const params = [userId];
  const results = await db.query(sql, params);
  return results.rows;
}

/**
 * Assesses exercises to see which qualify towards weekly count for challenges.
 * @param {Object} db used for SQL queries
 * @returns {Object} Contains groups and corresponding penalties. {groups, penalties}
 */
export async function qualifyExercises(db, data) {
  const currentWeek = dayjs.tz().week();
  const currentYear = dayjs.tz().year();
  const lastWeek = currentWeek === 1 ? 52 : currentWeek - 1;
  data.forEach((entry) => {
    entry.year = dayjs.tz(entry.date).year();
    entry.week = dayjs.tz(entry.date).week();
    entry.activeYear = dayjs.tz(entry.activeDate).year();
    entry.activeWeek = dayjs.tz(entry.activeDate).week();
  });
  data = data.filter((entry) => (
    (entry.activeYear === currentYear ? entry.activeWeek !== lastWeek : true)
  ));
  const tracker = {
    groups: [],
    penalties: []
  };
  for (let d = 0; d < data.length; d++) {
    const { keyGroupId, groupName, frequencyReq, intervalReq, year, week } = data[d];
    if (tracker.groups.indexOf(groupName) === -1) {
      tracker.groups.push(groupName);
      tracker[groupName] = { id: keyGroupId, frequency: frequencyReq, interval: intervalReq, count: 0 };
    }
    if (year === currentYear && week === lastWeek) {
      tracker[groupName].count++;
    }
  }
  for (let g = 0; g < tracker.groups.length; g++) {
    const currGroup = tracker[tracker.groups[g]];
    if (currGroup.count < currGroup.frequency) {
      tracker.penalties.push(currGroup.id);
    }
  }
  return tracker;
}

/**
 * Assesses penalties to see which have been inputted already.
 * @param {Object} db used for SQL queries
 * @param {Number} userId unique identifier for user
 * @param {Object} tracker includes keys for groups and penalties to compare against
 * @returns {Object} Contains groups and corresponding penalties. {groups, penalties}
 */
export async function queryPenalties(db, userId, tracker) {
  const modifiedTracker = tracker;
  const currentWeek = dayjs.tz().week();
  const currentYear = dayjs.tz().year();
  const sql2 = `
      SELECT "penaltyId"
      FROM "penalties"
    `;
  const result2 = await db.query(sql2);
  const penaltyIds = result2.rows.map(id => id.penaltyId);
  if (penaltyIds.length) {
    const totalPenalties = modifiedTracker.penalties.length;
    if (totalPenalties) {
      for (let p = 0; p < totalPenalties; p++) {
        modifiedTracker.penalties = modifiedTracker.penalties.filter((penalty) => penaltyIds.indexOf(String(penalty).concat(userId, currentWeek, currentYear)) === -1);
      }
    }
  }
  return modifiedTracker;
}

/**
 * Creates penalty records and adds them to the database.
 * @param {Object} db used for SQL queries
 * @param {Number} userId unique identifier for user
 * @param {Object} tracker includes keys for groups and penalties to compare against
 * @returns {Object} Contains groups and corresponding penalties. {groups, penalties}
 */
export async function createPenalties(db, userId, tracker) {
  const currentWeek = dayjs.tz().week();
  const currentYear = dayjs.tz().year();
  let sql3 = `
          INSERT INTO "penalties" ("groupId", "userId", "week", "year")
          VALUES
          `;
  if (tracker.penalties.length) {
    for (let p = 0; p < tracker.penalties.length; p++) {
      if (p !== tracker.penalties.length - 1) {
        sql3 = sql3.concat(`($${p + 4}, $1, $2, $3), `);
      } else {
        sql3 = sql3.concat(`($${p + 4}, $1, $2, $3) `);
      }
    }
    sql3 = sql3.concat('RETURNING *');
    const params3 = [userId, currentWeek, currentYear, ...tracker.penalties];
    await db.query(sql3, params3);
  }
}
