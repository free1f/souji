import './App.css'
import { useEffect, useRef } from 'react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionOne from './SectionOne';
import SectionTwo from './SectionTwo';
import SectionThree from './SectionThree';
import SectionFour from './SectionFour';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray(".section");
      panels.pop();

      panels.forEach((panel) => {
        const innerpanel = panel.querySelector(".section-inner");

        const panelHeight = innerpanel.offsetHeight;

        const windowHeight = window.innerHeight;

        const difference = panelHeight - windowHeight;

        const fakeScrollRatio = difference > 0 ? (difference / (difference + windowHeight)) : 0;

        if (fakeScrollRatio) {
          panel.style.marginBottom = panelHeight * fakeScrollRatio + "px";
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "bottom bottom",
            end: () => fakeScrollRatio ? `+=${innerpanel.offsetHeight}` : "bottom top",
            pinSpacing: false,
            pin: true,
            scrub: true
          }
        });

        if (fakeScrollRatio) {
          tl.to(innerpanel, { yPercent: -100, y: window.innerHeight, duration: 1 / (1 - fakeScrollRatio) - 1, ease: "none" });
        }

        tl.fromTo(panel, { scale: 1, opacity: 1 }, { scale: 0.7, opacity: 0.5, duration: 0.9 })
          .to(panel, { opacity: 0, duration: 0.1 });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="root">
      <div className="slides-wrapper">
        <SectionOne />
        <SectionTwo />
        <SectionThree />
        <SectionFour />
      </div>
    </div>
  )
}

export default App
