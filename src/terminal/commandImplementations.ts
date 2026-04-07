import { CONTACT, CONTACT_EMAIL, LINKEDIN_URL, LOCATION_LINE, PHONE_DISPLAY } from './contact';
import type { OutputLine } from './lineTypes';
import { PROJECTS, type Project } from './projects';
import { PHILOSOPHY } from './philosophy';
import { SKILLS } from './skills';
import { SOCIAL } from './social';
import { EXPERIENCE } from './workExperience';

export const emailDisplay = CONTACT_EMAIL;

export function mailto(): string {
  return `mailto:${CONTACT_EMAIL}`;
}

export function cmdWork(): HTMLElement {
  const c = document.createElement('div');
  c.innerHTML = `<div class="output-line heading">Projects</div>
    <div class="output-line dim" style="margin-bottom:12px">  ${PROJECTS.length} projects</div>`;
  for (const p of PROJECTS) {
    c.appendChild(projectCardEl(p));
  }
  return c;
}

function projectCardEl(p: Project): HTMLElement {
  const card = document.createElement('div');
  card.className = 'project-card';
  card.innerHTML = `
    <span class="project-year">${p.year}</span>
    <div class="project-name">${p.name}</div>
    <div class="project-type">${p.type}</div>
    <div class="project-desc">${p.desc}</div>
    <div class="project-tags">${p.tags.map((t) => `<span class="project-tag">${t}</span>`).join('')}</div>
    ${p.stats ? `<div class="project-stats">${p.stats.map((s) => `<span class="project-stat">✦ ${s}</span>`).join('')}</div>` : ''}`;
  return card;
}

export function cmdProject(projectName: string): HTMLElement | OutputLine[] {
  const keyOf = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
  const normalized = keyOf(projectName);
  const project =
    PROJECTS.find((p) => p.name === projectName) ??
    PROJECTS.find((p) => keyOf(p.name) === normalized);
  if (!project) {
    return [{ text: `  Project "${projectName}" not found.`, cls: 'red' }];
  }
  const wrap = document.createElement('div');
  wrap.appendChild(projectCardEl(project));
  const hint = document.createElement('div');
  hint.className = 'output-line dim';
  hint.style.marginTop = '12px';
  hint.textContent = '  → /projects for all projects';
  wrap.appendChild(hint);
  return wrap;
}

export function cmdAbout(): OutputLine[] {
  return [
    { text: 'About', cls: 'heading' },
    { text: '' },
    {
      text: '  I work on AI, computer vision, and HCI, with a focus on accessibility-first systems.',
      cls: 'dim',
    },
    {
      text: '  My work focuses on creating tools that make technology easier to use for people with different cognitive and visual needs.',
      cls: 'dim',
    },
    { text: '' },
    { text: '  → /projects  •  /experience  •  /skills  •  /contact', cls: 'dim' },
  ];
}

export function cmdHelpStatic(): OutputLine[] {
  return [
    { text: 'Available commands', cls: 'heading' },
    { text: '' },
    { html: '  <span class="cmd-name">/about</span> <span class="cmd-desc">Bio</span>', cls: 'dim' },
    { html: '  <span class="cmd-name">/projects</span> <span class="cmd-desc">Projects</span>', cls: 'dim' },
    { html: '  <span class="cmd-name">/experience</span> <span class="cmd-desc">Work experience</span>', cls: 'dim' },
    { html: '  <span class="cmd-name">/skills</span> <span class="cmd-desc">Capabilities</span>', cls: 'dim' },
    { html: '  <span class="cmd-name">/philosophy</span> <span class="cmd-desc">How I work</span>', cls: 'dim' },
    { html: '  <span class="cmd-name">/social</span> <span class="cmd-desc">Links</span>', cls: 'dim' },
    { html: '  <span class="cmd-name">/linkedin</span> <span class="cmd-desc">LinkedIn</span>', cls: 'dim' },
    { html: '  <span class="cmd-name">/location</span> <span class="cmd-desc">Where I am</span>', cls: 'dim' },
    { html: '  <span class="cmd-name">/phone</span> <span class="cmd-desc">Phone</span>', cls: 'dim' },
    { html: '  <span class="cmd-name">/email</span> <span class="cmd-desc">Email</span>', cls: 'dim' },
    { html: '  <span class="cmd-name">/contact</span> <span class="cmd-desc">Email & phone</span>', cls: 'dim' },
    { text: '' },
    { html: '  <span class="cmd-name">/themes</span> <span class="cmd-desc">Theme picker</span>', cls: 'dim' },
    { html: '  <span class="cmd-name">/dark</span> <span class="cmd-desc"> /light /retro /glass</span>', cls: 'dim' },
    { html: '  <span class="cmd-name">/matrix</span> <span class="cmd-desc">Effect</span>', cls: 'dim' },
    { text: '' },
    { text: '  Project shortcuts: /utopia /morseye /hat-tile /pixels', cls: 'dim' },
    { text: '  Tab completes commands · ↑↓ history · Konami code on keyboard', cls: 'dim' },
  ];
}

