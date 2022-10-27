import React from "react";
import { Button } from "reactstrap";
import styles from "./SwapButton.module.css";

function SwapButton({ swap, isDisable }) {
  return (
    <Button
      className={styles.button_box}
      size="md"
      disabled={isDisable}
      onClick={swap}
    >
      Swap
    </Button>
  );
}
export default SwapButton;
