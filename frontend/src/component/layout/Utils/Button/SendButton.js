import React from "react";
import { Button } from "reactstrap";
import styles from "./AmountButton.module.css";

function AmountButton({ send, isDisable }) {
  return (
    <Button
      className={styles.button_box}
      size="md"
      onClick={send}
      disabled={isDisable}
    >
      Send
    </Button>
  );
}
export default AmountButton;
