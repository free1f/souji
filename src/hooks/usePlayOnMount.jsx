import { useEffect, useRef } from 'react';

export default function usePlayOnMount(src, options = {}) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (!src) return;

    const audio = new Audio(src);
    audioRef.current = audio;
    if (typeof options.volume === 'number') audio.volume = options.volume;
    if (typeof options.loop === 'boolean') audio.loop = options.loop;

    const play = async () => {
      try {
        await audio.play();
      } catch (err) {
        // Autoplay can be blocked by browsers until user interaction
        console.warn('Audio playback prevented by browser:', err);
      }
    };

    play();

    return () => {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (e) {}
    };
  }, [src]);

  return audioRef;
}
