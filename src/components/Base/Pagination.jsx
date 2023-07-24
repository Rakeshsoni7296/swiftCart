import React, { useState } from "react";
import styles from "./Base.module.css";

const Pagination = (props) => {
  const visibleDivs = 1;
  const [activeIndex, setActiveIndex] = useState(props.page - 1);

  const handleDivClick = (index) => {
    setActiveIndex(index);
    props.onPageChange(index + 1);
  };

  const pageNums = (pages) => {
    let start = Math.max(0, activeIndex - visibleDivs);
    let end = Math.min(pages - 1, activeIndex + visibleDivs);

    const divs = [];
    for (let i = start; i <= end; i++) {
      divs.push(
        <div
          key={i}
          className={i === activeIndex ? styles.active : ""}
          onClick={() => handleDivClick(i)}
        >
          {`${i + 1}`}
        </div>
      );
    }

    if (start > 0) {
      divs.unshift(<div key="start">...</div>);
      divs.unshift(
        <div
          key={0}
          className={activeIndex === 0 ? styles.active : ""}
          onClick={() => handleDivClick(0)}
        >
          1
        </div>
      );
    }

    if (end < pages - 1) {
      divs.push(<div key="end">...</div>);
      divs.push(
        <div
          key={pages - 1}
          className={activeIndex === pages - 1 ? styles.active : ""}
          onClick={() => handleDivClick(pages - 1)}
        >
          {pages}
        </div>
      );
    }

    return divs;

    // return Array.from({ length: pages }, (_, index) => (
    //   <div
    //     key={index}
    //     className={index === activeIndex ? styles.active : ""}
    //     onClick={() => handleDivClick(index)}
    //   >{`${index + 1}`}</div>
    // ));
  };

  return (
    <div className={styles.pagination_container}>
      {pageNums(props.totalPages)}
    </div>
  );
};

export default Pagination;
