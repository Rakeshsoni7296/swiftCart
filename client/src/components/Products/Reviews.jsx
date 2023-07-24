import styles from "./Products.module.css";
import { StarFilled } from "@ant-design/icons";

const baseUrl = "http://localhost:4000";

const Reviews = ({ reviews }) => {
  console.log(reviews);
  return (
    <div className={styles['review-card-wrapper']}>
      {reviews?.map((review, ind) => (
        <div key={ind} className={styles["product-review-card"]}>
          <div className={styles["review-header"]}>
            <div className={styles["user-rating-icon"]}>
              <div className={styles["rating-user-img"]}>
                <img
                  src={`${baseUrl}${review.avatar}`}
                  alt={`${review.name}`}
                />
              </div>
              <div className={styles["rate-user-name-rating"]}>
                <div>{review.name}</div>
                <div>
                  {review.rating} <StarFilled style={{ color: "#fadb14" }} />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.hr_line}></div>
          <div className={styles['review-comment']}>{review.comment}</div>
        </div>
      ))}
    </div>
  );
};

export default Reviews;
