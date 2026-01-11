import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './styles/sectionone.css';

export default function SectionOne() {
  const wrapRef = useRef(null);
  const videoId = '8pH2LIbmtjc';
  const ytContainerRef = useRef(null);
  const playerRef = useRef(null);
  const pendingStartRef = useRef(false);
  const [started, setStarted] = useState(false);
  

  function startParty() {
    setStarted(true);
    pendingStartRef.current = true;
    if (playerRef.current && playerRef.current.unMute) {
      try { playerRef.current.unMute(); playerRef.current.playVideo(); pendingStartRef.current = false; } catch (e) { console.warn(e); }
    }
    // fireworks removed
    try { wrapRef.current && wrapRef.current.scrollIntoView({ behavior: 'smooth' }); } catch (e) {}
  }

  

  // Create YouTube player via IFrame API so we can unMute() without reloading
  useEffect(() => {
    let cancelled = false;

    function createPlayer() {
      if (cancelled) return;
      if (!ytContainerRef.current) return;
      if (!window.YT || !window.YT.Player) return;

      playerRef.current = new window.YT.Player(ytContainerRef.current, {
        height: '100%',
        width: '100%',
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 1,
          mute: 1,
          loop: 1,
          playlist: videoId,
          modestbranding: 1
        },
        events: {
          onReady: (e) => {
            try { e.target.playVideo(); } catch (err) {}
            if (pendingStartRef.current) {
              try { e.target.unMute(); e.target.playVideo(); pendingStartRef.current = false; } catch (err) {}
            }
          }
        }
      });
    }

    if (!window.YT || !window.YT.Player) {
      const existing = document.getElementById('youtube-iframe-api');
      if (!existing) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.id = 'youtube-iframe-api';
        document.body.appendChild(tag);
      }

      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = function() {
        if (typeof prev === 'function') prev();
        createPlayer();
      };
    } else {
      createPlayer();
    }

    return () => {
      cancelled = true;
      if (playerRef.current && playerRef.current.destroy) playerRef.current.destroy();
      playerRef.current = null;
    };
  }, [videoId]);

  // ScrambleText plugin + Next button handler
  useEffect(() => {
    let curIndex = 0;
    const blurbs = [
      "FELIZ CUMPLEAÑOS SOUJI! 🎉🎂🎈",
      "Como hoy no puedo entregarte tu regalo yo misma tendrás que buscarlo.",
      "Encerrado en pesadillas y vigilado por el que controla los sueños.",
      "Sigue el mapa."
    ];

    (async () => {
      try {
        const mod = await import('gsap/ScrambleTextPlugin');
        const Scramble = mod.default || mod.ScrambleTextPlugin || mod;
        gsap.registerPlugin(Scramble);
      } catch (e) {
        console.warn('Could not load ScrambleTextPlugin', e);
      }
    })();

    const wrapper = wrapRef.current;
    const btn = wrapper ? wrapper.querySelector('#next') : document.getElementById('next');
    const textEl = wrapper ? wrapper.querySelector('.text') : document.querySelector('.text');

    const handler = () => {
      curIndex = (curIndex + 1) % blurbs.length;
      if (!textEl) return;
      gsap.to(textEl, {
        scrambleText: {
          text: blurbs[curIndex],
          chars: 'upperAndLowerCase',
          revealDelay: 0.2,
          tweenLength: true,
          newClass: curIndex === 2 ? 'border' : ''
        },
        ease: 'power2.inOut',
        overwrite: 'auto',
        duration: 4.2
      });
    };

    if (btn) btn.addEventListener('click', handler);
    return () => { if (btn) btn.removeEventListener('click', handler); };
  }, []);

  return (
    <>
      {!started && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button onClick={startParty} style={{ background: 'white', color: '#000', padding: '18px 28px', fontSize: 18, borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 700 }}>
            Click here! 🎉
          </button>
        </div>
      )}

      <section className="section section-1" ref={wrapRef}>
        <div className='background-map-container'>
          <div className='map'></div>
        </div>
        <div className="section-content">
          <div className="section-inner">
            <section className='title'>
              <h2 className="text heading-text">
                FELIZ CUMPLEAÑOS SOUJI! 🎉🎂🎈
              </h2>
              <button id="next" onClick={startParty} style={{ background: 'black', color: 'white', borderRadius: 12, border: '1px solid white', cursor: 'pointer' }}>
                Click here! 🎉
              </button>
            </section>
            <div style={{ 
                position: 'absolute', 
                right: 24, bottom: 24, 
                zIndex: 6000, width: 650, 
                height: 550, boxShadow: '0 8px 24px rgba(0,0,0,0.4)', 
                borderRadius: 8, overflow: 'hidden', 
                background: '#000', pointerEvents: 'auto'
              }}
            >
              <div ref={ytContainerRef} style={{ width: '100%', height: '100%' }} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
