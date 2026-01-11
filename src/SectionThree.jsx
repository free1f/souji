import React from 'react';
import letsrock from './assets/letsrock.jpg';

export default function SectionThree() {
  return (
    <section className="section section-3">
      <div className="section-content">
        <div className="section-inner">
          <h2>Algo para tener cuando veamos a nuestro Umibozu de la vida real</h2>
          <img className="image" src={letsrock} alt="" />
        </div>
      </div>
    </section>
  );
}
