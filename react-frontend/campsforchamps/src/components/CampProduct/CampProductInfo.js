import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../../helper/auth";
import { addItemToCart, removeItemFromCart } from "../../helper/cart";
import { Footer } from "../../shared/components/Footer";
import { showWarningMsg } from "../../shared/components/Message";
import { Navbar, NavbarAlt } from "../../shared/components/Navbar";

export const CampProductInfo = (props) => {
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

  try {
    const product = props.location.state.product;

    const getARedirectToSignIn = (redirectToSignIn) => {
      if (redirectToSignIn) {
        return <Redirect to="/signup" />;
      }
    };

    const addToCartFunc = () => {
      if (isAuthenticated()) {
        addItemToCart("product", product, () => {});
        setMessage({
          ...message,
          display: true,
          message: "Successfully added to cart",
        });
        console.log("Added to cart");
      } else {
        setRedirectToSignIn(true);
        console.log("Please signin/login");
      }
    };

    const removeFromCartFunc = () => {
      if (isAuthenticated()) {
        removeItemFromCart("product", product.id);
        setMessage({
          ...message,
          display: true,
          message: "Successfully removed from cart",
        });
        console.log("Removed from cart");
      } else {
        setRedirectToSignIn(true);
        console.log("Please signin/login");
      }
    };

    return (
      <div>
        <Navbar />
        <NavbarAlt />

        <section className="camp-product-info">
          <Link to="/camp-product">
            <i className="fas fa-arrow-left"></i> Go back
          </Link>

          <div className="message">
            {showWarningMsg(message.display, message.message)}
          </div>

          <div className="info-container">
            <img src={product.image ? product.image : ""} alt={product.name} />

            <div className="info">
              <h3>{product.name}</h3>
              <div className="ratings">
                {getRatings(ratings).map((c, i) => c)}
              </div>
              <div className="price">
                <i className="fas fa-dollar-sign"></i>
                {formatMoney(product.price)}
              </div>
              <div>
                <i className="fas fa-shopping-cart"></i> Stock available{" "}
                {product.stock}
              </div>

              <div className="description">{product.description}</div>

              <div className="btn-section">
                <button onClick={addToCartFunc}>
                  <i className="fas fa-plus-circle"></i> Add to Cart
                </button>
                <button onClick={removeFromCartFunc}>
                  <i className="fas fa-minus-circle"></i> Remove from cart
                </button>
              </div>
            </div>
          </div>

          {getARedirectToSignIn(redirectToSignIn)}
        </section>

        <Footer />
      </div>
    );
  } catch (e) {
    console.log(e);
    return <Redirect to="/camp-product" />;
  }
};
