// -----------------    optimal ------------------------

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "reactstrap";
import styles from "./AddLiquidityPage.module.css";

import ConfirmTransactionModal from "../layout/Utils/Modal/ConfirmTransactionModal.js";
import WalletButton from "../layout/Utils/Button/WalletButton.js";
import AmountButton from "../layout/Utils/Button/AmountButton.js";
import SelectATokenButton from "../layout/Utils/Button/SelectATokenButton.js";
import SwapBoxFrom from "../layout/Utils/SwapBox/SwapBoxFrom";
import SwapBoxTo from "../layout/Utils/SwapBox/SwapBoxTo";
import SwapBoxToggler from "../layout/Utils/SwapBox/SwapBoxToggler";

import FontSizeLoader from ".././layout/Loader/FontSizeLoader.js";
//import WaitButton from "../layout/Utils/Button/WaitButton";
import InsufficientBalanceButton from "../layout/Utils/Button/InsufficientBalanceButton";
import DynamicButton from "../layout/Utils/Button/DynamicButton";

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
  addLiquidity,
  getTokenData,
  fetchReserves,
  getTokenDataWithBalance,
  approveToken,
  isTokenAlreadyApproved,
} from "../../actions/contractFunction";

import { useDispatch, useSelector } from "react-redux";
import { clearErrors, login } from "../../actions/userAction";
import { useAlert } from "react-alert";

