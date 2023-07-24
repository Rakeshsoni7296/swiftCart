import { useEffect, useState } from "react";
import styles from "./Admin.module.css";
import Navbar from "../components/Base/Navbar";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";
import { Button, Form, Input, Select, Upload, message } from "antd";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createNewProduct,
  clearErrors,
} from "./../Redux/Products/productActions";
import { CREATE_NEWPRODUCT_RESET } from "../Redux/Products/productTypes";

const { Option } = Select;
const categories = [
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

const CreateNewProduct = () => {
  const [files, setFiles] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, success } = useSelector((state) => state.createNewProduct);

  useEffect(() => {
    if (error) {
      message.error(error, [2]);
      dispatch(clearErrors());
    }
    if (success) {
      message.success("New Product successfully created.", [2]);
      dispatch({ type: CREATE_NEWPRODUCT_RESET });
      setTimeout(() => {
        navigate("/admin-dashboard/products");
      }, 2000);
    }
  }, [dispatch, error, success, navigate]);

  const layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const validateMessages = {
    required: "${label} is required!",
    types: {
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };

  const beforeUpload = (file) => {
    const imgArr = [...files];
    console.log(imgArr);
    imgArr.push(file);
    setFiles(imgArr);
    console.log(imgArr);
    return false;
  };

  const onFinish = (values) => {
    const { product } = values;
    const { fileList } = product.images;

    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("images", file.originFileObj);
    });

    Object.entries(product).forEach(([key, value]) => {
      if (key !== "images") formData.append(key, value);
    });

    dispatch(createNewProduct(formData));
  };

  const handleWheel = (event) => {
    event.target.blur();
  };

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className={styles["admin-container"]}>
        <section>
          <div className={styles.new_product_create_header}>
            <div>
              <Link to="/admin-dashboard/products">
                <Button>
                  <ArrowLeftOutlined /> Go to All Products
                </Button>
              </Link>
            </div>
          </div>
          <div className={styles["new-product-form-cont"]}>
            <Form
              {...layout}
              name="nest-messages"
              onFinish={onFinish}
              style={{
                maxWidth: 600,
                margin: "0 auto",
              }}
              validateMessages={validateMessages}
            >
              <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                Create New Product
              </h2>
              <Form.Item
                name={["product", "name"]}
                label="Name"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name={["product", "price"]}
                label="Price"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input type="number" onWheel={handleWheel} />
              </Form.Item>
              <Form.Item
                name={["product", "category"]}
                label="Category"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please select product category!",
                  },
                ]}
              >
                <Select placeholder="Please select a category">
                  {categories.map((cat, i) => (
                    <Option key={i + 1} value={cat}>
                      {cat}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name={["product", "stock"]}
                label="Stock"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input type="number" onWheel={handleWheel} />
              </Form.Item>
              <Form.Item
                name={["product", "seller"]}
                label="Seller"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name={["product", "images"]}
                label="Images"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Upload
                  listType="picture"
                  maxCount={5}
                  accept="image/png, image/jpeg, image/jpg"
                  beforeUpload={beforeUpload}
                  multiple
                  className={styles["upload-list-inline"]}
                >
                  <Button
                    style={{ height: "32px", width: "200px" }}
                    icon={<UploadOutlined />}
                  >
                    Upload Product Pictures
                  </Button>
                </Upload>
              </Form.Item>

              <Form.Item
                name={["product", "description"]}
                label="Description"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input.TextArea />
              </Form.Item>
              <Form.Item
                wrapperCol={{
                  ...layout.wrapperCol,
                  offset: 10,
                }}
              >
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </section>
      </div>
    </>
  );
};

export default CreateNewProduct;
