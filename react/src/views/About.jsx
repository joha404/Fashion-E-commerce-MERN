import React from "react";
import AboutUs from "../components/AboutUs";
import FooterTop from "../components/FooterTop";
import Testmonirals from "../components/Testmoniral.jsx";

export default function About() {
  return (
    <>
      <section
        className="site-banner jarallax min-height300 padding-large"
        style={{
          backgroundImage: "url('images/hero-image.jpg')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="page-title">About us</h1>
              <div className="breadcrumbs">
                <span className="item">
                  <a href="index.html">Home /</a>
                </span>
                <span className="item">About</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FooterTop />
      <AboutUs />
      <Testmonirals />
    </>
  );
}
