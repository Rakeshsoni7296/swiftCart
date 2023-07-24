import { useState } from "react";
import styles from "./Order.module.css";
import Navbar from "../Base/Navbar";
import Footer from "../Base/Footer";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Input, Select } from "antd";
import { getShippingInfo } from "../../Redux/Cart/CartAction";
import { countries } from "countries-list";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import CheckoutSteps from "./CheckoutSteps";
const { Option } = Select;

const Shipping = () => {
  const { shippingInfo } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log(shippingInfo);

  const countriesList = Object.values(countries);

  const onFinish = (values) => {
    dispatch(getShippingInfo(values));
    navigate("/confirm");
  };

  const stepsStatus = [
    {
      title: "In Progress",
      description: "Shipping",
    },
    {
      title: "Waiting",
      description: "Confirm Order",
    },
    {
      title: "Waiting",
      description: "Payment",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Shipping Info | SwiftCart</title>
      </Helmet>
      <Navbar />
      <section className={styles["shipping-form-section"]}>
        <CheckoutSteps currentPage={0} stepsStatus={stepsStatus} />
        <h2 className={styles.shipping_header}>Shipping Info</h2>
        <div className={styles["ship-form-container"]}>
          <Form
            name="Get_shipping_Info"
            className={styles["shipping-form"]}
            initialValues={{
              remember: true,
              ...shippingInfo,
            }}
            onFinish={onFinish}
          >
            <Form.Item
              name="address"
              label="Address"
              rules={[
                {
                  required: true,
                  message: "Please enter your Address!",
                },
              ]}
            >
              <Input placeholder="Address" />
            </Form.Item>
            <Form.Item
              name="city"
              label="City"
              rules={[
                {
                  required: true,
                  message: "Please enter your City name!",
                },
              ]}
            >
              <Input placeholder="City" />
            </Form.Item>
            <Form.Item
              name="pincode"
              label="Pin Code"
              rules={[
                {
                  required: true,
                  message: "Please enter your Pincode!",
                },
              ]}
            >
              <Input type="number" placeholder="Pin code" />
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[
                {
                  required: true,
                  message: "Please enter your Phone Number!",
                },
              ]}
            >
              <Input type="number" placeholder="Contact Number" />
            </Form.Item>

            <Form.Item
              name="country"
              label="Country"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please select your country!",
                },
              ]}
            >
              <Select placeholder="Please select a country">
                {countriesList.map((cntry, i) => (
                  <Option key={i + 1} value={cntry.name}>
                    {cntry.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="shipping-form-button"
                style={{
                  width: "100%",
                  marginBottom: "10px",
                  marginTop: "10px",
                  position: "relative",
                }}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Shipping;
