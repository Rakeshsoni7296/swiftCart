import { connect } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateUserRoutes = ({ loading, isAuthenticated, isLoaded }) => {
  if (isLoaded) {
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
  }
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isLoaded: state.auth.isLoaded,
    loading: state.auth.loading,
  };
};

export default connect(mapStateToProps)(PrivateUserRoutes);
