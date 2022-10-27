import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Nav.module.css";

function Nav() {
  const Navigate = useNavigate();
  return (
    <div className={styles.route_nav_box}>
      <p
        style={{ cursor: "pointer" }}
        onClick={function () {
          Navigate("/swap");
        }}
      >
        Swap
      </p>

      <p
        style={{ cursor: "pointer" }}
        onClick={function () {
          Navigate("/send");
        }}
      >
        Send
      </p>

      <p
        style={{ cursor: "pointer" }}
        onClick={function () {
          Navigate("/pool");
        }}
      >
        Pool
      </p>
    </div>
  );
}
export default Nav;
