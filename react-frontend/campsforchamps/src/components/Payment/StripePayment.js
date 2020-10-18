import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import StripeCheckout from "react-stripe-checkout";
import { isAuthenticated } from "../../helper/auth";
import { cartEmpty } from "../../helper/cart";
import {
  createCampPlanOrder,
  createCampProductOrder,
} from "../../helper/order";
import { processStripePayment } from "../../helper/payment";

export const StripePayment = ({
  which,
  products,
  reload = undefined,
  setReload = (f) => f,
}) => {
  const [paymentInfo, setPaymentInfo] = useState({
    loading: false,
    success: false,
    error: false,
  });

  const userId = isAuthenticated() && isAuthenticated().user.id;
  const sessionToken = isAuthenticated() && isAuthenticated().token;
  const [totalAmount, setTotalAmount] = useState(0);

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

  const getTotalAmount = () => {
    let amount = 0;
    products.map((p) => {
      amount = amount + parseFloat(p.price);
    });
    return amount;
  };

  useEffect(() => {
    setTotalAmount(getTotalAmount());
  }, []);

  const onPurchase = (token) => {
    setPaymentInfo({ ...paymentInfo, loading: true });
    let product_names = "";
    products.map((p) => {
      product_names = product_names + p.name + ", ";
    });

    const paymentData = {
      amount: Math.round(totalAmount * 100),
      product_names: product_names,
      source: token.id,
    };

    console.log(paymentData);

    processStripePayment(userId, sessionToken, paymentData)
      .then((response) => {
        if (response.status === "succeeded") {
          setPaymentInfo({ ...paymentInfo, success: true, loading: false });

          // make order in backend
          if (which === "plan") {
            let plans = [];
            let plan_names = "";
            products.forEach((p) => {
              plans.push(p.id);
              plan_names = plan_names + p.name + ", ";
            });
            let total_plans = plans.length;
            const campPlanOrderData = {
              plans: plans,
              plan_names: plan_names,
              total_plans: total_plans,
              transaction_id: response.stripe_id,
              total_amount: response.amount,
            };

            createCampPlanOrder(userId, sessionToken, campPlanOrderData)
              .then((response) => {
                if (response.error) {
                  if (response.code == "1") {
                    console.log("Camp plan order failed");
                  }
                  return <Redirect to="/cart" />;
                } else {
                  if (response.success) {
                    console.log("order placed");
                    cartEmpty(which, () => console.log("Cart emptyed"));
                    setReload(!reload);
                  }
                }
              })
              .catch((err) => {
                setPaymentInfo({
                  ...paymentInfo,
                  loading: false,
                  success: false,
                });
                console.log("order failed: ", err);
              });
          } else if (which === "product") {
            let productsArr = [];
            let product_names = "";
            products.forEach((p) => {
              productsArr.push(p.id);
              product_names = product_names + p.name + ", ";
            });
            let total_products = productsArr.length;
            console.log(productsArr);
            const campProductOrderData = {
              products: productsArr,
              product_names: product_names,
              total_products: total_products,
              transaction_id: response.stripe_id,
              total_amount: response.amount,
            };
            createCampProductOrder(userId, sessionToken, campProductOrderData)
              .then((response) => {
                if (response.error) {
                  if (response.code == "1") {
                    console.log("Camp product order failed");
                  }
                  return <Redirect to="/cart" />;
                } else {
                  if (response.success) {
                    console.log("order placed");
                    cartEmpty(which, () => console.log("Cart emptyed"));
                    setReload(!reload);
                  }
                }
              })
              .catch((err) => {
                setPaymentInfo({
                  ...paymentInfo,
                  loading: false,
                  success: false,
                });
                console.log("order failed: ", err);
              });
          }
        } else {
          setPaymentInfo({ ...paymentInfo, error: true, loading: false });
          console.log("Payment failed");
        }
      })
      .catch((err) => console.log(err));
  };

  const showStripePayment = () => {
    return (
      <div>
        <StripeCheckout
          stripeKey={process.env.REACT_APP_STRIPE_SECRET_KEY}
          token={onPurchase}
          amount={totalAmount * 100}
          name="CampsForChamps"
        >
          <button className="checkout-btn" disabled={paymentInfo.loading}>
            <i className="fab fa-stripe"></i> Buy using stripe
          </button>
        </StripeCheckout>
      </div>
    );
  };

  return (
    <section className="payment">
      <h2>Stripe Payment</h2>

      <div className="total-price">
        <i className="fad fa-money-bill-wave"></i> Total amount is{" "}
        <i className="fad fa-dollar-sign"></i>{" "}
        {formatMoney(getTotalAmount(products))}
      </div>

      {showStripePayment()}
    </section>
  );
};
