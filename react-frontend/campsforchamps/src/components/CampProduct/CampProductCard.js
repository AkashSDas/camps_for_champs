import React from "react";
import { Link } from "react-router-dom";

export const CampProductCard = ({ product }) => {
  const ratings = 4;

  const getRatings = (num) => {
    const ratingJsx = <i className="fad fa-star"></i>;
    let ratingArr = [];
    for (let i = 0; i < num; i++) {
      ratingArr.push(ratingJsx);
    }
    return ratingArr;
  };

  function formatMoney(
    amount,
    decimalCount = 2,
    decimal = ".",
    thousands = ","
  ) {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

      const negativeSign = amount < 0 ? "-" : "";

      let i = parseInt(
        (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
      ).toString();
      let j = i.length > 3 ? i.length % 3 : 0;

      return (
        negativeSign +
        (j ? i.substr(0, j) + thousands : "") +
        i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
        (decimalCount
          ? decimal +
            Math.abs(amount - i)
              .toFixed(decimalCount)
              .slice(2)
          : "")
      );
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <section className="product-card">
      <Link
        to={{
          pathname: `/camp-product/${product.name}`,
          state: { product: product },
        }}
      >
        <img src={product.image} alt={product.name} />

        <div className="info">
          <div>
            <h3>{product.name}</h3>
            <div className="description">{product.description}</div>
          </div>
          <div>
            <div className="ratings">
              {getRatings(ratings).map((c, i) => c)}
            </div>
            <div className="price">
              <i className="fas fa-dollar-sign"></i>
              {formatMoney(product.price)}
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
};
