import { useEffect, useState } from "react";
import { Button, message } from "antd";
import {
  CheckOutlined,
  ShoppingCartOutlined,
  StarFilled,
} from "@ant-design/icons";
import styles from "./Base.module.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../../Redux/Cart/CartAction";

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
};

const Card = ({ product }) => {
  const [imgLoaded, setImgLoaded] = useState();
  const [productCartStatus, setProductCartStatus] = useState(false);
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);

  useEffect(() => {
    const item = cartItems.find((prod) => prod.product === product._id);
    if (item) setProductCartStatus(true);
  }, []);

  const addToCart = () => {
    const item = cartItems.find((prod) => prod.product === product._id);
    if (item) {
      return;
    } else {
      dispatch(addItemToCart(product._id, 1));
      message.success("Product Added to Cart");
    }
    setProductCartStatus(true);
  };

  const handleImgLoad = () => {
    setImgLoaded(true);
  };

  const baseUrl = "http://localhost:4000";

  return (
    <div className={styles["product-card"]}>
      <div className={styles.img_container}>
        {!imgLoaded && <div className={styles.img_loader}></div>}
        <img
          // src={`/imgs/${product.images[0].url}`}
          src={`${baseUrl}${product.images[0]}`}
          onLoad={handleImgLoad}
          style={{ display: imgLoaded ? "block" : "none" }}
        />
      </div>
      <div className={styles.category}>{product.category}</div>
      <div className={styles.title}>{truncateText(product.name, 40)}</div>
      <div className={styles["price-rating-container"]}>
        <div className={styles.price_value}>₹{product.price}</div>
        <div className={styles["rating-container"]}>
          <span className={styles["rating-rating-icon"]}>
            <span>{product.ratings.toFixed(1)}</span>{" "}
            <span className={styles["star-icon-cont"]}>
              <StarFilled />
            </span>
          </span>
          <span className={styles["people-rated"]}>{product.numOfReviews}</span>
        </div>
      </div>
      <div className={styles["btn-container"]}>
        <Button
          type={productCartStatus ? "primary" : "default"}
          icon={
            productCartStatus ? <CheckOutlined /> : <ShoppingCartOutlined />
          }
          onClick={addToCart}
        >
          {productCartStatus ? "Added in Cart" : "Add to Cart"}
        </Button>
        <Button>
          <Link to={`/product/${product._id}`}>View Details</Link>
        </Button>
      </div>
    </div>
  );
};

export default Card;
