import React from "react";
import ContractForm from "../components/ContractForm";
import Map from "../components/Map";

export default function Contract() {
  return (
    <>
      <section
        className="site-banner jarallax min-height300 padding-large"
        style={{
          backgroundImage: "url('images/hero-image1.jpg')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container">
          <div class="row">
            <div class="col-md-12">
              <h1 class="page-title">Contact us</h1>
              <div class="breadcrumbs">
                <span class="item">
                  <a href="index.html">Home /</a>
                </span>
                <span class="item">Contact us</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ContractForm />
      <Map />
    </>
  );
}
