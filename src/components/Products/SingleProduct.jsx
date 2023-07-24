import { useEffect, useState } from "react";
import { Button, Carousel, Rate, message } from "antd";
import Navbar from "../Base/Navbar";
import Footer from "../Base/Footer";
import styles from "./Products.module.css";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./../Base/Loader";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { addItemToCart } from "../../Redux/Cart/CartAction";
import {
  getProductDetails,
  clearErrors,
} from "./../../Redux/Products/productActions";
import Reviews from "./Reviews";

const baseUrl = `http://localhost:4000`;

const SingleProduct = () => {
  const [quantity, setQuantity] = useState(1);

  const dispatch = useDispatch();

  const plusClickHandler = () => {
    if (quantity < product?.stock) setQuantity((q) => q + 1);
  };

  const minusClickHandler = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  const onChange = (currentSlide) => {
    console.log(currentSlide);
  };

  const { loading, error, product } = useSelector(
    (state) => state.productDetails
  );

  const { id } = useParams();

  useEffect(() => {
    dispatch(getProductDetails(id));
    if (error) {
      message.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, id, error]);

  const addToCart = () => {
    dispatch(addItemToCart(id, quantity));
    message.success("Product Added to Cart");
  };

  return (
    <>
      <Helmet>
        <title>{`${product?.name}`} | SwiftCart</title>
      </Helmet>
      <Navbar />
      {loading ? (
        <Loader />
      ) : (
        <section className={styles["single-product-section"]}>
          <div className={styles["product-detail-container"]}>
            <div className={styles["imgs-slider"]}>
              <Carousel style={{ width: "568px" }} afterChange={onChange}>
                {product?.images?.map((img, ind) => (
                  <div key={ind} className={styles["product-imgs"]}>
                    <img src={`${baseUrl}${img}`} alt={product?.category} />
                  </div>
                ))}
              </Carousel>
            </div>
            <div className={styles["product-content-details"]}>
              <div className={styles["product_det-cat"]}>
                {product?.category}
              </div>
              <h2 className={styles["product-title"]}>{product?.name}</h2>
              <div className={styles["rate-and-review-prod"]}>
                <Rate disabled allowHalf defaultValue={product?.ratings} />
                <span className={styles["product-det-rate"]}>
                  {product?.ratings?.toFixed(1)}
                </span>
                <span>{product?.numOfReviews} Reviews</span>
              </div>
              <div className={styles["product-det-price"]}>
                ₹{product?.price}
              </div>
              <div className={styles["product-stock-wrapper"]}>
                <span>Stock :</span>
                <span
                  className={
                    product?.stock > 0
                      ? styles["product-available"]
                      : styles["out-of-stock"]
                  }
                >
                  {product?.stock > 0 ? "Available" : "Out of Stock"}
                </span>
              </div>
              <div className={styles["prod-add-to-cart"]}>
                <div className={styles["prod-cart-num-handles"]}>
                  <span
                    className={styles["cart-minus"]}
                    onClick={minusClickHandler}
                  >
                    <MinusOutlined />
                  </span>{" "}
                  <span className={styles["cart-number-item"]}>{quantity}</span>{" "}
                  <span
                    className={styles["cart-plus"]}
                    onClick={plusClickHandler}
                  >
                    <PlusOutlined />
                  </span>
                </div>
                <div className={styles["add-to-cart-btn-wrap"]}>
                  <Button disabled={product?.stock === 0} onClick={addToCart}>
                    Add to Cart
                  </Button>
                </div>
              </div>
              <div className={styles["about-produt"]}>
                <div>About Product</div>
                <div>{product?.description}</div>
              </div>
              <div className={styles["product-seller"]}>
                <span>Seller : </span>
                <span>{product?.seller}</span>
              </div>
            </div>
          </div>
          <div className={styles["product-reviews-container"]}>
            <h2>Product Reviews</h2>
            <Reviews reviews={product && product.reviews} />
          </div>
        </section>
      )}
      <Footer />
    </>
  );
};

export default SingleProduct;
