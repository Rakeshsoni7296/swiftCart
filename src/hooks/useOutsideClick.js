import { useEffect } from "react";

export const useOutsideClick = (ref, cb) => {
  const handleClick = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      cb();
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [ref, cb]);
};
