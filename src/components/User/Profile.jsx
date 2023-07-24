import React, { useEffect, useState } from "react";
import Navbar from "../Base/Navbar";
import Footer from "../Base/Footer";
import styles from "./User.module.css";
import InfoCard from "../Base/InfoCard";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  UploadOutlined,
  UserOutlined,
  CalendarOutlined,
  GlobalOutlined,
  MailOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Helmet } from "react-helmet";
import { Upload, Button, Modal, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { UPDATE_PROFILE_RESET } from "../../Redux/Users/userTypes";
import {
  updateProfile,
  loadUser,
  clearErrors,
} from "../../Redux/Users/userAction";

const Profile = ({ user }) => {
  const [file, setFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, isUpdated, loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      message.success("User updated Successfully.");
      dispatch(loadUser());
      navigate("/my-account");
      dispatch({ type: UPDATE_PROFILE_RESET });
    }
  }, [error, isUpdated, navigate, dispatch]);

  const handleOk = () => {
    const formData = new FormData();
    if (file) formData.append("avatar", file);
    dispatch(updateProfile(formData));
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const beforeUpload = (file) => {
    setFile(file);
    return false;
  };

  const handleNameUpdate = (userName) => {
    const formData = new FormData();
    formData.append("name", userName);
    dispatch(updateProfile(formData));
  };

  const handleEmailUpdate = (email) => {
    const formData = new FormData();
    formData.append("email", email);
    dispatch(updateProfile(formData));
  };

  const informations = [
    {
      type: "Name",
      inputType: "text",
      value: user?.name,
      icon: <UserOutlined />,
      handler: handleNameUpdate,
    },
    {
      type: "Date of Birth",
      inputType: "date",
      value: "2001-02-20",
      icon: <CalendarOutlined />,
    },
    {
      type: "Email",
      inputType: "email",
      value: user?.email,
      icon: <MailOutlined />,
      handler: handleEmailUpdate,
    },
    {
      type: "Country",
      inputType: "text",
      value: "India",
      icon: <GlobalOutlined />,
    },
    {
      type: "Language",
      inputType: "text",
      value: "Hindi, English",
      icon: <MessageOutlined />,
    },
  ];

  // http://localhost:4000/imgs/users/avatar-1688057150077-9408.jpg
  const baseUrl = "http://localhost:4000";

  const urlBreaker = (str) => {
    if (!str) return "no-img";
    const newUrl = str.split("/").at(-1);
    return newUrl;
  };

  return (
    <>
      <Helmet>
        <title>My Account | SwiftCart</title>
      </Helmet>
      <Navbar />
      <section className={styles["profile-container"]}>
        <div className={styles["user-img-name"]}>
          <div className={styles.img_wrapper}>
            {/* <img src="/defaultuser.jpg" alt="user" /> */}
            <img
              onClick={() => setIsModalOpen(true)}
              src={`${baseUrl}${user.avatar}`}
              alt="user"
            />
          </div>
          <Modal
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            title={`Update Profile Image`}
          >
            <Upload
              listType="picture"
              maxCount={1}
              defaultFileList={[
                {
                  uid: "-1",
                  name: `${urlBreaker(user.avatar)}`,
                  status: "done",
                  url: `${baseUrl}${user.avatar}`,
                  thumbUrl: `${baseUrl}${user.avatar}`,
                },
              ]}
              accept="image/png, image/jpeg, image/jpg"
              beforeUpload={beforeUpload}
            >
              <Button
                style={{ height: "35px", width: "130px", marginTop: "10px" }}
                icon={<UploadOutlined />}
              >
                Upload
              </Button>
            </Upload>
          </Modal>
        </div>
        <div className={styles["user-info-tag"]}>
          <h2>Personal Information</h2>
          <div>Manage your personal information here</div>
          <div className={styles["contact-info-wrapper"]}>
            {informations.map((info, i) => (
              <InfoCard key={i + 1} info={info} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  };
};

export default connect(mapStateToProps)(Profile);
