import React, { useEffect, useState } from "react";
import { Modal, ModalBody } from "reactstrap";

import { useSelector } from "react-redux";
import SmallLoader from "../../Loader/SmallLoader.js";
import styles from "./WaitingTransactionModal.module.css";

import * as chains from "../../../../constants/chains";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

function WaitingTransactionModal({ modalParams }) {
  const { transactionStatus } = useSelector((state) => state.transactionStatus);
  const [hashLink, setHashLink] = useState();
  async function link() {
    // console.log(modalParams);
    if ((await modalParams.transactionHashData.length) > 0) {
      if (chains.networks.includes(await modalParams.network.chainId)) {
        let p = await chains.getNetworkInfo.get(modalParams.network.chainId)
          .explorerUrl;
        p = p.toString();
        let url = p + `/tx/${await modalParams.transactionHashData[1]}`;
        setHashLink(url);
      }
    }
  }
  useEffect(() => {
    link();

    //console.log(props.network);
  }, [modalParams]);

  function SwapContent() {
    return (
      <div className={styles.tt2}>
        <span>{`Swapping ${Number(modalParams.amount0).toFixed(5)}  ${
          modalParams.token0Data ? modalParams.token0Data.symbol : null
        } for ${Number(modalParams.amount1).toFixed(5)} ${
          modalParams.token1Data ? modalParams.token1Data.symbol : null
        }`}</span>
      </div>
    );
  }
  function SendContent() {
    return (
      <div className={styles.tt2}>
        <span>{`Sending ${Number(modalParams.amount).toFixed(5)}  ${
          modalParams.tokenData ? modalParams.tokenData.symbol : null
        } to  ${
          modalParams.recipient
            ? modalParams.recipient.toString().substring(0, 5) +
              "..." +
              modalParams.recipient
                .toString()
                .substring(
                  modalParams.recipient.toString().length - 4,
                  modalParams.recipient.toString().length
                )
            : null
        }`}</span>
      </div>
    );
  }

  function AddLiquidityContent() {
    return (
      <div className={styles.tt2}>
        <span>{`Adding ${Number(modalParams.amount0).toFixed(5)}  ${
          modalParams.token0Data ? modalParams.token0Data.symbol : null
        } and ${Number(modalParams.amount1).toFixed(5)} ${
          modalParams.token1Data ? modalParams.token1Data.symbol : null
        }`}</span>
      </div>
    );
  }

  function RemoveLiquidityContent() {
    return (
      <div className={styles.tt2}>
        <span>{`Removing ${Number(modalParams.lpBurningAmount).toFixed(5)}  ${
          modalParams.lpTokenSymbol ? modalParams.lpTokenSymbol : null
        } for ${Number(modalParams.amount0).toFixed(5)} ${
          modalParams.token0Data ? modalParams.token0Data.symbol : null
        } and ${Number(modalParams.amount1).toFixed(5)} ${
          modalParams.token1Data ? modalParams.token1Data.symbol : null
        }`}</span>
      </div>
    );
  }
  return (
    <Modal
      className={styles.customClass}
      isOpen={modalParams.isopen ? modalParams.isopen : null}
    >
      <ModalBody className={styles.customBody}>
        <div className={styles.modalbody}>
          <div style={{ marginTop: -10, marginBottom: 20 }}>
            <span style={{ fontSize: "2.4vw" }} className={styles.leftItem}>
              {transactionStatus &&
              transactionStatus.transactionStatus === 1 ? (
                <span style={{ color: "rgb(0, 81, 128)" }}>
                  {" "}
                  <bold>Transaction Confirmed</bold>
                </span>
              ) : (
                [
                  transactionStatus &&
                  transactionStatus.transactionStatus === 2 ? (
                    <span style={{ color: "rgba(255, 111, 0, 0.837)" }}>
                      {" "}
                      <bold> Transaction Failed</bold>
                    </span>
                  ) : null,
                ]
              )}
            </span>
            <span
              style={{ fontSize: "x-large", cursor: "pointer" }}
              className={styles.rightItem}
              onClick={modalParams.togglemodal ? modalParams.togglemodal : null}
            >
              &times;
            </span>
          </div>

          {transactionStatus && transactionStatus.transactionStatus === 1 ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p
                className={styles.tt0}
                style={{ color: "rgb(0, 81, 128)", fontSize: "2vw" }}
              >
                <div>
                  {" "}
                  <DoneAllIcon />{" "}
                </div>
              </p>
              <div className={styles.tt1}>
                <span style={{ color: "rgb(0, 81, 128)" }}>
                  <strong>Transaction Confirmed</strong>
                </span>
              </div>
              <div className={styles.tt3}>
                <span
                  style={{ color: "rgb(0, 81, 128)", cursor: "pointer" }}
                  onClick={async () => {
                    if ((await modalParams.transactionHashData.length) > 0) {
                      window.open(hashLink, "_blank", "noopener,noreferrer");
                    }
                  }}
                >
                  <strong>View on block explorer</strong>
                </span>
              </div>
            </div>
          ) : (
            [
              transactionStatus && transactionStatus.transactionStatus === 2 ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <p
                    className={styles.tt0}
                    style={{ color: "rgba(255, 111, 0, 0.837)" }}
                  >
                    <HighlightOffIcon />
                  </p>
                  <div className={styles.tt1}>
                    <span style={{ color: "rgba(255, 111, 0, 0.837)" }}>
                      <strong>Transaction Failed</strong>
                    </span>
                  </div>
                  <div className={styles.tt3}>
                    {modalParams.transactionHashData.length > 0 ? (
                      <span
                        style={{ color: "rgb(0, 81, 128)", cursor: "pointer" }}
                        onClick={async () => {
                          if (
                            (await modalParams.transactionHashData.length) > 0
                          ) {
                            window.open(
                              hashLink,
                              "_blank",
                              "noopener,noreferrer"
                            );
                          }
                        }}
                      >
                        <strong>View on block explorer</strong>
                      </span>
                    ) : (
                      <span>Transaction Rejected</span>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <p>
                    {" "}
                    <SmallLoader />
                  </p>
                  <div className={styles.tt1}>
                    <span style={{ color: "orange" }}>
                      Waiting For Confirmation
                    </span>
                  </div>
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
                  <div className={styles.tt3}>
                    <span> Confirm this transaction in your wallet</span>
                  </div>
                </div>
              ),
            ]
          )}
        </div>
      </ModalBody>
    </Modal>
  );
}
export default WaitingTransactionModal;
