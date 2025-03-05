import React from "react";

export default function Map() {
  return (
    <section className="google-map">
      <div
        className="mapouter"
        style={{
          position: "relative",
          textAlign: "right",
          height: "500px",
          width: "100%",
        }}
      >
        <div
          className="gmap_canvas"
          style={{
            overflow: "hidden",
            background: "none !important",
            height: "500px",
            width: "100%",
          }}
        >
          <iframe
            width="100%"
            height="500"
            id="gmap_canvas"
            src="https://maps.google.com/maps?q=2880%20Broadway,%20New%20York&t=&z=13&ie=UTF8&iwloc=&output=embed"
            style={{ border: "0" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
