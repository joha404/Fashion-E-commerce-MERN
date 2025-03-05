import React from "react";

export default function DiscountCupon() {
  return (
    <>
      <section id="subscribe" className="padding-large">
        <div className="container">
          <div className="row">
            <div className="block-text col-md-6">
              <div className="section-header">
                <h2 className="section-title">Get 25% off Discount Coupons</h2>
              </div>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Dictumst amet, metus, sit massa posuere maecenas. At tellus ut
                nunc amet vel egestas.
              </p>
            </div>
            <div className="subscribe-content col-md-6">
              <form id="form" className="d-flex justify-content-between">
                <input
                  type="text"
                  name="email"
                  placeholder="Enter your email addresss here"
                />
                <button className="btn btn-dark">Subscribe Now</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
