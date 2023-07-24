import React, { useEffect, useState } from "react";
import Navbar from "../Base/Navbar";
import styles from "./Order.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails, clearErrors } from "./../../Redux/Order/OrderAction";
import { Modal, message, Rate, Input } from "antd";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";
import {
  UserOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { CREATE_REVIEW_RESET } from "../../Redux/Products/productTypes";
import { createNewReview } from "../../Redux/Products/productActions";

const baseUrl = "http://localhost:4000";

const OrderDetails = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [productId, setProductId] = useState("");

  const showModal = (id) => {
    setProductId(id);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("comment", comment);
    formData.append("productId", productId);
    dispatch(createNewReview(formData));
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleDescriptionChange = (e) => {
    setComment(e.target.value);
  };

  const { loading, error, order } = useSelector((state) => state.orderDetails);
  const { error: reviewError, success } = useSelector(
    (state) => state.createReview
  );

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

    if (reviewError) {
      message.error(reviewError);
      dispatch(clearErrors());
    }

    if (success) {
      message.success("Review Posted Successfully");
      dispatch({ type: CREATE_REVIEW_RESET });
    }
  }, [dispatch, error, id, reviewError, success]);

  const isPaid =
    order && order.paymentInfo && order.paymentInfo.status === "succeeded"
      ? true
      : false;

  return (
    <>
      <Helmet>
        <title>Order Details | SwiftCart</title>
      </Helmet>
      <Navbar />
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
                      <div className={styles["order-prod-name"]}>
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </div>
                      <div className={styles["order-prod-price"]}>
                        ₹{item.price}
                      </div>
                      <div>{item.quantity} Piece(s)</div>
                      <div
                        className={styles["submit-review-btn"]}
                        onClick={() => showModal(item.product)}
                      >
                        Provide your Feedback
                      </div>
                      <Modal
                        visible={isModalOpen}
                        onOk={handleOk}
                        onCancel={handleCancel}
                      >
                        <h2>Rate the Product</h2>
                        <Rate value={rating} onChange={handleRatingChange} />
                        <h2 style={{ margin: "10px 0 5px 0" }}>Comment</h2>
                        <Input.TextArea
                          value={comment}
                          onChange={handleDescriptionChange}
                          rows={4}
                        />
                      </Modal>
                    </div>
                  ))}
              </div>

              <div className={styles["user-info-contain"]}>
                <div className={styles["order-payment-status"]}>
                  <div className={styles["order-status"]}>
                    <span>Order Status : </span>{" "}
                    <span
                      className={
                        order?.orderStatus === "Processing"
                          ? styles["color-red"]
                          : styles["color-green"]
                      }
                    >
                      {order?.orderStatus}
                    </span>
                  </div>
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
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default OrderDetails;
