const API_KEY = 'e49a7a7a98msh13cb57e2b566849p170d69jsn437569ad55e5';
const BASE_URL = 'https://api-football-v1.p.rapidapi.com/v3';
const API_HOST = 'api-football-v1.p.rapidapi.com';

const headers = {
  'X-RapidAPI-Key': API_KEY,
  'X-RapidAPI-Host': API_HOST
};

// fetch teams by league ID
export async function fetchTeamsByLeague(leagueId, season = 2024) {
  const url = `${BASE_URL}/teams?league=${leagueId}&season=${season}`;
  try {
    const response = await fetch(url, { method: 'GET', headers });
    const data = await response.json();
    return data.response;
  } catch (err) {
    console.error('Failed to fetch teams:', err);
    return [];
  }
}

// fetch league standings
export async function fetchStandingsByLeague(leagueId, season = 2024) {
  const url = `${BASE_URL}/standings?league=${leagueId}&season=${season}`;
  try {
    const response = await fetch(url, { method: 'GET', headers });
    const data = await response.json();
    return data.response[0]?.league?.standings[0] || [];
  } catch (err) {
    console.error('Failed to fetch standings:', err);
    return [];
  }
}
