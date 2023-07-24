import axios from "axios";
import {
  ALL_PRODUCTS_REQUEST,
  ALL_PRODUCTS_SUCCESS,
  ALL_PRODUCTS_FAIL,
  ADMIN_PRODUCTS_REQUEST,
  ADMIN_PRODUCTS_SUCCESS,
  ADMIN_PRODUCTS_FAIL,
  CREATE_NEWPRODUCT_REQUEST,
  CREATE_NEWPRODUCT_SUCCESS,
  CREATE_NEWPRODUCT_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  CREATE_REVIEW_REQUEST,
  CREATE_REVIEW_SUCCESS,
  CREATE_REVIEW_FAIL,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
  GET_REVIEWS_REQUEST,
  GET_REVIEWS_SUCCESS,
  GET_REVIEWS_FAIL,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_FAIL,
  CLEAR_ERRORS,
} from "./productTypes";

export const getAllProducts =
  (page = 1, searchQuery = "", category = "", priceRange) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALL_PRODUCTS_REQUEST });

      const link = `/api/v1/products`;
      const config = {
        params: {
          page,
          keyword: searchQuery,
          ...(category !== "All" && { category }),
          "price[gte]": priceRange[0],
          "price[lte]": priceRange[1],
        },
      };

      const { data } = await axios.get(link, config);

      dispatch({ type: ALL_PRODUCTS_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: ALL_PRODUCTS_FAIL,
        payload: error.response?.data.message || error.message,
      });
    }
  };

export const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });

    const link = `/api/v1/products/${id}`;
    const { data } = await axios.get(link);

    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.response?.data.message || error.message,
    });
  }
};

export const getAllProductsForAdmin = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_PRODUCTS_REQUEST });
    const { data } = await axios("/api/v1/get-all-products", {
      withCredentials: true,
    });

    dispatch({
      type: ADMIN_PRODUCTS_SUCCESS,
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_PRODUCTS_FAIL,
      payload: error.response?.data.message || error.message,
    });
  }
};

// Create New Product
export const createNewProduct = (product) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_NEWPRODUCT_REQUEST });
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    };
    const { data } = await axios.post("/api/v1/products", product, config);
    dispatch({
      type: CREATE_NEWPRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CREATE_NEWPRODUCT_FAIL,
      payload: error.response?.data.message || error.message,
    });
  }
};

// Delete a product
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_PRODUCT_REQUEST });
    const config = {
      withCredentials: true,
    };
    const { data } = await axios.delete(`/api/v1/products/${id}`, config);
    dispatch({
      type: DELETE_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DELETE_PRODUCT_FAIL,
      payload: error.response?.data.message || error.message,
    });
  }
};

// Update Product
export const updateProduct = (id, product) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    };
    const { data } = await axios.put(`/api/v1/products/${id}`, product, config);

    dispatch({
      type: UPDATE_PRODUCT_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_PRODUCT_FAIL,
      payload: error.response?.data.message || error.message,
    });
  }
};

// Create New Review
export const createNewReview = (reviewData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_REVIEW_REQUEST });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    const { data } = await axios.put("/api/v1/reviews", reviewData, config);

    dispatch({
      type: CREATE_REVIEW_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: CREATE_REVIEW_FAIL,
      payload: error.response?.data.message || error.message,
    });
  }
};

// Get all Reviews
export const getProductReviews = (productId) => async (dispatch) => {
  try {
    dispatch({ type: GET_REVIEWS_REQUEST });
    const config = {
      withCredentials: true,
      params: {
        id: productId,
      },
    };

    const { data } = await axios.get("/api/v1/reviews", config);

    dispatch({
      type: GET_REVIEWS_SUCCESS,
      payload: data.reviews,
    });
  } catch (error) {
    dispatch({
      type: GET_REVIEWS_FAIL,
      payload: error.response?.data.message || error.message,
    });
  }
};

// Delete a Review
export const deleteProductReview =
  (productId, reviewId) => async (dispatch) => {
    try {
      dispatch({ type: DELETE_REVIEW_REQUEST });
      const config = {
        withCredentials: true,
        params: {
          id: reviewId,
          productId,
        },
      };
      const { data } = await axios.delete(`/api/v1/reviews`, config);
      dispatch({
        type: DELETE_REVIEW_SUCCESS,
        payload: data.success,
      });
    } catch (error) {
      dispatch({
        type: DELETE_REVIEW_FAIL,
        payload: error.response?.data.message || error.message,
      });
    }
  };

// Clear all errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
