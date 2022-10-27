// -----------------    optimal ------------------------

import React, { useState, useEffect } from "react";
//import Web3 from "web3";
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
} from "reactstrap";

import ModalTokenSelect from "../layout/Utils/Modal/ModalTokenSelect.js";
import ConfirmTransactionModal from "../layout/Utils/Modal/ConfirmTransactionModal.js";
import SwapButton from "../layout/Utils/Button/SwapButton.js";
import Nav from "../layout/Utils/Nav/Nav.js";
import SwapBoxFrom from "../layout/Utils/SwapBox/SwapBoxFrom";
import SwapBoxTo from "../layout/Utils/SwapBox/SwapBoxTo";
import SwapBoxToggler from "../layout/Utils/SwapBox/SwapBoxToggler";

import {
  isTokenToModalOpen,
  isTokenFromModalOpen,
  transactionStatusAction,
} from "../../actions/utilsAction";
import {
  myPooledAssetsAction,
  PoolAssetsAction,
} from "../../actions/contractAction.js";
import {
  swap, //
  getTokenDataWithBalance, //
  checkForPairExists,
  getArrayOfPoolPrice,
  getArrayOfPriceAtPaid,
  getAmountOut,
  getAmountIn,
  getTokenData, //
  SmartRoutes,
  fetchReserves,
  approveToken, //
  isTokenAlreadyApproved,
} from "../../actions/contractFunction";

import styles from "./SwapPage.module.css";
import InfoIcon from "@material-ui/icons/Info";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import ShareIcon from "@material-ui/icons/Share";

import { useDispatch, useSelector } from "react-redux";
import { clearErrors, login } from "../../actions/userAction";
import { useAlert } from "react-alert";
import DynamicButton from "../layout/Utils/Button/DynamicButton";

