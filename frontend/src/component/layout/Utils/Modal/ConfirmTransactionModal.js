import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

import { useDispatch, useSelector } from "react-redux";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import AddIcon from "@mui/icons-material/Add";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";

import WaitingTransactionModal from "./WaitingTransactionModal.js";
import DynamicButton from "../Button/DynamicButton";
import styles from "./ConfirmTransactionModal.module.css";

import { transactionStatusAction } from "../../../../actions/utilsAction";

function ConfirmTransactionModal({ modalParams }) {
  const dispatch = useDispatch();
  //const [isSwapDisabled, setIsSwapDisabled] = useState();

  const [isWaitingTransactionModal, setIsWaitingTransactionModal] =
    useState(false);

  const { transactionStatus } = useSelector((state) => state.transactionStatus);
  const { slippage } = useSelector((state) => state.slippage);

  const WaitingTransactionModalToggle = async () => {
    setIsWaitingTransactionModal(!isWaitingTransactionModal);
    if (transactionStatus) {
      if (
        transactionStatus.transactionStatus === 1 ||
        transactionStatus.transactionStatus === 2
      ) {
        dispatch(transactionStatusAction(0));
      }
    }
    modalParams ? await modalParams.togglemodal() : null;
    //setIsTransactionInitiated(false);
  };
  async function swap() {
    setIsWaitingTransactionModal(!isWaitingTransactionModal);
    // await WaitingTransactionModalToggle();

    modalParams ? await modalParams.func() : null;
  }
  async function send() {
    setIsWaitingTransactionModal(!isWaitingTransactionModal);

    modalParams ? await modalParams.func() : null;
  }
  async function addLiquidity() {
    setIsWaitingTransactionModal(!isWaitingTransactionModal);

    modalParams ? await modalParams.func() : null;
  }

  async function removeLiquidity() {
    setIsWaitingTransactionModal(!isWaitingTransactionModal);

    modalParams ? await modalParams.func() : null;
  }

  function minimumReceived() {
    if (slippage) {
      let a = 1 - slippage.slippage * 0.01;
      return modalParams.amount1
        ? (Number(modalParams.amount1) * a).toFixed(6)
        : null;
    }
  }
  function minimumAddAmounts() {
    if (slippage) {
      let a = 1 - slippage.slippage * 0.01;
      return [
        modalParams.amount0
          ? (Number(modalParams.amount0) * a).toFixed(6)
          : null,
        modalParams.amount1
          ? (Number(modalParams.amount1) * a).toFixed(6)
          : null,
      ];
    }
  }

  function minimumRecievedAmountsByBurning() {
    if (slippage) {
      let a = 1 - slippage.slippage * 0.01;
      return [
        modalParams.amount0
          ? (Number(modalParams.amount0) * a).toFixed(6)
          : null,
        modalParams.amount1
          ? (Number(modalParams.amount1) * a).toFixed(6)
          : null,
      ];
    }
  }
  useEffect(() => {
    //console.log(transactionStatus.transactionStatus === 2);
    // if (modalParams.isDisable) {
    //   setIsSwapDisabled(modalParams.isDisable());
    // }

    if (
      (!isWaitingTransactionModal &&
        transactionStatus &&
        transactionStatus.transactionStatus === 2) ||
      (!isWaitingTransactionModal &&
        transactionStatus &&
        transactionStatus.transactionStatus === 1)
    ) {
      console.log(isWaitingTransactionModal);
      dispatch(transactionStatusAction(0));
    }
  }, [modalParams, transactionStatus]);

  function SwapContent() {
    return (
      <div className={styles.flexBox}>
        <div>
          <span className={styles.leftItem}>
            {" "}
            {modalParams.amount0
              ? Number(modalParams.amount0).toFixed(10)
              : null}
          </span>
          <span className={styles.rightItem}>
            {modalParams.token0Data ? modalParams.token0Data.symbol : null}
          </span>
        </div>
        <div className={styles.ArrowDownwardIcon}>
          <span>
            <ArrowDownwardIcon />
          </span>
        </div>
        <div>
          <span className={styles.leftItem}>
            {" "}
            {modalParams.amount1
              ? Number(modalParams.amount1).toFixed(10)
              : null}
          </span>
          <span className={styles.rightItem}>
            {modalParams.token1Data ? modalParams.token1Data.symbol : null}
          </span>
        </div>
        <div className={styles.text}>
          {`Output is estimated. You will receive at least ${minimumReceived()} ${
            modalParams.token1Data ? modalParams.token1Data.symbol : null
          } or transaction will revert.`}
        </div>

        <div className={styles.infobox}>
          <p>
            <span className={styles.leftItem}>Price</span>
            <span className={styles.rightItem}>
              {Number(modalParams.price).toFixed(8)}{" "}
              {modalParams.token0Data ? modalParams.token0Data.symbol : null}
              {"/"}
              {modalParams.token1Data ? modalParams.token1Data.symbol : null}
            </span>
          </p>
          <p>
            <span className={styles.leftItem}>
              <span>Minimum sent</span>
              <span>
                <HelpOutlineIcon />
              </span>
            </span>
            <span className={styles.rightItem}>
              {minimumReceived()}{" "}
              {modalParams.token1Data ? modalParams.token1Data.symbol : null}
            </span>
          </p>
          <p>
            <span className={styles.leftItem}>
              <span>Price Impact</span>
              <span>
                <HelpOutlineIcon />
              </span>
            </span>
            <span className={styles.rightItem}>
              {modalParams.priceImpact ? (
                Number(modalParams.priceImpact).toFixed(7) > 0.01 ? (
                  <span>{Number(modalParams.priceImpact).toFixed(7)}%</span>
                ) : (
                  <span>{"<"} 0.01%</span>
                )
              ) : null}
            </span>
          </p>
          <p>
            <span className={styles.leftItem}>
              <span>Liquidity Provider Fee</span>
              <span>
                <HelpOutlineIcon />
              </span>
            </span>
            <span className={styles.rightItem}>
              {(Number(modalParams.amount0) * 0.0003).toFixed(7)}{" "}
              {modalParams.token0Data ? modalParams.token0Data.symbol : null}
            </span>
          </p>
          <DynamicButton
            text={modalParams.title}
            isDisable={modalParams.isDisable} //{isSwapDisabled}
            func={swap}
            classN={styles.swap}
          />
        </div>
      </div>
    );
  }
  function SendContent() {
    return (
      <div className={styles.flexBox}>
        <div>
          <span className={styles.leftItem}>
            {" "}
            {modalParams.amount ? Number(modalParams.amount).toFixed(10) : null}
          </span>
          <span className={styles.rightItem}>
            {modalParams.tokenData ? modalParams.tokenData.symbol : null}
          </span>
        </div>
        <div>
          <span className={styles.leftItem}> {"Recipient : "}</span>
          <span className={styles.rightItem}>
            {modalParams.recipient
              ? modalParams.recipient.toString().substring(0, 5) +
                "..." +
                modalParams.recipient
                  .toString()
                  .substring(
                    modalParams.recipient.toString().length - 4,
                    modalParams.recipient.toString().length
                  )
              : null}
          </span>
        </div>
        <div className={styles.infobox}>
          <DynamicButton
            text={modalParams.title}
            isDisable={modalParams.isDisable}
            func={send}
            classN={styles.swap}
          />
        </div>
      </div>
    );
  }

  function AddLiquidityContent() {
    return (
      <div className={styles.flexBox}>
        <div>
          <span className={styles.leftItem}>
            {" "}
            {modalParams.amount0
              ? Number(modalParams.amount0).toFixed(10)
              : null}
          </span>
          <span className={styles.rightItem}>
            {modalParams.token0Data ? modalParams.token0Data.symbol : null}
          </span>
        </div>
        <div className={styles.ArrowDownwardIcon}>
          <span>
            {" "}
            <AddIcon />{" "}
          </span>
        </div>
        <div>
          <span className={styles.leftItem}>
            {" "}
            {modalParams.amount1
              ? Number(modalParams.amount1).toFixed(10)
              : null}
          </span>
          <span className={styles.rightItem}>
            {modalParams.token1Data ? modalParams.token1Data.symbol : null}
          </span>
        </div>
        <div className={styles.text}>
          {`Input is estimated. You will add at least ${
            minimumAddAmounts()[0]
          } ${
            modalParams.token0Data ? modalParams.token0Data.symbol : null
          } and ${minimumAddAmounts()[1]} ${
            modalParams.token1Data ? modalParams.token1Data.symbol : null
          } or transaction will revert.`}
        </div>

        <div className={styles.infobox}>
          <p>
            <span className={styles.leftItem}>
              <span>Rate</span>
              <span>
                <HelpOutlineIcon />
              </span>
            </span>
            <span className={styles.rightItem}>
              {modalParams.poolPrice && modalParams.poolPrice.length > 0
                ? Number(modalParams.poolPrice[1]).toFixed(8)
                : null}{" "}
              {modalParams.token0Data ? modalParams.token0Data.symbol : null}
              {"/"}
              {modalParams.token1Data ? modalParams.token1Data.symbol : null}
            </span>
          </p>
          <p>
            <span className={styles.leftItem}>
              <span>Rate</span>
              <span>
                <HelpOutlineIcon />
              </span>
            </span>
            <span className={styles.rightItem}>
              {modalParams.poolPrice && modalParams.poolPrice.length > 0
                ? Number(modalParams.poolPrice[0]).toFixed(8)
                : null}{" "}
              {modalParams.token1Data ? modalParams.token1Data.symbol : null}
              {"/"}
              {modalParams.token0Data ? modalParams.token0Data.symbol : null}
            </span>
          </p>
          <p>
            <span className={styles.leftItem}>
              <span>Share of Pool</span>
              <span>
                <HelpOutlineIcon />
              </span>
            </span>
            <span className={styles.rightItem}>
              {modalParams.poolPrice && modalParams.poolPrice.length > 2 ? (
                Number(modalParams.poolPrice[2]).toFixed(7) > 0.01 ? (
                  <span>{Number(modalParams.poolPrice[2]).toFixed(7)}%</span>
                ) : (
                  <span>{"<"} 0.01%</span>
                )
              ) : null}
            </span>
          </p>

          <DynamicButton
            text={modalParams.title}
            isDisable={modalParams.isDisable} //{isSwapDisabled}
            func={addLiquidity}
            classN={styles.swap}
          />
        </div>
      </div>
    );
  }

  function RemoveLiquidityContent() {
    return (
      <div className={styles.flexBox}>
        <div>
          <span className={styles.leftItem}>Burning lp:</span>
          <span className={styles.rightItem}>{null}</span>
        </div>
        <div>
          <span className={styles.leftItem}>
            {" "}
            {modalParams.lpBurningAmount
              ? Number(modalParams.lpBurningAmount).toFixed(10)
              : null}
          </span>
          <span className={styles.rightItem}>
            {modalParams.lpTokenSymbol ? modalParams.lpTokenSymbol : null}
          </span>
        </div>
        <div>
          <span className={styles.leftItem}>estimated output:</span>
          <span className={styles.rightItem}>{null}</span>
        </div>
        <div>
          <span className={styles.leftItem}>
            {" "}
            {modalParams.amount0
              ? Number(modalParams.amount0).toFixed(10)
              : null}
          </span>
          <span className={styles.rightItem}>
            {modalParams.token0Data ? modalParams.token0Data.symbol : null}
          </span>
        </div>
        <div className={styles.ArrowDownwardIcon}>
          <span>
            <ArrowDownwardIcon />
          </span>
        </div>
        <div>
          <span className={styles.leftItem}>estimated output:</span>
          <span className={styles.rightItem}>{null}</span>
        </div>
        <div>
          <span className={styles.leftItem}>
            {" "}
            {modalParams.amount1
              ? Number(modalParams.amount1).toFixed(10)
              : null}
          </span>
          <span className={styles.rightItem}>
            {modalParams.token1Data ? modalParams.token1Data.symbol : null}
          </span>
        </div>
        <div className={styles.text}>
          {`Output is estimated. You will receive at least ${
            minimumRecievedAmountsByBurning()[0]
          } ${
            modalParams.token0Data ? modalParams.token0Data.symbol : null
          } and ${minimumRecievedAmountsByBurning()[1]} ${
            modalParams.token1Data ? modalParams.token1Data.symbol : null
          } or transaction will revert.`}
        </div>

        <div className={styles.infobox}>
          <p>
            <span className={styles.leftItem}>
              <span>Burn</span>
              <span>
                {" "}
                <HelpOutlineIcon />
              </span>
            </span>
            <span className={styles.rightItem}>
              {Number(modalParams.lpBurningAmount).toFixed(10)}{" "}
              {modalParams.lpTokenSymbol ? modalParams.lpTokenSymbol : null}
            </span>
          </p>
          <p>
            <span className={styles.leftItem}>
              <span>Minimum sent</span>
              <span>
                <HelpOutlineIcon />
              </span>
            </span>
            <span className={styles.rightItem}>
              {minimumRecievedAmountsByBurning()[0]}{" "}
              {modalParams.token0Data ? modalParams.token0Data.symbol : null}
            </span>
          </p>
          <p>
            <span className={styles.leftItem}>
              <span>Minimum sent</span>
              <span>
                <HelpOutlineIcon />
              </span>
            </span>
            <span className={styles.rightItem}>
              {minimumRecievedAmountsByBurning()[1]}{" "}
              {modalParams.token1Data ? modalParams.token1Data.symbol : null}
            </span>
          </p>
          <DynamicButton
            text={modalParams.title}
            isDisable={modalParams.isDisable} //{isSwapDisabled}
            func={removeLiquidity}
            classN={styles.swap}
          />
        </div>
      </div>
    );
  }

  const forSwapWaitingTransactionModalParams = {
    togglemodal: WaitingTransactionModalToggle,
    isopen: isWaitingTransactionModal,
    amount0: modalParams.amount0 ? modalParams.amount0 : null,
    amount1: modalParams.amount1 ? modalParams.amount1 : null,
    token0Data: modalParams.token0Data ? modalParams.token0Data : null,
    token1Data: modalParams.token1Data ? modalParams.token1Data : null,
    isTransactionConfirmed: modalParams.isDisable, //isSwapDisabled,
    transactionHashData: modalParams.transactionHashData,
    network: modalParams.network,
    isSwapTransaction: modalParams.isSwapTransaction,
  };

  const forSendWaitingTransactionModalParams = {
    togglemodal: WaitingTransactionModalToggle,
    isopen: isWaitingTransactionModal,
    amount: modalParams.amount ? modalParams.amount : null,
    tokenData: modalParams.tokenData ? modalParams.tokenData : null,
    recipient: modalParams.recipient ? modalParams.recipient : null,
    isTransactionConfirmed: modalParams.isDisable, //isSwapDisabled,
    transactionHashData: modalParams.transactionHashData,
    network: modalParams.network,
    isSendTransaction: modalParams.isSendTransaction,
  };
  const forAddLiquidityWaitingTransactionModalParams = {
    togglemodal: WaitingTransactionModalToggle,
    isopen: isWaitingTransactionModal,
    amount0: modalParams.amount0 ? modalParams.amount0 : null,
    amount1: modalParams.amount1 ? modalParams.amount1 : null,
    token0Data: modalParams.token0Data ? modalParams.token0Data : null,
    token1Data: modalParams.token1Data ? modalParams.token1Data : null,
    isTransactionConfirmed: modalParams.isDisable, //isSwapDisabled,
    transactionHashData: modalParams.transactionHashData,
    network: modalParams.network,
    isAddLiquidityTransaction: modalParams.isAddLiquidityTransaction,
  };
  const forRemoveLiquidityWaitingTransactionModalParams = {
    togglemodal: WaitingTransactionModalToggle,
    isopen: isWaitingTransactionModal,
    lpTokenSymbol: modalParams.lpTokenSymbol ? modalParams.lpTokenSymbol : null,
    lpBurningAmount: modalParams.lpBurningAmount
      ? modalParams.lpBurningAmount
      : null,
    amount0: modalParams.amount0 ? modalParams.amount0 : null,
    amount1: modalParams.amount1 ? modalParams.amount1 : null,
    token0Data: modalParams.token0Data ? modalParams.token0Data : null,
    token1Data: modalParams.token1Data ? modalParams.token1Data : null,
    isTransactionConfirmed: modalParams.isDisable, //isSwapDisabled,
    transactionHashData: modalParams.transactionHashData,
    network: modalParams.network,
    isRemoveTransaction: modalParams.isRemoveTransaction,
  };

  return (
    <Modal
      className={styles.customClass}
      isOpen={modalParams.isopen ? modalParams.isopen : null}
      toggle={modalParams.togglemodal ? modalParams.togglemodal : null}
    >
      <ModalBody className={styles.customBody}>
        {/*  --------- Modal Header ---------- */}
        <div className={styles.modalbody}>
          <div style={{ marginTop: -10, marginBottom: 20 }}>
            <span style={{ fontSize: "xx-large" }} className={styles.leftItem}>
              {modalParams.title ? modalParams.title : null}
            </span>
            <span
              style={{ fontSize: "xx-large", cursor: "pointer" }}
              className={styles.rightItem}
              onClick={modalParams.togglemodal ? modalParams.togglemodal : null}
            >
              &times;
            </span>
          </div>
          <div>
            <hr
              style={{
                margin: "-10px 0px 0px 0px",
                padding: "-10px 0px 0px 0px",
              }}
            ></hr>
          </div>

          {/* ------ Modal body ---------  */}
          {modalParams.isSwapTransaction ? (
            <SwapContent />
          ) : (
            [
              modalParams.isSendTransaction ? (
                <SendContent />
              ) : modalParams.isAddLiquidityTransaction ? (
                <AddLiquidityContent />
              ) : modalParams.isRemoveTransaction ? (
                <RemoveLiquidityContent />
              ) : null,
            ]
          )}
        </div>
      </ModalBody>

      <WaitingTransactionModal
        modalParams={
          modalParams.isSwapTransaction
            ? forSwapWaitingTransactionModalParams
            : modalParams.isSendTransaction
            ? forSendWaitingTransactionModalParams
            : modalParams.isAddLiquidityTransaction
            ? forAddLiquidityWaitingTransactionModalParams
            : modalParams.isRemoveTransaction
            ? forRemoveLiquidityWaitingTransactionModalParams
            : null
        }
      />
    </Modal>
  );
}
export default ConfirmTransactionModal;
