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
 * Fetches user's logs from the exercises table in the API.
 * @param {Number} 'id' - an integer representing the userId.
 * @returns Promise that resolves to an array of exercise logs grouped by date.
 */
export async function fetchUserChartLogs(id) {
  const response = await fetch(`/api/chart-exercises/${id}`);
  if (!response.ok) {
    throw new Error(`Status ${response.status}`);
  }
  return await response.json();
}

/**
 * Fetches group's logs from the exercises table in the API.
 * @param {Number} 'id' - an integer representing the groupId.
 * @returns Promise that resolves to an array of group members' IDs and first names.
 */
export async function fetchGroupUsers(id) {
  const response = await fetch(`/api/group-users/${id}`);
  if (!response.ok) {
    throw new Error(`Status ${response.status}`);
  }
  return await response.json();
}

/**
 * Fetches group's logs from the exercises table in the API.
 * @param {Number} 'id' - an integer representing the groupId.
 * @returns Promise that resolves to an array of exercise logs grouped by date.
 */
export async function fetchGroupChartLogs(id) {
  const response = await fetch(`/api/chart-group-exercises/${id}`);
  if (!response.ok) {
    throw new Error(`Status ${response.status}`);
  }
  return await response.json();
}

/**
 * Fetches user's logs from the exercises table in the API.
 * @param {Number} 'id' - an integer representing the userId.
 * @returns Promise that resolves to an array of exercise logs.
 */
export async function fetchUserLogs(id) {
  const response = await fetch(`/api/exercises/${id}`);
  if (!response.ok) {
    throw new Error(`Status ${response.status}`);
  }
  return await response.json();
}

/**
 * Fetches user's groups from the groups table in the API.
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

/**
 * Fetches group exercises from the API.
 * @param {Number} 'id' - an integer representing the groupId.
 * @returns Promise that resolves to an array of exercise logs for all group members.
 */
export async function fetchGroupLogs(id) {
  const response = await fetch(`/api/group-logs/${id}`);
  if (!response.ok) {
    throw new Error(`Status ${response.status}`);
  }
  return await response.json();
}

/**
 * Fetches group data from the API.
 * @param {Number} 'id' - an integer representing the groupId.
 * @returns Promise that resolves to an array of group settings data.
 */
export async function fetchGroupSettings(id) {
  const response = await fetch(`/api/group-settings/${id}`);
  if (!response.ok) {
    throw new Error(`Status ${response.status}`);
  }
  return await response.json();
}

/**
 * Fetches group data from the API.
 * @param {Number} 'id' - an integer representing the groupId.
 * @returns Promise that resolves to an array of group penalties data.
 */
export async function fetchGroupPenalties(id) {
  const response = await fetch(`/api/group-penalties/${id}`);
  if (!response.ok) {
    throw new Error(`Status ${response.status}`);
  }
  return await response.json();
}

/**
 * Fetches penalties data from the API.
 * @param {Number} 'id' - an integer representing the userId.
 * @returns Promise that resolves to an array of the user's penalties.
 */
export async function fetchUserPenalties(id) {
  const response = await fetch(`/api/user-penalties/${id}`);
  if (!response.ok) {
    throw new Error(`Status ${response.status}`);
  }
  return await response.json();
}

/**
 * Fetches all login information and verifies account from the API.
 * @returns Promise that resolves to an object with a token and user information.
 */
export async function postAccount(account) {
  const response = await fetch('/api/sign-in', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(account)
  });
  if (!response.ok) {
    return;
  }
  return await response.json();
}

/**
 * Posts new account into the users table in the API.
 * @param {Object} 'account' - an object with data collected from the form.
 */
export async function postNewAccount(account) {
  const response = await fetch('/api/users', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(account)
  });
  if (!response.ok) {
    const result = await response.json();
    if (result.detail?.includes('email')) {
      return { severity: 'error', message: 'An account with this email already exists. Please try again.' };
    } else if (result.detail?.includes('username')) {
      return { severity: 'error', message: 'An account with this username already exists. Please try again.' };
    } else {
      return { severity: 'error', message: 'An unexpected error occurred. Please try again.' };
    }
  }
  return { severity: 'success', message: 'Account successfully created.' };
}

/**
 * Posts new exercise entry into the exercises table in the API.
 * @param {Object} 'newLog' - an object with data collected from the form.
 */
export async function postNewLog(newLog) {
  const response = await fetch('/api/exercises', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newLog)
  });
  if (!response.ok) {
    throw new Error(`Status ${response.status}`);
  }
}

/**
 * Posts new group information into the groups table in the API.
 * @param {Object} 'group' - an object with data collected from the new group form.
 * @returns {Object} Data for the new group record.
 */
export async function postNewGroup(group) {
  const response = await fetch('/api/new-group', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(group)
  });
  if (!response.ok) {
    throw new Error(`Status ${response.status}`);
  }
  return await response.json();
}

/**
 * Posts new group member into the groupUsers table in the API.
 * @param {Object} 'group' - an object with the groupId, userId, passQty, and remainingPasses.
 * @returns {Object} Data for the new group member record.
 */
export async function postNewGroupMember(member) {
  const response = await fetch('/api/new-group-member', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(member)
  });
  if (!response.ok) {
    throw new Error(`Status ${response.status}`);
  }
  return await response.json();
}

/**
 * Updates group data in the API.
 * @param {Number} 'id' - an integer representing the groupId.
 * @param {Object} 'group' - an object with data collected from the group settings form.
 */
export async function patchGroupSettings(id, group) {
  const response = await fetch(`/api/group-settings/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(group)
  });
  if (!response.ok) {
    throw new Error(`Status ${response.status}`);
  }
  return await response.json();
}
