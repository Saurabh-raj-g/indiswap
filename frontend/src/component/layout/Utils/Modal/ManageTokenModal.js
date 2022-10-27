import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import TokenList from "../../../../TokenList";
import {
  getTokenDataWithBalance,
  getpairContract,
  getDataForPairs,
} from "../../../../actions/contractFunction";
import {
  myPooledAssetsAction,
  PoolAssetsAction,
} from "../../../../actions/contractAction.js";
import { useDispatch, useSelector } from "react-redux";
// import { clearErrors } from "../../../../actions/userAction";
//import { useAlert } from "react-alert";

import * as chains from "../../../../constants/chains.js";

import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import styles from "./ManageTokenModal.module.css";

const ManageTokenModal = ({ params, network }) => {
  const dispatch = useDispatch();
  const [address, setAddress] = useState();
  const [tokenData, setTokenData] = useState();
  const [pairData, setPairData] = useState();
  //const dispatch = useDispatch();
  // const alert = useAlert();

  //const { chainChanged } = useSelector((state) => state.chainChanged);
  const { user, error, isAuthenticated } = useSelector((state) => state.user);

  const { poolAssets } = useSelector((state) => state.poolAssets);

  const toggleThisModal = async () => {
    params.toggleManageTokenModal();
    setAddress();
    setTokenData();
  };
  // async function importToken() {
  //   if (tokenData) {
  //     let p = JSON.parse(localStorage.getItem("tokens"));

  //     // console.log(typeof p);
  //     //final array of token
  //     let fina = [];
  //     if (p) {
  //       let arr = Object.values(p);

  //       for (let i = 0; i < arr.length; i++) {
  //         if (
  //           (await arr[i].tokenAddress.toString().toLowerCase()) ===
  //           (await tokenData.tokenAddress.toString().toLowerCase())
  //         ) {
  //           alert("token already imported");
  //           return;
  //         } else {
  //           fina.push(arr[i]);
  //         }
  //       }

  //       for (let i = 0; i < TokenList.length; i++) {
  //         if (
  //           (await TokenList[i].toString().toLowerCase()) ===
  //           (await tokenData.tokenAddress.toString().toLowerCase())
  //         ) {
  //           alert("token already exists");
  //           return;
  //         }
  //       }
  //       fina.push(tokenData);
  //       // localStorage.setItem("tokens", JSON.stringify(fina));
  //       // params.toggleManageTokenModal();
  //       // setTokenData();
  //       // setAddress();
  //       //console.log("p");
  //       //fina = Object.assign(p, tokenData);
  //       // console.log(fina);
  //     } else if (!p) {
  //       for (let i = 0; i < TokenList.length; i++) {
  //         if (
  //           (await TokenList[i].toString().toLowerCase()) ===
  //           (await tokenData.tokenAddress.toString().toLowerCase())
  //         ) {
  //           alert("token already exists");
  //           return;
  //         }
  //       }
  //       fina.push(tokenData);
  //     }

  //     localStorage.setItem("tokens", JSON.stringify(fina));
  //     params.toggleManageTokenModal();
  //     setTokenData();
  //     setAddress();
  //   }
  // }

  async function importToken() {
    if (isAuthenticated) {
      if (tokenData) {
        if (network) {
          if (chains.networks.includes(network.chainId)) {
            let p = await JSON.parse(localStorage.getItem("tokens"));

            // console.log(typeof p);
            //final array of token
            //let fina = {};
            if (p) {
              // let arr = Object.values(p);
              if (p[network.chainId]) {
                let data = p[network.chainId];
                for (let i = 0; i < data.length; i++) {
                  if (
                    (await data[i].tokenAddress.toString().toLowerCase()) ===
                    (await tokenData.tokenAddress.toString().toLowerCase())
                  ) {
                    alert("token already imported");
                    return;
                  }
                }
                for (
                  let i = 0;
                  i < (await TokenList.get(network.chainId).length);
                  i++
                ) {
                  if (
                    (await TokenList.get(network.chainId)
                      [i].toString()
                      .toLowerCase()) ===
                    (await tokenData.tokenAddress.toString().toLowerCase())
                  ) {
                    alert("token already exists");
                    return;
                  }
                }
                let mk = {
                  isAddedByMe: true,
                };
                await Object.assign(tokenData, mk);

                await data.push(tokenData);
                p[network.chainId] = data;
              } else {
                for (
                  let i = 0;
                  i < (await TokenList.get(network.chainId).length);
                  i++
                ) {
                  if (
                    (await TokenList.get(network.chainId)
                      [i].toString()
                      .toLowerCase()) ===
                    (await tokenData.tokenAddress.toString().toLowerCase())
                  ) {
                    alert("token already exists");
                    return;
                  }
                }
                let mk = {
                  isAddedByMe: true,
                };
                await Object.assign(tokenData, mk);

                let data = {};
                data[network.chainId] = [tokenData];
                await Object.assign(p, data);
              }
            } else if (!p) {
              for (
                let i = 0;
                i < (await TokenList.get(network.chainId).length);
                i++
              ) {
                if (
                  (await TokenList.get(network.chainId)
                    [i].toString()
                    .toLowerCase()) ===
                  (await tokenData.tokenAddress.toString().toLowerCase())
                ) {
                  alert("token already exists");
                  return;
                }
              }
              let mk = {
                isAddedByMe: true,
              };
              await Object.assign(tokenData, mk);

              let data = {};
              data[network.chainId] = [tokenData];
              // await Object.assign(p, data);
              p = data;
              //fina.push(tokenData);
            }

            localStorage.setItem("tokens", JSON.stringify(p));
            params.toggleManageTokenModal();
            setTokenData();
            setAddress();
            await params.list();
          } else {
            alert("Connect to Goerli or smart chain testnet network");
            return;
          }
        }
      }
    } else {
      alert("Connect Wallet first");
      return;
    }
  }

  async function importPairToken() {
    if (isAuthenticated) {
      if (pairData) {
        if (network) {
          if (chains.networks.includes(network.chainId)) {
            let p = await JSON.parse(localStorage.getItem("pairTokens"));

            if (p) {
              // let arr = Object.values(p);
              if (p[network.chainId]) {
                let data = p[network.chainId];
                for (let i = 0; i < data.length; i++) {
                  if (
                    (await data[i].pairAddress.toString().toLowerCase()) ===
                    (await pairData.pairAddress.toString().toLowerCase())
                  ) {
                    alert("pair already imported");
                    return;
                  }
                }
                if (poolAssets) {
                  for (let i = 0; i < Object.values(poolAssets).length; i++) {
                    if (
                      (await Object.values(poolAssets)
                        [i].pairAddress.toString()
                        .toLowerCase()) ===
                      (await pairData.pairAddress.toString().toLowerCase())
                    ) {
                      alert("pair already exists");
                      return;
                    }
                  }
                }

                let mk = {
                  isMyAssets: true,
                };

                await Object.assign(pairData, mk);

                await data.push(pairData);
                p[network.chainId] = data;
              } else {
                if (poolAssets) {
                  for (let i = 0; i < Object.values(poolAssets).length; i++) {
                    if (
                      (await Object.values(poolAssets)
                        [i].pairAddress.toString()
                        .toLowerCase()) ===
                      (await pairData.pairAddress.toString().toLowerCase())
                    ) {
                      alert("pair already exists");
                      return;
                    }
                  }
                }
                let mk = {
                  isMyAssets: true,
                };

                await Object.assign(pairData, mk);

                let data = {};
                data[network.chainId] = [pairData];
                await Object.assign(p, data);
              }
            } else if (!p) {
              if (poolAssets) {
                for (let i = 0; i < Object.values(poolAssets).length; i++) {
                  if (
                    (await Object.values(poolAssets)
                      [i].pairAddress.toString()
                      .toLowerCase()) ===
                    (await pairData.pairAddress.toString().toLowerCase())
                  ) {
                    alert("token already exists");
                    return;
                  }
                }
              }
              let mk = {
                isMyAssets: true,
              };

              await Object.assign(pairData, mk);

              let data = {};
              data[network.chainId] = [pairData];
              // await Object.assign(p, data);
              p = data;
              //fina.push(tokenData);
            }

            localStorage.setItem("pairTokens", JSON.stringify(p));
            params.toggleManageTokenModal();
            setPairData();
            setAddress();

            dispatch(
              myPooledAssetsAction(
                user,
                network.factory,
                network.wethAddress,
                network.chainId
              )
            );
            dispatch(
              PoolAssetsAction(
                isAuthenticated,
                user,
                network.factory,
                network.wethAddress,
                network.chainId
              )
            );
          } else {
            alert("Connect to Goerli or smart chain testnet network");
            return;
          }
        }
      }
    } else {
      alert("Connect Wallet first");
      return;
    }
  }

  async function load() {
    if (network) {
      if (chains.networks.includes(network.chainId)) {
        if (address) {
          // console.log(params.isTokenAddress);
          if (params.isTokenAddress === undefined) {
            //await getpairContract(address)
            if (isAuthenticated) {
              const pairContract = await getpairContract(address);
              if (pairContract) {
                const data = await getDataForPairs(
                  user.account,
                  address,
                  network.factory,
                  network.wethAddress,
                  network.chainId
                );

                if (data) {
                  setPairData(data[0]);
                }
              } else {
                alert("Pair doesn't exists");
                return;
              }
            } else {
              alert("Please Connect Wallet First");
              return;
            }
          } else {
            if (isAuthenticated) {
              const data = await getTokenDataWithBalance(
                address,
                network.wethAddress,
                network.chainId,
                user.account
              );
              if (data) {
                setTokenData(data);
              }
            } else {
              alert("Please Connect Wallet First");
              return;
            }
          }
        }
      } else {
        alert("Connect to Goerli or smart chain testnet network");
        return;
      }
    }
  }
  useEffect(() => {
    load();
  }, [address]);
  return (
    <Modal
      isOpen={params.manageTokenModal ? params.manageTokenModal : false}
      toggle={toggleThisModal}
    >
      <ModalHeader toggle={toggleThisModal}>
        <span>Import Token </span>
        <span className={styles.iButton}>
          <HelpOutlineIcon />
        </span>
      </ModalHeader>
      <ModalBody>
        <input
          type="text"
          className={styles.input}
          onChange={(el) => setAddress(el.target.value)}
          placeholder="paste address"
        />

        <hr />

        <div className={styles.box_overflow}>
          {tokenData ? (
            <div className={`${styles.box} `}>
              <div className={styles.token_box}>
                <p className={styles.token_box_left}>
                  {/* <img
            className={styles.token_logo}
            src={`https://assets-cdn.trustwallet.com/blockchains/ethereum/assets/${token.tokenAddress.toString()}/logo.png`}
            //src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${token.tokenAddress.toString()}/logo.png`}
            alt={token ? token.symbol : null}
          /> */}
                </p>
                <p className={styles.token_box_right}>
                  {tokenData ? tokenData.symbol : null}
                </p>
              </div>
              <p
                className={`${styles.box_right} ${styles.join1} `}
                onClick={importToken}
              >
                import
              </p>
            </div>
          ) : null}
          {pairData ? (
            <div className={`${styles.box} `}>
              <div className={styles.token_box}>
                <p className={styles.token_box_left}>
                  {/* <img
            className={styles.token_logo}
            src={`https://assets-cdn.trustwallet.com/blockchains/ethereum/assets/${token.tokenAddress.toString()}/logo.png`}
            //src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${token.tokenAddress.toString()}/logo.png`}
            alt={token ? token.symbol : null}
          /> */}
                </p>
                <p className={styles.token_box_right}>
                  <span>
                    {pairData.token0Data ? pairData.token0Data.symbol : null}
                  </span>
                  <span>{"/"}</span>
                  <span>
                    {pairData.token1Data ? pairData.token1Data.symbol : null}
                  </span>
                </p>
              </div>
              <p
                className={`${styles.box_right} ${styles.join1} `}
                onClick={importPairToken}
              >
                import
              </p>
            </div>
          ) : null}
        </div>
      </ModalBody>
    </Modal>
  );
};
export default ManageTokenModal;
