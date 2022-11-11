import React from "react";
import style from "./FontSizeLoader.module.css";

const FontSizeLoader = (props) => {
  return (
    //<div className={style.container1}>
    <div className={style.loading}>
      <div></div>
      <span className={style.text}>{props.text}</span>
    </div>
    // <div className={style.text}>{props.text}</div>
    //</div>
  );
};

export default FontSizeLoader;
