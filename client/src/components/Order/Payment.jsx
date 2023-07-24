import { useEffect } from "react";
import styles from "./Order.module.css";
import Navbar from "../Base/Navbar";
import Footer from "../Base/Footer";
import { useDispatch, useSelector } from "react-redux";
import { message, Form, Card, Row, Col, Button } from "antd";
import { createOrder, clearErrors } from "./../../Redux/Order/OrderAction";
// import { resetCartItems } from "./../../Redux/Cart/CartAction";

import CheckoutSteps from "./CheckoutSteps";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";

const stepsStatus = [
  {
    title: "Completed",
    description: "Shipping",
  },
  {
    title: "Completed",
    description: "Confirm Order",
  },
  {
    title: "In Process",
    description: "Payment",
  },
];

const options = {
  style: {
    base: {
      fontSize: "16px",
    },
    invalid: {
      color: "#9e2146",
    },
  },
};

const Payment = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { error } = useSelector((state) => state.newOrder);

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  const order = {
    orderItems: cartItems,
    shippingInfo: { ...shippingInfo, phoneNo: shippingInfo.phoneNumber },
  };

  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

  if (orderInfo) {
    order.itemsPrice = orderInfo.itemsPrice;
    order.shippingPrice = orderInfo.shippingPrice;
    order.taxPrice = orderInfo.taxPrice;
    order.totalPrice = orderInfo.totalPrice;
  }

  const paymentData = {
    amount: orderInfo?.totalPrice * 100,
  };

  const onFinish = async () => {
    let res;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };

      res = await axios.post("/api/v1/process-payment", paymentData, config);

      const clientSecret = res.data.client_secret;

      if (!stripe || !elements) return;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
          },
        },
      });

      if (result.error) {
        message.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };

          dispatch(createOrder(order));

          navigate("/success");
        } else {
          message.error("Some issue occurred in payment processing");
        }
      }
    } catch (error) {
      message.error(error?.response?.data?.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>Payment | SwiftCart</title>
      </Helmet>
      <Navbar />
      <section className={styles.payment_card_section}>
        <CheckoutSteps currentPage={2} stepsStatus={stepsStatus} />
        <div className={styles.card_wrapper}>
          <h2>Card Details</h2>
          <Card title="Payment Card Details" style={{ width: 400 }}>
            <Form name="cardForm" onFinish={onFinish}>
              <Form.Item
                label="Card Number"
                name="cardNumber"
                // rules={[
                //   { required: true, message: "Please enter the card number" },
                //   {
                //     pattern: /^\d{16}$/,
                //     message: "Please enter a valid card number",
                //   },
                // ]}
              >
                <CardNumberElement options={options} />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Expiry Date"
                    name="expiryDate"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Please enter the expiry date",
                    //   },
                    //   {
                    //     pattern: /^(0[1-9]|1[0-2])\/?([0-9]{2})$/,
                    //     message: "Please enter a valid expiry date",
                    //   },
                    // ]}
                  >
                    <CardExpiryElement placeholder="MM/YY" options={options} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="CVV"
                    name="cvv"
                    // rules={[
                    //   { required: true, message: "Please enter the CVV" },
                    //   {
                    //     pattern: /^\d{3,4}$/,
                    //     message: "Please enter a valid CVV",
                    //   },
                    // ]}
                  >
                    <CardCvcElement options={options} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Pay {` - ${orderInfo?.totalPrice}`}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Payment;
