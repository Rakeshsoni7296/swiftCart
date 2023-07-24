import React, { useState, useEffect } from "react";
import {
  LockOutlined,
  UserOutlined,
  ArrowLeftOutlined,
  UploadOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Button, Upload, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, clearErrors } from "./../../Redux/Users/userAction";
import styles from "./Auth.module.css";
import googleIcon from "./../../assets/Login/google.svg";
import instaIcon from "./../../assets/Login/instagram.svg";
import { Helmet } from "react-helmet";

// const fileList = [
//   {
//     uid: "0",
//     name: "xxx.png",
//     status: "uploading",
//     percent: 33,
//   },
// ];

const Register = () => {
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, error, loading } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) navigate("/");
    if (error) {
      message.error(error, [2]);
      dispatch(clearErrors());
    }
  }, [isAuthenticated, navigate, error, dispatch]);

  const beforeUpload = (file) => {
    setFile(file);
    return false; // Prevent default upload behavior
  };

  const onFinish = (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("password", values.password);
    if (file) formData.append("avatar", file);

    dispatch(register(formData));

    // console.log("Received values of form: ", values);
    for (let entry of formData.entries()) {
      console.log(entry);
    }
  };

  return (
    <section className={styles["login-container"]}>
      <Helmet>
        <title>Register | SwiftCart</title>
      </Helmet>
      <div className={styles["go-back-btn"]}>
        <Link to={"/"}>
          <ArrowLeftOutlined style={{ marginRight: "12px" }} />
          Go Home
        </Link>
      </div>
      <div className={styles["form-content-wrapper"]}>
        <div className={styles["welcome-tag"]}>
          <div> Let's Get Started</div>
          <div>Sign up and we will continue</div>
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
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="name"
            />
          </Form.Item>
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
            />
          </Form.Item>

          <Upload
            listType="picture"
            maxCount={1}
            accept="image/png, image/jpeg, image/jpg"
            beforeUpload={beforeUpload}
          >
            <Button
              style={{ height: "40px", width: "200px" }}
              icon={<UploadOutlined />}
            >
              Upload Profile Picture
            </Button>
          </Upload>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              style={{
                width: "100%",
                marginBottom: "10px",
                marginTop: "20px",
                position: "relative",
              }}
            >
              Register
              {loading && <div className={styles.loader}></div>}
            </Button>
            Or <Link to="/login">log in!</Link>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default Register;
