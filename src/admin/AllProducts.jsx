import { useEffect, useState } from "react";
import Navbar from "../components/Base/Navbar";
import Sidebar from "./Sidebar";
import styles from "./Admin.module.css";
import { Link, useNavigate } from "react-router-dom";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Table, message, Space, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProductsForAdmin,
  clearErrors,
  deleteProduct,
} from "./../Redux/Products/productActions";
import { DELETE_PRODUCT_RESET } from "../Redux/Products/productTypes";

const AllProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeDelete, setActiveDelete] = useState("");

  const { loading, error, products } = useSelector((state) => state.products);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(getAllProductsForAdmin());
    if (error) {
      message.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      message.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      message.warning("Product deleted successfully.", [2]);
      dispatch({ type: DELETE_PRODUCT_RESET });
      setTimeout(() => {
        navigate("/admin-dashboard/products");
      }, 2000);
    }
  }, [dispatch, error, deleteError, isDeleted, navigate]);

  const deleteProductHandler = (id) => {
    setTimeout(() => {
      const response = confirm(
        "Are you sure, you want to delete this product?"
      );
      if (response) dispatch(deleteProduct(id));
      else setActiveDelete("");
    }, 400);
  };

  const columns = [
    {
      title: "Sr No",
      dataIndex: "srNo",
      key: "srNo",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Action",
      key: "action",
      render: (_, product) => (
        <Space>
          <Link to={`/admin-dashboard/products/update/${product.id}`}>
            <Button>
              <EditOutlined />
            </Button>
          </Link>
          <Button
            type={activeDelete === product.id ? "primary" : "default"}
            danger={true}
            onClick={() => {
              setActiveDelete(product.id);
              deleteProductHandler(product.id);
            }}
          >
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  const productsData = products?.map((product, i) => {
    return {
      key: i + 1,
      srNo: i + 1,
      id: product._id,
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
    };
  });

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className={styles["admin-container"]}>
        <section className={styles["all-products-section"]}>
          <div className={styles["all-products-header"]}>
            <div>All Products</div>
            <div>
              <Link to="/admin-dashboard/products/create-product">
                <PlusCircleOutlined style={{ marginRight: "10px" }} />
                Create New Product
              </Link>
            </div>
          </div>
          <div className={styles["table-container"]}>
            <Table
              dataSource={productsData}
              columns={columns}
              loading={loading}
              bordered={true}
            />
          </div>
        </section>
      </div>
    </>
  );
};

export default AllProducts;
