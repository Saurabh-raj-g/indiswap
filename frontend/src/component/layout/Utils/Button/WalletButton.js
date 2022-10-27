import React from "react";
import { Button } from "reactstrap";
import styles from "./WalletButton.module.css";

const WalletButton = ({ connectWallet, error }) => {
  return (
    <Button className={styles.button_box} size="md" onClick={connectWallet}>
      {error ? error : "Connect Wallet"}
    </Button>
  );
};
export default WalletButton;