const JoinPoolPage = (props) => {
  const address = useParams();
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();
  const [modal, setModal] = useState(false);

  const [isFetching, setIsFetching] = useState(false);
  const [isConfirmTransactionModal, setIsConfirmTransactionModal] =
    useState(false);
  // 0 -> false , 1 -> approving , 2 -> approved , 3 -> anotherIsApproving
  const [token0ApprovedStatus, setToken0ApprovedStatus] = useState(0);
  const [token1ApprovedStatus, setToken1ApprovedStatus] = useState(0);

  const [isAlreadyToken0Approved, setAlreadyToken0Approved] = useState(false);
  const [isAlreadyToken1Approved, setAlreadyToken1Approved] = useState(false);
  const [isAddLiquidityButtonClicked, setAddLiquidityButtonClicked] =
    useState(false);

  const [token0Data, setToken0Data] = useState(null);
  const [token1Data, setToken1Data] = useState(null);

  // const [t0Data, setT0Data] = useState();
  // const [t1Data, setT1Data] = useState();

  const [input0, setInput0] = useState();
  const [input1, setInput1] = useState();

  const [poolPrice, setPoolPrice] = useState([]);

  const [transactionHashData, setTransactionHashData] = useState([]);

  const { user, error, isAuthenticated } = useSelector((state) => state.user);
  const { slippage } = useSelector((state) => state.slippage);
  const { deadline } = useSelector((state) => state.deadline);
  //const { weth } = useSelector((state) => state.weth);

  const setFetching = async (t) => {
    setIsFetching(t);
  };

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

  const getPoolPrice = async (e) => {
    setPoolPrice(e);
  };

  const addLiquiditytoggler = async () => {
    Navigate("/add/new");
  };

  const token0Approve = async () => {
    if (isAuthenticated && token0Data && token1Data && input0 && input1) {
      setToken0ApprovedStatus(1);
      if (
        await isTokenAlreadyApproved(
          token1Data.tokenAddress,
          input1,
          user.account,
          props.network.router._address
        )
      ) {
      } else {
        setToken1ApprovedStatus(3);
      }

      let p = await approveToken(
        token0Data.tokenAddress,
        props.network.router._address,
        user.account
      );
      if (p) {
        setToken0ApprovedStatus(2);
        if (
          await isTokenAlreadyApproved(
            token1Data.tokenAddress,
            input1,
            user.account,
            props.network.router._address
          )
        ) {
        } else {
          setToken1ApprovedStatus(0);
        }
      } else {
        setToken0ApprovedStatus(0);
        if (
          await isTokenAlreadyApproved(
            token1Data.tokenAddress,
            input1,
            user.account,
            props.network.router._address
          )
        ) {
        } else {
          setToken1ApprovedStatus(0);
        }
      }
    }
  };

  const token1Approve = async () => {
    if (isAuthenticated && token0Data && token1Data && input0 && input1) {
      setToken1ApprovedStatus(1);
      if (
        await isTokenAlreadyApproved(
          token0Data.tokenAddress,
          input0,
          user.account,
          props.network.router._address
        )
      ) {
      } else {
        setToken0ApprovedStatus(3);
      }
      let p = await approveToken(
        token1Data.tokenAddress,
        props.network.router._address,
        user.account
      );
      if (p) {
        setToken1ApprovedStatus(2);
        if (
          await isTokenAlreadyApproved(
            token0Data.tokenAddress,
            input0,
            user.account,
            props.network.router._address
          )
        ) {
        } else {
          setToken0ApprovedStatus(0);
        }
      } else {
        setToken1ApprovedStatus(0);
        if (
          await isTokenAlreadyApproved(
            token0Data.tokenAddress,
            input0,
            user.account,
            props.network.router._address
          )
        ) {
        } else {
          setToken0ApprovedStatus(0);
        }
      }
    }
  };

  const addYourLiquidity = async () => {
    setAddLiquidityButtonClicked(true);
    dispatch(transactionStatusAction(3));
    const p = await addLiquidity(
      token0Data.tokenAddress,
      token1Data.tokenAddress,
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
        setTransactionHashData(p);
        if (await p[0]) {
          setAddLiquidityButtonClicked(false);
          dispatch(transactionStatusAction(1));
          setToken0ApprovedStatus(0);
          setToken1ApprovedStatus(0);
          alert.success("Liquidity added Successfully !");
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
        } else {
          setAddLiquidityButtonClicked(false);
          dispatch(transactionStatusAction(2));
          alert.error("Transaction Failed ");
        }
      }
    } else {
      setAddLiquidityButtonClicked(false);
      dispatch(transactionStatusAction(2));
      alert.error("Transaction Failed ");
    }
  };
  const setTokensData = async (a0, a1) => {
    if (isAuthenticated) {
      if (a0) {
        let t0 = await getTokenDataWithBalance(
          a0.tokenAddress,
          props.network.wethAddress,
          props.network.chainId,
          user.account
        );
        setToken0Data(t0);
      }
      if (a1) {
        let t1 = await getTokenDataWithBalance(
          a1.tokenAddress,
          props.network.wethAddress,
          props.network.chainId,
          user.account
        );
        setToken1Data(t1);
      }
    }

    if (!isAuthenticated) {
      if (a0) {
        let t0 = await getTokenData(
          a0.tokenAddress,
          props.network.wethAddress,
          props.network.chainId
        );
        setToken0Data(t0);
      }
      if (a1) {
        let t1 = await getTokenData(
          a1.tokenAddress,
          props.network.wethAddress,
          props.network.chainId
        );
        setToken1Data(t1);
      }
    }
  };

  if (window.ethereum) {
    // async function listenChainChanged() {
    window.ethereum.on("chainChanged", async function () {
      setToken0ApprovedStatus(0);
      setToken1ApprovedStatus(0);
      setAlreadyToken0Approved(false);
      setAlreadyToken1Approved(false);
      setAddLiquidityButtonClicked(false);
      setToken0Data(null);
      setToken1Data(null);
      setInput0("");
      setInput1("");
      setPoolPrice([]);
    });
  }

  async function load() {
    setTokensData(token0Data, token1Data);

    if (token0Data && token1Data && !input0 && !input1) {
      const reserves = await fetchReserves(
        token0Data.tokenAddress,
        token1Data.tokenAddress,
        props.network.factory
      );
      if (reserves[0] === 0 && reserves[1] === 0) {
        let p = [];
        p.push(0);
        p.push(0);
        setPoolPrice(p);
      } else {
        let p = [];
        p.push(reserves[1] / reserves[0]);
        p.push(reserves[0] / reserves[1]);
        setPoolPrice(p);
      }
    }
    if (poolPrice[2]) {
    }

    if (address.address) {
      const pairContract = await getpairContract(address.address);
      if (pairContract) {
        const token0Address = await pairContract.methods.token0().call();
        const token1Address = await pairContract.methods.token1().call();

        let p0 = await getTokenData(
          token0Address,
          props.network.wethAddress,
          props.network.chainId
        );
        let p1 = await getTokenData(
          token1Address,
          props.network.wethAddress,
          props.network.chainId
        );

        await setTokensData(p0, p1);
        //}
      } else {
        Navigate("/add/new");
      }
    }
  }
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (!modal) {
      dispatch(isTokenFromModalOpen(false));
      dispatch(isTokenToModalOpen(false));
    }

    load();
  }, [
    dispatch,
    input0,
    input1,
    // token0Data,
    // token1Data,
    address.address,
    deadline,
    user,
    error,
    alert,
    isAuthenticated,
  ]);

  //

  useEffect(() => {
    if (
      token0Data &&
      token1Data &&
      input0 &&
      input1 &&
      input0 > 0 &&
      input1 > 0
    ) {
      if (isAuthenticated) {
        setToken0ApprovedStatus(0);
        setToken1ApprovedStatus(0);
        async function chechAlreadyToken0Approved() {
          let p = await isTokenAlreadyApproved(
            token0Data.tokenAddress,
            input0,
            user.account,
            props.network.router._address
          );
          setAlreadyToken0Approved(p);
        }
        async function chechAlreadyToken1Approved() {
          let p = await isTokenAlreadyApproved(
            token1Data.tokenAddress,
            input1,
            user.account,
            props.network.router._address
          );
          setAlreadyToken1Approved(p);
        }
        chechAlreadyToken0Approved();
        chechAlreadyToken1Approved();
      }
    }
  }, [
    user,
    isAuthenticated,
    error,
    token0Data ? token0Data.tokenAddress : token0Data,
    token1Data ? token1Data.tokenAddress : token1Data,
    input0,
    input1,
  ]);

  const SwapBoxFromParams = {
    togglemodal: togglemodal,
    token0Data: token0Data ? token0Data : null,
    token1Data: token1Data ? token1Data : null,
    sendInputAmount0: getInput0,
    sendFetchingStatus: setFetching,
    amount0: input0,
    sendInputAmount1: getInput1,
    isJoinPoolOn: true,
    sendPoolPrice: getPoolPrice,
  };
  const SwapBoxToParams = {
    togglemodal: togglemodal,
    token0Data: token0Data ? token0Data : null,
    token1Data: token1Data ? token1Data : null,
    sendInputAmount0: getInput0,
    sendFetchingStatus: setFetching,
    amount1: input1,
    sendInputAmount1: getInput1,
    isJoinPoolOn: true,
    sendPoolPrice: getPoolPrice,
  };

  const confirmTransactionModalParams = {
    title: "Confirm Add Liquidity",
    token0Data: token0Data,
    token1Data: token1Data,
    amount0: input0,
    amount1: input1,
    togglemodal: confirmTransactionModalToggle,
    isopen: isConfirmTransactionModal,
    poolPrice: poolPrice,
    func: addYourLiquidity,
    isDisable: isFetching
      ? true
      : // eth + token
      token0Data &&
        token0Data.tokenAddress.toString().toLowerCase() ===
          props.network.wethAddress.toString().toLowerCase() &&
        isAlreadyToken1Approved &&
        !isAddLiquidityButtonClicked
      ? false
      : token0Data &&
        token0Data.tokenAddress.toString().toLowerCase() ===
          props.network.wethAddress.toString().toLowerCase() &&
        isAlreadyToken1Approved &&
        isAddLiquidityButtonClicked
      ? true
      : // if already not approved
      token0Data &&
        token0Data.tokenAddress.toString().toLowerCase() ===
          props.network.wethAddress.toString().toLowerCase() &&
        token1ApprovedStatus !== 2
      ? true
      : token0Data &&
        token0Data.tokenAddress.toString().toLowerCase() ===
          props.network.wethAddress.toString().toLowerCase() &&
        token1ApprovedStatus === 2 &&
        !isAddLiquidityButtonClicked
      ? false
      : token0Data &&
        token0Data.tokenAddress.toString().toLowerCase() ===
          props.network.wethAddress.toString().toLowerCase() &&
        token1ApprovedStatus === 2 &&
        isAddLiquidityButtonClicked
      ? true
      : // token + eth

      token1Data &&
        token1Data.tokenAddress.toString().toLowerCase() ===
          props.network.wethAddress.toString().toLowerCase() &&
        isAlreadyToken0Approved &&
        !isAddLiquidityButtonClicked
      ? false
      : token1Data &&
        token1Data.tokenAddress.toString().toLowerCase() ===
          props.network.wethAddress.toString().toLowerCase() &&
        isAlreadyToken0Approved &&
        isAddLiquidityButtonClicked
      ? true
      : // if already not approved
      token1Data &&
        token1Data.tokenAddress.toString().toLowerCase() ===
          props.network.wethAddress.toString().toLowerCase() &&
        token0ApprovedStatus !== 2
      ? true
      : token1Data &&
        token1Data.tokenAddress.toString().toLowerCase() ===
          props.network.wethAddress.toString().toLowerCase() &&
        token0ApprovedStatus === 2 &&
        !isAddLiquidityButtonClicked
      ? false
      : token1Data &&
        token1Data.tokenAddress.toString().toLowerCase() ===
          props.network.wethAddress.toString().toLowerCase() &&
        token0ApprovedStatus === 2 &&
        isAddLiquidityButtonClicked
      ? true
      : // token + token

      isAlreadyToken0Approved &&
        isAlreadyToken1Approved &&
        !isAddLiquidityButtonClicked
      ? false
      : isAlreadyToken0Approved && token1ApprovedStatus !== 2
      ? true
      : token0ApprovedStatus !== 2 && isAlreadyToken1Approved
      ? true
      : token0ApprovedStatus !== 2 && token1ApprovedStatus !== 2
      ? true
      : token0ApprovedStatus === 2 && token1ApprovedStatus !== 2
      ? true
      : token0ApprovedStatus !== 2 && token1ApprovedStatus === 2
      ? true
      : token0ApprovedStatus === 2 &&
        token1ApprovedStatus === 2 &&
        !isAddLiquidityButtonClicked
      ? false
      : token0ApprovedStatus === 2 &&
        token1ApprovedStatus === 2 &&
        isAddLiquidityButtonClicked
      ? true
      : true,
    transactionHashData: transactionHashData,
    network: props.network,
    isAddLiquidityTransaction: true,
  };
  function AddLiquidityButton({ add, isDisable }) {
    return (
      <Button
        className={styles.button_box}
        size="md"
        onClick={add}
        disabled={isDisable}
      >
        Add Liquidity
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

            <p className={styles.header_middle}>Add Liquidity</p>

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

          <SwapBoxToggler toggle={addLiquiditytoggler} isJoinPool={true} />

          <SwapBoxTo
            SwapBoxToParams={SwapBoxToParams}
            network={props.network}
          />

          {token0Data && token1Data ? (
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
                    {poolPrice.length > 2 ? ( //
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
          ) : null}

          {isAuthenticated &&
          token0Data &&
          token0Data.tokenAddress.toString().toLowerCase() !==
            props.network.wethAddress.toString().toLowerCase() &&
          token1Data &&
          input0 &&
          input0 > 0 &&
          input0 <= token0Data.balance &&
          input1 &&
          input1 > 0 &&
          input1 <= token1Data.balance &&
          !isAlreadyToken0Approved ? (
            <DynamicButton
              text={
                token0ApprovedStatus === 0 || token0ApprovedStatus === 3
                  ? `Approve ${token0Data.symbol}`
                  : [
                      token0ApprovedStatus === 1
                        ? "Approving..."
                        : token0ApprovedStatus === 2
                        ? "Approved"
                        : null,
                    ]
              }
              isDisable={
                token0ApprovedStatus === 1 ||
                token0ApprovedStatus === 2 ||
                token0ApprovedStatus === 3
              }
              func={token0Approve}
            />
          ) : null}

          {isAuthenticated &&
          token0Data &&
          token1Data &&
          token1Data.tokenAddress.toString().toLowerCase() !==
            props.network.wethAddress.toString().toLowerCase() &&
          input0 &&
          input0 > 0 &&
          input0 <= token0Data.balance &&
          input1 &&
          input1 > 0 &&
          input1 <= token1Data.balance &&
          !isAlreadyToken1Approved ? (
            <DynamicButton
              text={
                token1ApprovedStatus === 0 || token1ApprovedStatus === 3
                  ? `Approve ${token1Data.symbol}`
                  : [
                      token1ApprovedStatus === 1
                        ? "Approving..."
                        : token1ApprovedStatus === 2
                        ? "Approved"
                        : null,
                    ]
              }
              isDisable={
                token1ApprovedStatus === 1 ||
                token1ApprovedStatus === 2 ||
                token1ApprovedStatus === 3
              }
              func={token1Approve}
            />
          ) : null}

          {!isAuthenticated ? (
            <WalletButton connectWallet={connectWallet} />
          ) : (
            [
              !token0Data ? (
                <SelectATokenButton />
              ) : !token1Data ? (
                <SelectATokenButton />
              ) : !input0 ? (
                <AmountButton />
              ) : !input1 ? (
                <AmountButton />
              ) : input0 <= 0 || input1 <= 0 ? (
                <DynamicButton text={"Enter an Amount"} isDisable={true} />
              ) : input0 > token0Data.balance ? (
                <InsufficientBalanceButton />
              ) : input1 > token1Data.balance ? (
                <InsufficientBalanceButton />
              ) : (
                <AddLiquidityButton
                  add={confirmTransactionModalToggle}
                  isDisable={
                    isFetching
                      ? true
                      : // eth + token
                      token0Data.tokenAddress.toString().toLowerCase() ===
                          props.network.wethAddress.toString().toLowerCase() &&
                        isAlreadyToken1Approved &&
                        !isAddLiquidityButtonClicked
                      ? false
                      : token0Data.tokenAddress.toString().toLowerCase() ===
                          props.network.wethAddress.toString().toLowerCase() &&
                        isAlreadyToken1Approved &&
                        isAddLiquidityButtonClicked
                      ? true
                      : // if already not approved
                      token0Data.tokenAddress.toString().toLowerCase() ===
                          props.network.wethAddress.toString().toLowerCase() &&
                        token1ApprovedStatus !== 2
                      ? true
                      : token0Data.tokenAddress.toString().toLowerCase() ===
                          props.network.wethAddress.toString().toLowerCase() &&
                        token1ApprovedStatus === 2 &&
                        !isAddLiquidityButtonClicked
                      ? false
                      : token0Data.tokenAddress.toString().toLowerCase() ===
                          props.network.wethAddress.toString().toLowerCase() &&
                        token1ApprovedStatus === 2 &&
                        isAddLiquidityButtonClicked
                      ? true
                      : // token + eth

                      token1Data.tokenAddress.toString().toLowerCase() ===
                          props.network.wethAddress.toString().toLowerCase() &&
                        isAlreadyToken0Approved &&
                        !isAddLiquidityButtonClicked
                      ? false
                      : token1Data.tokenAddress.toString().toLowerCase() ===
                          props.network.wethAddress.toString().toLowerCase() &&
                        isAlreadyToken0Approved &&
                        isAddLiquidityButtonClicked
                      ? true
                      : // if already not approved
                      token1Data.tokenAddress.toString().toLowerCase() ===
                          props.network.wethAddress.toString().toLowerCase() &&
                        token0ApprovedStatus !== 2
                      ? true
                      : token1Data.tokenAddress.toString().toLowerCase() ===
                          props.network.wethAddress.toString().toLowerCase() &&
                        token0ApprovedStatus === 2 &&
                        !isAddLiquidityButtonClicked
                      ? false
                      : token1Data.tokenAddress.toString().toLowerCase() ===
                          props.network.wethAddress.toString().toLowerCase() &&
                        token0ApprovedStatus === 2 &&
                        isAddLiquidityButtonClicked
                      ? true
                      : // token + token

                      isAlreadyToken0Approved &&
                        isAlreadyToken1Approved &&
                        !isAddLiquidityButtonClicked
                      ? false
                      : isAlreadyToken0Approved && token1ApprovedStatus !== 2
                      ? true
                      : token0ApprovedStatus !== 2 && isAlreadyToken1Approved
                      ? true
                      : token0ApprovedStatus !== 2 && token1ApprovedStatus !== 2
                      ? true
                      : token0ApprovedStatus === 2 && token1ApprovedStatus !== 2
                      ? true
                      : token0ApprovedStatus !== 2 && token1ApprovedStatus === 2
                      ? true
                      : token0ApprovedStatus === 2 &&
                        token1ApprovedStatus === 2 &&
                        !isAddLiquidityButtonClicked
                      ? false
                      : token0ApprovedStatus === 2 &&
                        token1ApprovedStatus === 2 &&
                        isAddLiquidityButtonClicked
                      ? true
                      : true
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
export default JoinPoolPage;
