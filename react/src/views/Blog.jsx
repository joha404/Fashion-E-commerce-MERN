import React from "react";
import Blogs from "../components/blogs/Blogs";

export default function Blog() {
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
              <h1 class="page-title">Blog page</h1>
              <div class="breadcrumbs">
                <span class="item">
                  <a href="index.html">Home /</a>
                </span>
                <span class="item">Blog</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Blogs />
    </>
  );
}
