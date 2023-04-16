import { useContext } from 'react';
import AppContext from '../context/AppContext';

const url = (path) => `${process.env.REACT_APP_BASE_URL}${path}`;

/**
 * Fetches all exerciseTypes from the API.
 * @returns Promise that resolves to an array of exercise types.
 */
export async function fetchExerciseTypes() {
  const res = await fetch(url('/api/exerciseTypes'));
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
}

/**
 * Fetches all exerciseTypes from the API.
 * @param {Object} 'newLog' - an object with data collected from the form.
 * @param {Number} id - the id of the logged in user.
 * @returns Promise that resolves to an array of exercise types.
 */
export async function PostNewLog(newLog, id) {

  newLog.userId = id;
  const response = await fetch(url('/api/exercises1'), {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newLog)
  });

  if (!response.ok) {
    throw new Error(`Status ${response.status}`);
  }
}
