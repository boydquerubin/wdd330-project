import { fetchTeamsByLeague, fetchStandingsByLeague } from './api.js';

const leagueSelect = document.getElementById('leagueSelect');
const seasonSelect = document.getElementById('seasonSelect');
const teamContainer = document.getElementById('teamContainer');
const teamLookup = new Map();
let triviaData = {};

document.addEventListener('DOMContentLoaded', async () => {
  await loadTrivia();
  const leagueId = leagueSelect.value;
  const season = seasonSelect.value;
  loadTeams(leagueId, season);
  loadStandings(leagueId, season);
});

leagueSelect.addEventListener('change', () => {
  const leagueId = leagueSelect.value;
  const season = seasonSelect.value;
  loadTeams(leagueId, season);
  loadStandings(leagueId, season);
});

seasonSelect.addEventListener('change', () => {
  const leagueId = leagueSelect.value;
  const season = seasonSelect.value;
  loadTeams(leagueId, season);
  loadStandings(leagueId, season);
});

// load and render teams
async function loadTeams(leagueId, season) {
  teamContainer.innerHTML = '<p>Loading...</p>';
  const teams = await fetchTeamsByLeague(leagueId, season);
  renderTeams(teams);
}

function renderTeams(teams) {
  teamContainer.innerHTML = '';
  teamLookup.clear();

  teams.forEach(team => {
    const card = document.createElement('div');
    card.className = 'team-card';

    teamLookup.set(team.team.id, team);

    card.innerHTML = `
      <img src="${team.team.logo}" alt="${team.team.name} logo" class="clickable-logo" data-id="${team.team.id}">
      <h3>${team.team.name}</h3>
      <button class="info-btn" data-id="${team.team.id}">More Info</button>
    `;

    teamContainer.appendChild(card);
  });

  document.querySelectorAll('.info-btn, .clickable-logo').forEach(el => {
    el.addEventListener('click', (e) => {
      const teamId = parseInt(e.currentTarget.dataset.id);
      const teamData = teamLookup.get(teamId);
      if (teamData) openModal(teamData);
    });
  });
}

// handles modals
function openModal(team) {
  const modal = document.getElementById('teamModal');
  document.getElementById('modalTeamName').textContent = team.team.name;
  document.getElementById('modalStadium').textContent = team.venue.name;
  document.getElementById('modalCity').textContent = team.venue.city;
  document.getElementById('modalCapacity').textContent = team.venue.capacity.toLocaleString();

  const leagueName = leagueSelect.selectedOptions[0].text;
  const fact = triviaData[leagueName]?.[team.team.name] || 'Fun fact coming soon!';
  document.getElementById('modalFact').textContent = fact;

  modal.classList.remove('hidden');
}

document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('teamModal').classList.add('hidden');
});

// load trivia
async function loadTrivia() {
  try {
    const res = await fetch('src/trivia.json');
    triviaData = await res.json();
  } catch (err) {
    console.error('Failed to load trivia:', err);
    triviaData = {};
  }
}

// render standings
async function loadStandings(leagueId, season) {
  const standings = await fetchStandingsByLeague(leagueId, season);
  const tbody = document.querySelector('#standingsTable tbody');
  tbody.innerHTML = '';
  standings.forEach(team => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${team.rank}</td>
      <td>
        <img src="${team.team.logo}" alt="${team.team.name}" style="width: 20px; vertical-align: middle; margin-right: 8px;">
        ${team.team.name}
      </td>
      <td>${team.points}</td>
      <td>${team.all.win}</td>
      <td>${team.all.draw}</td>
      <td>${team.all.lose}</td>
    `;
    tbody.appendChild(row);
  });
}
