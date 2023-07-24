import Navbar from "../components/Base/Navbar";
import Sidebar from "./Sidebar";
import styles from "./Admin.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getSingleUser,
  editUser,
  clearErrors,
} from "../Redux/Users/userAction";
import {
  UPDATE_USER_RESET,
  USER_DETAILS_RESET,
} from "../Redux/Users/userTypes";
import { Form, Input, Button, Select, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
const { Option } = Select;

const UpdateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { error, isUpdated } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.userDetails);

  const { id: userId } = useParams();

  useEffect(() => {
    if (user && user._id !== userId) {
      dispatch(getSingleUser(userId));
      console.log("k");
    } else {
      form.setFieldsValue(user);
    }

    if (error) {
      message.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      message.success("User updated successfully", [2]);
      dispatch({ type: UPDATE_USER_RESET });
      dispatch({ type: USER_DETAILS_RESET });
      setTimeout(() => {
        navigate("/admin-dashboard/users");
      }, 2000);
    }
  }, [dispatch, user, userId, form, error, isUpdated, navigate]);

  const onFinish = (values) => {
    console.log("Received values:", values);
    dispatch(editUser(userId, values));
  };

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className={styles["admin-container"]}>
        <div className={styles["user-email-other-info"]}>
          <h2>User Details</h2>
          <Form name="myForm" onFinish={onFinish} form={form}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: "Please select your role" }]}
            >
              <Select placeholder="Select a role">
                <Option value="user">User</Option>
                <Option value="admin">Admin</Option>
              </Select>
            </Form.Item>

            <Form.Item style={{ textAlign: "center" }}>
              <Button
                style={{ width: "120px" }}
                type="primary"
                htmlType="submit"
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default UpdateUser;
