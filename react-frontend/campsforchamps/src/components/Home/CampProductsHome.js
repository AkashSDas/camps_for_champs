import React, { useEffect, useState } from "react";
import { getAllProducts } from "../../helper/campProduct";
import { CampProductCardHome } from "./CampProductCardHome";

export const CampProductsHome = () => {
  const [campProducts, setCampProducts] = useState([]);

  // handle signup success, error, disable submit button
  const [response, setResponse] = useState({
    loading: false,
  });

  useEffect(() => {
    setResponse({ ...response, loading: true });

    getAllProducts()
      .then((data) => {
        setCampProducts(data.slice(0, 6));
        setResponse({ ...response, loading: false });
      })
      .catch((err) => {
        console.log(err);
        setResponse({ ...response, loading: false });
      });
  }, []);

  const campProductJsx = (campProducts) => (
    <section className="home-camp-product">
      {response.loading ? (
        <div className="loader"></div>
      ) : (
        <div>
          {campProducts.length !== 0 ? (
            <div className="product-grid">
              {campProducts.map((product, i) => (
                <CampProductCardHome key={i} product={product} />
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

  return <div>{campProductJsx(campProducts)}</div>;
};
