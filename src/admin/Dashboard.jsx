import { useEffect } from "react";
import Navbar from "../components/Base/Navbar";
import Sidebar from "./Sidebar";
import styles from "./Admin.module.css";
import { Button } from "antd";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsForAdmin } from "./../Redux/Products/productActions";
import { getAllOrders } from "../Redux/Order/OrderAction";
import { getAllUsers } from "../Redux/Users/userAction";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.products);
  const { totalAmount, adminOrders } = useSelector((state) => state.allOrders);
  const { users } = useSelector((state) => state.allUsers);

  let outOfStock = 0;
  products?.forEach((item) => {
    if (item.stock === 0) outOfStock++;
  });

  const cardItems = [
    {
      key: 1,
      cardTitle: "Products",
      totalItems: products && products.length,
      link: "/admin-dashboard/products",
    },
    {
      key: 2,
      cardTitle: "Orders",
      totalItems: adminOrders && adminOrders.length,
      link: "/admin-dashboard/orders",
    },
    {
      key: 3,
      cardTitle: "Users",
      totalItems: users && users.length,
      link: "/admin-dashboard/users",
    },
    {
      key: 4,
      cardTitle: "Out of Stock",
      totalItems: outOfStock,
      link: "/admin-dashboard",
    },
  ];

  useEffect(() => {
    dispatch(getAllProductsForAdmin());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className={styles["admin-container"]}>
        <section className={styles["dashboard-section"]}>
          <h2>Dashboard</h2>
          <div className={styles["total-amt-container"]}>
            <div>Total Amount</div>
            <div>₹{totalAmount}</div>
          </div>
          <div className={styles["details-card-container"]}>
            {cardItems.map((item) => (
              <div className={styles["details-card"]} key={item.key}>
                <div className={styles["card-title"]}>{item.cardTitle}</div>
                <div className={styles["card-total-items"]}>
                  {item.totalItems}
                </div>
                <div
                  className={
                    item.key !== cardItems.length
                      ? styles["hr-line"]
                      : styles.hidden
                  }
                ></div>
                <div
                  className={item.key === cardItems.length ? styles.hidden : ""}
                >
                  <Button>
                    <Link to={item.link}>View Details</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Dashboard;
