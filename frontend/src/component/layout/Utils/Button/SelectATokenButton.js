import React from "react";
import { Button } from "reactstrap";
import styles from "./SelectATokenButton.module.css";

function SelectATokenButton() {
  return (
    <Button className={styles.button_box} size="md" disabled={true}>
      Select a Token
    </Button>
  );
}
export default SelectATokenButton;
