(function ($) {
  "use strict";

  // Search Popup functionality
  var searchPopup = function () {
    // open search box
    $(".secondary-nav").on("click", ".search-button", function (e) {
      $(".search-popup").toggleClass("is-visible");
    });

    $("#header-nav").on("click", ".btn-close-search", function (e) {
      $(".search-popup").toggleClass("is-visible");
    });

    $(".search-popup-trigger").on("click", function (b) {
      b.preventDefault();
      $(".search-popup").addClass("is-visible");
      setTimeout(function () {
        $(".search-popup").find("#search-popup").focus();
      }, 350);
    });

    $(".search-popup").on("click", function (b) {
      if (
        $(b.target).is(".search-popup-close") ||
        $(b.target).is(".search-popup-close svg") ||
        $(b.target).is(".search-popup-close path") ||
        $(b.target).is(".search-popup")
      ) {
        b.preventDefault();
        $(this).removeClass("is-visible");
      }
    });

    $(document).keyup(function (b) {
      if (b.which === 27) {
        $(".search-popup").removeClass("is-visible");
      }
    });
  };

  // Preloader functionality
  var initPreloader = function () {
    $(document).ready(function ($) {
      var Body = $("body");
      Body.addClass("preloader-site");
    });
    $(window).on("load", function () {
      $(".preloader-wrapper").fadeOut();
      $("body").removeClass("preloader-site");
    });
  };

  // Init jarallax parallax effect
  var initJarallax = function () {
    jarallax(document.querySelectorAll(".jarallax"));
    jarallax(document.querySelectorAll(".jarallax-img"), {
      keepImg: true,
    });
  };

  // Tabs functionality
  var initTabs = function () {
    const tabs = document.querySelectorAll("[data-tab-target]");
    const tabContents = document.querySelectorAll("[data-tab-content]");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = document.querySelector(tab.dataset.tabTarget);
        tabContents.forEach((tabContent) => {
          tabContent.classList.remove("active");
        });
        tabs.forEach((tab) => {
          tab.classList.remove("active");
        });
        tab.classList.add("active");
        target.classList.add("active");
      });
    });
  };

  // Document ready function
  $(document).ready(function () {
    searchPopup();
    initPreloader();
    initTabs();
    initJarallax();

    // Initialize stellar navigation
    jQuery(".stellarnav").stellarNav({
      position: "right",
    });

    // Search box toggle
    $(".user-items .icon-search").click(function () {
      $(".search-box").toggleClass("active");
      $(".search-box .search-input").focus();
    });
    $(".close-button").click(function () {
      $(".search-box").toggleClass("active");
    });

    // Initialize Swipers
    var swiperMain = new Swiper(".main-swiper", {
      speed: 500,
      loop: true,
      navigation: {
        nextEl: ".button-next",
        prevEl: ".button-prev",
      },
      pagination: {
        el: "#billboard .swiper-pagination",
        clickable: true,
      },
    });

    var swiperTwoColumn = new Swiper(".two-column-swiper", {
      speed: 500,
      loop: true,
      navigation: {
        nextEl: ".button-next",
        prevEl: ".button-prev",
      },
    });

    var swiperFeaturedProducts = new Swiper(
      "#featured-products .product-swiper",
      {
        pagination: {
          el: "#featured-products .swiper-pagination",
          clickable: true,
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 30,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          999: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1299: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        },
      }
    );

    var swiperFeaturedProductsTwo = new Swiper(
      "#featured-products .product-swiper-two",
      {
        pagination: {
          el: "#featured-products .swiper-pagination",
          clickable: true,
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 30,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          999: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
          1299: {
            slidesPerView: 5,
            spaceBetween: 30,
          },
        },
      }
    );

    var swiperFlashSales = new Swiper("#flash-sales .product-swiper", {
      pagination: {
        el: "#flash-sales .product-swiper .swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
          spaceBetween: 30,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        999: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        1299: {
          slidesPerView: 4,
          spaceBetween: 30,
        },
      },
    });

    var swiperTestimonial = new Swiper(".testimonial-swiper", {
      loop: true,
      navigation: {
        nextEl: ".next-button",
        prevEl: ".prev-button",
      },
    });

    var thumb_slider = new Swiper(".thumb-swiper", {
      slidesPerView: 1,
    });
    var large_slider = new Swiper(".large-swiper", {
      spaceBetween: 10,
      effect: "fade",
      thumbs: {
        swiper: thumb_slider,
      },
    });

    // Initialize Isotope
    var $grid = $(".entry-container").isotope({
      itemSelector: ".entry-item",
      layoutMode: "masonry",
    });
    $grid.imagesLoaded().progress(function () {
      $grid.isotope("layout");
    });

    // Colorbox for galleries and youtube embeds
    $(".gallery").colorbox({
      rel: "gallery",
    });

    $(".youtube").colorbox({
      iframe: true,
      innerWidth: 960,
      innerHeight: 585,
    });
  });
})(jQuery);
