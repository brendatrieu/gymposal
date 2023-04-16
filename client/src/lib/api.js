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
