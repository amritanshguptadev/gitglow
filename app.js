/* ================================================================
   GitGlow — app.js
   GitHub Public API integration, charts, animations
   ================================================================ */

'use strict';

// ── DOM REFS ──────────────────────────────────────────────────────
const usernameInput = document.getElementById('username-input');
const searchBtn     = document.getElementById('search-btn');
const btnSpinner    = document.getElementById('btn-spinner');
const btnText       = searchBtn.querySelector('.btn-text');
const searchError   = document.getElementById('search-error');
const errorMsg      = document.getElementById('error-msg');
const hero          = document.getElementById('hero');
const dashboard     = document.getElementById('dashboard');
const backBtn       = document.getElementById('back-btn');
const backBtnTop    = document.getElementById('back-btn-top');

// ── LANGUAGE COLORS MAP ───────────────────────────────────────────
const LANG_COLORS = {
  JavaScript:  '#f7df1e',
  TypeScript:  '#3178c6',
  Python:      '#3572A5',
  Java:        '#b07219',
  C:           '#555555',
  'C++':       '#f34b7d',
  'C#':        '#178600',
  Ruby:        '#701516',
  Go:          '#00ADD8',
  Rust:        '#dea584',
  PHP:         '#4F5D95',
  Swift:       '#F05138',
  Kotlin:      '#A97BFF',
  Dart:        '#00B4AB',
  Shell:       '#89e051',
  HTML:        '#e34c26',
  CSS:         '#563d7c',
  SCSS:        '#c6538c',
  Vue:         '#41b883',
  Svelte:      '#ff3e00',
  Astro:       '#ff5a03',
  Lua:         '#000080',
  R:           '#198CE7',
  MATLAB:      '#e16737',
  Haskell:     '#5e5086',
  Scala:       '#c22d40',
  Elixir:      '#6e4a7e',
  Clojure:     '#db5855',
  Perl:        '#0298c3',
  Dockerfile:  '#384d54',
};

function getLangColor(lang) {
  return LANG_COLORS[lang] || '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
}

