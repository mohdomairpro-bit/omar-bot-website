// ---- SHARED CONFIG ----
const CLIENT_ID = "1495782087574159471";
const OWNER_ID = "977960143071379616";

// ---- DISCORD OAUTH ----
function discordLogin(e) {
  if (e) e.preventDefault();
  const redirect = encodeURIComponent(window.location.origin + "/dashboard.html");
  window.location.href = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirect}&response_type=token&scope=identify`;
}

async function fetchDiscordUser(token) {
  const r = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: "Bearer " + token }
  });
  if (!r.ok) throw new Error("Invalid token");
  return r.json();
}

function getStoredUser() {
  const u = localStorage.getItem("discord_user");
  const t = localStorage.getItem("discord_token");
  if (!u || !t) return null;
  return { user: JSON.parse(u), token: t };
}

function logout() {
  localStorage.removeItem("discord_token");
  localStorage.removeItem("discord_user");
  window.location.href = "/index.html";
}

function isOwner(userId) {
  return userId === OWNER_ID;
}

function avatarUrl(user) {
  return user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator || 0) % 5}.png`;
}

// ---- AUTH COUNTER (using countapi) ----
async function getAuthCount() {
  try {
    const r = await fetch("https://api.countapi.xyz/hit/execvoid-bot/authorizations");
    const data = await r.json();
    return data.value || 0;
  } catch { return "—"; }
}

async function peekAuthCount() {
  try {
    const r = await fetch("https://api.countapi.xyz/get/execvoid-bot/authorizations");
    const data = await r.json();
    return data.value || 0;
  } catch { return "—"; }
}

// ---- SCROLL REVEAL ----
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
  }, { threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach(r => obs.observe(r));
}

// ---- NAV AUTH STATE ----
function updateNav() {
  const stored = getStoredUser();
  const loginBtn = document.getElementById("nav-login-btn");
  const userEl = document.getElementById("nav-user");
  const userImg = document.getElementById("nav-avatar");
  const userSpan = document.getElementById("nav-username");

  if (stored && loginBtn && userEl) {
    loginBtn.style.display = "none";
    userEl.style.display = "flex";
    if (userImg) userImg.src = avatarUrl(stored.user);
    if (userSpan) userSpan.textContent = stored.user.global_name || stored.user.username;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initReveal();
  updateNav();
});
