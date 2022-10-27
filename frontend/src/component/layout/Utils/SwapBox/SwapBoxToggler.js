import React from "react";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import AddIcon from "@material-ui/icons/Add";
import styles from "./SwapBoxToggler.module.css";

function SwapBoxToggler({ toggle, isJoinPool, isRemoveMyLiquidityOn }) {
  return (
    <div className={styles.swap_box_toggler}>
      <p
        onClick={() => {
          toggle();
        }}
      >
        {isJoinPool || isRemoveMyLiquidityOn ? (
          <AddIcon />
        ) : (
          <ArrowDownwardIcon />
        )}
      </p>
    </div>
  );
}
export default SwapBoxToggler;
