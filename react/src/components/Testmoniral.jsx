import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function Testmoniral() {
  return (
    <section
      id="testimonials"
      className="testimonial.testimonials padding-large "
    >
      <div className="container">
        <div className="reviews-content">
          <div className="row d-flex flex-wrap">
            <div className="col-md-2">
              <div className="review-icon">
                <i className="icon icon-right-quote"></i>
              </div>
            </div>
            <div className="col-md-8">
              <Swiper
                modules={[Navigation]}
                navigation={{
                  nextEl: ".next-button",
                  prevEl: ".prev-button",
                }}
                spaceBetween={50}
                slidesPerView={1}
                loop={true} // Enables infinite loop
                className="testimonial-swiper"
              >
                <SwiperSlide>
                  <div className="testimonial-detail">
                    <p>
                      “Dignissim massa diam elementum habitant fames. Id nullam
                      pellentesque nisi, eget cursus dictumst pharetra, sit.
                      Pulvinar laoreet id porttitor egestas dui urna. Porttitor
                      nibh magna dolor ultrices iaculis sit iaculis.”
                    </p>
                    <div className="author-detail">
                      <div className="name">By Maggie Rio</div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="testimonial-detail">
                    <p>
                      “Dignissim massa diam elementum habitant fames. Id nullam
                      pellentesque nisi, eget cursus dictumst pharetra, sit.
                      Pulvinar laoreet id porttitor egestas dui urna. Porttitor
                      nibh magna dolor ultrices iaculis sit iaculis.”
                    </p>
                    <div className="author-detail">
                      <div className="name">By John Smith</div>
                    </div>
                  </div>
                </SwiperSlide>
              </Swiper>
              <div className="swiper-arrows">
                <button className="prev-button">
                  <i className="icon icon-arrow-left"></i>
                </button>
                <button className="next-button">
                  <i className="icon icon-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
