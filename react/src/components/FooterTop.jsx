import React from "react";

export default function FooterTop() {
  return (
    <>
      <section id="shipping-information">
        <hr />
        <div className="container">
          <div className="row d-flex flex-wrap align-items-center justify-content-between">
            <div className="col-md-3 col-sm-6">
              <div className="icon-box">
                <i className="icon icon-truck"></i>
                <h4 className="block-title">
                  <strong>Free shipping</strong> Over $200
                </h4>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="icon-box">
                <i className="icon icon-return"></i>
                <h4 className="block-title">
                  <strong>Money back</strong> Return within 7 days
                </h4>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="icon-box">
                <i className="icon icon-tags1"></i>
                <h4 className="block-title">
                  <strong>Buy 4 get 5th</strong> 50% off
                </h4>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="icon-box">
                <i className="icon icon-help_outline"></i>
                <h4 className="block-title">
                  <strong>Any questions?</strong> experts are ready
                </h4>
              </div>
            </div>
          </div>
        </div>
        <hr />
      </section>
    </>
  );
}
