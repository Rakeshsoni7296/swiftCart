import React, { useEffect, useState } from "react";
import { ArrowLeftOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import styles from "./../Auth/Auth.module.css";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, clearErrors } from "./../../Redux/Users/userAction";
import { Helmet } from "react-helmet";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    error,
    message: apiMessage,
    loading,
  } = useSelector((state) => state.forgotPassword);

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearErrors());
    }

    if (apiMessage) {
      message.success(apiMessage);
    }
  }, [error, dispatch, apiMessage]);

  const onFinish = (values) => {
    dispatch(forgotPassword(values));
  };

  return (
    <section className={styles["login-container"]}>
      <Helmet>
        <title>Forgot Password | SwiftCart</title>
      </Helmet>
      <div className={styles["go-back-btn"]}>
        <Link to={"/"}>
          <ArrowLeftOutlined style={{ marginRight: "12px" }} />
          Go Home
        </Link>
      </div>
      <div className={styles["form-content-wrapper"]}>
        <div className={styles["welcome-tag"]}>
          <div>Lost your password? Don't fret!</div>
          <div>
            Just enter your email, and we'll unlock the way to reset your
            password securely
          </div>
        </div>

        <Form
          name="normal_login"
          className={styles["login-form"]}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your Email!",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Enter your email"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              style={{
                width: "100%",
                marginBottom: "10px",
                marginTop: "10px",
                position: "relative",
              }}
              disabled={loading ? true : false}
            >
              Continue
              {loading && <div className={styles.loader}></div>}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default ForgotPassword;
