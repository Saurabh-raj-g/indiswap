// -----------------    optimal ------------------------

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WalletButton from "../layout/Utils/Button/WalletButton.js";
import AmountButton from "../layout/Utils/Button/AmountButton.js";
import SendButton from "../layout/Utils/Button/SendButton.js";
import ModalTokenSelect from "../layout/Utils/Modal/ModalTokenSelect.js";
import ConfirmTransactionModal from "../layout/Utils/Modal/ConfirmTransactionModal.js";
import SelectATokenButton from "../layout/Utils/Button/SelectATokenButton.js";
import Nav from "../layout/Utils/Nav/Nav.js";
import {
  getTokenData,
  getTokenDataWithBalance,
  sendToken,
} from "../../actions/contractFunction";

import { transactionStatusAction } from "../../actions/utilsAction";
import styles from "./SendPage.module.css";

import { useDispatch, useSelector } from "react-redux";
import { clearErrors, login } from "../../actions/userAction";
import { useAlert } from "react-alert";

import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
//import WaitButton from "../layout/Utils/Button/WaitButton";
import InsufficientBalanceButton from "../layout/Utils/Button/InsufficientBalanceButton";
import DynamicButton from "../layout/Utils/Button/DynamicButton";

const SendPage = (props) => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();
  //const valid = /^[+-]?\d*(?:[.,]\d*)?$/;
  const [modal, setModal] = useState(false);
  const [isConfirmTransactionModal, setIsConfirmTransactionModal] =
    useState(false);
  //const [token, setToken] = useState(null);
  const [tokenData, setTokenData] = useState(null);
  const [inputAmount, setInputAmount] = useState();
  const [inputAddress, setInputAddress] = useState(null);

  const [isButtonClicked, setButtonClicked] = useState(false);

  const [transactionHashData, setTransactionHashData] = useState([]);

  const confirmTransactionModalToggle = () => {
    setIsConfirmTransactionModal(!isConfirmTransactionModal);
  };

  const getInputToken = async (tokenAddress) => {
    if (isAuthenticated) {
      const token = await getTokenDataWithBalance(
        tokenAddress,
        props.network.wethAddress,
        props.network.chainId,
        user.account
      );
      setTokenData(token);
    } else {
      const token = await getTokenData(
        tokenAddress,
        props.network.wethAddress,
        props.network.chainId
      );
      setTokenData(token);
    }
  };

  const getInputAddress = async (event) => {
    setInputAddress(event.target.value);
  };

  const getInputAmount = async (event) => {
    setInputAmount(event.target.value);
  };
  const togglemodal = () => {
    setModal(!modal);
  };

  const send = async () => {
    setButtonClicked(true);
    dispatch(transactionStatusAction(3));
    const p = await sendToken(
      tokenData.tokenAddress,
      props.network.wethAddress,
      inputAddress,
      inputAmount,
      user.account
    );
    if (p) {
      if (p.length > 0) {
        setTransactionHashData(p);
        if (await p[0]) {
          setButtonClicked(false);
          dispatch(transactionStatusAction(1));
          alert.success("Token sent Successfully !  ");
          setInputAmount("");
          if (isAuthenticated) {
            dispatch(login());
          }
        } else {
          setButtonClicked(false);
          dispatch(transactionStatusAction(2));
          alert.error("Transaction Failed ");
        }
      }
    } else {
      setButtonClicked(false);
      dispatch(transactionStatusAction(2));
      alert.error("Transaction Failed ");
    }
  };

  const { user, error, isAuthenticated } = useSelector((state) => state.user);

  const connectWallet = (e) => {
    e.preventDefault();
    dispatch(login());
  };

  const inputMax = async () => {
    if (isAuthenticated && tokenData && tokenData.balance) {
      setInputAmount(tokenData.balance);
    }
  };
  const addSwap = async () => {
    Navigate("/swap");
  };

  if (window.ethereum) {
    // async function listenChainChanged() {
    window.ethereum.on("chainChanged", async function () {
      setTokenData(null);
      setInputAmount("");
      setInputAddress("");
      setButtonClicked(false);
    });
  }

  async function load() {
    if (isAuthenticated && tokenData) {
      const token = await getTokenDataWithBalance(
        tokenData.tokenAddress,
        props.network.wethAddress,
        props.network.chainId,
        user.account
      );
      setTokenData(token);
    }
    if (!isAuthenticated && tokenData) {
      const token = await getTokenData(
        tokenData.tokenAddress,
        props.network.wethAddress,
        props.network.chainId
      );
      setTokenData(token);
    }
  }

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    load();
  }, [
    dispatch,
    inputAddress,
    inputAmount,
    user,
    error,
    alert,
    isAuthenticated,
  ]);

  const sendModalParams = {
    modal: modal,
    togglemodal: togglemodal,
    sendInputToken: getInputToken,
  };
  const confirmTransactionModalParams = {
    title: "Confirm Send",
    tokenData: tokenData,
    amount: inputAmount,
    recipient: inputAddress,
    togglemodal: confirmTransactionModalToggle,
    isopen: isConfirmTransactionModal,
    func: send,
    isDisable: isButtonClicked,
    transactionHashData: transactionHashData,
    network: props.network,
    isSendTransaction: true,
  };
  return (
    <div className={styles.container}>
      <div className={styles.container_box}>
        <Nav />

        <div className={styles.input1}>
          <input
            className={styles.input1_}
            type="number"
            onChange={getInputAmount}
            value={inputAmount}
            placeholder="0.0"
          />
        </div>

        <div className={styles.select_box}>
          <p className={styles.select} onClick={togglemodal}>
            {tokenData ? (
              <span>
                {tokenData.symbol} <KeyboardArrowDownIcon />
              </span>
            ) : (
              <span>
                select Token <KeyboardArrowDownIcon />
              </span>
            )}
          </p>
        </div>

        <div className={styles.add_box}>
          <p className={styles.price} onClick={addSwap}>
            {" "}
            + add a swap
          </p>

          <p className={styles.rate} onClick={inputMax}>
            Input Max
          </p>
        </div>
        <div className={styles.recipient_box}>
          <div>
            <p className={styles.recipient}>Recipient</p>
            <input
              className={styles.input2}
              type="text"
              onChange={getInputAddress}
              value={inputAddress}
              placeholder="Wallet Address"
            />
          </div>
        </div>

        {!isAuthenticated ? (
          <WalletButton connectWallet={connectWallet} />
        ) : (
          [
            !tokenData ? (
              <SelectATokenButton />
            ) : !inputAmount ? (
              <AmountButton />
            ) : inputAmount <= 0 ? (
              <AmountButton />
            ) : !inputAddress ? (
              <DynamicButton
                text={"Enter recepient address"}
                isDisable={true}
              />
            ) : inputAmount > tokenData.balance ? (
              <InsufficientBalanceButton />
            ) : (
              <SendButton
                send={confirmTransactionModalToggle}
                isDisable={isButtonClicked}
              />
            ),
          ]
        )}

        <div className={styles.advance_details_accordion}></div>
      </div>
      <ModalTokenSelect modalParams={sendModalParams} network={props.network} />
      <ConfirmTransactionModal modalParams={confirmTransactionModalParams} />
    </div>
  );
};
export default SendPage;
