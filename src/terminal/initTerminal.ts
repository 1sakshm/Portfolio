import {
  applyThemeClass,
  cmdAbout,
  cmdContact,
  cmdEmail,
  cmdHelpStatic,
  cmdLinkedin,
  cmdLocation,
  cmdPhilosophy,
  cmdProject,
  cmdSkills,
  cmdSocial,
  cmdPhone,
  cmdThemes,
  cmdWork,
  cmdWorkExperience,
  setWallpaper,
} from './commandImplementations';
import { escapeHtml, sleep } from './html';
import type { OutputLine } from './lineTypes';
import { runConfetti, runMatrixRain } from './matrixConfetti';
const ASCII_NAME = `
███████╗ █████╗ ██╗  ██╗███████╗██╗  ██╗ █████╗ ███╗   ███╗
██╔════╝██╔══██╗██║ ██╔╝██╔════╝██║  ██║██╔══██╗████╗ ████║
███████╗███████║█████╔╝ ███████╗███████║███████║██╔████╔██║
╚════██║██╔══██║██╔═██╗ ╚════██║██╔══██║██╔══██║██║╚██╔╝██║
███████║██║  ██║██║  ██╗███████║██║  ██║██║  ██║██║ ╚═╝ ██║
╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝`.trim();

type CmdFn = () => HTMLElement | OutputLine[] | null;

const PROJECT_SLUGS: Record<string, string> = {
  '/utopia': 'Project Utopia',
  '/morseye': 'MorsEye',
  '/hat-tile': 'Aperiodic Hat Tile Research',
  '/pixels': 'From Pixels to Polygons',
};

const ALIASES: Record<string, string> = {
  '/portfolio': '/projects',
  '/projects': '/projects',
  '/work': '/projects',
  '/work-experience': '/experience',
  '/me': '/about',
  '/hire': '/contact',
  '/reset': '/clear',
  '/cls': '/clear',
  clear: '/clear',
  help: '/help',
};

const ROUTE_MAP: Record<string, string> = {
  '/about': 'about',
  '/projects': 'projects',
  '/work-experience': 'work-experience',
  '/experience': 'work-experience',
  '/skills': 'skills',
  '/contact': 'contact',
  '/philosophy': 'philosophy',
  '/social': 'social',
};

const ROUTE_TITLES: Record<string, string> = {
  '': 'Portfolio — Terminal',
  about: 'About',
  projects: 'Projects',
  'work-experience': 'Work Experience',
  skills: 'Skills',
  contact: 'Contact',
  philosophy: 'Philosophy',
  social: 'Social',
};

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

