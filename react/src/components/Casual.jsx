import React from "react";
const model = "/images/model.jpg";
export default function Casual() {
  return (
    <>
      <section className="shoppify-section-banner">
        <div className="container">
          <div className="product-collection">
            <div className="left-content collection-item">
              <div className="products-thumb">
                <img
                  src="images/model.jpg"
                  alt="collection item"
                  className="large-image image-rounded"
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-6 product-entry">
                <div className="categories">Denim collection</div>
                <h3 className="item-title">The casual selection.</h3>
                <p>
                  Vel non viverra ligula odio ornare turpis mauris. Odio
                  aliquam, tincidunt ut vitae elit risus. Tempor egestas
                  condimentum et ac rutrum dui, odio.
                </p>
                <div className="btn-wrap">
                  <a href="shop.html" className="d-flex align-items-center">
                    shop collection <i className="icon icon-arrow-io"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