export function cmdWorkExperience(): HTMLElement {
  const c = document.createElement('div');
  c.innerHTML = `<div class="output-line heading">Work Experience</div>
    <div class="output-line dim" style="margin-bottom:12px">  ${EXPERIENCE.length} roles</div>`;

  for (const w of EXPERIENCE) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <div class="project-name">${w.role}</div>
      <div class="project-type">${w.org} <span class="dim">•</span> ${w.type}</div>
      <div class="output-line dim" style="margin-top:6px">  ${w.year}</div>
      <div class="project-desc" style="margin-top:10px">${w.desc}</div>
      <div class="project-desc" style="margin-top:10px">${w.highlights.map((h) => `• ${h}`).join('<br/>')}</div>
    `;
    c.appendChild(card);
  }
  return c;
}

export function cmdSkills(): HTMLElement {
  const c = document.createElement('div');
  c.innerHTML = `<div class="output-line heading">Skills</div><div style="height:8px"></div>`;

  for (const group of SKILLS) {
    const h = document.createElement('div');
    h.className = 'output-line heading';
    h.style.marginTop = '14px';
    h.textContent = group.category;
    c.appendChild(h);

    const line = document.createElement('div');
    line.className = 'output-line dim';
    line.textContent = `  ${group.items.map((i) => i.name).join(', ')}`;
    c.appendChild(line);
  }
  return c;
}

export function cmdPhilosophy(): OutputLine[] {
  return [
    { text: 'Philosophy', cls: 'heading' },
    { text: '' },
    ...PHILOSOPHY.map((p) => ({ text: `  ◆ ${p}`, cls: 'green' as const })),
  ];
}

export function cmdSocial(): HTMLElement {
  const c = document.createElement('div');
  c.innerHTML = `<div class="output-line heading">Social</div><div style="height:8px"></div>`;
  for (const l of SOCIAL) {
    const badge = l.name === 'LinkedIn' ? 'in' : l.name === 'GitHub' ? 'gh' : 'x';
    const a = document.createElement('a');
    a.href = l.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'social-link';
    a.innerHTML = `<span class="social-badge blue">${badge}</span><span class="social-name">${l.name}</span><span class="social-handle">Open profile</span><span class="social-arrow">→</span>`;
    c.appendChild(a);
  }
  return c;
}

export function cmdLinkedin(): HTMLElement {
  const c = document.createElement('div');
  c.innerHTML = `<div class="output-line heading">LinkedIn</div><div style="height:8px"></div>`;
  const a = document.createElement('a');
  a.href = LINKEDIN_URL;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.className = 'social-link';
  a.innerHTML = `<span class="social-badge blue">in</span><span class="social-name">LinkedIn</span><span class="social-handle">Open profile</span><span class="social-arrow">→</span>`;
  c.appendChild(a);
  return c;
}

export function cmdLocation(): OutputLine[] {
  return [
    { text: 'Location', cls: 'heading' },
    { text: '' },
    { text: `  📍  ${LOCATION_LINE}`, cls: 'accent' },
  ];
}

export function cmdPhone(): OutputLine[] {
  return [
    { text: 'Phone', cls: 'heading' },
    { text: '' },
    { text: `  📞  ${PHONE_DISPLAY}`, cls: 'blue' },
  ];
}

export function cmdEmail(): OutputLine[] {
  return [
    { text: 'Email', cls: 'heading' },
    { text: '' },
    { text: `  ✉  ${CONTACT_EMAIL}`, cls: 'accent' },
  ];
}

export function cmdContact(): OutputLine[] {
  return [
    { text: 'Contact', cls: 'heading' },
    { text: '' },
    { text: `  ✉  ${CONTACT_EMAIL}`, cls: 'accent' },
    { text: `  📞  ${PHONE_DISPLAY}`, cls: 'blue' },
    { text: `  📍  ${LOCATION_LINE}`, cls: 'purple' },
    { text: '' },
    { text: `  ${CONTACT.availability}`, cls: 'dim' },
  ];
}

export function cmdThemes(current: string): HTMLElement {
  const c = document.createElement('div');
  c.innerHTML = `<div class="output-line heading">Themes</div>
    <div class="output-line dim" style="margin-bottom:8px">  Current: <span class="accent">${current}</span></div>`;
  const themes: { cmd: string; label: string }[] = [
    { cmd: '/dark', label: 'Default dark' },
    { cmd: '/light', label: 'Light' },
    { cmd: '/retro', label: 'Retro' },
    { cmd: '/glass', label: 'Glass' },
  ];
  for (const t of themes) {
    const row = document.createElement('div');
    row.className = 'output-line';
    row.style.marginTop = '4px';
    row.innerHTML = `  <span class="cmd-name">${t.cmd}</span> <span class="cmd-desc">${t.label}</span>${
      current === t.cmd.slice(1) ? ' <span class="accent">●</span>' : ''
    }`;
    c.appendChild(row);
  }
  return c;
}

/** Sets wallpaper tint + optional /public theme images if present */
export function setWallpaper(theme: string): void {
  const el = document.getElementById('wallpaper');
  if (el) el.setAttribute('data-wallpaper', theme);

  const picture = document.getElementById('wallpaper-picture') as HTMLPictureElement | null;
  if (!picture) return;
  const sources = picture.querySelectorAll('source');
  const img = picture.querySelector('img');
  if (sources[0]) sources[0].srcset = `/${theme}-theme.avif`;
  if (sources[1]) sources[1].srcset = `/${theme}-theme.webp`;
  if (img) img.src = `/${theme}-theme.png`;
}

export function applyThemeClass(theme: 'dark' | 'light' | 'retro' | 'glass'): void {
  document.documentElement.className =
    theme === 'dark'
      ? ''
      : theme === 'light'
        ? 'theme-light'
        : theme === 'retro'
          ? 'theme-retro'
          : 'theme-glass';
}
