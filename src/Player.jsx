//Import
import React, { useRef, useState, useEffect } from "react";
import WaveForm from "./WaveForm";
import './AudioPlayer.css';
import recordingVideo from './component/Recording.mp4';

const Player = () => {
  //Component State & Refs
  const [audioUrl, setAudioUrl] = useState();
  const [analyzerData, setAnalyzerData] = useState(null);
  const audioElmRef = useRef(null);
  const videoElmRef = useRef(null);
  const audioCtxRef = useRef(null);
  const sourceRef = useRef(null);
  //Audio Analyzer
  const audioAnalyzer = () => {
    if (audioCtxRef.current) {
      audioCtxRef.current.close(); // This  closes the previous audio content
    }
    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const audioCtx = audioCtxRef.current;
    const analyzer = audioCtx.createAnalyser();
    analyzer.fftSize = 2048;

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    const source = audioCtx.createMediaElementSource(audioElmRef.current);
    source.connect(analyzer);
    source.connect(audioCtx.destination);
    source.onended = () => {
      source.disconnect();
    };

    sourceRef.current = source;

    setAnalyzerData({ analyzer, bufferLength, dataArray });
  };
  // File Change
  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAudioUrl(URL.createObjectURL(file));
  };
  // Audio and Video effects
  useEffect(() => {
    const audio = audioElmRef.current;
    const video = videoElmRef.current;

    if (!audio || !video) {
      console.error('Audio or video element not found');
      return;
    }

    const handlePlay = () => {
      if (audio.currentSrc) {
        console.log('Audio is playing, starting video');
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log('Video playback started');
          }).catch(error => {
            console.error('Error starting video playback:', error);
          });
        }
      } else {
        console.log('Audio source is not set.');
      }
    };

    const handlePause = () => {
      console.log('Audio is paused, pausing video');
      video.pause();
    };

    const handleEnded = () => {
      console.log('Audio ended, stopping video');
      video.pause();
      video.currentTime = 0;
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);
  // Use Effect for handling AudioUrl Changes.
  useEffect(() => {
    if (audioUrl) {
      const audio = audioElmRef.current;
      const parent = audio.parentNode;
      const newAudio = audio.cloneNode(true);
      parent.replaceChild(newAudio, audio);
      audioElmRef.current = newAudio;

      audioElmRef.current.src = audioUrl; // This set up the new audio source
      audioElmRef.current.load();
      audioAnalyzer();

      // Event listeners reattaches new audio element
      const video = videoElmRef.current;
      const handlePlay = () => {
        if (audioElmRef.current.currentSrc) {
          console.log('Audio is playing, starting video');
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              console.log('Video playback started');
            }).catch(error => {
              console.error('Error starting video playback:', error);
            });
          }
        } else {
          console.log('Audio source is not set.');
        }
      };

      const handlePause = () => {
        console.log('Audio is paused, pausing video');
        video.pause();
      };

      const handleEnded = () => {
        console.log('Audio ended, stopping video');
        video.pause();
        video.currentTime = 0;
      };

      newAudio.addEventListener('play', handlePlay);
      newAudio.addEventListener('pause', handlePause);
      newAudio.addEventListener('ended', handleEnded);
    }
  }, [audioUrl]);
  // Return
  return (
    <div>
      <video src={recordingVideo} type="video/mp4" id="video" muted loop ref={videoElmRef} />
      {analyzerData && <WaveForm analyzerData={analyzerData} />}
      <div id="chooseFile">
      <input type="file" accept="audio/*" onChange={onFileChange}/>
      </div>
      <div>
      <audio controls ref={audioElmRef} id="audio" />
      </div>
    </div>
  );
};
// Export
export default Player;