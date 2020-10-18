import DropIn from "braintree-web-drop-in-react";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated } from "../../helper/auth";
import { cartEmpty } from "../../helper/cart";
import {
  createCampPlanOrder,
  createCampProductOrder,
} from "../../helper/order";
import {
  getBraintreeToken,
  processBraintreePayment,
} from "../../helper/payment";
import { logout } from "../../helper/user";

export const BraintreePayment = ({
  which,
  products,
  reload = undefined,
  setReload = (f) => f,
}) => {
  const [paymentInfo, setPaymentInfo] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
  });

  const userId = isAuthenticated() && isAuthenticated().user.id;
  const sessionToken = isAuthenticated() && isAuthenticated().token;

  const getBraintreePaymentToken = (userId, token) => {
    getBraintreeToken(userId, token).then((info) => {
      if (info.error) {
        setPaymentInfo({ ...paymentInfo, error: info.error });
        logout(() => <Redirect to="/" />);
      } else {
        const clientToken = info.clientToken;
        setPaymentInfo({ ...paymentInfo, clientToken: clientToken });
      }
    });
  };

  useEffect(() => {
    getBraintreePaymentToken(userId, sessionToken);
  }, []);

  const getTotalAmount = () => {
    let amount = 0;
    products.map((p) => {
      amount = amount + parseFloat(p.price);
    });
    return amount;
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

  const onPurchase = () => {
    setPaymentInfo({ ...paymentInfo, loading: true });

    let nonce;
    let getNonce = paymentInfo.instance
      .requestPaymentMethod()
      .then((data) => {
        nonce = data.nonce;
        const paymentData = {
          paymentMethodNonce: nonce,
          amount: getTotalAmount(),
        };

        processBraintreePayment(userId, sessionToken, paymentData)
          .then((response) => {
            console.log(response);
            if (response.error) {
              if (response.code == "1") {
                console.log("Payment failed");
                return <Redirect to="/cart" />;
              }
            } else {
              setPaymentInfo({
                ...paymentInfo,
                success: response.success,
                loading: false,
              });
              console.log("Payment success");

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
                  transaction_id: response.transaction.id,
                  total_amount: response.transaction.amount,
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
                  transaction_id: response.transaction.id,
                  total_amount: response.transaction.amount,
                };
                createCampProductOrder(
                  userId,
                  sessionToken,
                  campProductOrderData
                )
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
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log("Nonce: ", err));
  };

  const showDropInBtn = () => {
    if (products.length === 0) {
      return <h2>Please add something in cart</h2>;
    } else if (paymentInfo.clientToken !== null) {
      return (
        <div className="braintree-payment-section">
          <div>
            <DropIn
              options={{ authorization: paymentInfo.clientToken }}
              onInstance={(instance) => (paymentInfo.instance = instance)}
            />
          </div>

          <button
            className="checkout-btn"
            onClick={onPurchase}
            disabled={paymentInfo.loading}
          >
            <i className="fas fa-brain"></i> Buy using braintree
          </button>
        </div>
      );
    }
  };

  return (
    <section className="payment">
      <h2>Braintree Payment</h2>

      <div className="total-price">
        <i className="fad fa-money-bill-wave"></i> Total amount is{" "}
        <i className="fad fa-dollar-sign"></i>{" "}
        {formatMoney(getTotalAmount(products))}
      </div>

      {showDropInBtn()}
    </section>
  );
};
