import React, { useEffect, useState } from "react";
import { LockOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UPDATE_PASSWORD_RESET } from "../../Redux/Users/userTypes";
import { updatePassword, clearErrors } from "./../../Redux/Users/userAction";
import styles from "./../Auth/Auth.module.css";
import { Helmet } from "react-helmet";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, isUpdated, loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (error) {
      message.error(error, [2]);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      message.success("Password updated successfully.");
      dispatch({ type: UPDATE_PASSWORD_RESET });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }, [navigate, error, dispatch, isUpdated]);

  const onFinish = (values) => {
    dispatch(updatePassword(values));
  };
  return (
    <section className={styles["login-container"]}>
      <Helmet>
        <title>Change Password | SwiftCart</title>
      </Helmet>
      <div className={styles["go-back-btn"]}>
        <Link to={"/"}>
          <ArrowLeftOutlined style={{ marginRight: "12px" }} />
          Go Home
        </Link>
      </div>
      <div className={styles["form-content-wrapper"]}>
        <div className={styles["welcome-tag"]}>
          <div>Change your password here!</div>
          <div>Please enter the required data</div>
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
            name="oldPassword"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Old Password"
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="New Password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Confirm New Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            >
              Change Password
              {loading && <div className={styles.loader}></div>}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default ChangePassword;
