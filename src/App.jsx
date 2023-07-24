import React, { useEffect, useState } from "react";
import "./App.css";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

import { loadUser } from "./Redux/Users/userAction";
import store from "./Redux/store";
import PrivateUserRoutes from "./components/Auth/PrivateUserRoutes";
import Profile from "./components/User/Profile";
import ChangePassword from "./components/User/ChangePassword";
import ForgotPassword from "./components/User/ForgotPassword";
import ResetPassword from "./components/User/ResetPassword";
import AdminRoutes from "./components/Auth/AdminRoutes";
import Dashboard from "./admin/Dashboard";
import AllProducts from "./admin/AllProducts";
import Cart from "./components/Order/Cart";
import Shipping from "./components/Order/Shipping";
import CreateNewProduct from "./admin/CreateNewProduct";
import SingleProduct from "./components/Products/SingleProduct";
import ConfirmOrder from "./components/Order/ConfirmOrder";
import axios from "axios";
import Payment from "./components/Order/Payment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./components/Order/OrderSuccess";
import MyOrders from "./components/Order/MyOrders";
import OrderDetails from "./components/Order/OrderDetails";
import EditProduct from "./admin/EditProduct";
import AllOrders from "./admin/AllOrders";
import ViewOrder from "./admin/ViewOrder";
import AllUsers from "./admin/AllUsers";
import UpdateUser from "./admin/UpdateUser";
import ProductReviews from "./admin/ProductReviews";

function App() {
  const [stripeAPIKey, setStripeAPIKey] = useState("");

  useEffect(() => {
    store.dispatch(loadUser());
    async function getStripeAPIKey() {
      const { data } = await axios.get("/api/v1/stripe-apikey", {
        withCredentials: true,
      });
      setStripeAPIKey(data.stripeAPIKey);
    }

    getStripeAPIKey();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} exact />
        <Route path="/product/:id" element={<SingleProduct />} exact />
        <Route path="/login" element={<Login />} exact />
        <Route path="/register" element={<Register />} exact />
        <Route path="/forgot-password" element={<ForgotPassword />} exact />
        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
          exact
        />
        <Route path="/cart" element={<Cart />} exact />
        <Route element={<PrivateUserRoutes />}>
          <Route path="/my-account" element={<Profile />} exact />
          <Route path="/my-orders" element={<MyOrders />} exact />
          <Route path="/my-orders/:id" element={<OrderDetails />} exact />
          <Route path="/change-password" element={<ChangePassword />} exact />
          <Route path="/shipping" element={<Shipping />} exact />
          <Route path="/confirm" element={<ConfirmOrder />} exact />
          {stripeAPIKey && (
            <Route
              path="/payment"
              element={
                <React.Fragment>
                  <Elements stripe={loadStripe(stripeAPIKey)}>
                    <Payment />
                  </Elements>
                </React.Fragment>
              }
              exact
            />
          )}
          <Route path="/success" element={<OrderSuccess />} exact />
        </Route>
        <Route element={<AdminRoutes />}>
          <Route path="/admin-dashboard" element={<Dashboard />} exact />
          <Route
            path="/admin-dashboard/products"
            element={<AllProducts />}
            exact
          />
          <Route
            path="/admin-dashboard/products/create-product"
            element={<CreateNewProduct />}
            exact
          />
          <Route
            path="/admin-dashboard/products/update/:id"
            element={<EditProduct />}
            exact
          />
          <Route path="/admin-dashboard/orders" element={<AllOrders />} exact />
          <Route path="/admin-dashboard/orders/:id" element={<ViewOrder />} exact />
          <Route path="/admin-dashboard/users" element={<AllUsers />} exact />
          <Route path="/admin-dashboard/users/:id" element={<UpdateUser />} exact />
          <Route path="/admin-dashboard/reviews" element={<ProductReviews />} exact />  
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
