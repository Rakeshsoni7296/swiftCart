import { useEffect, useState } from "react";
import {
  LockOutlined,
  MailOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Form, Input, message } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, clearErrors } from "./../../Redux/Users/userAction";
import { Helmet } from "react-helmet";

import styles from "./Auth.module.css";
import googleIcon from "./../../assets/Login/google.svg";
import instaIcon from "./../../assets/Login/instagram.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, error, loading } = useSelector(
    (state) => state.auth
  );

  let redirect = location.search && location.search.split("=")[1];
  // const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  console.log(redirect);
  redirect = `/${redirect}`;

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
    if (error) {
      message.error(error, [2]);
      dispatch(clearErrors());
    }
  }, [isAuthenticated, navigate, error, dispatch, redirect]);

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    dispatch(login(email, password));
  };
  return (
    <section className={styles["login-container"]}>
      <Helmet>
        <title>Login | SwiftCart</title>
      </Helmet>
      <div className={styles["go-back-btn"]}>
        <Link to={"/"}>
          <ArrowLeftOutlined style={{ marginRight: "12px" }} />
          Go Home
        </Link>
      </div>
      <div className={styles["form-content-wrapper"]}>
        <div className={styles["welcome-tag"]}>
          <div>Welcome!</div>
          <div>Please enter your data to continue</div>
        </div>

        {/* <div className={styles["social-media-login"]}>
          <Link to={"/google"}>
            <img src={googleIcon} alt="Google" />
            <span style={{ marginLeft: "10px" }}>Google Login</span>
          </Link>
          <Link to={"/insta"}>
            <img src={instaIcon} alt="Instagram" />
            <span style={{ marginLeft: "10px" }}>Instagram Login</span>
          </Link>
        </div> */}

        {/* <div className={styles.separator}>
          <div></div>
          <div>Or</div>
          <div></div>
        </div> */}

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
                message: "Please input your email!",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              type="email"
              placeholder="email"
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Form.Item
              name="remember"
              valuePropName="checked"
              noStyle
              style={{ float: "left" }}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Link
              className="login-form-forgot"
              to="/forgot-password"
              style={{ float: "right" }}
            >
              Forgot password
            </Link>
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
              Log in
              {loading && <div className={styles.loader}></div>}
            </Button>
            Or <Link to="/register">register now!</Link>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default Login;
