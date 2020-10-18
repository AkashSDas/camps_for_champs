import React, { useEffect, useState } from "react";
import { getAllProducts } from "../../helper/campProduct";
import { Footer } from "../../shared/components/Footer";
import { Navbar, NavbarAlt } from "../../shared/components/Navbar";
import { CampProductCard } from "./CampProductCard";

export const CampProducts = () => {
  const [campProducts, setCampProducts] = useState([]);

  // handle signup success, error, disable submit button
  const [response, setResponse] = useState({
    loading: false,
  });

  useEffect(() => {
    setResponse({ ...response, loading: true });

    getAllProducts()
      .then((data) => {
        setCampProducts(data);
        setResponse({ ...response, loading: false });
      })
      .catch((err) => {
        console.log(err);
        setResponse({ ...response, loading: false });
      });
  }, []);

  const campProductJsx = (campProducts) => (
    <section className="camp-product">
      <h1>Camp products</h1>

      {response.loading ? (
        <div className="loader"></div>
      ) : (
        <div>
          {campProducts.length !== 0 ? (
            <div className="product-grid">
              {campProducts.map((product, i) => (
                <CampProductCard key={i} product={product} />
              ))}
            </div>
          ) : (
            <h3>
              <i className="fas fa-frown"></i> No camp products
            </h3>
          )}
        </div>
      )}
    </section>
  );

  return (
    <div>
      <Navbar />
      <NavbarAlt />

      {campProductJsx(campProducts)}

      <Footer />
    </div>
  );
};
