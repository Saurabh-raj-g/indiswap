import React from "react";
import { Button } from "reactstrap";
import styles from "./AmountButton.module.css";

function AmountButton() {
  return (
    <Button className={styles.button_box} size="md" disabled={true}>
      Enter an Amount
    </Button>
  );
}
export default AmountButton;
