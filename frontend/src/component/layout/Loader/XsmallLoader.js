import React from "react";
import style from "./XsmallLoader.module.css";

const SmallLoader = (props) => {
  return (
    <div className={style.container1}>
      <div className={style.loading}>
        <div></div>
      </div>
      <div className={style.text}>{props.text}</div>
    </div>
  );
};

export default SmallLoader;
