import React, { useState, useEffect } from "react";
import styles from "./Admin.module.css";
import {
  DashboardOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  UsergroupAddOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  {
    key: 1,
    menuIcon: <DashboardOutlined />,
    menuItem: "Dashboard",
    link: "/admin-dashboard",
  },
  {
    key: 2,
    menuIcon: <ShoppingOutlined />,
    menuItem: "Products",
    link: "/admin-dashboard/products",
  },
  {
    key: 3,
    menuIcon: <ShoppingCartOutlined />,
    menuItem: "Orders",
    link: "/admin-dashboard/orders",
  },
  {
    key: 4,
    menuIcon: <UsergroupAddOutlined />,
    menuItem: "Users",
    link: "/admin-dashboard/users",
  },
  {
    key: 5,
    menuIcon: <StarOutlined />,
    menuItem: "Reviews",
    link: "/admin-dashboard/reviews",
  },
];

const Sidebar = () => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(1);

  useEffect(() => {
    const baseRoute = location.pathname;
    const currentMenuItem = menuItems.find((item) => item.link === baseRoute);
    setActiveMenu(currentMenuItem?.key);
  }, [location.pathname]);

  return (
    <aside className={styles["sidebar-container"]}>
      {menuItems.map((item) => (
        <Link
          to={item.link}
          className={`${styles["item-info-wrapper"]} ${
            item.key === activeMenu ? styles["menu-active"] : ""
          }`}
          onClick={() => setActiveMenu(item.key)}
          key={item.key}
        >
          <div className={styles["menu-icon"]}>{item.menuIcon}</div>
          <div>{item.menuItem}</div>
        </Link>
      ))}
    </aside>
  );
};

export default Sidebar;
