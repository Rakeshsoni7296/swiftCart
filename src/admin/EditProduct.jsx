import { useEffect, useState } from "react";
import styles from "./Admin.module.css";
import Navbar from "../components/Base/Navbar";
import Sidebar from "./Sidebar";
import { Link, useParams } from "react-router-dom";
import { Button, Form, Input, Select, Upload, message } from "antd";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  updateProduct,
  getProductDetails,
  clearErrors,
} from "./../Redux/Products/productActions";
import {
  PRODUCT_DETAILS_RESET,
  UPDATE_PRODUCT_RESET,
} from "../Redux/Products/productTypes";

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

const EditProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Product data

  const { error, product: productInfo } = useSelector(
    (state) => state.productDetails
  );
  const { error: updateError, isUpdated } = useSelector(
    (state) => state.product
  );

  const { id } = useParams();
  // current Product Data
  const [productData, setProductData] = useState({});
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isFileListReady, setIsFileListReady] = useState(false);

  useEffect(() => {
    if (productInfo && productInfo._id !== id) dispatch(getProductDetails(id));
    else {
      setProductData(productInfo);
      console.log(productInfo);
      let productImgs;
      if (typeof productInfo.images?.at(0) === "string") {
        productImgs = productInfo.images.map((img, ind) => ({
          uid: `${ind}`,
          name: imgUrl(img),
          status: "done",
          type: "image/jpg",
          path: img,
          url: `http://localhost:4000${img}`,
        }));
      } else {
        productImgs = productInfo.images;
      }
      setFileList(productImgs);
      productInfo.images = productImgs;
      form.setFieldsValue(productInfo);
      setIsFileListReady(true);
    }

    if (error) {
      message.error(error, [2]);
      dispatch(clearErrors());
    }

    if (updateError) {
      message.error(updateError, [2]);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      message.success("Product successfully updated.", [2]);
      dispatch({ type: UPDATE_PRODUCT_RESET });
      dispatch({ type: PRODUCT_DETAILS_RESET });
      setTimeout(() => {
        navigate("/admin-dashboard/products");
      }, 2000);
    }
  }, [
    dispatch,
    error,
    isUpdated,
    navigate,
    updateError,
    id,
    productInfo,
    form,
  ]);

  const imgUrl = (str) => {
    const finalString = str.split("/").at(-1);
    return finalString;
  };

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
    setFileList((prevFileList) => [...prevFileList, file]);
    return false;
  };

  const onFinish = (product) => {
    const imgLists = product?.images?.fileList;

    const formData = new FormData();
    imgLists?.forEach((file) => {
      if (file.originFileObj) formData.append("images", file.originFileObj);
    });

    fileList.forEach((file) => {
      if (file.path) {
        formData.append("unchangedimages[]", file.path);
      }
    });

    Object.entries(product).forEach(([key, value]) => {
      if (key !== "images") formData.append(key, value);
    });

    // for (const [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }

    // console.log(product);

    dispatch(updateProduct(id, formData));
  };

  const handleWheel = (event) => {
    event.target.blur();
  };

  const handleRemove = (file) => {
    setFileList((prevFileList) =>
      prevFileList.filter((f) => f.uid !== file.uid)
    );
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
            {productData && productData.name !== "" && (
              <Form
                {...layout}
                name="nest-messages"
                onFinish={onFinish}
                initialValues={{
                  remember: true,
                  ...productData,
                }}
                style={{
                  maxWidth: 600,
                  margin: "0 auto",
                }}
                validateMessages={validateMessages}
                form={form}
              >
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                  Edit Product
                </h2>
                <Form.Item
                  name="name"
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
                  name="price"
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
                  name="category"
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
                  name="stock"
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
                  name="seller"
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
                  name="images"
                  label="Images"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  {isFileListReady && (
                    <Upload
                      listType="picture"
                      maxCount={5}
                      defaultFileList={[...fileList]}
                      accept="image/png, image/jpeg, image/jpg"
                      beforeUpload={beforeUpload}
                      multiple
                      className={styles["upload-list-inline"]}
                      onRemove={handleRemove}
                    >
                      <Button
                        style={{ height: "32px", width: "200px" }}
                        icon={<UploadOutlined />}
                      >
                        Upload Product Pictures
                      </Button>
                    </Upload>
                  )}
                </Form.Item>

                <Form.Item
                  name="description"
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
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default EditProduct;
