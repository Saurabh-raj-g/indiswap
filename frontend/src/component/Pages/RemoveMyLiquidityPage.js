import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "reactstrap";
import styles from "./RemoveMyLiquidityPage.module.css";
import ConfirmTransactionModal from "../layout/Utils/Modal/ConfirmTransactionModal.js";
import WalletButton from "../layout/Utils/Button/WalletButton.js";
import AmountButton from "../layout/Utils/Button/AmountButton.js";
import DynamicButton from "../layout/Utils/Button/DynamicButton";
import SelectATokenButton from "../layout/Utils/Button/SelectATokenButton.js";
import SwapBoxFrom from "../layout/Utils/SwapBox/SwapBoxFrom";
import SwapBoxTo from "../layout/Utils/SwapBox/SwapBoxTo";
import SwapBoxToggler from "../layout/Utils/SwapBox/SwapBoxToggler";

import Slider from "@mui/material/Slider";
//import WaitButton from "../layout/Utils/Button/WaitButton";
import InsufficientBalanceButton from "../layout/Utils/Button/InsufficientBalanceButton";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";

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
  getpairContract,
  quoteRemoveLiquidity,
  removeLiquidity,
  getDataForPairs,
  getDataForPairsWithoutAuth,
  isLpTokenAlreadyApproved,
  approveLpToken,
} from "../../actions/contractFunction";

import { useDispatch, useSelector } from "react-redux";
import { clearErrors, login } from "../../actions/userAction";
import { useAlert } from "react-alert";
//import { myPooledAssetsAction } from "../../actions/contractAction";

