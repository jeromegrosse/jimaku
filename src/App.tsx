import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import './App.css';
import SRTDisplay from './components/SRTDisplay';
import { subtitles, video } from './data';

const App: React.FC<any> = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playerRef = React.createRef<ReactPlayer>();

  return (
    <div className="App">
      <ReactPlayer
        ref={playerRef}
        url={video}
        playing={isPlaying}
      />
      <button onClick={() => setIsPlaying(!isPlaying)}>Play/Pause</button>
      <SRTDisplay
        srtPath={subtitles}
        playerRef={playerRef}
      />
    </div>
  );
}

export default App;
