const CAMP_PLAN_CART = "campPlanCart";
const CAMP_PRODUCT_CART = "campProductCart";

export const getWhichCart = (name) => {
  if (name === "plan") {
    return CAMP_PLAN_CART;
  } else if (name === "product") {
    return CAMP_PRODUCT_CART;
  }
};

// add items to cart
export const addItemToCart = (which, item, next) => {
  let where = getWhichCart(which);

  let cart = [];
  if (typeof window !== undefined) {
    if (localStorage.getItem(where)) {
      cart = JSON.parse(localStorage.getItem(where));
    }
    cart.push({ ...item });

    localStorage.setItem(where, JSON.stringify(cart));
    next();
  }
};

// retrive all items from cart
export const loadCart = (which) => {
  let where = getWhichCart(which);

  if (typeof window !== undefined) {
    if (localStorage.getItem(where)) {
      console.log(JSON.parse(localStorage.getItem(where)));
      return JSON.parse(localStorage.getItem(where));
    }
    return [];
  }
};

// remove items from cart
export const removeItemFromCart = (which, removeId) => {
  let where = getWhichCart(which);

  let cart = [];
  if (typeof window !== undefined) {
    if (localStorage.getItem(where)) {
      cart = JSON.parse(localStorage.getItem(where));
    }

    cart.map((product, i) => {
      if (product.id === removeId) {
        console.log(product, product.id);
        cart.splice(i, 1);
      }
    });

    localStorage.setItem(where, JSON.stringify(cart));
  }
};

// empty the cart
export const cartEmpty = (which, next) => {
  if (typeof window !== undefined) {
    if (which === "plan") {
      localStorage.removeItem(getWhichCart("plan"));
      localStorage.setItem(getWhichCart("plan"), JSON.stringify([]));
    } else if (which === "product") {
      localStorage.removeItem(getWhichCart("product"));
      localStorage.setItem(getWhichCart("product"), JSON.stringify([]));
    }

    next();
  }
};
