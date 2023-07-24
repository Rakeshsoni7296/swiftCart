import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "./../../Redux/Products/productActions";
import Footer from "../Base/Footer";
import Navbar from "../Base/Navbar";
import AllProducts from "../Products/AllProducts";
import Loader from "../Base/Loader";
import styles from "./Home.module.css";
import { Slider, message } from "antd";
import { Helmet } from "react-helmet";

const marks = {
  1: {
    style: {
      marginTop: "4px",
    },
    label: "₹1",
  },
  1000: {
    style: {
      marginTop: "4px",
    },
    // label: <strong>₹1000</strong>,
    label: "₹1000",
  },
};

const categories = [
  "All",
  "Electronics",
  "Cameras",
  "Laptops",
  "Headphones",
  "Food",
  "Books",
  "Clothes",
  "Shoes",
  "Sports",
  "Sunglasses",
  "Watches",
];

const noProductFoundImg = "/notFound.jpg";

const Home = () => {
  const dispatch = useDispatch();
  const { loading, error, products, productsCount } = useSelector(
    (state) => state.products
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([1, 1000000]);
  const [category, setCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageOffset = 6;
  const debounceTime = 300;
  const totalNumOfPages = Math.ceil(productsCount / pageOffset) || 0;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const searchHandler = (query) => {
    setSearchQuery(query);
  };

  const productDetails = [
    products,
    currentPage,
    totalNumOfPages,
    handlePageChange,
  ];

  useEffect(() => {
    setCurrentPage(1);
  }, [category, searchQuery, priceRange]);

  useEffect(() => {
    if (error) return message.error(error, [2]);
    const getData = setTimeout(() => {
      dispatch(getAllProducts(currentPage, searchQuery, category, priceRange));
    }, debounceTime);
    return () => clearTimeout(getData);
  }, [dispatch, error, currentPage, searchQuery, category, priceRange]);

  return (
    <>
      <Helmet>
        <title>SwiftCart | An E-commerce Store</title>
      </Helmet>
      <Navbar onSearch={searchHandler} />
      {/* Products will go here */}
      <section className={styles["widget"]}>
        <div className={styles["widget-left"]}>
          <div>
            {/* <Slider
              max={100000}
              min={1}
              range={true}
              defaultValue={[1, 100000]}
              marks={marks}
              style={{ width: "200px" }}
              onChange={(val) => setPriceRange(val)}
            /> */}
          </div>
          <div className={styles.category_header}>Categories</div>
          {categories.map((cat, ind) => (
            <div
              className={`${styles.category_name} ${
                category === cat ? styles.active : ""
              }`}
              key={ind + 1}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </div>
          ))}
        </div>
        <div className={styles["widget-right"]}>
          {loading ? (
            <Loader />
          ) : products && products.length > 0 ? (
            <AllProducts productDetails={productDetails} />
          ) : (
            <div className={styles["no-data-found-img-container"]}>
              <img src={noProductFoundImg} alt="no-product-found" />
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Home;
