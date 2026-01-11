import { useEffect, useRef } from 'react';

function getYouTubeId(urlOrId) {
  if (!urlOrId) return null;
  // If it's already an ID (11 chars typical), return it
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) return urlOrId;

  try {
    const url = new URL(urlOrId);
    if (url.hostname.includes('youtu.be')) return url.pathname.slice(1);
    if (url.searchParams.get('v')) return url.searchParams.get('v');
  } catch (e) {}

  // Fallback: try to match common patterns
  const m = urlOrId.match(/[a-zA-Z0-9_-]{11}/);
  return m ? m[0] : null;
}

export default function usePlayYouTubeOnMount(urlOrId, opts = {}) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    const videoId = getYouTubeId(urlOrId);
    if (!videoId) {
      console.warn('usePlayYouTubeOnMount: no valid YouTube id/URL provided');
      return;
    }

    let cancelled = false;

    function onYouTubeIframeAPIReady() {
      if (cancelled) return;
      if (!containerRef.current) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        height: '0',
        width: '0',
        videoId,
        playerVars: {
          autoplay: opts.autoplay ? 1 : 0,
          controls: opts.controls ? 1 : 0,
          mute: opts.mute ? 1 : 0,
          loop: opts.loop ? 1 : 0,
          playlist: opts.loop ? videoId : undefined,
          modestbranding: 1,
        },
        events: {
          onReady: (e) => {
            if (opts.autoplay) {
              // Try to play; if muted it's more likely to succeed
              try { e.target.playVideo(); } catch (err) {}
            }
          }
        }
      });
    }

    // Load API if needed
    if (!window.YT || !window.YT.Player) {
      const existing = document.getElementById('youtube-iframe-api');
      if (!existing) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.id = 'youtube-iframe-api';
        document.body.appendChild(tag);
      }

      // Attach callback
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = function() {
        if (typeof prev === 'function') prev();
        onYouTubeIframeAPIReady();
      };
    } else {
      onYouTubeIframeAPIReady();
    }

    return () => {
      cancelled = true;
      if (playerRef.current && playerRef.current.destroy) playerRef.current.destroy();
      playerRef.current = null;
    };
  }, [urlOrId]);

  return { containerRef, playerRef };
}
