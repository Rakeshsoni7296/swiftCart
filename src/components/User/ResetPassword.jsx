import { useEffect } from "react";
import { LockOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, clearErrors } from "./../../Redux/Users/userAction";
import { Helmet } from "react-helmet";

import styles from "./../Auth/Auth.module.css";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const { error, success, loading } = useSelector(
    (state) => state.forgotPassword
  );

  useEffect(() => {
    if (error) {
      message.error(error, [2]);
      dispatch(clearErrors());
    }

    if (success) {
      message.success("Password updated successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  }, [navigate, error, dispatch, success]);

  const onFinish = (values) => {
    dispatch(resetPassword(token, values));
  };
  return (
    <section className={styles["login-container"]}>
      <Helmet>
        <title>Reset Password | SwiftCart</title>
      </Helmet>
      <div className={styles["go-back-btn"]}>
        <Link to={"/"}>
          <ArrowLeftOutlined style={{ marginRight: "12px" }} />
          Go Home
        </Link>
      </div>
      <div className={styles["form-content-wrapper"]}>
        <div className={styles["welcome-tag"]}>
          <div>Reset your password here!</div>
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
              Reset Password
              {loading && <div className={styles.loader}></div>}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default ResetPassword;
