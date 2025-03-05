import React from "react";

export default function Quote() {
  return (
    <section id="quotation" className="align-center padding-large">
      <div className="inner-content">
        <h2 className="section-title divider">Quote of the day</h2>
        <blockquote>
          <q>
            It's true, I don't like the whole cutoff-shorts-and-T-shirt look,
            but I think you can look fantastic in casual clothes.
          </q>
          <div className="author-name">- Dr. Seuss</div>
        </blockquote>
      </div>
    </section>
  );
}
