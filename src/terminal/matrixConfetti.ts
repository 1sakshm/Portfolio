export function runMatrixRain(): void {
  const canvas = document.getElementById('matrixCanvas') as HTMLCanvasElement | null;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (ctx === null) return;
  const canvasEl: HTMLCanvasElement = canvas;
  const ctx2d: CanvasRenderingContext2D = ctx;

  canvasEl.width = window.innerWidth;
  canvasEl.height = window.innerHeight;
  canvasEl.classList.add('active');

  const chars =
    'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789VLADBURCA';
  const fontSize = 14;
  const columns = Math.floor(canvasEl.width / fontSize);
  const drops = Array(columns).fill(1);

  let frameCount = 0;
  const maxFrames = 180;

  function draw(): void {
    ctx2d.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx2d.fillRect(0, 0, canvasEl.width, canvasEl.height);
    ctx2d.fillStyle = '#33ff33';
    ctx2d.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx2d.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvasEl.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }

    frameCount++;
    if (frameCount < maxFrames) {
      requestAnimationFrame(draw);
    } else {
      canvasEl.classList.remove('active');
      setTimeout(() => {
        ctx2d.clearRect(0, 0, canvasEl.width, canvasEl.height);
      }, 400);
    }
  }
  draw();
}

export function runConfetti(): void {
  const canvas = document.getElementById('confettiCanvas') as HTMLCanvasElement | null;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (ctx === null) return;
  const canvasEl: HTMLCanvasElement = canvas;
  const ctx2d: CanvasRenderingContext2D = ctx;

  canvasEl.width = window.innerWidth;
  canvasEl.height = window.innerHeight;

  const colors = ['#e8a87c', '#7ec89b', '#7caae8', '#e87c7c', '#b88ce8', '#e8d87c', '#7ce8d8'];
  const particles: Array<{
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
    vx: number;
    vy: number;
    rot: number;
    rotV: number;
  }> = [];

  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * canvasEl.width,
      y: Math.random() * canvasEl.height - canvasEl.height,
      w: Math.random() * 8 + 4,
      h: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)]!,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.2,
    });
  }

  let frameCount = 0;
  const maxFrames = 180;

  function draw(): void {
    ctx2d.clearRect(0, 0, canvasEl.width, canvasEl.height);
    frameCount++;
    const fade = frameCount > 120 ? 1 - (frameCount - 120) / 60 : 1;

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotV;
      p.vy += 0.05;
      ctx2d.save();
      ctx2d.translate(p.x, p.y);
      ctx2d.rotate(p.rot);
      ctx2d.globalAlpha = fade;
      ctx2d.fillStyle = p.color;
      ctx2d.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx2d.restore();
    }

    if (frameCount < maxFrames) {
      requestAnimationFrame(draw);
    } else {
      ctx2d.clearRect(0, 0, canvasEl.width, canvasEl.height);
    }
  }
  draw();
}
