import axios from "axios";
import {
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  RESET_CART,
  SHIPPING_INFO,
} from "./CartTypes";

export const addItemToCart = (id, quantity) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/v1/products/${id}`);
  dispatch({
    type: ADD_TO_CART,
    payload: {
      product: data?.product?._id,
      name: data?.product?.name,
      category: data?.product?.category,
      price: data?.product?.price,
      image: data?.product?.images[0],
      stock: data?.product?.stock,
      quantity,
    },
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const deleteCartItem = (id) => async (dispatch, getState) => {
  dispatch({
    type: REMOVE_CART_ITEM,
    payload: id,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const resetCartItems = () => (dispatch, getState) => {
  try {
    dispatch({
      type: RESET_CART,
    });

    // const { cartItems } = getState().cart;
    // localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.removeItem("cartItems");
  } catch (error) {
    // Handle the error gracefully
    console.error("Error resetting cart items:", error);
  }
};

export const getShippingInfo = (data) => async (dispatch) => {
  dispatch({
    type: SHIPPING_INFO,
    payload: data,
  });

  localStorage.setItem("shippingInfo", JSON.stringify(data));
};
