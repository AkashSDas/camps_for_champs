import React, { useEffect, useState } from "react";
import { loadCart } from "../../helper/cart";
import { Footer } from "../../shared/components/Footer";
import { Navbar, NavbarAlt } from "../../shared/components/Navbar";
import { BraintreePayment } from "../Payment/BraintreePayment";
import { StripePayment } from "../Payment/StripePayment";
import { CampPlanCard } from "./CampPlanCard";
import { CampProductCard } from "./CampProductCard";

export const Cart = () => {
  const [campProducts, setCampProducts] = useState([]);
  const [campPlans, setCampPlans] = useState([]);

  const [reload, setReload] = useState(false);

  const [displayProductCart, setDisplayProductCart] = useState(false);
  const [displayPlanCart, setDisplayPlanCart] = useState(false);
  const [displayProductPayment, setDisplayProductPayment] = useState(false);
  const [displayPlanPayment, setDisplayPlanPayment] = useState(false);

  useEffect(() => {
    setCampProducts(loadCart("product"));
    setCampPlans(loadCart("plan"));
  }, [reload]);

  const loadCampProductsJsx = (campProducts) => (
    <section className="container">
      {campProducts.map((product, index) => {
        return (
          <CampProductCard
            key={index}
            product={product}
            reload={reload}
            setReload={setReload}
          />
        );
      })}
    </section>
  );

  const loadCampPlansJsx = (campPlans) => (
    <section className="container">
      {campPlans.map((plan, index) => {
        return (
          <CampPlanCard
            key={index}
            plan={plan}
            reload={reload}
            setReload={setReload}
          />
        );
      })}
    </section>
  );

  const paymentJsx = (which, products) => {
    return (
      <div>
        <BraintreePayment
          which={which}
          products={products}
          reload={reload}
          setReload={setReload}
        />

        <hr style={{ marginTop: "2rem" }} />

        <StripePayment
          which={which}
          products={products}
          reload={reload}
          setReload={setReload}
        />
      </div>
    );
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

  const getTotalAmount = (products) => {
    let amount = 0;
    products.map((p) => {
      amount = amount + parseFloat(p.price);
    });
    return amount;
  };

  const campCart = (
    which,
    products,
    loadProduct,
    display,
    setDisplay,
    paymentDisplay,
    setPaymentDisplay
  ) => {
    if (products.length > 0) {
      return (
        <section className="camp-cart">
          <button className="cart-btn" onClick={() => setDisplay(!display)}>
            <i className="fas fa-arrow-circle-down"></i> Show camp {which} cart
          </button>

          {display ? (
            <div className="cart-items-list">
              <div className="total-price">
                <i className="fad fa-money-bill-wave"></i> Total amount is{" "}
                <i className="fad fa-dollar-sign"></i>{" "}
                {formatMoney(getTotalAmount(products))}
              </div>

              {loadProduct(products)}

              {paymentDisplay ? paymentJsx(which, products) : null}

              <button
                className="payment-btn"
                onClick={() => setPaymentDisplay(!paymentDisplay)}
              >
                <i className="fab fa-paypal"></i> Do camp {which} payment
              </button>
            </div>
          ) : null}
        </section>
      );
    } else {
      return (
        <section className="empty-cart">
          <h2>
            <i className="fas fa-frown"></i> Cart has no {which}
          </h2>
        </section>
      );
    }
  };

  const campProductsSectionJsx = () => {
    return campCart(
      "products",
      campProducts,
      loadCampProductsJsx,
      displayProductCart,
      setDisplayProductCart,
      displayProductPayment,
      setDisplayProductPayment
    );
  };

  const campPlansSectionJsx = () => {
    return campCart(
      "plans",
      campPlans,
      loadCampPlansJsx,
      displayPlanCart,
      setDisplayPlanCart,
      displayPlanPayment,
      setDisplayPlanPayment
    );
  };

  return (
    <div>
      <Navbar />
      <NavbarAlt />

      <section className="cart">
        <h1>Cart</h1>

        {campProductsSectionJsx()}

        <hr />

        {campPlansSectionJsx()}
      </section>

      <Footer />
    </div>
  );
};
