import React from "react";
import { Button } from "reactstrap";
import styles from "./AmountButton.module.css";

function DynamicButton({ text, isDisable, func, classN }) {
  return (
    <Button
      className={classN ? classN : styles.button_box}
      size="md"
      disabled={isDisable}
      onClick={func}
    >
      {text}
    </Button>
  );
}
export default DynamicButton;
