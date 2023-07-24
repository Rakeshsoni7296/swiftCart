import React, { useState } from "react";
import styles from "./Base.module.css";
import { EditOutlined } from "@ant-design/icons";
import { Input, Modal } from "antd";

const InfoCard = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [input, setInput] = useState(props.info.value);

  const handleOk = () => {
    props.info.handler(input);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles["info-card"]}>
      <div className={styles["left-view-info"]}>
        <div>{props.info.type}</div>
        <div>{props.info.value}</div>
      </div>
      <div className={styles["right-view-info"]}>{props.info.icon}</div>
      <div className={styles["edit-info"]} onClick={() => setIsModalOpen(true)}>
        <EditOutlined style={{ fontSize: "20px" }} />
      </div>
      <Modal
        open={isModalOpen}
        title={`Update ${props.info.type}`}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          type={props.info.inputType}
          defaultValue={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default InfoCard;
