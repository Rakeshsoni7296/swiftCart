import { Popover, Steps } from "antd";

const customDot = (dot, { status, index }) => (
  <Popover
    content={
      <span>
        step {index+1} status: {status}
      </span>
    }
  >
    {dot}
  </Popover>
);

const CheckoutSteps = ({ currentPage, stepsStatus }) => {
  return (
    <Steps
      current={currentPage}
      progressDot={customDot}
      items={stepsStatus}
    />
  );
};

export default CheckoutSteps;
