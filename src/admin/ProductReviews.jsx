import Navbar from "../components/Base/Navbar";
import Sidebar from "./Sidebar";
import styles from "./Admin.module.css";
import { message, Button, Table, Form, Select, Empty, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getProductReviews,
  getAllProductsForAdmin,
  clearErrors,
} from "../Redux/Products/productActions";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";
import { DELETE_REVIEW_RESET } from "../Redux/Products/productTypes";
import { deleteProductReview } from "../Redux/Products/productActions";

const { Option } = Select;

const ProductReviews = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [activeDeleteOrder, setActiveDeleteOrder] = useState(false);
  const [productId, setProductId] = useState("");

  const { products } = useSelector((state) => state.products);
  const { loading, error, reviews } = useSelector((state) => state.getReviews);
  const { isDeleted } = useSelector((state) => state.deleteReview);

  useEffect(() => {
    dispatch(getAllProductsForAdmin());

    if (error) {
      message.error(error);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      message.warning("Review deleted successfully.", [2]);
      dispatch({ type: DELETE_REVIEW_RESET });
      setTimeout(() => {
        navigate("/admin-dashboard/reviews");
      }, 2000);
    }
  }, [dispatch, error, isDeleted, navigate]);

  const deleteReviewHandler = (id) => {
    setTimeout(() => {
      const response = confirm("Are you sure you want to delete this order?");
      if (response) dispatch(deleteProductReview(productId, id));
      setActiveDeleteOrder("");
    }, 400);
  };

  const getReviewsForProductSubmitHandler = (value) => {
    const { productId: id } = value;
    dispatch(getProductReviews(id));
    setProductId(id);
  };

  const columns = [
    {
      title: "Sr No",
      dataIndex: "srNo",
      key: "srNo",
    },
    {
      title: "Review ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Action",
      key: "action",
      render: (_, user) => (
        <>
          <Button
            danger
            type={activeDeleteOrder === user.id ? "primary" : "default"}
            onClick={() => {
              setActiveDeleteOrder(user.id);
              deleteReviewHandler(user.id);
            }}
          >
            <DeleteOutlined />
          </Button>
        </>
      ),
    },
  ];

  const dataSource = reviews?.map((review, i) => {
    return {
      key: i,
      srNo: i + 1,
      id: review._id,
      rating: review.rating,
      comment: review.comment,
      user: review.name,
    };
  });

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className={styles["admin-container"]}>
        <section className={styles.order_admin_table_section}>
          <h2>All Reviews</h2>
          <Form
            style={{ width: "480px", marginBottom: "30px" }}
            name="myForm"
            onFinish={getReviewsForProductSubmitHandler}
            form={form}
          >
            <Form.Item
              name="productId"
              label="Product Name"
              rules={[{ required: true, message: "Please choose a product" }]}
            >
              <Select
                style={{ display: "flex" }}
                placeholder="Select a product"
                // dropdownRender={(menu) => <div>{menu}</div>}
              >
                {products?.map((prod) => (
                  <Option key={prod._id} value={prod._id}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div
                        style={{
                          marginRight: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          style={{ width: "24px", borderRadius: "5px" }}
                          src={`http://localhost:4000${prod.images[0]}`}
                        />
                      </div>
                      <Tooltip title={prod.name}>
                        <span>{prod.name}</span>
                      </Tooltip>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item style={{ textAlign: "center" }}>
              <Button
                style={{ width: "140px" }}
                type="primary"
                htmlType="submit"
              >
                Submit
              </Button>
            </Form.Item>
          </Form>

          {reviews && reviews.length > 0 ? (
            <Table
              dataSource={dataSource}
              columns={columns}
              bordered={true}
              loading={loading}
            ></Table>
          ) : (
            <div>
              <Empty description="No Reviews Available" />
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default ProductReviews;
