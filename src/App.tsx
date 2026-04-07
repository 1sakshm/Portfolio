import { Player } from '@remotion/player';
import { PortfolioBackdrop } from './remotion/PortfolioBackdrop';
import { TerminalExperience } from './components/TerminalExperience';

const REMOTION_FPS = 30;
const REMOTION_FRAMES = 300;

export default function App() {
  return (
    <div className="app-root">
      <div className="remotion-wallpaper" aria-hidden>
        <Player
          component={PortfolioBackdrop}
          durationInFrames={REMOTION_FRAMES}
          compositionWidth={1920}
          compositionHeight={1080}
          fps={REMOTION_FPS}
          controls={false}
          loop
          autoPlay
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </div>
      <TerminalExperience />
    </div>
  );
}
