import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import {
  productReducer,
  createNewProductReducer,
  productDetailsReducer,
  createReviewReducer,
  productDeleteUpdateReducer,
  getReviewsReducer,
  deleteReviewReducer,
} from "./Products/productReducer";
import {
  authReducer,
  userReducer,
  forgotPasswordReducer,
  allUsersReducer,
  userDetailsReducer,
} from "./Users/userReducer";
import { cartReducer } from "./Cart/CartReducer";
import {
  newOrderReducer,
  myOrdersReducer,
  orderDetailsReducer,
  allOrdersReducer,
  editOrderReducer,
} from "./Order/OrderReducer";

const initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  },
};

const rootReducer = combineReducers({
  products: productReducer,
  createNewProduct: createNewProductReducer,
  productDetails: productDetailsReducer,
  product: productDeleteUpdateReducer,
  auth: authReducer,
  user: userReducer,
  allUsers: allUsersReducer,
  userDetails: userDetailsReducer,
  forgotPassword: forgotPasswordReducer,
  cart: cartReducer,
  newOrder: newOrderReducer,
  myOrders: myOrdersReducer,
  orderDetails: orderDetailsReducer,
  allOrders: allOrdersReducer,
  editOrder: editOrderReducer,
  createReview: createReviewReducer,
  getReviews: getReviewsReducer,
  deleteReview: deleteReviewReducer,
});

const store = createStore(rootReducer, initialState, applyMiddleware(thunk));

export default store;
