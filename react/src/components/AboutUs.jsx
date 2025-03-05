import React from "react";
const aboutImg = "/images/single-image1.jpg";
export default function AboutUs() {
  return (
    <>
      <section id="about-us">
        <div class="container ">
          <div class="row d-flex align-items-center">
            <div class="col-lg-6 col-md-12">
              <div class="image-holder">
                <img src={aboutImg} alt="single" class="about-image" />
              </div>
            </div>
            <div class="col-lg-6 col-md-12">
              <div class="detail">
                <div class="display-header">
                  <h2 class="section-title">How was Ultras Store started?</h2>
                  <p>
                    Risus augue curabitur diam senectus congue velit et. Sed
                    vitae metus nibh sit era. Nulla adipiscing pharetra
                    pellentesque maecenas odio eros at. Et libero vulputate amet
                    duis erat volutpat vitae eget. Sed vitae metus nibh sit era.
                    Nulla adipiscing pharetra pellentesque maecenas odio eros
                    at.
                    <br />
                    Sed vitae metus nibh sit era. Nulla adipiscing pharetra
                    pellentesque maecenas odio eros at. Et libero vulputate amet
                    duis erat volutpat vitae eget. Quam libero etiam et in ac at
                    quis. Risus augue curabitur diam senectus congue velit et.{" "}
                  </p>
                  <div class="btn-wrap">
                    <a
                      href="shop.html"
                      class="btn btn-dark btn-medium d-flex align-items-center"
                      tabindex="0"
                    >
                      Shop our store<i class="icon icon-arrow-io"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
