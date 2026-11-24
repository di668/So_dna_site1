const data = window.SITE_DATA;
const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const crewGrid = document.querySelector("#crew-grid");

crewGrid.innerHTML = data.members.map((m, i) => `
  <article class="crew-card">
    <button class="crew-photo-open" type="button" data-member-index="${i}" aria-label="Открыть профиль: ${esc(m.name)}">
      <div class="crew-photo">
        ${m.photo ? `<img src="${esc(m.photo)}" alt="Фото участника ${esc(m.name)}">` : `<div class="photo-label"><b>✧</b>ДОБАВЬТЕ ФОТО</div>`}
      </div>
    </button>
    <div class="crew-info">
      <h3><button class="crew-name-open" type="button" data-member-index="${i}">${esc(m.name)}</button></h3>
      <div class="crew-role">${esc(m.role)}</div>
      <p>${esc(m.group)}${m.contact ? `<br><a href="${esc(m.contact)}" target="_blank" rel="noopener noreferrer">Контакт участника ↗</a>` : ""}</p>
    </div>
  </article>`).join("");

function openMemberProfile(index) {
  const member = data.members[index];
  if (!member) return;
  const previous = document.querySelector(".profile-overlay");
  if (previous) previous.remove();
  const profile = document.createElement("div");
  profile.className = "profile-overlay";
  profile.setAttribute("role", "dialog");
  profile.setAttribute("aria-modal", "true");
  profile.setAttribute("aria-label", `Профиль: ${member.name}`);
  profile.innerHTML = `
    <div class="profile-panel">
      <div class="profile-portrait">
        ${member.photo ? `<img src="${esc(member.photo)}" alt="Фото ${esc(member.name)}">` : `<div class="profile-photo-placeholder"><span>✧</span><small>ФОТО УЧАСТНИКА</small></div>`}
      </div>
      <div class="profile-details">
        <button class="profile-close" type="button" aria-label="Закрыть профиль">×</button>
        <p class="profile-label">КОМАНДА «СО ДНА»</p>
        <h2>${esc(member.name)}</h2>
        <div class="profile-divider"></div>
        <h4>Вклад в проект</h4>
        <p class="profile-contribution">${esc(member.contribution || "Информация скоро появится...")}</p>
        ${member.skills ? `<h4 class="profile-extra-title">Навыки</h4><p class="profile-contribution">${esc(member.skills)}</p>` : ""}
      </div>
    </div>`;
  document.body.appendChild(profile);
  document.body.classList.add("profile-is-open");
  requestAnimationFrame(() => profile.classList.add("profile-visible"));
  const close = () => {
    profile.classList.add("profile-closing");
    document.body.classList.remove("profile-is-open");
    setTimeout(() => profile.remove(), 260);
  };
  profile.addEventListener("click", event => {
    if (event.target === profile || event.target.closest(".profile-close") || event.target.closest(".profile-portrait")) close();
  });
  document.addEventListener("keydown", function onKey(event) {
    if (event.key === "Escape" && document.body.contains(profile)) {
      close(); document.removeEventListener("keydown", onKey);
    }
  });
  profile.querySelector(".profile-close").focus();
}

crewGrid.addEventListener("click", event => {
  const trigger = event.target.closest("[data-member-index]");
  if (trigger) openMemberProfile(Number(trigger.dataset.memberIndex));
});

document.querySelector("#skills-list").innerHTML = data.skills.map((s,i)=>`
  <article class="skill-item"><span class="skill-num">0${i+1} / EQUIPMENT</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></article>`).join("");
document.querySelector("#projects-grid").innerHTML = data.projects.map((p,i)=>`
  <article class="project-card"><span class="project-id">DISCOVERY / 0${i+1}</span><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p><span class="project-tag">${esc(p.tag)}</span></article>`).join("");
document.querySelector("#contact-links").innerHTML = data.contacts.filter(c=>c.href && c.href.trim()).map(c=>`
  <a href="${esc(c.href)}" target="_blank" rel="noopener noreferrer">${esc(c.label)} ↗</a>`).join("");
const toggle = document.querySelector(".nav-toggle"), nav = document.querySelector(".nav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.textContent = open ? "×" : "☰";
});
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  nav.classList.remove("open"); toggle.setAttribute("aria-expanded","false"); toggle.textContent="☰";
}));
