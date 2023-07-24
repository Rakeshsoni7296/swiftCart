import React from "react";
import Navbar from "../Base/Navbar";
import Footer from "../Base/Footer";
import styles from "./Order.module.css";
import CheckoutSteps from "./CheckoutSteps";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  EditOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { Helmet } from "react-helmet";

const stepsStatus = [
  {
    title: "Completed",
    description: "Shipping",
  },
  {
    title: "In Progress",
    description: "Confirm Order",
  },
  {
    title: "Waiting",
    description: "Payment",
  },
];

const baseUrl = "http://localhost:4000";

const totalAmt = (itemArr) => {
  const res = itemArr.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  return res;
};

const ConfirmOrder = () => {
  const navigate = useNavigate();
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const subtotalAmt = totalAmt(cartItems);
  const shippingCharge = subtotalAmt > 15000 ? 0 : 100;
  const taxPrice = Math.round(Number(0.05 * subtotalAmt));
  const grandTotal = subtotalAmt + shippingCharge + taxPrice;

  const proceedToPay = () => {
    const data = {
      itemsPrice: subtotalAmt,
      shippingPrice: shippingCharge,
      taxPrice,
      totalPrice: grandTotal,
    };

    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    navigate("/payment");
  };

  return (
    <>
      <Helmet>
        <title>Confirm Order | SwiftCart</title>
      </Helmet>
      <Navbar />
      <section className={styles["confirm-order-container"]}>
        <CheckoutSteps currentPage={1} stepsStatus={stepsStatus} />
        <div className={styles["confirm-order-product-ship-bills-wrapper"]}>
          <div className={styles["products-card-wrapper"]}>
            {cartItems.map((item, ind) => (
              <div key={ind} className={styles["cart-item-wrapper"]}>
                <div className={styles["product-img-cont"]}>
                  <img src={`${baseUrl}${item.image}`} alt="camera" />
                </div>
                <div className={styles["item-content-container"]}>
                  <div className={styles["cart-card-header"]}>
                    <div className={styles["product-header-left"]}>
                      <div>{item.name}</div>
                      <div>{item.category}</div>
                    </div>
                  </div>
                  <div className={styles["cart-card-footer"]}>
                    <div className={styles["prod-add-to-cart"]}>
                      <div className={styles["prod-cart-num-handles"]}>
                        x {item.quantity}
                      </div>
                    </div>
                    <div className={styles["item-price"]}>
                      <span>
                        {item.quantity} x ₹{item.price} ={" "}
                      </span>
                      ₹{(item.price * item.quantity).toLocaleString("en-US")}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles["address-plus-bill-wrapper"]}>
            <div className={styles["shipping-info-card"]}>
              <div className={styles.shippingInfoHeaderTag}>
                <h2>Shipping Information</h2>
                <div>
                  <Link to="/shipping">
                    <EditOutlined style={{ color: "#333" }} />
                  </Link>
                </div>
              </div>
              <div className={styles["user-detail-info"]}>
                <span>
                  <UserOutlined />
                </span>
                <span>{user.name}</span>
              </div>
              <div className={styles["user-detail-info"]}>
                <span>
                  <EnvironmentOutlined />
                </span>
                <span>
                  {shippingInfo.address}, {shippingInfo.city},{" "}
                  {shippingInfo.pincode}, {shippingInfo.country}
                </span>
              </div>
              <div className={styles["user-detail-info"]}>
                <span>
                  <PhoneOutlined style={{ transform: "rotate(90deg)" }} />
                </span>
                <span>{shippingInfo.phoneNumber}</span>
              </div>
            </div>
            <div className={styles["billing-info-card"]}>
              <div className={styles["bill-total-det"]}>
                <span>Subtotal : </span>
                <span>₹{subtotalAmt}</span>
              </div>
              <div className={styles["bill-total-det"]}>
                <span>Shipping : </span>
                <span>₹{shippingCharge}</span>
              </div>
              <div className={styles["bill-total-det"]}>
                <span>Tax : </span>
                <span>₹{taxPrice}</span>
              </div>
              <div
                className={`${styles["bill-total-det"]} ${styles["grand-total-amt"]}`}
              >
                <span>Grand Total : </span>
                <span>₹{grandTotal}</span>
              </div>
              <div className={styles["procceed-to-pay"]}>
                <Button type="primary" onClick={proceedToPay}>
                  Procceed to Payment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ConfirmOrder;
