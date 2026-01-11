import React from 'react';
import both from './assets/both.jpg';

export default function SectionFour() {
  return (
    <section className="section section-4">
      <div className="section-content">
        <div className="section-inner">
          <p>Por todo lo que hemos compartido y por lo que aún nos falta compartir. Cheers!</p>
          <img className="image" style={{ height: '500px', width: '500px'}} src={both} alt="" />
        </div>
      </div>
    </section>
  );
}
