import type { FC } from 'react';
import { Composition, registerRoot } from 'remotion';
import { PortfolioBackdrop } from './PortfolioBackdrop';

export const RemotionRoot: FC = () => {
  return (
    <>
      <Composition
        id="PortfolioBackdrop"
        component={PortfolioBackdrop}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

registerRoot(RemotionRoot);