const RemoveMyLiquidityPage = (props) => {
  const address = useParams();
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();

  const [modal, setModal] = useState(false);
  const [isConfirmTransactionModal, setIsConfirmTransactionModal] =
    useState(false);
  // 0 -> false , 1 -> approving , 2 -> approved
  const [isLpTokenApproved, setIsLpTokenApproved] = useState(0);
  const [isAlreadyLpTokenApproved, setAlreadyLpTokenApproved] = useState(false);
  const [isRemoveButtonClicked, setIsRemoveButtonClicked] = useState(false);

  const [tooltipOpen, setTooltipOpen] = useState(false);

  const [myAssets, setMyAssets] = useState();

  const [liquidity_bn, setLiquidity_bn] = useState();

  const [input0, setInput0] = useState();
  const [input1, setInput1] = useState();

  const [transactionHashData, setTransactionHashData] = useState([]);

  const { user, error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const { slippage } = useSelector((state) => state.slippage);
  const { deadline } = useSelector((state) => state.deadline);

  // const [amountMinInput0, setAmountMinInput0] = useState();
  // const [amountMinInput1, setAmountMinInput1] = useState();

  // const [poolPrice, setPoolPrice] = useState([]);

  const togglemodal = () => {
    setModal(!modal);
  };

  const confirmTransactionModalToggle = () => {
    setIsConfirmTransactionModal(!isConfirmTransactionModal);
  };

  const toggleTooltip = () => {
    setTooltipOpen(!tooltipOpen);
  };

  const connectWallet = (e) => {
    e.preventDefault();
    dispatch(login());
  };
  // set liquidity_bn by range slider

  const setLiquidity_BN = async (e) => {
    if (isAuthenticated) {
      if (myAssets && myAssets.liquidity) {
        if ((myAssets.liquidity * e.target.value) / 100 <= myAssets.liquidity) {
          let a = (myAssets.liquidity * e.target.value) / 100;
          setLiquidity_bn(a);
          const data = await quoteRemoveLiquidity(
            myAssets.token0Data.tokenAddress,
            myAssets.token1Data.tokenAddress,
            a,
            props.network.factory
          );
          if (data.length > 0) {
            setInput0(data[1]);
            setInput1(data[2]);
          }
        } else {
          alert.error("insufficient liquidity");
        }
      }
    } else {
      alert.error("You are not authorised");
    }
  };
  const getInput0 = async (e) => {
    setInput0(e);
  };
  const getInput1 = async (e) => {
    setInput1(e);
  };

  // const getAmountMinInput0 = async (e) => {
  //   if (input0) {
  //     if (e <= input0) {
  //       setAmountMinInput0(e);
  //     } else {
  //       alert.error(
  //         "Minimum output should be greater or equal to expected output "
  //       );
  //       setAmountMinInput0("");
  //     }
  //   } else {
  //     setAmountMinInput0("");
  //     alert.error("Max expected output is empty ");
  //   }
  // };

  // const getAmountMinInput1 = async (e) => {
  //   if (input1) {
  //     if (e <= input1) {
  //       setAmountMinInput1(e);
  //     } else {
  //       alert.error(
  //         "Minimum output should be greater or equal to expected output "
  //       );
  //       setAmountMinInput1("");
  //     }
  //   } else {
  //     setAmountMinInput1("");
  //     alert.error("Max expected output is empty ");
  //   }
  // };

  const getLiquidity_BN = async (e) => {
    if (isAuthenticated) {
      if (myAssets && myAssets.liquidity) {
        if (myAssets.liquidity - e >= 0) {
          //let a = (e / myAssets.liquidity) * 100;
          setLiquidity_bn(e);
        } else {
          alert.error("insufficient liquidity");
        }
      }
    } else {
      alert.error("You are not authorised");
    }
  };

  const lpTokenApprove = async () => {
    if (isAuthenticated && myAssets && input0 && input1) {
      setIsLpTokenApproved(1);
      let p = await approveLpToken(
        myAssets.pairAddress,
        props.network.router._address,
        user.account
      );
      if (p) {
        setIsLpTokenApproved(2);
      } else {
        setIsLpTokenApproved(0);
      }
    }
  };

  const addLiquiditytoggler = async () => {
    Navigate("/add/new");
  };

  const removeYourLiquidity = async () => {
    setIsRemoveButtonClicked(true);
    dispatch(transactionStatusAction(3));
    const p = await removeLiquidity(
      myAssets.token0Data.tokenAddress,
      myAssets.token1Data.tokenAddress,
      liquidity_bn,
      slippage.slippage,
      deadline.deadline,
      user.account,
      props.network.factory,
      props.network.router,
      props.network.wethAddress
    );

    if (p) {
      if (p.length > 0) {
        //console.log(await p[0], await p[1]);
        setTransactionHashData(p);
        if (await p[0]) {
          setIsRemoveButtonClicked(false);
          dispatch(transactionStatusAction(1));
          setIsLpTokenApproved(0);
          alert.success("Liquidity burned Successfully !");
          setInput0("");
          setInput1("");
          setLiquidity_BN("");

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
        } else {
          setIsRemoveButtonClicked(false);
          dispatch(transactionStatusAction(2));
          alert.error("Transaction Failed ");
        }
      }
    } else {
      setIsRemoveButtonClicked(false);
      dispatch(transactionStatusAction(2));
      alert.error("Transaction Failed ");
    }
  };

  if (window.ethereum) {
    // async function listenChainChanged() {
    window.ethereum.on("chainChanged", async function () {
      setMyAssets(null);
      setLiquidity_bn();
      setInput0("");
      setInput1("");
    });
  }

  async function load() {
    if (address.address) {
      const pairContract = await getpairContract(address.address);
      if (pairContract) {
        if (isAuthenticated) {
          const data = await getDataForPairs(
            user.account,
            address.address,
            props.network.factory,
            props.network.router,
            props.network.wethAddress
          );
          setMyAssets(data[0]);
        }
        if (!isAuthenticated) {
          const data = await getDataForPairsWithoutAuth(
            address.address,
            props.network.factory,
            props.network.router,
            props.network.wethAddress
          );
          setMyAssets(data[0]);
        }
      } else {
        Navigate("/add/new");
      }
    }
    // if (isAuthenticated && myAssets && liquidity_bn) {
    //   const data = await quoteRemoveLiquidity(
    //     myAssets.token0Data.tokenAddress,
    //     myAssets.token1Data.tokenAddress,
    //     liquidity_bn
    //   );
    //   console.log(liquidity_bn);
    //   if (data.length > 0) {
    //     setInput0(data[1]);
    //     setInput1(data[2]);
    //   }
    // }
  }
  // let x = document.getElementsByClassName("x");
  // let scrubber = document.getElementsByClassName("scrubbers")[0];
  // let tooltip = document.getElementsByClassName("tooltips")[0];

  function showTooltip(e) {
    // let w = scrubber.clientWidth;
    // console.log("w  " + w);
    // let x = e.clientX; //e.offsetX;
    // console.log("x  " + x);
    // let percents = x / w;
    // console.log("perce  " + percents);
    // let max = parseInt(scrubber.max);
    // console.log("max  " + max);
    // tooltip.innerHTML = Math.floor(percents * max + 0.5);
  }

  // window.onmousemove = function (e) {
  //   let x = e.clientX + 20 + "px";
  //   tooltip.style.left = x;
  // };

  // cartItems: localStorage.getItem("cartItems")
  //     ? JSON.parse(localStorage.getItem("cartItems"))
  //     : [],

  useEffect(() => {
    //console.log("cfgh");
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (!modal) {
      dispatch(isTokenFromModalOpen(false));
      dispatch(isTokenToModalOpen(false));
    }
    if (myAssets && myAssets.pairAddress && liquidity_bn && liquidity_bn > 0) {
      if (isAuthenticated) {
        // console.log("djsd");
        setIsLpTokenApproved(0);
        async function chechAlreadyLpTokenApproved() {
          let p = await isLpTokenAlreadyApproved(
            myAssets.pairAddress,
            liquidity_bn,
            user.account,
            props.network.router._address
          );
          setAlreadyLpTokenApproved(p);
        }
        chechAlreadyLpTokenApproved();
      }
    }

    load();
  }, [
    dispatch,
    input0,
    input1,
    myAssets ? myAssets.pairAddress : null,
    // token0Data,
    // token1Data,
    address.address,
    liquidity_bn,
    deadline,
    user,
    error,
    alert,
    isAuthenticated,
  ]);
  function numFormatter(num) {
    if (Number.isInteger(num)) {
      return Number(num).toFixed(0) + "%";
    } else {
      return Number(num).toFixed(1) + "%";
    }
  }

  const SwapBoxFromParams = {
    togglemodal: togglemodal,
    token0Data: myAssets ? myAssets.token0Data : null,
    token1Data: myAssets ? myAssets.token1Data : null,
    sendInputAmount0: getInput0,
    amount0: input0,
    sendInputAmount1: getInput1,
    isRemoveMyLiquidityOn: true,
    // sendInputAmount0Min: getAmountMinInput0,
    // sendInputAmount1Min: getAmountMinInput1,
    // amount0Min: amountMinInput0,
    sendLiquidity_BN: getLiquidity_BN,
    Liquidity_BN: liquidity_bn,
  };
  const SwapBoxToParams = {
    togglemodal: togglemodal,
    token0Data: myAssets ? myAssets.token0Data : null,
    token1Data: myAssets ? myAssets.token1Data : null,
    sendInputAmount0: getInput0,
    amount1: input1,
    sendInputAmount1: getInput1,
    isRemoveMyLiquidityOn: true,
    // sendInputAmount0Min: getAmountMinInput0,
    // sendInputAmount1Min: getAmountMinInput1,
    // amount1Min: amountMinInput1,
    sendLiquidity_BN: getLiquidity_BN,
    Liquidity_BN: liquidity_bn,
  };

  const confirmTransactionModalParams = {
    title: "Confirm RemoveLiquidity",
    lpTokenSymbol: "IND-LP-V1",
    lpBurningAmount: liquidity_bn,
    token0Data: myAssets ? myAssets.token0Data : null,
    token1Data: myAssets ? myAssets.token1Data : null,
    amount0: input0,
    amount1: input1,
    togglemodal: confirmTransactionModalToggle,
    isopen: isConfirmTransactionModal,
    func: removeYourLiquidity,
    isDisable:
      isAlreadyLpTokenApproved && !isRemoveButtonClicked
        ? false
        : isLpTokenApproved !== 2 || isRemoveButtonClicked,
    transactionHashData: transactionHashData,
    network: props.network,
    isRemoveTransaction: true,
  };

  function RemoveLiquidityButton({ remove, isDisable }) {
    return (
      <Button
        className={styles.button_box}
        size="md"
        onClick={remove}
        disabled={isDisable}
      >
        Remove Liquidity
      </Button>
    );
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.container_box}>
          <div className={styles.header_box}>
            <p
              className={styles.header_left}
              style={{ cursor: "pointer" }}
              onClick={function () {
                Navigate("/pool");
              }}
            >
              <ArrowBackIcon />
            </p>

            <p className={styles.header_middle}>Remove Liquidity</p>

            <p
              className={styles.header_right}
              style={{ cursor: "pointer" }}
              onClick={function () {
                Navigate("/pool");
              }}
            >
              <HelpOutlineIcon />
            </p>
          </div>

          <SwapBoxFrom
            SwapBoxFromParams={SwapBoxFromParams}
            network={props.network}
          />

          <SwapBoxToggler
            toggle={addLiquiditytoggler}
            isRemoveMyLiquidityOn={true}
          />

          <SwapBoxTo
            SwapBoxToParams={SwapBoxToParams}
            network={props.network}
          />

          {isAuthenticated && myAssets ? (
            <div className={styles.scrubberContainer}>
              <Slider
                onChange={setLiquidity_BN}
                defaultValue={0}
                aria-label="Small"
                valueLabelDisplay="auto"
                valueLabelFormat={numFormatter}
                max="100"
                color="secondary"
                value={
                  myAssets && myAssets.liquidity && liquidity_bn
                    ? (liquidity_bn * 100) / myAssets.liquidity
                    : 0
                }
              />
            </div>
          ) : null}

          {/* {token0Data && token1Data ? (
            <div className={styles.box}>
              <p className={styles.item1Left}>Prices and pool share</p>

              <div className={styles.child_box}>
                <div>
                  <p>
                    {poolPrice.length > 0
                      ? Number(poolPrice[1]).toFixed(4)
                      : null}
                  </p>
                  <p>
                    {poolPrice.length > 0
                      ? Number(poolPrice[0]).toFixed(4)
                      : null}
                  </p>
                  <p>
                    {poolPrice[2] ? (
                      <span>{Number(poolPrice[2]).toFixed(4)}%</span>
                    ) : null}
                  </p>
                </div>
                <div>
                  <p className={styles.child_box_text}>
                    {token0Data ? token0Data.symbol : null} per{" "}
                    {token1Data ? token1Data.symbol : null}
                  </p>
                  <p className={styles.child_box_text}>
                    {token1Data ? token1Data.symbol : null} per{" "}
                    {token0Data ? token0Data.symbol : null}
                  </p>
                  <p className={styles.child_box_text}>Share of Pool</p>
                </div>
              </div>
            </div>
          ) : null} */}
          {isAuthenticated &&
          !isAlreadyLpTokenApproved &&
          myAssets &&
          input0 &&
          input0 > 0 &&
          input1 &&
          input1 > 0 &&
          liquidity_bn &&
          liquidity_bn > 0 &&
          liquidity_bn <= myAssets.liquidity ? (
            <DynamicButton
              text={
                isLpTokenApproved === 0
                  ? `Approve IND-LP-V1`
                  : [
                      isLpTokenApproved === 1
                        ? "Approving..."
                        : isLpTokenApproved === 2
                        ? "Approved"
                        : null,
                    ]
              }
              isDisable={isLpTokenApproved === 1 || isLpTokenApproved === 2}
              func={lpTokenApprove}
            />
          ) : null}

          {!isAuthenticated ? (
            <WalletButton connectWallet={connectWallet} />
          ) : (
            [
              !myAssets ? (
                <SelectATokenButton />
              ) : !myAssets ? (
                <SelectATokenButton />
              ) : !input0 ? (
                <AmountButton />
              ) : !input1 ? (
                <AmountButton />
              ) : input0 <= 0 || input1 <= 0 ? (
                <AmountButton />
              ) : input0 > myAssets.token0Data.balance ? (
                <InsufficientBalanceButton />
              ) : input1 > myAssets.token1Data.balance ? (
                <InsufficientBalanceButton />
              ) : (
                <RemoveLiquidityButton
                  remove={confirmTransactionModalToggle}
                  isDisable={
                    isAlreadyLpTokenApproved && !isRemoveButtonClicked
                      ? false
                      : isLpTokenApproved !== 2 || isRemoveButtonClicked
                  }
                />
              ),
            ]
          )}
        </div>
      </div>
      <ConfirmTransactionModal modalParams={confirmTransactionModalParams} />
    </>
  );
};
export default RemoveMyLiquidityPage;
