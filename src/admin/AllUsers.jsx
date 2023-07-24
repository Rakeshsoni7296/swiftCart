import Navbar from "../components/Base/Navbar";
import Sidebar from "./Sidebar";
import styles from "./Admin.module.css";
import {
  deleteUser,
  getAllUsers,
  clearErrors,
} from "../Redux/Users/userAction";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { message, Button, Table } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { DELETE_USER_RESET } from "../Redux/Users/userTypes";

const AllUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeDeleteOrder, setActiveDeleteOrder] = useState(false);

  const { loading, error, users } = useSelector((state) => state.allUsers);
  const { isDeleted } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllUsers());

    if (error) {
      message.error(error);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      message.warning("User deleted successfully.", [2]);
      dispatch({ type: DELETE_USER_RESET });
      setTimeout(() => {
        navigate("/admin-dashboard/users");
      }, 2000);
    }
  }, [dispatch, error, isDeleted, navigate]);

  const deleteOrderHandler = (id) => {
    console.log(id);
    setTimeout(() => {
      const response = confirm("Are you sure you want to delete this order?");
      if (response) dispatch(deleteUser(id));
      setActiveDeleteOrder("");
    }, 400);
  };

  const columns = [
    {
      title: "Sr No",
      dataIndex: "srNo",
      key: "srNo",
    },
    {
      title: "User ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Action",
      key: "action",
      render: (_, user) => (
        <>
          <Link
            style={{ marginRight: "10px" }}
            to={`/admin-dashboard/users/${user.id}`}
          >
            <Button>
              <EditOutlined />
            </Button>
          </Link>
          <Button
            danger
            type={activeDeleteOrder === user.id ? "primary" : "default"}
            onClick={() => {
              setActiveDeleteOrder(user.id);
              deleteOrderHandler(user.id);
            }}
          >
            <DeleteOutlined />
          </Button>
        </>
      ),
    },
  ];

  const dataSource = users?.map((user, i) => {
    return {
      key: i,
      srNo: i + 1,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  });

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className={styles["admin-container"]}>
        <section className={styles.order_admin_table_section}>
          <h2>All Users</h2>
          <Table
            dataSource={dataSource}
            columns={columns}
            bordered={true}
            loading={loading}
          ></Table>
        </section>
      </div>
    </>
  );
};

export default AllUsers;