// ── UTILITY FUNCTIONS ─────────────────────────────────────────────
function formatNumber(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'k';
  return String(n);
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  const weeks = Math.floor(days / 7);
  const months= Math.floor(days / 30);
  if (mins < 60)   return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  if (days < 7)    return `${days}d ago`;
  if (weeks < 5)   return `${weeks}w ago`;
  return `${months}mo ago`;
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── GITHUB API FETCH ──────────────────────────────────────────────
const BASE = 'https://api.github.com';

async function apiFetch(path) {
  const res = await fetch(BASE + path, {
    headers: { Accept: 'application/vnd.github+json' }
  });
  if (!res.ok) throw Object.assign(new Error('GitHub API error'), { status: res.status });
  return res.json();
}

// ── SEARCH LOGIC ─────────────────────────────────────────────────
async function handleSearch(username) {
  username = username.trim().replace(/^@/, '');
  if (!username) {
    showError('Please enter a GitHub username.');
    return;
  }
  hideError();
  setLoading(true);

  try {
    const [user, repos, events] = await Promise.all([
      apiFetch(`/users/${username}`),
      apiFetch(`/users/${username}/repos?per_page=100&sort=stars`),
      apiFetch(`/users/${username}/events/public?per_page=30`),
    ]);
    renderDashboard(user, repos, events);
  } catch (err) {
    if (err.status === 404) showError(`User "${username}" not found on GitHub.`);
    else if (err.status === 403) showError('GitHub API rate limit reached. Please wait a minute and try again.');
    else showError('Something went wrong. Please try again.');
    setLoading(false);
  }
}

function setLoading(on) {
  searchBtn.disabled = on;
  btnText.hidden     = on;
  btnSpinner.hidden  = !on;
}

function showError(msg) {
  errorMsg.textContent = msg;
  searchError.hidden = false;
}
function hideError() {
  searchError.hidden = true;
}

// ── RENDER DASHBOARD ──────────────────────────────────────────────
function renderDashboard(user, repos, events) {
  // Transition
  hero.classList.add('hidden');
  dashboard.classList.remove('hidden');
  setLoading(false);

  renderProfile(user);
  renderStats(user, repos);
  renderLanguageChart(repos);
  renderStarsChart(repos);
  renderRepos(repos);
  renderActivity(events);

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── PROFILE ───────────────────────────────────────────────────────
function renderProfile(u) {
  document.getElementById('profile-avatar').src = u.avatar_url;
  document.getElementById('profile-avatar').alt = u.login;
  document.getElementById('profile-name').textContent  = u.name || u.login;
  document.getElementById('profile-login').textContent = '@' + u.login;
  document.getElementById('profile-bio').textContent   = u.bio || '';
  document.getElementById('profile-link').href         = u.html_url;

  const meta = [];
  if (u.location) meta.push({ icon: '📍', text: u.location });
  if (u.company)  meta.push({ icon: '🏢', text: u.company });
  if (u.blog)     meta.push({ icon: '🔗', text: u.blog });
  if (u.twitter_username) meta.push({ icon: '𝕏', text: '@' + u.twitter_username });

  document.getElementById('profile-meta').innerHTML = meta.map(m =>
    `<span class="meta-item"><span>${m.icon}</span> ${escapeHTML(m.text)}</span>`
  ).join('');
}

// ── STATS ─────────────────────────────────────────────────────────
function renderStats(u, repos) {
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);

  const stats = [
    { icon: '⭐', value: formatNumber(totalStars), label: 'Total Stars', color: '#facc15' },
    { icon: '🍴', value: formatNumber(totalForks), label: 'Total Forks', color: '#22d3ee' },
    { icon: '📦', value: formatNumber(u.public_repos), label: 'Repos', color: '#a855f7' },
    { icon: '👥', value: formatNumber(u.followers), label: 'Followers', color: '#4ade80' },
    { icon: '➡️', value: formatNumber(u.following), label: 'Following', color: '#fb923c' },
    { icon: '🗂️', value: formatNumber(u.public_gists), label: 'Gists', color: '#ec4899' },
  ];

  document.getElementById('stats-grid').innerHTML = stats.map((s, i) =>
    `<div class="stat-card animate-in" style="--stat-color:${s.color}; animation-delay:${i * 0.07}s">
       <span class="stat-icon">${s.icon}</span>
       <span class="stat-value">${s.value}</span>
       <span class="stat-label">${s.label}</span>
     </div>`
  ).join('');
}

// ── LANGUAGE DONUT CHART ──────────────────────────────────────────
function renderLanguageChart(repos) {
  const counts = {};
  repos.forEach(r => {
    if (r.language) counts[r.language] = (counts[r.language] || 0) + 1;
  });

  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const total = sorted.reduce((s, [, n]) => s + n, 0);
  const colors = sorted.map(([lang]) => getLangColor(lang));

  // Draw on canvas
  const canvas = document.getElementById('lang-chart');
  const ctx    = canvas.getContext('2d');
  const cx = canvas.width / 2, cy = canvas.height / 2;
  const outerR = 90, innerR = 55;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let angle = -Math.PI / 2;
  const gap = 0.025;

  sorted.forEach(([, count], i) => {
    const slice = (count / total) * (Math.PI * 2);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outerR, angle + gap / 2, angle + slice - gap / 2);
    ctx.closePath();

    // Gradient fill
    const grad = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR);
    grad.addColorStop(0, colors[i] + 'aa');
    grad.addColorStop(1, colors[i]);
    ctx.fillStyle = grad;
    ctx.fill();

    // Inner hole
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.fillStyle = '#080b14';
    ctx.fill();

    angle += slice;
  });

  // Legend
  const legend = document.getElementById('lang-legend');
  legend.innerHTML = sorted.map(([lang, count], i) => {
    const pct = ((count / total) * 100).toFixed(1);
    return `<li>
      <span class="legend-dot" style="background:${colors[i]}"></span>
      <span class="legend-name">${escapeHTML(lang)}</span>
      <span class="legend-pct">${pct}%</span>
    </li>`;
  }).join('');
}

// ── STARS BAR CHART ───────────────────────────────────────────────
function renderStarsChart(repos) {
  const top = repos
    .filter(r => r.stargazers_count > 0)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 8);

  if (!top.length) {
    document.getElementById('stars-card').innerHTML += '<p style="color:var(--text-3); font-size:14px; text-align:center; padding:20px">No starred repositories yet.</p>';
    return;
  }

  const max = top[0].stargazers_count;
  const wrap = document.getElementById('bar-chart-wrap');

  wrap.innerHTML = top.map((r, i) => {
    const pct = (r.stargazers_count / max) * 100;
    const delay = i * 0.08;
    return `<div class="bar-item" style="animation-delay:${delay}s">
      <div class="bar-header">
        <span class="bar-name">${escapeHTML(r.name)}</span>
        <span class="bar-stars">⭐ ${formatNumber(r.stargazers_count)}</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill" style="width:${pct}%; animation-delay:${delay}s"></div>
      </div>
    </div>`;
  }).join('');
}

