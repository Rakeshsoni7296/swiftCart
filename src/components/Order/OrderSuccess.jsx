import Navbar from "../Base/Navbar";
import styles from "./Order.module.css";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { Helmet } from "react-helmet";

const OrderSuccess = () => {
  return (
    <>
      <Helmet>
        <title>Order Success | SwiftCart</title>
      </Helmet>
      <Navbar />
      <section className={styles.order_successful_section}>
        <div className={styles.order_success_card}>
          <h2>Your order has been placed Successfully.</h2>
          <img src="/order_success.jpg" alt="order-success" />
          <Link to="/my-orders">
            <Button>Go to Orders</Button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default OrderSuccess;