export function initTerminal(): () => void {
  // Allow re-init (Fast Refresh / StrictMode) by cleaning up old listeners.
  const w = window as unknown as {
    __sakshamTerminalCleanup?: (() => void) | undefined;
    __sakshamBootDone?: boolean;
    __sakshamBootPromise?: Promise<void> | undefined;
  };
  if (typeof w.__sakshamTerminalCleanup === 'function') {
    w.__sakshamTerminalCleanup();
    w.__sakshamTerminalCleanup = undefined;
  }

  const bootOverlay = document.getElementById('bootOverlay');
  const bootText = document.getElementById('bootText');
  const terminal = document.getElementById('terminal');
  const terminalBody = document.getElementById('terminalBody');
  const outputArea = document.getElementById('outputArea');
  const cmdInput = document.getElementById('cmdInput') as HTMLInputElement | null;
  const autocompleteEl = document.getElementById('autocomplete');
  const asciiNameEl = document.getElementById('asciiName');
  const closeOverlay = document.getElementById('closeOverlay');
  const seoFallback = document.getElementById('seoFallback');

  if (
    !bootOverlay ||
    !bootText ||
    !terminal ||
    !terminalBody ||
    !outputArea ||
    !cmdInput ||
    !autocompleteEl ||
    !asciiNameEl ||
    !closeOverlay
  ) {
    return () => undefined;
  }

  // Non-null aliases (helps TS inside callbacks)
  const bootOverlayEl = bootOverlay;
  const bootTextEl = bootText;
  const terminalEl = terminal;
  const terminalBodyEl = terminalBody;
  const outputAreaEl = outputArea;
  const cmdInputEl = cmdInput;
  const autocompleteElEl = autocompleteEl;
  const asciiNameElEl = asciiNameEl;
  const closeOverlayEl = closeOverlay;
  if (seoFallback) seoFallback.setAttribute('aria-hidden', 'true');
  const inputAreaEl = terminalEl.querySelector('.input-area') as HTMLElement | null;

  let currentTheme: 'dark' | 'light' | 'retro' | 'glass' = 'dark';
  let commandHistory: string[] = [];
  let historyIndex = -1;
  let acItems: Array<[string, { desc: string }]> = [];
  let acIndex = -1;
  let konamiIndex = 0;

  const REGISTRY: Record<string, { desc: string; fn: CmdFn }> = {
    '/help': { desc: 'This list', fn: () => cmdHelpStatic() },
    '/about': { desc: 'Bio', fn: cmdAbout },
    '/projects': { desc: 'Projects', fn: cmdWork },
    '/experience': { desc: 'Work Experience', fn: cmdWorkExperience },
    '/skills': { desc: 'Skills', fn: cmdSkills },
    '/philosophy': { desc: 'How I work', fn: cmdPhilosophy },
    '/social': { desc: 'Links', fn: cmdSocial },
    '/linkedin': { desc: 'LinkedIn', fn: cmdLinkedin },
    '/location': { desc: 'Location', fn: cmdLocation },
    '/phone': { desc: 'Phone', fn: cmdPhone },
    '/email': { desc: 'Email', fn: cmdEmail },
    '/contact': { desc: 'Contact', fn: cmdContact },
    '/themes': {
      desc: 'Themes',
      fn: () => cmdThemes(currentTheme),
    },
    '/dark': {
      desc: 'Dark',
      fn: () => {
        currentTheme = 'dark';
        applyThemeClass('dark');
        setWallpaper('dark');
        return [{ text: '  ✦ Dark mode.', cls: 'accent' }];
      },
    },
    '/light': {
      desc: 'Light',
      fn: () => {
        currentTheme = 'light';
        applyThemeClass('light');
        setWallpaper('light');
        return [{ text: '  ☀ Light mode.', cls: 'yellow' }];
      },
    },
    '/retro': {
      desc: 'Retro',
      fn: () => {
        currentTheme = 'retro';
        applyThemeClass('retro');
        setWallpaper('retro');
        return [{ text: '  ▓ Retro mode.', cls: 'green' }];
      },
    },
    '/glass': {
      desc: 'Glass',
      fn: () => {
        currentTheme = 'glass';
        applyThemeClass('glass');
        setWallpaper('glass');
        return [{ text: '  ◈ Glass mode.', cls: 'accent' }];
      },
    },
    '/matrix': {
      desc: 'Matrix rain',
      fn: () => {
        runMatrixRain();
        return [{ text: '  Matrix rain…', cls: 'green' }];
      },
    },
  };

  for (const [slug, name] of Object.entries(PROJECT_SLUGS)) {
    REGISTRY[slug] = {
      desc: `Project: ${name}`,
      fn: () => cmdProject(name),
    };
  }

  const HIDDEN: Record<string, CmdFn> = {
    '/konami': () => {
      runConfetti();
      return [{ text: '  🎉 Konami! Confetti.', cls: 'yellow' }];
    },
    '/secrets': () => [
      { text: '  Hidden: /konami · Konami keys · /matrix', cls: 'dim' },
    ],
  };

  function updateUrl(command: string): void {
    const slug = ROUTE_MAP[command];
    if (slug !== undefined) {
      const url = '/' + slug;
      if (window.location.pathname !== url) {
        history.pushState({ cmd: command }, '', url);
      }
      document.title = ROUTE_TITLES[slug] ?? ROUTE_TITLES[''];
    } else if (command === '/clear' || command === '/help') {
      if (window.location.pathname !== '/') {
        history.pushState({ cmd: '' }, '', '/');
      }
      document.title = ROUTE_TITLES[''];
    }
  }

  function normalizeInput(raw: string): string {
    let r = raw.trim().toLowerCase();
    r = ALIASES[r] ?? r;
    // If user typed a multi-word command like "/hat tile",
    // try a dashed variant "/hat-tile" before treating it as args.
    if (r.startsWith('/') && r.includes(' ')) {
      const dashed = '/' + r.slice(1).split(/\s+/).join('-');
      if (REGISTRY[dashed] || HIDDEN[dashed]) return dashed;
    }
    if (!r.startsWith('/') && !r.includes(' ')) {
      const withSlash = '/' + r;
      if (REGISTRY[withSlash] || HIDDEN[withSlash]) return withSlash;
    }
    return r;
  }

  function applyStaggerAnimation(container: HTMLElement): void {
    const selectors = '.output-line, .project-card, .client-item, .skill-bar';
    const children = container.querySelectorAll(selectors);
    let index = 0;
    const maxStagger = 30;
    children.forEach((el) => {
      if (el.closest('.cmd-echo')) return;
      const elh = el as HTMLElement;
      if (elh.classList.contains('output-line') && !elh.textContent?.trim() && !elh.innerHTML.trim()) return;
      elh.classList.add('stagger-child');
      elh.style.setProperty('--i', String(index < maxStagger ? index : maxStagger));
      index++;
    });
  }

  function animateSkillBars(block: HTMLElement): void {
    requestAnimationFrame(() => {
      setTimeout(() => {
        block.querySelectorAll<HTMLElement>('.bar-fill').forEach((el) => {
          const w = el.dataset.width;
          if (w) el.style.width = w;
        });
      }, 80);
    });
  }

  function renderBlockContent(block: HTMLElement, result: HTMLElement | OutputLine[] | null): void {
    if (result === null) return;
    if (result instanceof HTMLElement) {
      block.appendChild(result);
    } else {
      for (const line of result) {
        const div = document.createElement('div');
        div.className = 'output-line' + (line.cls ? ' ' + line.cls : '');
        if (line.style) div.setAttribute('style', line.style);
        if (line.html) div.innerHTML = line.html;
        else div.textContent = line.text ?? '';
        block.appendChild(div);
      }
    }
    applyStaggerAnimation(block);
    animateSkillBars(block);
  }

  function executeCommand(input: string): void {
    const rawIn = input.trim().toLowerCase();
    if (!rawIn) return;

    const raw = normalizeInput(rawIn);

    terminalEl.classList.remove('minimized');
    document.body.classList.remove('minimized');

    if (raw === '/clear') {
      outputAreaEl.innerHTML = '';
      commandHistory.unshift(input.trim());
      if (commandHistory.length > 50) commandHistory.pop();
      historyIndex = -1;
      updateUrl(raw);
      return;
    }

    commandHistory.unshift(input.trim());
    if (commandHistory.length > 50) commandHistory.pop();
    historyIndex = -1;

    const hiddenFn = HIDDEN[raw];
    const cmd = REGISTRY[raw];
    updateUrl(raw);

    const block = document.createElement('div');
    block.className = 'output-block';
    const echo = document.createElement('div');
    echo.className = 'cmd-echo';
    echo.innerHTML = `<span class="prompt-symbol">&gt;</span> ${escapeHtml(input.trim())}`;
    block.appendChild(echo);

    if (hiddenFn) {
      renderBlockContent(block, hiddenFn());
      outputAreaEl.appendChild(block);
      terminalBodyEl.scrollTop = terminalBodyEl.scrollHeight;
      return;
    }

    if (cmd) {
      const thinking = document.createElement('div');
      thinking.className = 'thinking-indicator';
      thinking.innerHTML = `<span class="thinking-text">Processing</span><span class="thinking-dots"><span></span><span></span><span></span></span>`;
      block.appendChild(thinking);
      outputAreaEl.appendChild(block);
      const delay = 400 + Math.random() * 500;
      setTimeout(() => {
        thinking.remove();
        renderBlockContent(block, cmd.fn());
        terminalBodyEl.scrollTop = terminalBodyEl.scrollHeight;
      }, delay);
      return;
    }

    const err = document.createElement('div');
    err.className = 'output-line red';
    err.textContent = `  Command not found: "${input.trim()}"`;
    block.appendChild(err);
    const hint = document.createElement('div');
    hint.className = 'output-line dim';
    hint.textContent = '  Type /help for commands. Tab completes.';
    block.appendChild(hint);
    outputAreaEl.appendChild(block);
    terminalBodyEl.scrollTop = terminalBodyEl.scrollHeight;
  }

  function updateAutocomplete(value: string): void {
    const val = value.toLowerCase().trim();
    acItems = [];
    acIndex = -1;
    if (!val) {
      autocompleteElEl.classList.remove('show');
      autocompleteElEl.innerHTML = '';
      return;
    }

    const entries = Object.entries(REGISTRY).map(([cmd, v]) => [cmd, v] as [string, { desc: string }]);
    const withClear: Array<[string, { desc: string }]> = [['/clear', { desc: 'Clear output' }], ...entries];
    const matches = withClear.filter(([cmd]) => cmd.startsWith(val) || cmd.startsWith('/' + val));

    if (matches.length === 0 || (matches.length === 1 && matches[0][0] === val)) {
      autocompleteElEl.classList.remove('show');
      autocompleteElEl.innerHTML = '';
      return;
    }

    acItems = matches;
    autocompleteElEl.innerHTML = '';
    matches.forEach(([cmd, data]) => {
      const item = document.createElement('div');
      item.className = 'autocomplete-item';
      item.innerHTML = `<span class="ac-cmd">${cmd}</span><span class="ac-desc">${data.desc}</span>`;
      item.addEventListener('mousedown', (e) => {
        e.preventDefault();
        cmdInputEl.value = cmd;
        autocompleteElEl.classList.remove('show');
        cmdInputEl.focus();
      });
      autocompleteElEl.appendChild(item);
    });
    autocompleteElEl.classList.add('show');
  }

  function highlightAcItem(): void {
    autocompleteElEl.querySelectorAll('.autocomplete-item').forEach((el, i) => {
      el.classList.toggle('active', i === acIndex);
      if (i === acIndex) el.scrollIntoView({ block: 'nearest' });
    });
  }

  async function runBoot(): Promise<void> {
    // Prevent duplicate boot output (StrictMode / HMR).
    if (w.__sakshamBootDone) {
      bootOverlayEl.classList.add('hidden');
      terminalEl.style.display = 'flex';
      asciiNameElEl.textContent = ASCII_NAME;
      setWallpaper('dark');
      focusCmdInput();
      return;
    }
    if (w.__sakshamBootPromise) {
      await w.__sakshamBootPromise;
      return;
    }

    w.__sakshamBootPromise = (async () => {
    bootOverlayEl.classList.remove('hidden');
    bootTextEl.innerHTML = '';
    const steps: Array<{ text: string; delay: number; cls?: string }> = [
      { text: 'Initializing portfolio system...', delay: 180 },
      { text: 'Loading design tokens...', delay: 170 },
      { text: 'Calibrating terminal renderer...', delay: 190 },
      { text: 'Warming up command palette...', delay: 170 },
      { text: 'Mounting UI components...', delay: 190 },
      { text: 'Loading projects database (4 entries)...', delay: 210 },
      { text: 'Applying desktop wallpaper...', delay: 180 },
      { text: 'System ready.', delay: 220, cls: 'green' },
      { text: 'Press Enter to continue...', delay: 260, cls: 'accent' },
    ];
    for (const step of steps) {
      await sleep(step.delay);
      const div = document.createElement('div');
      if (step.cls) div.className = step.cls;
      div.textContent = step.text;
      bootTextEl.appendChild(div);
    }
    await new Promise<void>((resolve) => {
      const done = () => {
        document.removeEventListener('keydown', onKey);
        document.removeEventListener('click', onClick);
        document.removeEventListener('touchstart', onTouch);
        resolve();
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Enter') done();
      };
      const onClick = () => done();
      const onTouch = () => done();
      document.addEventListener('keydown', onKey);
      document.addEventListener('click', onClick);
      document.addEventListener('touchstart', onTouch);
    });
    bootOverlayEl.classList.add('hidden');
    terminalEl.style.display = 'flex';
    asciiNameElEl.textContent = ASCII_NAME;
    setWallpaper('dark');
    focusCmdInput();
    w.__sakshamBootDone = true;
    w.__sakshamBootPromise = undefined;
    })();

    await w.__sakshamBootPromise;
  }

  const onPop = (e: PopStateEvent) => {
    const path = window.location.pathname.replace(/^\//, '');
    document.title = ROUTE_TITLES[path] ?? ROUTE_TITLES[''];
    if (e.state?.cmd) executeCommand(e.state.cmd);
    else if (path) executeCommand('/' + path);
  };
  window.addEventListener('popstate', onPop);

  const onKonamiKey = (e: KeyboardEvent) => {
    const expected = KONAMI[konamiIndex];
    if (e.key === expected || e.key.toLowerCase() === expected) {
      konamiIndex++;
      if (konamiIndex === KONAMI.length) {
        konamiIndex = 0;
        executeCommand('/konami');
      }
    } else {
      konamiIndex = 0;
    }
  };
  document.addEventListener('keydown', onKonamiKey);

  const onDocKeyFocus = (e: KeyboardEvent) => {
    if (e.target !== cmdInputEl && !e.ctrlKey && !e.metaKey && !e.altKey && e.key.length === 1) {
      cmdInputEl.focus();
    }
  };
  document.addEventListener('keydown', onDocKeyFocus);

  const redDot = terminalEl.querySelector('.titlebar-dot.red');
  const yellowDot = terminalEl.querySelector('.titlebar-dot.yellow');
  const greenDot = terminalEl.querySelector('.titlebar-dot.green');
  const closeReopen = document.getElementById('closeReopen');

  function syncMaximizeButton(): void {
    if (!(greenDot instanceof HTMLElement)) return;
    const isMax = terminalEl.classList.contains('maximized');
    greenDot.classList.toggle('is-restore', isMax);
    greenDot.title = isMax ? 'Restore' : 'Maximize';
  }

  const onRedDotClick = () => {
    terminalEl.style.display = 'none';
    closeOverlayEl.classList.add('visible');
  };
  redDot?.addEventListener('click', onRedDotClick);

  const onCloseReopenClick = () => {
    closeOverlayEl.classList.remove('visible');
    terminalEl.style.display = '';
    terminalEl.classList.remove('minimized');
    document.body.classList.remove('minimized');
    focusCmdInput();
  };
  closeReopen?.addEventListener('click', onCloseReopenClick);

  const onYellowDotClick = () => {
    const isMin = terminalEl.classList.toggle('minimized');
    document.body.classList.toggle('minimized', isMin);
  };
  yellowDot?.addEventListener('click', onYellowDotClick);

  const onGreenDotClick = () => {
    terminalEl.classList.remove('minimized');
    document.body.classList.remove('minimized');
    const isMax = terminalEl.classList.toggle('maximized');
    document.body.classList.toggle('maximized', isMax);
    syncMaximizeButton();
  };
  greenDot?.addEventListener('click', onGreenDotClick);
  syncMaximizeButton();

  const onCmdInput = () => updateAutocomplete(cmdInputEl.value);
  cmdInputEl.addEventListener('input', onCmdInput);

  const onCmdKeyDown = (e: KeyboardEvent) => {
    if (autocompleteElEl.classList.contains('show')) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        acIndex = Math.min(acIndex + 1, acItems.length - 1);
        highlightAcItem();
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        acIndex = Math.max(acIndex - 1, -1);
        highlightAcItem();
        return;
      }
      if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        if (acIndex >= 0 && acItems[acIndex]) cmdInputEl.value = acItems[acIndex][0];
        else if (acItems.length > 0) cmdInputEl.value = acItems[0][0];
        autocompleteElEl.classList.remove('show');
        if (e.key === 'Enter') {
          const value = cmdInputEl.value;
          cmdInputEl.value = '';
          executeCommand(value);
        }
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        autocompleteElEl.classList.remove('show');
        return;
      }
    }

    if (e.key === 'Tab' && !autocompleteElEl.classList.contains('show')) {
      e.preventDefault();
      const val = cmdInputEl.value.toLowerCase().trim();
      if (val) {
        const keys = Object.keys(REGISTRY);
        const match = keys.find((c) => c.startsWith(val) || c.startsWith('/' + val));
        if (match) cmdInputEl.value = match;
      }
      return;
    }

    if (e.key === 'Enter') {
      autocompleteElEl.classList.remove('show');
      const value = cmdInputEl.value;
      cmdInputEl.value = '';
      executeCommand(value);
      return;
    }

    if (e.key === 'ArrowUp' && !autocompleteElEl.classList.contains('show')) {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        cmdInputEl.value = commandHistory[historyIndex];
      }
      return;
    }
    if (e.key === 'ArrowDown' && !autocompleteElEl.classList.contains('show')) {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        cmdInputEl.value = commandHistory[historyIndex];
      } else {
        historyIndex = -1;
        cmdInputEl.value = '';
      }
    }
  };
  cmdInputEl.addEventListener('keydown', onCmdKeyDown);

  function focusCmdInput(): void {
    cmdInputEl.focus();
    const end = cmdInputEl.value.length;
    try {
      cmdInputEl.setSelectionRange(end, end);
    } catch {
      // ignore (some input types / browsers)
    }
  }

  const onTerminalBodyClick = () => {
    if (!window.getSelection()?.toString()) focusCmdInput();
  };
  terminalBodyEl.addEventListener('click', onTerminalBodyClick);

  const onInputAreaClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest?.('#autocomplete')) return;
    if (target?.closest?.('a, button')) return;
    focusCmdInput();
  };
  inputAreaEl?.addEventListener('click', onInputAreaClick);

  void runBoot();

  const cleanup = () => {
    window.removeEventListener('popstate', onPop);
    document.removeEventListener('keydown', onKonamiKey);
    document.removeEventListener('keydown', onDocKeyFocus);
    terminalBodyEl.removeEventListener('click', onTerminalBodyClick);
    inputAreaEl?.removeEventListener('click', onInputAreaClick);
    redDot?.removeEventListener('click', onRedDotClick);
    yellowDot?.removeEventListener('click', onYellowDotClick);
    greenDot?.removeEventListener('click', onGreenDotClick);
    closeReopen?.removeEventListener('click', onCloseReopenClick);
    cmdInputEl.removeEventListener('input', onCmdInput);
    cmdInputEl.removeEventListener('keydown', onCmdKeyDown);
  };
  (w as unknown as { __sakshamTerminalCleanup?: (() => void) | undefined }).__sakshamTerminalCleanup = cleanup;
  return cleanup;
}