// ── REPOS GRID ────────────────────────────────────────────────────
function renderRepos(repos) {
  const top = repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 12);

  document.getElementById('repo-count-badge').textContent = repos.length;

  document.getElementById('repos-grid').innerHTML = top.map((r, i) => {
    const lang  = r.language || null;
    const color = lang ? getLangColor(lang) : '#64748b';
    return `<a
      href="${escapeHTML(r.html_url)}"
      target="_blank"
      rel="noopener"
      class="repo-card card animate-in"
      style="animation-delay:${i * 0.04}s"
      aria-label="${escapeHTML(r.name)} repository"
    >
      <div class="repo-name">📁 ${escapeHTML(r.name)}</div>
      <div class="repo-desc">${escapeHTML(r.description || 'No description provided.')}</div>
      <div class="repo-footer">
        ${lang ? `<span class="repo-lang-dot" style="background:${color}"></span><span class="repo-lang-name">${escapeHTML(lang)}</span>` : ''}
        <span class="repo-stat stars">⭐ ${formatNumber(r.stargazers_count)}</span>
        <span class="repo-stat forks">🍴 ${formatNumber(r.forks_count)}</span>
      </div>
    </a>`;
  }).join('');
}

// ── ACTIVITY FEED ─────────────────────────────────────────────────
const EVENT_ICONS = {
  PushEvent:              '⬆️',
  CreateEvent:            '✨',
  DeleteEvent:            '🗑️',
  ForkEvent:              '🍴',
  WatchEvent:             '⭐',
  IssuesEvent:            '🐛',
  IssueCommentEvent:      '💬',
  PullRequestEvent:       '🔀',
  PullRequestReviewEvent: '👀',
  ReleaseEvent:           '🚀',
  PublicEvent:            '📢',
  MemberEvent:            '👤',
  GollumEvent:            '📝',
};

function describeEvent(e) {
  const repo = `<span class="activity-repo">${escapeHTML(e.repo.name)}</span>`;
  switch (e.type) {
    case 'PushEvent':
      const commits = e.payload.commits?.length || 0;
      return `Pushed <strong>${commits} commit${commits !== 1 ? 's' : ''}</strong> to ${repo}`;
    case 'CreateEvent':
      return `Created ${escapeHTML(e.payload.ref_type || 'repository')} <strong>${escapeHTML(e.payload.ref || '')}</strong> in ${repo}`;
    case 'ForkEvent':
      return `Forked ${repo}`;
    case 'WatchEvent':
      return `Starred ${repo}`;
    case 'IssuesEvent':
      return `${escapeHTML(e.payload.action || 'Updated')} issue in ${repo}`;
    case 'PullRequestEvent':
      return `${escapeHTML(e.payload.action || 'Updated')} pull request in ${repo}`;
    case 'IssueCommentEvent':
      return `Commented on an issue in ${repo}`;
    case 'ReleaseEvent':
      return `Published a release in ${repo}`;
    case 'DeleteEvent':
      return `Deleted ${escapeHTML(e.payload.ref_type || '')} in ${repo}`;
    default:
      return `${escapeHTML(e.type.replace('Event', ''))} in ${repo}`;
  }
}

function renderActivity(events) {
  const feed = document.getElementById('activity-feed');
  const items = events.slice(0, 10);

  if (!items.length) {
    feed.innerHTML = '<p style="color:var(--text-3); font-size:14px; text-align:center; padding:20px">No recent public activity.</p>';
    return;
  }

  feed.innerHTML = items.map((e, i) =>
    `<div class="activity-item animate-in" style="animation-delay:${i * 0.05}s">
       <div class="activity-icon">${EVENT_ICONS[e.type] || '⚡'}</div>
       <div class="activity-body">
         <div class="activity-text">${describeEvent(e)}</div>
         <div class="activity-time">${timeAgo(e.created_at)}</div>
       </div>
     </div>`
  ).join('');
}

// ── EVENT LISTENERS ───────────────────────────────────────────────
searchBtn.addEventListener('click', () => handleSearch(usernameInput.value));

usernameInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleSearch(usernameInput.value);
});

// Clear error as user types — no stale "User not found" while typing
usernameInput.addEventListener('input', () => {
  if (!searchError.hidden) hideError();
});

// Chip clicks
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    usernameInput.value = chip.dataset.user;
    handleSearch(chip.dataset.user);
  });
});

// Shared back-navigation logic (used by both buttons)
function goBack() {
  dashboard.classList.add('hidden');
  hero.classList.remove('hidden');
  usernameInput.value = '';
  hideError();
  setLoading(false);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(() => usernameInput.focus(), 300);
}

if (backBtn)    backBtn.addEventListener('click', goBack);
if (backBtnTop) backBtnTop.addEventListener('click', goBack);

// On load: explicitly reset state so CSS display rules don't leak through
window.addEventListener('DOMContentLoaded', () => {
  // Belt-and-suspenders: force hidden state regardless of CSS
  searchError.hidden = true;
  btnSpinner.hidden  = true;
  btnText.hidden     = false;
  searchBtn.disabled = false;
  usernameInput.focus();
});

