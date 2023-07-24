import Card from "../Base/Card";
import Pagination from "../Base/Pagination";
import styles from "./Products.module.css";

const AllProducts = ({ productDetails }) => {
  return (
    <>
      <h2 className={styles.heading}>Products</h2>
      <div className={styles["card-container"]}>
        {productDetails[0].map((item) => (
          <Card key={item._id} product={item} />
        ))}
      </div>
      <div className={styles["pagination-wrapper"]}>
        {productDetails[2] > 1 && (
          <Pagination
            page={productDetails[1]}
            totalPages={productDetails[2]}
            onPageChange={productDetails[3]}
          />
        )}
      </div>
    </>
  );
};

export default AllProducts;
