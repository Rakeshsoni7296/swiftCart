import styles from "./Base.module.css";

const Loader = () => {
  return (
    <div className={styles["loader-container"]}>
      <div className={styles["spinner"]}>
        <div className={styles["rect1"]}></div>
        <div className={styles["rect2"]}></div>
        <div className={styles["rect3"]}></div>
        <div className={styles["rect4"]}></div>
        <div className={styles["rect5"]}></div>
      </div>
    </div>
  );
};

export default Loader;
