/**
 * Fetches all exerciseTypes from the API.
 * @returns Promise that resolves to an array of exercise types.
 */
export async function fetchExerciseTypes() {
  const response = await fetch('/api/exercise-types');
  if (!response.ok) throw new Error(`fetch Error ${response.status}`);
  return await response.json();
}

/**
 * Posts new exercise entry into the exercises table in the database.
 * @param {Object} 'newLog' - an object with data collected from the form.
 */
export async function postNewLog(newLog) {
  const response = await fetch('/api/exercises', {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newLog)
  });
  if (!response.ok) {
    throw new Error(`Status ${response.status}`);
  }
}

/**
 * Fetches user's logs from the exercises table in the database.
 * @param {Number} 'id' - an integer representing the userId.
 * @returns Promise that resolves to an array of exercise logs.
 */
export async function fetchPersonalLogs(id) {
  const response = await fetch(`/api/exercises/${id}`);
  if (!response.ok) {
    throw new Error(`Status ${response.status}`);
  }
  return await response.json();
}

/**
 * Posts new group information into the groups table in the database.
 * @param {Object} 'group' - an object with data collected from the new group form.
 */
export async function postNewGroup(group) {
  const response = await fetch('/api/new-group', {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(group)
  });
  if (!response.ok) {
    throw new Error(`Status ${response.status}`);
  }
}

/**
 * Fetches user's groups from the groups table in the database.
 * @param {Number} 'id' - an integer representing the userId.
 * @returns Promise that resolves to an array of groups.
 */
export async function fetchGroups(id) {
  const response = await fetch(`/api/groups/${id}`);
  if (!response.ok) {
    throw new Error(`Status ${response.status}`);
  }
  return await response.json();
}
