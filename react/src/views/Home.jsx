import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import FeatureProduct from "../components/products/FeatureProduct";
import Collection from "../components/collection/Collection";
import DiscountCupon from "../components/DiscountCupon";
import BestSelling from "../components/products/BestSelling";
import Testmoniral from "../components/Testmoniral";
import NewArrival from "../components/products/NewArrival";
import Casual from "../components/Casual";
import Quote from "../components/Quote";
import styles from "./home.module.css"; // Correct CSS module import

export default function Home() {
  // Define styles and titles for the slides
  const slides = [
    {
      backgroundImage: "url('/images/banner1.jpg')",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      title: "Summer Collection",
    },
    {
      backgroundImage: "url('/images/banner2.jpg')",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      title: "Casual Collection",
    },
  ];

  return (
    <>
      <section id={styles.billboard} className="overflow-hidden ">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop
          speed={1000} // Transition speed in milliseconds
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className={styles["banner-content"]} style={{ ...slide }}>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-6">
                      <h2 className={styles["banner-title"]}>{slide.title}</h2>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed eu feugiat amet, libero ipsum enim pharetra hac.
                      </p>
                      <div className="btn-wrap">
                        <a
                          href="shop.html"
                          className="btn btn-light btn-medium d-flex align-items-center"
                        >
                          Shop it now <i className="icon icon-arrow-io"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      <FeatureProduct />
      <Collection />
      <DiscountCupon />
      <BestSelling />
      <Testmoniral />
      <NewArrival />
      <Casual />
      <Quote />
      <hr />
    </>
  );
}
