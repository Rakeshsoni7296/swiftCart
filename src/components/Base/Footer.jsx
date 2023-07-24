import { Link } from "react-router-dom";
import styles from "./Base.module.css";
import {
  LinkedinOutlined,
  InstagramOutlined,
  TwitterOutlined,
} from "@ant-design/icons";

const Footer = () => {
  return (
    <section className={styles.footer_section}>
      <h2>SwiftCart</h2>
      <p>Shopping Made Effortless, Delivery at Your Fingertips!</p>
      <div className={styles['last-row-wrapper']}>
        <div>Copyright &copy; 2023 Rakesh Soni</div>
        <div className={styles['social-link-wrapper']}>
          <Link to="" target="_blank">
            <LinkedinOutlined />
          </Link>
          <Link to="" target="_blank">
            <InstagramOutlined />
          </Link>
          <Link to="" target="_blank">
            <TwitterOutlined />
          </Link>
        </div>
        <div>
          All rights reserved. Unauthorized use or reproduction of content is
          strictly prohibited.
        </div>
      </div>
    </section>
  );
};

export default Footer;
