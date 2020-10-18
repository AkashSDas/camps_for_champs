import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated } from "../../helper/auth";
import { removeItemFromCart } from "../../helper/cart";

export const CampProductCard = ({
  product,
  reload = undefined,
  setReload = (f) => f,
}) => {
  const [redirectToSignIn, setRedirectToSignIn] = useState(false);

  const [message, setMessage] = useState({
    display: false,
    message: "",
  });

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

  const getARedirectToSignIn = (redirectToSignIn) => {
    if (redirectToSignIn) {
      return <Redirect to="/signup" />;
    }
  };

  const removeFromCartFunc = () => {
    if (isAuthenticated()) {
      removeItemFromCart("product", product.id);
      setReload(!reload);
      console.log("Removed from cart");
    } else {
      setRedirectToSignIn(true);
      console.log("Please signin/login");
    }
  };

  return (
    <div className="product-cart">
      <div className="info">
        <img src={product.image ? product.image : ""} alt={product.name} />

        <div>
          <h3>{product.name}</h3>
          <div className="description">
            <div className="ratings">
              {getRatings(ratings).map((c, i) => c)}
            </div>
            <div className="price">
              <i className="fas fa-dollar-sign"></i>
              {formatMoney(product.price)}
            </div>
            <div>{product.description}</div>
          </div>
        </div>
      </div>

      <div className="btn-section">
        <button className="remove-btn" onClick={removeFromCartFunc}>
          <i className="fas fa-minus"></i>
        </button>
      </div>

      {getARedirectToSignIn(redirectToSignIn)}
    </div>
  );
};
