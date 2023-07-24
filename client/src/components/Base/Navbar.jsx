import { useState, useRef } from "react";
import { connect, useDispatch } from "react-redux";
import { Input, message } from "antd";
import { useOutsideClick } from "./../../hooks/useOutsideClick";
import { logout } from "../../Redux/Users/userAction";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import styles from "./Base.module.css";

const Navbar = ({ onSearch, loading, user, cartItems }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setshowDropdown] = useState(false);
  const userProfileRef = useRef();
  const dropdownRef = useRef();
  const dispatch = useDispatch();
  const baseUrl = "http://localhost:4000";

  const handleSearch = (e) => {
    onSearch(e.target.value);
  };

  const changeHandler = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === "") onSearch("");
  };

  const logoutHandler = () => {
    dispatch(logout());
    message.success("Logged out successfully", [2]);
  };

  const handleProfileWrapperClick = (event) => {
    event.stopPropagation();
    setshowDropdown((prevState) => !prevState);
  };

  const handleOutsideClick = () => {
    setshowDropdown(false);
  };

  useOutsideClick(dropdownRef, handleOutsideClick);

  return (
    <div className={styles["nav-container"]}>
      <nav className={styles.navbar}>
        <div className={styles.nav_left}>
          <Link to="/">
            <img src="/logo.jpg" alt="logo" />
          </Link>
        </div>
        <div className={styles.nav_center}>
          <Input
            placeholder="Search..."
            suffix={
              <SearchOutlined
                className={`${styles.search_default_color} ${
                  searchQuery.length === 0 ? styles.color_toggle : ""
                }`}
              />
            }
            onChange={changeHandler}
            onPressEnter={handleSearch}
          />
        </div>
        <div className={styles.nav_right}>
          <Link to="/cart">
            <ShoppingCartOutlined />
            <span className={styles.nav_right_icon}>Cart</span>
            <span className={styles.cart_items}>{cartItems.length}</span>
          </Link>
          {user ? (
            <>
              <div
                className={styles.profile_wrapper}
                ref={userProfileRef}
                onClick={handleProfileWrapperClick}
              >
                <span className={styles["user-img-container"]}>
                  {/* <img src="/defaultuser.jpg" alt="user" /> */}
                  <img src={`${baseUrl}${user?.avatar}`} alt="user" />
                </span>
                <span>{user?.name?.split(" ")[0]}</span>
              </div>
              {showDropdown && (
                <div className={styles["dropdown"]} ref={dropdownRef}>
                  {user && user?.role === "admin" && (
                    <div>
                      <Link to={"/admin-dashboard"}>Dashboard</Link>
                    </div>
                  )}
                  <div>
                    <Link to={"/my-orders"}>My Orders</Link>
                  </div>
                  <div>
                    <Link to={"/my-account"}>My Account</Link>
                  </div>
                  <div>
                    <Link to={"/change-password"}>Change Password</Link>
                  </div>
                  <div>
                    <Link onClick={logoutHandler} to={"/"}>
                      Logout
                    </Link>
                  </div>
                </div>
              )}
            </>
          ) : (
            !loading && (
              <Link to="/login">
                <UserOutlined />
                <span className={styles.nav_right_icon}>Login</span>
              </Link>
            )
          )}
        </div>
      </nav>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    user: state.auth.user,
    cartItems: state.cart.cartItems,
  };
};

export default connect(mapStateToProps)(Navbar);
