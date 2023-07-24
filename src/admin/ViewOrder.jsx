import { useEffect, useState } from "react";
import styles from "./../components/Order/Order.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrderDetails,
  updateOrder,
  clearErrors,
} from "../Redux/Order/OrderAction";
import { message, Modal, Select } from "antd";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";
import stylesAdmin from "./Admin.module.css";
import {
  UserOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  EditFilled,
} from "@ant-design/icons";
import { UPDATE_ORDER_RESET } from "../Redux/Order/OrderTypes";
import Navbar from "../components/Base/Navbar";
import Sidebar from "./Sidebar";

const baseUrl = "http://localhost:4000";
const { Option } = Select;

const ViewOrder = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { loading, error, order } = useSelector((state) => state.orderDetails);
  const { error: updateError, isUpdated } = useSelector(
    (state) => state.editOrder
  );

  const [status, setStatus] = useState(order?.orderStatus);
  //   const {
  //     shippingInfo,
  //     orderItems,
  //     paymentInfo,
  //     user,
  //     totalPrice,
  //     orderStatus,
  //   } = order;

  const { id } = useParams();

  useEffect(() => {
    dispatch(getOrderDetails(id));
    if (error) {
      message.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      message.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      message.success("Order status updated successfully");
      dispatch({ type: UPDATE_ORDER_RESET });
    }
  }, [dispatch, error, id, updateError, isUpdated]);

  const isPaid =
    order && order.paymentInfo && order.paymentInfo.status === "succeeded"
      ? true
      : false;

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = (id) => {
    const formData = new FormData();
    formData.append("status", status);

    dispatch(updateOrder(id, formData));
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>Order Details | SwiftCart</title>
      </Helmet>
      <Navbar />
      <Sidebar />
      <div className={stylesAdmin["admin-container"]}>
        <section className={styles["order-details-sec-container"]}>
          {!loading && (
            <>
              <div className={styles.order_detail_heading}>
                <h2>Order #{order && order._id}</h2>
              </div>
              <div className={styles["user-info-order-info-contain"]}>
                <div className={styles["order-info-contain"]}>
                  {order &&
                    order.orderItems?.map((item, ind) => (
                      <div key={ind} className={styles["order-card"]}>
                        <div className={styles["order-prod-img"]}>
                          <img
                            src={`${baseUrl}${item.image}`}
                            alt="product-img"
                          />
                        </div>
                        <div
                          id={stylesAdmin["order-prod-name-len"]}
                          className={`${styles["order-prod-name"]}`}
                        >
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </div>
                        <div className={styles["order-prod-price"]}>
                          ₹{item.price}
                        </div>
                        <div>{item.quantity} Piece(s)</div>
                      </div>
                    ))}
                </div>

                <div className={styles["user-info-contain"]}>
                  <div className={styles["order-payment-status"]}>
                    <div className={styles["order-status"]}>
                      <span>Order Status : </span>{" "}
                      <span
                        className={
                          order?.orderStatus === "Delivered"
                            ? styles["color-green"]
                            : styles["color-red"]
                        }
                      >
                        {order?.orderStatus}
                      </span>
                    </div>
                    <div className={styles["order-status"]}>
                      <EditFilled onClick={showModal} />
                    </div>
                  </div>
                  <div className={styles["shipping-info-card"]}>
                    <div className={styles.shippingInfoHeaderTag}>
                      <h2>Shipping Information</h2>
                    </div>
                    <div className={styles["user-detail-info"]}>
                      <span>
                        <UserOutlined />
                      </span>
                      <span>{order?.user?.name}</span>
                    </div>
                    <div
                      style={{ display: "flex" }}
                      className={styles["user-detail-info"]}
                    >
                      <span>
                        <EnvironmentOutlined />
                      </span>
                      <span>
                        {order?.shippingInfo?.address},{" "}
                        {order?.shippingInfo?.city},{" "}
                        {order?.shippingInfo?.pincode},{" "}
                        {order?.shippingInfo?.country}
                      </span>
                    </div>
                    <div className={styles["user-detail-info"]}>
                      <span>
                        <PhoneOutlined style={{ transform: "rotate(90deg)" }} />
                      </span>
                      <span>{order?.shippingInfo?.phoneNo}</span>
                    </div>
                  </div>
                  <Modal
                    title="Update Status"
                    open={isModalOpen}
                    onOk={() => handleOk(order._id)}
                    onCancel={handleCancel}
                  >
                    <Select
                      value={status}
                      onChange={(val) => setStatus(val)}
                      style={{
                        width: "200px",
                        margin: "15px 0",
                      }}
                    >
                      <Option value="Processing">Processing</Option>
                      <Option value="Shipped">Shipped</Option>
                      <Option value="Delivered">Delivered</Option>
                    </Select>
                  </Modal>
                  <div className={stylesAdmin["hr-line-payment-status"]}></div>
                  <div className={stylesAdmin["payment-container"]}>
                    <div className={styles["order-status"]}>
                      <span>Payment Status : </span>{" "}
                      <span
                        className={
                          isPaid ? styles["color-green"] : styles["color-red"]
                        }
                      >
                        {isPaid ? "PAID" : "NOT PAID"}
                      </span>
                    </div>
                    <div
                      className={`${styles["order-status"]} ${stylesAdmin["order-status-stripe-id"]}`}
                    >
                      <span>Stripe ID : </span>{" "}
                      <span>{order?.paymentInfo?.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
};

export default ViewOrder;