const SwapPage = (props) => {
  // const web3 = new Web3(window.ethereum);
  const [modal, setModal] = useState(false);
  const [isConfirmTransactionModal, setIsConfirmTransactionModal] =
    useState(false);
  // 0 -> false , 1 -> approving , 2 -> approved
  const [isToken0Approved, setIsToken0Approved] = useState(0);
  const [isAlreadyTokenApproved, setAlreadyTokenApproved] = useState(false);
  const [isSwapButtonClicked, setSwapButtonClicked] = useState(false);

  const [reservesDetails, setReservesDetails] = useState([]);

  const [smartRouteData, setSmartRouteData] = useState([]);
  const [smartRoute, setSmartRoute] = useState([]);

  const [token0Data, setToken0Data] = useState(null);
  const [token1Data, setToken1Data] = useState(null);

  const [priceImpact, setPriceImpact] = useState(null);
  const [price, setPrice] = useState(null);

  const [input0, setInput0] = useState();
  const [input1, setInput1] = useState();

  const [transactionHashData, setTransactionHashData] = useState([]);

  const dispatch = useDispatch();
  const alert = useAlert();

  const { user, error, isAuthenticated } = useSelector((state) => state.user);
  const { poolAssets } = useSelector((state) => state.poolAssets);
  //   const { chainChanged } = useSelector((state) => state.chainChanged);
  //   const { weth } = useSelector((state) => state.weth);
  const { slippage } = useSelector((state) => state.slippage);
  const { deadline } = useSelector((state) => state.deadline);

  const togglemodal = () => {
    setModal(!modal);
  };
  const confirmTransactionModalToggle = () => {
    setIsConfirmTransactionModal(!isConfirmTransactionModal);
  };
  const connectWallet = (e) => {
    e.preventDefault();
    dispatch(login());
  };

  const getInput0 = async (e) => {
    setInput0(e);
  };
  const getInput1 = async (e) => {
    setInput1(e);
  };

  const getSmartRoute = async (arr) => {
    setSmartRoute(arr);
  };

  const tokenFrom = async (tokenAddress) => {
    if (isAuthenticated) {
      const token = await getTokenDataWithBalance(
        tokenAddress,
        props.network.wethAddress,
        props.network.chainId,
        user.account
      );
      setToken0Data(token);
    } else {
      const token = await getTokenData(
        tokenAddress,
        props.network.wethAddress,
        props.network.chainId
      );
      setToken0Data(token);
    }
  };
  const tokenTo = async (tokenAddress) => {
    if (isAuthenticated) {
      const token = await getTokenDataWithBalance(
        tokenAddress,
        props.network.wethAddress,
        props.network.chainId,
        user.account
      );
      setToken1Data(token);
    } else {
      const token = await getTokenData(
        tokenAddress,
        props.network.wethAddress,
        props.network.chainId
      );
      setToken1Data(token);
    }
  };

  const swaptoggler = async () => {
    setInput0(input1);
    setInput1("");
    setToken0Data(token1Data);
    setToken1Data(token0Data);
    // setIsSwapToggleOn(true);
  };

  const tokenApprove = async () => {
    if (isAuthenticated && token0Data && token1Data && input0 && input1) {
      setIsToken0Approved(1);
      let p = await approveToken(
        token0Data.tokenAddress,
        props.network.router._address,
        user.account
      );
      if (p) {
        setIsToken0Approved(2);
      } else {
        setIsToken0Approved(0);
      }
    }
  };

  // updating input1 if reserves updated
  //const myInterval = setInterval(inputUpdate, 90000);

  async function inputUpdate() {
    if (
      input0 > 0 &&
      input1 > 0 &&
      token0Data &&
      token1Data &&
      smartRoute.length > 0
    ) {
      let currentReservesDeatils = [];
      for (let i = 0; i < smartRoute.length - 1; i++) {
        const reserves = await fetchReserves(
          smartRoute[i],
          smartRoute[i + 1],
          props.network.factory
        );
        currentReservesDeatils.push(reserves);
      }

      let ischange = false;
      if (currentReservesDeatils.length === reservesDetails.length) {
        for (let i = 0; i < reservesDetails.length; i++) {
          if (
            reservesDetails[i][0] !== currentReservesDeatils[i][0] ||
            reservesDetails[i][1] !== currentReservesDeatils[i][1]
          ) {
            ischange = true;
            i = reservesDetails.length;
            break;
          }
        }
      }
      if (ischange) {
        if (
          await checkForPairExists(
            token0Data.tokenAddress,
            token1Data.tokenAddress,
            props.network.factory
          )
        ) {
          const amount = await getAmountOut(
            [token0Data.tokenAddress, token1Data.tokenAddress],
            input0,
            props.network.router
          );
          //("sgs");
          setInput1(amount);
        } else if (poolAssets && Object.values(poolAssets).length > 0) {
          if (input0 > 0) {
            let routes = await SmartRoutes(
              Object.values(poolAssets),
              token0Data.tokenAddress,
              token1Data.tokenAddress
            );
            if (routes.length > 0) {
              let bestPrice = 0;
              let bestRoute = [];
              for (const item of routes) {
                let price = await getAmountOut(
                  item,
                  input0,
                  props.network.router
                );
                if (price > bestPrice) {
                  bestPrice = price;
                  bestRoute = item;
                }
              }
              setInput1(bestPrice);
              await SwapBoxFromParams.sendSmartRoute(bestRoute);
            } else {
              alert.error("No route found");
            }
          }
        }
      }
    }
  }
  const trade = async () => {
    setSwapButtonClicked(true);
    dispatch(transactionStatusAction(3));
    // setAlreadyTokenApproved(false);
    const p = await swap(
      smartRoute,
      input0,
      input1,
      slippage.slippage,
      deadline.deadline,
      user.account,
      props.network.router,
      props.network.wethAddress
    );

    if (p) {
      if (p.length > 0) {
        //console.log(await p[0], await p[1]);
        setTransactionHashData(p);
        if (await p[0]) {
          setSwapButtonClicked(false);
          dispatch(transactionStatusAction(1));
          setIsToken0Approved(0);
          alert.success("Trade Successfully Placed !  ");
          setInput0("");
          setInput1("");

          if (isAuthenticated) {
            dispatch(
              myPooledAssetsAction(
                user,
                props.network.factory,
                props.network.wethAddress,
                props.network.chainId
              )
            );
            dispatch(login());
          }
          dispatch(
            PoolAssetsAction(
              isAuthenticated,
              user,
              props.network.factory,
              props.network.wethAddress,
              props.network.chainId
            )
          );

          // clearInterval(myInterval);
        } else {
          setSwapButtonClicked(false);
          dispatch(transactionStatusAction(2));
          alert.error("Transaction Failed ");
          // clearInterval(myInterval);
        }
      }
    } else {
      setSwapButtonClicked(false);
      dispatch(transactionStatusAction(2));
      alert.error("Transaction Failed ");
      // clearInterval(myInterval);
    }
  };

  useEffect(() => {
    async function listenNetwork() {
      setIsToken0Approved(0);
      setAlreadyTokenApproved(false);
      setSwapButtonClicked(false);
      setSmartRouteData([]);
      setSmartRoute([]);
      setToken0Data(null);
      setToken1Data(null);
      setPriceImpact(null);
      setPrice(null);
      setInput0("");
      setInput1("");
    }
    listenNetwork();
  }, [props.network ? props.network.chainId : props.network]);

  // updating token0 and token1
  const getTokenDataLoad = async () => {
    if (isAuthenticated) {
      if (token0Data) {
        let t0 = await getTokenDataWithBalance(
          token0Data.tokenAddress,
          props.network.wethAddress,
          props.network.chainId,
          user.account
        );
        setToken0Data(t0);
      }
      if (token1Data) {
        let t1 = await getTokenDataWithBalance(
          token1Data.tokenAddress,
          props.network.wethAddress,
          props.network.chainId,
          user.account
        );
        setToken1Data(t1);
      }
    }

    if (!isAuthenticated) {
      if (token0Data) {
        let t0 = await getTokenData(
          token0Data.tokenAddress,
          props.network.wethAddress,
          props.network.chainId
        );
        setToken0Data(t0);
      }
      if (token1Data) {
        let t1 = await getTokenData(
          token1Data.tokenAddress,
          props.network.wethAddress,
          props.network.chainId
        );
        setToken1Data(t1);
      }
    }
  };
  useEffect(() => {
    getTokenDataLoad();

    //console.log(props.network);
  }, [user, error, isAuthenticated]);

  // update amoutout/amountin on tokens change

  const get2 = async (t0, t1, am, isInput1) => {
    //console.log(smartRoute);
    if (
      await checkForPairExists(
        t0.tokenAddress,
        t1.tokenAddress,
        props.network.factory
      )
    ) {
      const reserves = await fetchReserves(
        t0.tokenAddress,
        t1.tokenAddress,
        props.network.factory
      );
      // update reservesDetails
      let x = [];
      await x.push(reserves);
      setReservesDetails(x);
      //console.log(t0.tokenAddress);
      if (isInput1) {
        if (Number(am) > Number(reserves[1])) {
          alert.error(
            `greater than reserve !\n amount should be less than ${reserves[1]}`
          );
        } else {
          const amount = await getAmountIn(
            [t0.tokenAddress, t1.tokenAddress],
            am,
            props.network.router
          );

          setInput0(amount);
          setSmartRoute([t0.tokenAddress, t1.tokenAddress]);
          setSmartRouteData([t0, t1]);
        }
      } else {
        const amount = await getAmountOut(
          [t0.tokenAddress, t1.tokenAddress],
          am,
          props.network.router
        );
        setInput1(amount);
        setSmartRoute([t0.tokenAddress, t1.tokenAddress]);
        setSmartRouteData([t0, t1]);
      }
    } else if (poolAssets && Object.values(poolAssets).length > 0) {
      //  console.log("v");
      let routes = await SmartRoutes(
        Object.values(poolAssets),
        t0.tokenAddress,
        t1.tokenAddress
      );

      //console.log([t0.symbol, t1.symbol]);
      // console.log([routes, routes.length]);
      if (isInput1) {
        if (routes.length > 0) {
          let bestPrice = 0;
          let bestRoute = [];
          let i = routes.length;
          for (const item of routes) {
            const reserves = await fetchReserves(
              item[item.length - 2],
              item[item.length - 1],
              props.network.factory
            );
            if (i === 1) {
              if (Number(am) > Number(reserves[1]) && bestRoute.length === 0) {
                alert.error(
                  `greater than reserve !\n amount should be less than ${reserves[1]}`
                );
              } else if (
                Number(am) > Number(reserves[1]) &&
                bestRoute.length !== 0
              ) {
                continue;
              } else if (Number(am) <= Number(reserves[1])) {
                let price = await getAmountIn(item, am, props.network.router);
                if (price > bestPrice) {
                  bestPrice = price;
                  bestRoute = item;
                }
              }
            } else {
              i--;
              if (Number(am) > Number(reserves[1])) {
                continue;
              } else {
                let price = await getAmountIn(item, am, props.network.router);
                if (price > bestPrice) {
                  bestPrice = price;
                  bestRoute = item;
                }
              }
            }
          }

          //.log(bestRoute);
          if (bestPrice !== 0) {
            setInput0(bestPrice);
            setSmartRoute(bestRoute);
            let p = [];
            // reservesDeatils updating
            let xx = [];
            for (let i = 0; i < bestRoute.length; i++) {
              for (let j = 0; j < Object.values(poolAssets).length; j++) {
                if (
                  (await Object.values(poolAssets)
                    [j].token0Data.tokenAddress.toString()
                    .toLowerCase()) ===
                  (await bestRoute[i].toString().toLowerCase())
                ) {
                  p.push(Object.values(poolAssets)[j].token0Data);
                  break;
                } else if (
                  (await Object.values(poolAssets)
                    [j].token1Data.tokenAddress.toString()
                    .toLowerCase()) ===
                  (await bestRoute[i].toString().toLowerCase())
                ) {
                  p.push(Object.values(poolAssets)[j].token1Data);
                  break;
                }
              }
              // reservesDeatils updating
              if (i < bestRoute.length - 1) {
                let x = await fetchReserves(
                  bestRoute[i],
                  bestRoute[i + 1],
                  props.network.factory
                );
                xx.push(x);
              }
            }
            setReservesDetails(xx);
            setSmartRouteData(p);
          }
        }
      } else {
        // console.log("bestRoute[0]");
        if (routes.length > 0) {
          let bestPrice = 0;
          let bestRoute = [];
          for (const item of routes) {
            let price = await getAmountOut(item, input0, props.network.router);
            if (price > bestPrice) {
              bestPrice = price;
              bestRoute = item;
            }
          }
          // console.log(bestRoute[0]);
          setInput1(bestPrice);
          setSmartRoute(bestRoute);
          let p = [];
          // reservesDeatils updating
          let xx = [];
          for (let i = 0; i < bestRoute.length; i++) {
            for (let j = 0; j < Object.values(poolAssets).length; j++) {
              if (
                (await Object.values(poolAssets)
                  [j].token0Data.tokenAddress.toString()
                  .toLowerCase()) ===
                (await bestRoute[i].toString().toLowerCase())
              ) {
                p.push(Object.values(poolAssets)[j].token0Data);
                break;
              } else if (
                (await Object.values(poolAssets)
                  [j].token1Data.tokenAddress.toString()
                  .toLowerCase()) ===
                (await bestRoute[i].toString().toLowerCase())
              ) {
                p.push(Object.values(poolAssets)[j].token1Data);
                break;
              }
            }
            // reservesDeatils updating
            if (i < bestRoute.length - 1) {
              let x = await fetchReserves(
                bestRoute[i],
                bestRoute[i + 1],
                props.network.factory
              );
              xx.push(x);
            }
          }
          setReservesDetails(xx);
          setSmartRouteData(p);
        }
      }
    } else {
      alert.error("No route found");
    }
  };

  useEffect(() => {
    //(async () => {
    if (token0Data && token1Data && input0 && input0 > 0 && !input1) {
      get2(token0Data, token1Data, input0, false);
    } else if (token0Data && token1Data && !input0 && input1 && input1 > 0) {
      get2(token0Data, token1Data, input1, true);
    } else if (token0Data && token1Data && input0 && input0 > 0 && input1) {
      get2(token0Data, token1Data, input0, false);
    }
    //})();
  }, [
    token0Data ? token0Data.tokenAddress : token0Data,
    token1Data ? token1Data.tokenAddress : token1Data,
  ]);

  useEffect(() => {
    // console.log(smartRoute);

    if (
      token0Data &&
      token1Data &&
      input0 &&
      input1 &&
      input0 > 0 &&
      input1 > 0
    ) {
      //console.log(smartRoute);
      if (isAuthenticated) {
        setIsToken0Approved(0);
        async function chechAlreadyTokenApproved() {
          let p = await isTokenAlreadyApproved(
            token0Data.tokenAddress,
            input0,
            user.account,
            props.network.router._address
          );
          setAlreadyTokenApproved(p);
        }
        chechAlreadyTokenApproved();
      }

      if (
        token0Data.tokenAddress.toString().toLowerCase() !==
        token1Data.tokenAddress.toString().toLowerCase()
      ) {
        setPrice(input0 / input1);
      } else {
        alert.error("Identical tokens found");
      }
    }
  }, [
    user,
    isAuthenticated,
    error,
    token0Data ? token0Data.tokenAddress : token0Data,
    input0,
    input1,
  ]);

  // update price/ priceimpact on inputs changes
  const get4 = async () => {
    // console.log(smartRoute);
    if (smartRoute && smartRoute.length > 0 && input0 && input0 > 0) {
      // console.log(smartRoute[0]);
      let poolPrices = await getArrayOfPoolPrice(
        smartRoute,
        props.network.factory
      );

      let priceAtPaids = await getArrayOfPriceAtPaid(
        smartRoute,
        input0,
        props.network.router
      );

      if (
        poolPrices &&
        priceAtPaids &&
        poolPrices.length === priceAtPaids.length
      ) {
        let PIs = [];
        for (let i = 0; i < poolPrices.length; i++) {
          let p = 1 - poolPrices[i] / priceAtPaids[i];

          PIs.push(p);
        }
        //average
        let r = 0;
        for (let k = 0; k < PIs.length; k++) {
          r = r + PIs[k];
        }
        r = (r / PIs.length) * 100;
        setPriceImpact(r);
      }
    }
  };
  useEffect(() => {
    get4();
  }, [input0]);

  // // update priceimpact on smartroute changes
  const get5 = async () => {
    // console.log(smartRoute);
    if (smartRoute && smartRoute.length > 0 && input0 && input0 > 0) {
      //  console.log(smartRoute[0]);
      let poolPrices = await getArrayOfPoolPrice(
        smartRoute,
        props.network.factory
      );
      let priceAtPaids = await getArrayOfPriceAtPaid(
        smartRoute,
        input0,
        props.network.router
      );
      if (
        poolPrices &&
        priceAtPaids &&
        poolPrices.length === priceAtPaids.length
      ) {
        let PIs = [];
        for (let i = 0; i < poolPrices.length; i++) {
          let p = 1 - poolPrices[i] / priceAtPaids[i];

          PIs.push(p);
        }
        let r = 0;
        for (let k = 0; k < PIs.length; k++) {
          r = r + PIs[k];
        }
        r = (r / PIs.length) * 100;
        setPriceImpact(r);
      }
    }
    if (poolAssets && Object.values(poolAssets).length > 0) {
      let m = [];
      for (let i = 0; i < smartRoute.length; i++) {
        for (let j = 0; j < Object.values(poolAssets).length; j++) {
          if (
            (await Object.values(poolAssets)
              [j].token0Data.tokenAddress.toString()
              .toLowerCase()) === (await smartRoute[i].toString().toLowerCase())
          ) {
            m.push(Object.values(poolAssets)[j].token0Data);
            break;
          } else if (
            (await Object.values(poolAssets)
              [j].token1Data.tokenAddress.toString()
              .toLowerCase()) === (await smartRoute[i].toString().toLowerCase())
          ) {
            m.push(Object.values(poolAssets)[j].token1Data);
            break;
          }
        }
      }
      setSmartRouteData(m);
      //console.log(Object.values(poolAssets).length);
    }
  };
  useEffect(() => {
    get5();
  }, [smartRoute, poolAssets]);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (!modal) {
      dispatch(isTokenFromModalOpen(false));
      dispatch(isTokenToModalOpen(false));
    }
    //load();
  }, [dispatch, error, alert]); //isSwapToggleOn,

  const [open, setOpen] = useState("0");
  const toggle = (id) => {
    open === id ? setOpen() : setOpen(id);
  };
  // function isDisabled() {
  //   if (
  //     token0Data &&
  //     token0Data.tokenAddress.toString().toLowerCase() ===
  //       props.network.wethAddress.toString().toLowerCase() &&
  //     !isSwapButtonClicked
  //   ) {
  //     return false;
  //   } else if (isAlreadyTokenApproved && !isSwapButtonClicked) {
  //     return false;
  //   } else {
  //     return isToken0Approved !== 2 || isSwapButtonClicked;
  //   }
  // }
  const modalParams = {
    modal: modal,
    togglemodal: togglemodal,
    tokenFrom: tokenFrom,
    tokenTo: tokenTo,
  };

  const SwapBoxFromParams = {
    togglemodal: togglemodal,
    token0Data: token0Data,
    token1Data: token1Data,
    sendInputAmount0: getInput0,
    amount0: input0,
    sendInputAmount1: getInput1,
    sendSmartRoute: getSmartRoute,
  };
  const SwapBoxToParams = {
    togglemodal: togglemodal,
    token0Data: token0Data,
    token1Data: token1Data,
    sendInputAmount0: getInput0,
    amount1: input1,
    sendInputAmount1: getInput1,
    sendSmartRoute: getSmartRoute,
  };
  const confirmTransactionModalParams = {
    title: "Confirm Swap",
    token0Data: token0Data,
    token1Data: token1Data,
    amount0: input0,
    amount1: input1,
    togglemodal: confirmTransactionModalToggle,
    isopen: isConfirmTransactionModal,
    price: price,
    priceImpact: priceImpact,
    func: trade,
    isDisable:
      token0Data &&
      token0Data.tokenAddress.toString().toLowerCase() ===
        props.network.wethAddress.toString().toLowerCase() &&
      !isSwapButtonClicked
        ? false
        : isAlreadyTokenApproved && !isSwapButtonClicked
        ? false
        : isToken0Approved !== 2 || isSwapButtonClicked,
    transactionHashData: transactionHashData,
    network: props.network,
    isSwapTransaction: true,
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.container_box}>
          <Nav />

          <SwapBoxFrom
            SwapBoxFromParams={SwapBoxFromParams}
            network={props.network}
          />

          <SwapBoxToggler toggle={swaptoggler} />

          <SwapBoxTo
            SwapBoxToParams={SwapBoxToParams}
            network={props.network}
          />

          {token0Data && token1Data && input0 && input1 ? (
            <div className={styles.transaction_details_box}>
              <div>
                <p className={styles.price}>Price</p>
                <p className={styles.rate}>
                  {price ? Number(price).toFixed(4) : null}{" "}
                  {token0Data ? String(token0Data.symbol).toUpperCase() : null}{" "}
                  per{" "}
                  {token1Data ? String(token1Data.symbol).toUpperCase() : null}
                </p>
              </div>
              <div>
                <p className={styles.price_impact}>Price Impact</p>
                <p className={styles.price_impact_val}>
                  {Number(priceImpact).toFixed(2)}%
                </p>
                <p className={styles.price_impact_ibutton}>
                  <InfoIcon />
                </p>
              </div>
            </div>
          ) : null}

          {input0 && input1 && smartRouteData && smartRouteData.length > 0 ? (
            <div className={styles.smartRoute_box}>
              <p>
                <ShareIcon /> Route
              </p>
              <div className={styles.smartRoute_box_items}>
                {smartRouteData.map((l) => (
                  <p key={l.tokenAddress}>
                    {l.tokenAddress.toString().toLowerCase() ===
                    token1Data.tokenAddress.toString().toLowerCase() ? (
                      l.symbol
                    ) : (
                      <>
                        {" "}
                        {l.symbol}
                        <ArrowRightAltIcon />{" "}
                      </>
                    )}
                  </p>
                ))}
              </div>
            </div>
          ) : null}
          {isAuthenticated &&
          !isAlreadyTokenApproved &&
          token0Data &&
          token0Data.tokenAddress.toString().toLowerCase() !==
            props.network.wethAddress.toString().toLowerCase() &&
          token1Data &&
          input0 &&
          input0 > 0 &&
          input0 <= token0Data.balance &&
          input1 ? (
            <DynamicButton
              text={
                isToken0Approved === 0
                  ? `Approve ${token0Data.symbol}`
                  : [
                      isToken0Approved === 1
                        ? "Approving..."
                        : isToken0Approved === 2
                        ? "Approved"
                        : null,
                    ]
              }
              isDisable={isToken0Approved === 1 || isToken0Approved === 2}
              func={tokenApprove}
            />
          ) : null}
          {!isAuthenticated ? (
            <DynamicButton text={" Connect Wallet"} func={connectWallet} />
          ) : (
            [
              !token0Data ? (
                <DynamicButton text={"Select a Token"} isDisable={true} />
              ) : !token1Data ? (
                <DynamicButton text={"Select a Token"} isDisable={true} />
              ) : !input0 ? (
                <DynamicButton text={"Enter an Amount"} isDisable={true} />
              ) : !input1 ? (
                <DynamicButton text={"Enter an Amount"} isDisable={true} />
              ) : input0 <= 0 || input1 <= 0 ? (
                <DynamicButton text={"Enter an Amount"} isDisable={true} />
              ) : input0 > token0Data.balance ? (
                <DynamicButton text={"Insufficient Balance"} isDisable={true} />
              ) : !smartRoute.length > 0 ? (
                <DynamicButton text="wait a moment" isDisable={true} />
              ) : token0Data.tokenAddress === token1Data.tokenAddress ? (
                <DynamicButton
                  text="Identical Tokens Selected"
                  isDisable={true}
                />
              ) : (
                <SwapButton
                  swap={confirmTransactionModalToggle}
                  isDisable={
                    token0Data.tokenAddress.toString().toLowerCase() ===
                      props.network.wethAddress.toString().toLowerCase() &&
                    !isSwapButtonClicked
                      ? false
                      : isAlreadyTokenApproved && !isSwapButtonClicked
                      ? false
                      : isToken0Approved !== 2 || isSwapButtonClicked
                  }
                />
                // <SwapButton
                //   swap={trade}
                //   isDisable={
                //     token0Data.tokenAddress ===
                //       "0xc778417E063141139Fce010982780140Aa0cD5Ab" ||
                //     isAlreadyTokenApproved
                //       ? false
                //       : isToken0Approved !== 2 || isSwapButtonClicked
                //   }
                // />
              ),
            ]
          )}
        </div>
      </div>

      {token0Data && token1Data && input0 && input1 ? (
        <div className={styles.advance_details_accordion}>
          <Accordion open={open} toggle={toggle}>
            <AccordionItem>
              <AccordionHeader targetId="1">Show Advanced</AccordionHeader>
              <AccordionBody accordionId="1">
                <div className={styles.advance_details_accordion_item}>
                  <div>
                    <p className={styles.left}>Minimum received</p>
                    <p className={styles.middle_left}>
                      <InfoIcon />
                    </p>
                    <p className={styles.right}>
                      {input1 * (1 - slippage.slippage * 0.01)}
                      {token1Data ? String(token1Data.symbol) : null}
                    </p>
                  </div>
                  <div>
                    <p className={styles.left}>Price Impact</p>
                    <p className={styles.middle_left}>
                      <InfoIcon />
                    </p>
                    <p className={styles.right}>{Number(priceImpact)}%</p>
                  </div>
                  <div>
                    <p className={styles.left}>Liquidity Provider Fee</p>
                    <p className={styles.middle_left}>
                      <InfoIcon />
                    </p>
                    <p className={styles.right}>
                      {Number(input0 * 0.003)}{" "}
                      {token0Data ? String(token0Data.symbol) : null}
                    </p>
                  </div>
                </div>
              </AccordionBody>
            </AccordionItem>
          </Accordion>
        </div>
      ) : null}

      <ModalTokenSelect modalParams={modalParams} network={props.network} />
      <ConfirmTransactionModal modalParams={confirmTransactionModalParams} />
    </>
  );
};

export default SwapPage;
