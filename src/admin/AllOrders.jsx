import styles from "./Admin.module.css";
import Navbar from "../components/Base/Navbar";
import Sidebar from "./Sidebar";
import {
  getAllOrders,
  clearErrors,
  deleteOrder,
} from "../Redux/Order/OrderAction";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { message, Button, Table } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { DeleteOutlined, EyeFilled } from "@ant-design/icons";
import { DELETE_ORDER_RESET } from "../Redux/Order/OrderTypes";

const AllOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeDeleteOrder, setActiveDeleteOrder] = useState(false);

  const { loading, error, adminOrders } = useSelector(
    (state) => state.allOrders
  );

  const { isDeleted } = useSelector((state) => state.editOrder);

  useEffect(() => {
    dispatch(getAllOrders());

    if (error) {
      message.error(error);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      message.warning("Order deleted successfully.", [2]);
      dispatch({ type: DELETE_ORDER_RESET });
      setTimeout(() => {
        navigate("/admin-dashboard/orders");
      }, 2000);
    }
  }, [dispatch, error, isDeleted, navigate]);

  const deleteOrderHandler = (id) => {
    setTimeout(() => {
      const response = confirm("Are you sure you want to delete this order?");
      if (response) dispatch(deleteOrder(id));
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
      title: "Order ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "No of Items",
      dataIndex: "num_items",
      key: "num_items",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      key: "action",
      render: (_, order) => (
        <>
          <Link
            style={{ marginRight: "10px" }}
            to={`/admin-dashboard/orders/${order.id}`}
          >
            <Button>
              <EyeFilled />
            </Button>
          </Link>
          <Button
            danger
            type={activeDeleteOrder === order.id ? "primary" : "default"}
            onClick={() => {
              setActiveDeleteOrder(order.id);
              deleteOrderHandler(order.id);
            }}
          >
            <DeleteOutlined />
          </Button>
        </>
      ),
    },
  ];

  const dataSource = adminOrders?.map((order, i) => {
    return {
      key: i,
      srNo: i + 1,
      id: order._id,
      num_items: order.orderItems.length,
      amount: `₹${order.totalPrice}`,
      status:
        order.orderStatus && String(order.orderStatus).includes("Delivered") ? (
          <p style={{ color: "#72BB10" }}>{order.orderStatus}</p>
        ) : (
          <p style={{ color: "#BB1072" }}>{order.orderStatus}</p>
        ),
    };
  });

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className={styles["admin-container"]}>
        <section className={styles.order_admin_table_section}>
          <h2>All Orders</h2>
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

export default AllOrders;
