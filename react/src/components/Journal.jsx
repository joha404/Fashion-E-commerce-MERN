import React from "react";
const brand1 = "/images/brand1.png";
const brand2 = "/images/brand2.png";
const brand3 = "/images/brand3.png";
const brand4 = "/images/brand4.png";
const brand5 = "/images/brand5.png";
const post1 = "/images/post-img1.jpg";
const post2 = "/images/post-img2.jpg";
const post3 = "/images/post-img3.jpg";

export default function Journal() {
  return (
    <>
      <section id="latest-blog" className="padding-large">
        <div className="container">
          <div className="section-header d-flex flex-wrap align-items-center justify-content-between">
            <h2 className="section-title">our Journal</h2>
            <div className="btn-wrap align-right">
              <a href="blog.html" className="d-flex align-items-center">
                Read All Articles <i className="icon icon icon-arrow-io"></i>
              </a>
            </div>
          </div>
          <div className="row d-flex flex-wrap">
            <article className="col-md-4 post-item">
              <div className="image-holder zoom-effect">
                <a href="single-post.html">
                  <img src={post1} alt="post" className="post-image" />
                </a>
              </div>
              <div className="post-content d-flex">
                <div className="meta-date">
                  <div className="meta-day text-primary">22</div>
                  <div className="meta-month">Aug-2021</div>
                </div>
                <div className="post-header">
                  <h3 className="post-title">
                    <a href="single-post.html">
                      top 10 casual look ideas to dress up your kids
                    </a>
                  </h3>
                  <a href="blog.html" className="blog-categories">
                    Fashion
                  </a>
                </div>
              </div>
            </article>
            <article className="col-md-4 post-item">
              <div className="image-holder zoom-effect">
                <a href="single-post.html">
                  <img src={post2} alt="post" className="post-image" />
                </a>
              </div>
              <div className="post-content d-flex">
                <div className="meta-date">
                  <div className="meta-day text-primary">25</div>
                  <div className="meta-month">Aug-2021</div>
                </div>
                <div className="post-header">
                  <h3 className="post-title">
                    <a href="single-post.html">
                      Latest trends of wearing street wears supremely
                    </a>
                  </h3>
                  <a href="blog.html" className="blog-categories">
                    Trending
                  </a>
                </div>
              </div>
            </article>
            <article className="col-md-4 post-item">
              <div className="image-holder zoom-effect">
                <a href="single-post.html">
                  <img src={post3} alt="post" className="post-image" />
                </a>
              </div>
              <div className="post-content d-flex">
                <div className="meta-date">
                  <div className="meta-day text-primary">28</div>
                  <div className="meta-month">Aug-2021</div>
                </div>
                <div className="post-header">
                  <h3 className="post-title">
                    <a href="single-post.html">
                      types of comfortable clothes ideas for women
                    </a>
                  </h3>
                  <a href="blog.html" className="blog-categories">
                    Inspiration
                  </a>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="brand-collection" className="padding-medium bg-light-grey">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between">
            <img src={brand1} alt="phone" className="brand-image" />
            <img src={brand2} alt="phone" className="brand-image" />
            <img src={brand3} alt="phone" className="brand-image" />
            <img src={brand4} alt="phone" className="brand-image" />
            <img src={brand5} alt="phone" className="brand-image" />
          </div>
        </div>
      </section>
    </>
  );
}
