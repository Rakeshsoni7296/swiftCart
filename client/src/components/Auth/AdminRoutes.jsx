import { connect } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoutes = ({ isAuthenticated, isLoaded, user }) => {
  if (isLoaded && user?.role === "admin") {
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
  }

  return <div></div>;
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isLoaded: state.auth.isLoaded,
    user: state.auth.user,
  };
};

export default connect(mapStateToProps)(AdminRoutes);
