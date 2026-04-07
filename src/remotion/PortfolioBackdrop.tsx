import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * Full-viewport cinematic background: aurora mesh, soft bokeh orbs,
 * and a subtle scanline shimmer — designed to sit behind the glass terminal.
 */
export const PortfolioBackdrop: FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  const breathe = interpolate(
    frame % durationInFrames,
    [0, durationInFrames / 2, durationInFrames],
    [0, 1, 0],
  );

  const drift = (offset: number) =>
    interpolate(
      (frame + offset) % durationInFrames,
      [0, durationInFrames],
      [0, Math.PI * 2],
    );

  const orb1x = width * 0.2 + Math.sin(drift(0)) * width * 0.08;
  const orb1y = height * 0.25 + Math.cos(drift(12)) * height * 0.06;
  const orb2x = width * 0.75 + Math.cos(drift(30)) * width * 0.1;
  const orb2y = height * 0.55 + Math.sin(drift(8)) * height * 0.08;
  const orb3x = width * 0.5 + Math.sin(drift(50)) * width * 0.12;
  const orb3y = height * 0.8 + Math.cos(drift(22)) * height * 0.05;

  const hueShift = interpolate(frame % durationInFrames, [0, durationInFrames], [0, 360]);

  const grainOpacity = interpolate(breathe, [0, 1], [0.03, 0.07]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(165deg, hsl(${(hueShift * 0.15) % 360}, 28%, 8%) 0%, #0a0a14 45%, #12122a 100%)`,
      }}
    >
      {/* Aurora layers */}
      <AbsoluteFill
        style={{
          filter: 'blur(90px)',
          opacity: 0.85,
          transform: `scale(${1 + interpolate(breathe, [0, 1], [0, 0.04])})`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: orb1x - 280,
            top: orb1y - 280,
            width: 560,
            height: 560,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(232,168,124,0.55) 0%, rgba(124,170,232,0.15) 45%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: orb2x - 320,
            top: orb2y - 320,
            width: 640,
            height: 640,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(124,170,232,0.45) 0%, rgba(184,140,232,0.2) 50%, transparent 72%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: orb3x - 240,
            top: orb3y - 240,
            width: 480,
            height: 480,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(126,200,155,0.35) 0%, rgba(232,168,124,0.12) 55%, transparent 75%)',
          }}
        />
      </AbsoluteFill>

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, transparent 0%, rgba(5,5,12,0.5) 55%, rgba(5,5,12,0.92) 100%)',
        }}
      />

      {/* Scanline shimmer */}
      <AbsoluteFill
        style={{
          opacity: 0.12,
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.04) 2px,
            rgba(255,255,255,0.04) 4px
          )`,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Film grain (CSS noise approximation) */}
      <AbsoluteFill
        style={{
          opacity: grainOpacity,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E")`,
          mixBlendMode: 'soft-light',
        }}
      />

      {/* Bottom warm glow — matches wallpaper “desk” light */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to top, rgba(232,168,124,0.12) 0%, transparent 35%)',
        }}
      />
    </AbsoluteFill>
  );
};
