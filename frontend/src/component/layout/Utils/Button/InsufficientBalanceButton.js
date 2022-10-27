import React from "react";
import { Button } from "reactstrap";
import styles from "./AmountButton.module.css";

function InsufficientBalanceButton() {
  return (
    <Button className={styles.button_box} size="md" disabled={true}>
      Insufficient Balance
    </Button>
  );
}
export default InsufficientBalanceButton;
