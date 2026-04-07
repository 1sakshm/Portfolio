import { useEffect } from 'react';
import { initTerminal } from '../terminal/initTerminal';

export function TerminalExperience() {
  useEffect(() => {
    let cleanup = initTerminal();

    // In dev, Fast Refresh can keep effects mounted; ensure the terminal bindings update.
    if (import.meta.hot) {
      import.meta.hot.accept(() => {
        cleanup();
        cleanup = initTerminal();
      });
      import.meta.hot.dispose(() => {
        cleanup();
      });
    }

    return () => cleanup();
  }, []);

  return (
    <>
      <div className="wallpaper" id="wallpaper" data-wallpaper="dark" aria-hidden />
      <canvas id="matrixCanvas" />
      <canvas id="confettiCanvas" />

      <div className="boot-overlay" id="bootOverlay">
        <div className="boot-text" id="bootText" />
      </div>

      <div className="close-overlay" id="closeOverlay">
        <div className="close-window">
          <div className="titlebar">
            <div className="titlebar-dot red" title="Close" />
            <div className="titlebar-dot yellow" title="Minimize" />
            <div className="titlebar-dot green" title="Maximize" />
            <div className="titlebar-title">saksham@desktop ~ /exit</div>
          </div>
          <div className="close-body">
            <div className="output-line red">$ kill -9 portfolio</div>
            <div className="output-line red">✗ Process terminated.</div>
            <div className="output-line dim"> But great design never really stops.</div>
            <div className="close-actions">
              <button type="button" className="close-btn" id="closeReopen">
                Reopen terminal
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="terminal-window" id="terminal" style={{ display: 'none' }}>
        <div className="titlebar">
          <div className="titlebar-dot red" title="Close" />
          <div className="titlebar-dot yellow" title="Minimize" />
          <div className="titlebar-dot green" title="Maximize" />
          <div className="titlebar-title">saksham@desktop ~ /portfolio</div>
        </div>

        <div className="terminal-body" id="terminalBody">
          <h1 className="sr-only">Saksham — Terminal Portfolio</h1>
          <pre className="ascii-name" id="asciiName" aria-hidden>
            {' '}
          </pre>

          <div className="welcome-box" id="welcomeBox">
            <div className="welcome-left">
              <img className="portrait-img" src="/portrait.png" alt="Portrait" />
            </div>
            <div className="welcome-right">
              <div className="welcome-section">
                <h2 className="welcome-section-title">About</h2>
                <div className="output-line dim">
                  {' '}
                  Building AI, computer vision, and HCI systems with a focus on accessibility.
                </div>
              </div>
              <div className="welcome-section">
                <h2 className="welcome-section-title">Skills</h2>
                <div className="kv">
                  <span className="label">AI/ML</span>
                  <span>Python, Scikit-learn, PyTorch</span>
                </div>
                <div className="kv">
                  <span className="label">Computer Vision</span>
                  <span>OpenCV, MediaPipe, FaceMesh</span>
                </div>
                <div className="kv">
                  <span className="label">Backend</span>
                  <span>Node.js, Flask, Django, APIs</span>
                </div>
                <div className="kv">
                  <span className="label">Frontend</span>
                  <span>React, TypeScript</span>
                </div>
                <div className="kv">
                  <span className="label">Tools</span>
                  <span>Unity, Firebase, Git, Linux</span>
                </div>
              </div>
              <div className="welcome-section">
                <h2 className="welcome-section-title">Navigation</h2>
                <div className="item">
                  <span>/about</span>
                </div>
                <div className="item">
                  <span>/projects</span>
                </div>
                <div className="item">
                  <span>/experience</span>
                </div>
                <div className="item">
                  <span>/skills</span>
                </div>
                <div className="item">
                  <span>/contact</span>
                </div>
                <div className="item">
                  <span>/help</span>
                </div>
                <div className="command-hint" style={{ marginTop: 8 }}>
                  Tab completes commands · ↑↓ history
                </div>
              </div>
            </div>
          </div>

          <div className="output-area" id="outputArea" />
        </div>

        <div className="input-area">
          <span className="input-prompt">&gt;</span>
          <div className="input-wrapper">
            <div className="autocomplete" id="autocomplete" />
            <input
              id="cmdInput"
              className="input-field"
              type="text"
              placeholder='Try "/help"'
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>
      </div>

      <div id="seoFallback" className="seo-fallback">
        <p>Terminal portfolio. Enable JavaScript for the full experience.</p>
      </div>
    </>
  );
}
