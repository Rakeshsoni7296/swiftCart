import React, { useEffect } from "react";
import Navbar from "../Base/Navbar";
import styles from "./Order.module.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { myorders, clearErrors } from "./../../Redux/Order/OrderAction";
import { Button, Table, message } from "antd";
import { Helmet } from "react-helmet";

const MyOrders = () => {
  const dispatch = useDispatch();

  const { loading, error, orders } = useSelector((state) => state.myOrders);

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
          <Link to={`/my-orders/${order.id}`}>
            <Button>View Order</Button>
          </Link>
        </>
      ),
    },
  ];

  const dataSource = orders?.map((order, i) => {
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

  //   const dataSource = [
  //     {
  //       key: "1",
  //       name: "Mike",
  //       age: 32,
  //       address: "10 Downing Street",
  //     },
  //     {
  //       key: "2",
  //       name: "John",
  //       age: 42,
  //       address: "10 Downing Street",
  //     },
  //   ];

  useEffect(() => {
    dispatch(myorders());

    if (error) {
      message.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  return (
    <>
      <Helmet>
        <title>My Orders | SwiftCart</title>
      </Helmet>
      <Navbar />
      <section className={styles["my-orders-container"]}>
        <h2>My orders</h2>
        <Table
          dataSource={dataSource}
          columns={columns}
          bordered={true}
          loading={loading}
        ></Table>
      </section>
    </>
  );
};

export default MyOrders;
