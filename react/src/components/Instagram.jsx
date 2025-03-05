import React from "react";
const insta1 = "/images/insta-image1.jpg";
const insta2 = "/images/insta-image2.jpg";
const insta3 = "/images/insta-image3.jpg";
const insta4 = "/images/insta-image4.jpg";
const insta5 = "/images/insta-image5.jpg";
const insta6 = "/images/insta-image6.jpg";
export default function Instagram() {
  return (
    <>
      <section id="instagram" className="padding-large">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Follow our instagram</h2>
          </div>
          <p>
            Our official Instagram account <a href="#">@ultras</a> or
            <a href="#">#ultras_clothing</a>
          </p>
          <div className="row d-flex flex-wrap justify-content-between">
            <div className="col-lg-2 col-md-4 col-sm-6">
              <figure className="zoom-effect">
                <img src={insta1} alt="instagram" className="insta-image" />
                <i className="icon icon-instagram"></i>
              </figure>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-6">
              <figure className="zoom-effect">
                <img src={insta2} alt="instagram" className="insta-image" />
                <i className="icon icon-instagram"></i>
              </figure>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-6">
              <figure className="zoom-effect">
                <img src={insta3} alt="instagram" className="insta-image" />
                <i className="icon icon-instagram"></i>
              </figure>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-6">
              <figure className="zoom-effect">
                <img src={insta4} alt="instagram" className="insta-image" />
                <i className="icon icon-instagram"></i>
              </figure>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-6">
              <figure className="zoom-effect">
                <img src={insta5} alt="instagram" className="insta-image" />
                <i className="icon icon-instagram"></i>
              </figure>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-6">
              <figure className="zoom-effect">
                <img src={insta6} alt="instagram" className="insta-image" />
                <i className="icon icon-instagram"></i>
              </figure>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
