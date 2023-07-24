import React from "react";
import styles from "./Order.module.css";
import Navbar from "../Base/Navbar";
import Footer from "../Base/Footer";
import { useDispatch, useSelector } from "react-redux";
import { MinusOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { addItemToCart, deleteCartItem } from "../../Redux/Cart/CartAction";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.cart);

  const removeIteHandler = (id) => {
    dispatch(deleteCartItem(id));
  };

  const baseUrl = "http://localhost:4000";

  const plusClickHandler = (id, quantity, stock) => {
    const updatedQuantity = quantity + 1;
    if (updatedQuantity > stock) return;

    dispatch(addItemToCart(id, updatedQuantity));
  };

  const minusClickHandler = (id, quantity) => {
    const updatedQuantity = quantity - 1;
    if (updatedQuantity < 1) return;

    dispatch(addItemToCart(id, updatedQuantity));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=shipping");
  };

  const totalAmt = (itemArr) => {
    const res = itemArr.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    return res;
  };

  return (
    <>
      <Helmet>
        <title>Cart | SwiftCart</title>
      </Helmet>
      <Navbar />
      <section className={styles["cart-items-container"]}>
        {cartItems.length === 0 ? (
          <div
            style={{ textAlign: "center", width: "100%", marginTop: "-20px" }}
          >
            <img src="/emptyCart.jpg" alt="cart-empty" />
          </div>
        ) : (
          <>
            <div className={styles["items-wrapper"]}>
              {cartItems.map((item, ind) => (
                <div key={ind} className={styles["cart-item-wrapper"]}>
                  <div className={styles["product-img-cont"]}>
                    <img src={`${baseUrl}${item.image}`} alt="camera" />
                  </div>
                  <div className={styles["item-content-container"]}>
                    <div className={styles["cart-card-header"]}>
                      <div className={styles["product-header-left"]}>
                        <div>{item.name}</div>
                        <div>{item.category}</div>
                      </div>
                      <div>
                        <Button
                          onClick={() => removeIteHandler(item.product)}
                          className={styles.delete_btn}
                        >
                          <DeleteOutlined />
                        </Button>
                      </div>
                    </div>
                    <div className={styles["cart-card-footer"]}>
                      <div className={styles["prod-add-to-cart"]}>
                        <div className={styles["prod-cart-num-handles"]}>
                          <span
                            className={styles["cart-minus"]}
                            onClick={() =>
                              minusClickHandler(item.product, item.quantity)
                            }
                          >
                            <MinusOutlined />
                          </span>{" "}
                          <span className={styles["cart-number-item"]}>
                            {item.quantity}
                          </span>{" "}
                          <span
                            className={styles["cart-plus"]}
                            onClick={() =>
                              plusClickHandler(
                                item.product,
                                item.quantity,
                                item.stock
                              )
                            }
                          >
                            <PlusOutlined />
                          </span>
                        </div>
                      </div>
                      <div className={styles["item-price"]}>
                        ₹{(item.price * item.quantity).toLocaleString("en-US")}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles["total-bill-wrapper"]}>
              <div className={styles["checkout-header"]}>Total Bill</div>
              <div className={styles["number-of-items"]}>
                <span>Number of Items : </span>{" "}
                <span>
                  {cartItems.reduce(
                    (acc, item) => acc + Number(item.quantity),
                    0
                  )}
                </span>
              </div>
              <div className={styles["total-amount"]}>
                <span>Total Amount : </span>
                <span>{totalAmt(cartItems)}</span>
              </div>
              <div className={styles["grand-total"]}>
                <span>Grand Total : </span>{" "}
                <span>₹{totalAmt(cartItems) - 25}</span>
              </div>
              {/* <div>Yay! you saved ₹25</div> */}
              <div className={styles["checkout-btn-wrapper"]}>
                <Button onClick={checkoutHandler} type="primary">
                  Checkout
                </Button>
              </div>
            </div>
          </>
        )}
      </section>
      <Footer />
    </>
  );
};

export default Cart;
