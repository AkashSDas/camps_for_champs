import React, { useEffect, useState } from "react";
import { getGalleryImages } from "../../helper/home";
import { Footer } from "../../shared/components/Footer";
import { Navbar, NavbarAlt } from "../../shared/components/Navbar";

export const Gallery = () => {
  const [images, setImages] = useState([]);
  const [response, setResponse] = useState({
    loading: false,
  });

  useEffect(() => {
    setResponse({ ...response, loading: true });
    getGalleryImages()
      .then((images) => {
        setImages(images);
        setResponse({ ...response, loading: false });
      })
      .catch((err) => console.log(err));
  }, []);

  const imagesJsx = () => (
    <section className="container">
      <h1>Gallery</h1>

      {response.loading ? (
        <div className="loader"></div>
      ) : (
        <div className="gallery">
          {images.length !== 0 ? (
            images.map((imgUrl, i) => (
              <div
                key={i}
                className="card"
                style={{ backgroundImage: `url(${imgUrl})` }}
              ></div>
            ))
          ) : (
            <h1>No images</h1>
          )}
        </div>
      )}
    </section>
  );

  return (
    <div>
      <Navbar />
      <NavbarAlt />

      {imagesJsx()}

      <Footer />
    </div>
  );
};
