// -----------------    optimal ------------------------
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  isTokenToModalOpen,
  isTokenFromModalOpen,
} from "../../../../actions/utilsAction";
import {
  checkForPairExists,
  getAmountOut,
  quoteAddLiquidity,
  fetchReserves,
  getPairAddress,
  getpairContract,
  getAmoutOutRemoveLiquidity,
  SmartRoutes,
} from "../../../../actions/contractFunction";
import styles from "./SwapBoxFrom.module.css";
import { useAlert } from "react-alert";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";

function SwapBoxFrom({ SwapBoxFromParams, network }) {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { user, error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );
  const { poolAssets } = useSelector((state) => state.poolAssets);

  const setPoolPriceForAddLiqORJoinLiq = async (amount) => {
    const reserves = await fetchReserves(
      SwapBoxFromParams.token0Data.tokenAddress,
      SwapBoxFromParams.token1Data.tokenAddress,
      network.factory
    );
    if (reserves[0] === 0 && reserves[1] === 0) {
      let p = [];
      p.push(0);
      p.push(0);
      p.push(100);
      await SwapBoxFromParams.sendPoolPrice(p);
    } else {
      if (amount > 0) {
        const quote = await quoteAddLiquidity(
          SwapBoxFromParams.token0Data.tokenAddress,
          SwapBoxFromParams.token1Data.tokenAddress,
          amount,
          false,
          network.factory
        );

        if (quote.length > 0) {
          await SwapBoxFromParams.sendInputAmount1(Number(quote[1]));
          let p = [];
          p.push(reserves[1] / reserves[0]);
          p.push(reserves[0] / reserves[1]);
          const pair = await getPairAddress(
            SwapBoxFromParams.token0Data.tokenAddress,
            SwapBoxFromParams.token1Data.tokenAddress,
            network.factory
          );
          if (pair) {
            const pairContract = await getpairContract(pair);
            const _totalSupply =
              Number(await pairContract.methods.totalSupply().call()) *
              10 ** -Number(await pairContract.methods.decimals().call());
            let liqPercent =
              (Number(quote[2]) / (Number(_totalSupply) + Number(quote[2]))) *
              100;
            p.push(Number(liqPercent));
          }
          //console.log(" from " + p[2]);
          await SwapBoxFromParams.sendPoolPrice(p);
        }
      }
    }
  };

  // async function setTokenMinAmount(event) {
  //   if (SwapBoxFromParams.token0Data && SwapBoxFromParams.token1Data) {
  //     await SwapBoxFromParams.sendInputAmount0Min(event.target.value);
  //     if (SwapBoxFromParams.amount0) {
  //       const data = await getAmoutOutRemoveLiquidity(
  //         SwapBoxFromParams.token0Data.tokenAddress,
  //         SwapBoxFromParams.token1Data.tokenAddress,
  //         event.target.value,
  //         false
  //       );
  //       if (data) {
  //         await SwapBoxFromParams.sendInputAmount1Min(data[2]);
  //         //await SwapBoxFromParams.sendLiquidity_BN(data[0]);
  //       }
  //     }
  //   } else {
  //     alert.show("Please select tokens first");
  //     await SwapBoxFromParams.sendInputAmount0Min("");
  //   }
  // }

  async function setTokenAmount(event) {
    if (SwapBoxFromParams.token0Data && SwapBoxFromParams.token1Data) {
      await SwapBoxFromParams.sendInputAmount0(event.target.value);

      if (SwapBoxFromParams.isAddLiquidityOn) {
        await setPoolPriceForAddLiqORJoinLiq(event.target.value);
      } else if (SwapBoxFromParams.isJoinPoolOn) {
        await setPoolPriceForAddLiqORJoinLiq(event.target.value);
      } else if (SwapBoxFromParams.isRemoveMyLiquidityOn) {
        if (isAuthenticated) {
          if (event.target.value > 0) {
            const data = await getAmoutOutRemoveLiquidity(
              SwapBoxFromParams.token0Data.tokenAddress,
              SwapBoxFromParams.token1Data.tokenAddress,
              event.target.value,
              false,
              network.factory
            );
            if (data) {
              await SwapBoxFromParams.sendInputAmount1(data[2]);
              await SwapBoxFromParams.sendLiquidity_BN(data[0]);
            }
          }
        } else {
          alert.error("You are not authorised");
        }
      } else {
        if (
          await checkForPairExists(
            SwapBoxFromParams.token0Data.tokenAddress,
            SwapBoxFromParams.token1Data.tokenAddress,
            network.factory
          )
        ) {
          if (event.target.value > 0) {
            const amount = await getAmountOut(
              [
                SwapBoxFromParams.token0Data.tokenAddress,
                SwapBoxFromParams.token1Data.tokenAddress,
              ],
              event.target.value,
              network.router
            );

            await SwapBoxFromParams.sendInputAmount1(amount);
            await SwapBoxFromParams.sendSmartRoute([
              SwapBoxFromParams.token0Data.tokenAddress,
              SwapBoxFromParams.token1Data.tokenAddress,
            ]);
            //  console.log("gha");
          }
        } else if (poolAssets && Object.values(poolAssets).length > 0) {
          if (event.target.value > 0) {
            let routes = await SmartRoutes(
              Object.values(poolAssets),
              SwapBoxFromParams.token0Data.tokenAddress,
              SwapBoxFromParams.token1Data.tokenAddress
            );
            if (routes.length > 0) {
              let bestPrice = 0;
              let bestRoute = [];
              for (const item of routes) {
                let price = await getAmountOut(
                  item,
                  event.target.value,
                  network.router
                );
                if (price > bestPrice) {
                  bestPrice = price;
                  bestRoute = item;
                }
              }
              await SwapBoxFromParams.sendInputAmount1(bestPrice);
              await SwapBoxFromParams.sendSmartRoute(bestRoute);
            } else {
              alert.error("No route found");
            }
          }
        }
      }
    } else {
      alert.show("Please select tokens first");
      await SwapBoxFromParams.sendInputAmount0("");
    }
  }

  const modal = () => {
    if (SwapBoxFromParams.isJoinPoolOn) {
    } else if (SwapBoxFromParams.isRemoveMyLiquidityOn) {
    } else {
      SwapBoxFromParams.togglemodal();
      dispatch(isTokenFromModalOpen(true));
      dispatch(isTokenToModalOpen(false));
    }
  };

  const inputMax = async () => {
    if (
      isAuthenticated &&
      SwapBoxFromParams.token0Data &&
      SwapBoxFromParams.token1Data &&
      SwapBoxFromParams.token0Data.balance
    ) {
      await SwapBoxFromParams.sendInputAmount0(
        SwapBoxFromParams.token0Data.balance
      );
      if (SwapBoxFromParams.isAddLiquidityOn) {
        await setPoolPriceForAddLiqORJoinLiq(
          SwapBoxFromParams.token0Data.balance
        );
      } else if (SwapBoxFromParams.isJoinPoolOn) {
        await setPoolPriceForAddLiqORJoinLiq(
          SwapBoxFromParams.token0Data.balance
        );
      } else if (SwapBoxFromParams.isRemoveMyLiquidityOn) {
        if (SwapBoxFromParams.token0Data.balance > 0) {
          const data = await getAmoutOutRemoveLiquidity(
            SwapBoxFromParams.token0Data.tokenAddress,
            SwapBoxFromParams.token1Data.tokenAddress,
            SwapBoxFromParams.token0Data.balance,
            false,
            network.factory
          );
          if (data) {
            await SwapBoxFromParams.sendInputAmount1(data[2]);
            await SwapBoxFromParams.sendLiquidity_BN(data[0]);
          }
        }
      } else {
        if (
          await checkForPairExists(
            SwapBoxFromParams.token0Data.tokenAddress,
            SwapBoxFromParams.token1Data.tokenAddress,
            network.factory
          )
        ) {
          if (SwapBoxFromParams.token0Data.balance > 0) {
            const amount = await getAmountOut(
              [
                SwapBoxFromParams.token0Data.tokenAddress,
                SwapBoxFromParams.token1Data.tokenAddress,
              ],
              SwapBoxFromParams.token0Data.balance,
              network.router
            );

            await SwapBoxFromParams.sendInputAmount1(amount);
            await SwapBoxFromParams.sendSmartRoute([
              SwapBoxFromParams.token0Data.tokenAddress,
              SwapBoxFromParams.token1Data.tokenAddress,
            ]);
          }
        } else if (poolAssets && Object.values(poolAssets).length > 0) {
          if (SwapBoxFromParams.token0Data.balance > 0) {
            let routes = await SmartRoutes(
              Object.values(poolAssets),
              SwapBoxFromParams.token0Data.tokenAddress,
              SwapBoxFromParams.token1Data.tokenAddress
            );
            if (routes.length > 0) {
              let bestPrice = 0;
              let bestRoute = [];
              for (const item of routes) {
                let price = await getAmountOut(
                  item,
                  SwapBoxFromParams.token0Data.balance,
                  network.router
                );
                if (price > bestPrice) {
                  bestPrice = price;
                  bestRoute = item;
                }
              }
              await SwapBoxFromParams.sendInputAmount1(bestPrice);
              await SwapBoxFromParams.sendSmartRoute(bestRoute);
            } else {
              alert.error("No route found");
            }
          }
        }
      }
    } else if (!SwapBoxFromParams.token0Data || !SwapBoxFromParams.token1Data) {
      alert.show("Please select tokens first");
    }
  };

  async function load() {}
  useEffect(() => {
    load();
  }, [
    dispatch,
    poolAssets,
    // SwapBoxFromParams.token1Address,
    // SwapBoxFromParams.token2Address,
    SwapBoxFromParams.amount0,
    user,
    error,
    loading,
    isAuthenticated,
  ]);

  return (
    <div className={styles.swap_box}>
      <div>
        <p className={styles.from}>
          {SwapBoxFromParams.isAddLiquidityOn ||
          SwapBoxFromParams.isJoinPoolOn ||
          SwapBoxFromParams.isRemoveMyLiquidityOn
            ? "Input"
            : "From"}
        </p>
        <p className={styles.balance}>
          {isAuthenticated &&
          SwapBoxFromParams.isRemoveMyLiquidityOn &&
          SwapBoxFromParams.token0Data ? (
            "Your Reserve : "
          ) : isAuthenticated && SwapBoxFromParams.token0Data ? (
            "Balance : "
          ) : (
            <p></p>
          )}

          {isAuthenticated &&
          SwapBoxFromParams.token0Data &&
          SwapBoxFromParams.token0Data.balance ? (
            Number(SwapBoxFromParams.token0Data.balance).toFixed(4)
          ) : (
            <p></p>
          )}
        </p>
      </div>
      <div>
        <input
          className={styles.input1}
          type="number"
          onChange={setTokenAmount}
          value={SwapBoxFromParams.amount0}
          placeholder="0.0"
        ></input>

        <div className={styles.tk_right}>
          {isAuthenticated &&
          SwapBoxFromParams.token0Data &&
          SwapBoxFromParams.token1Data ? (
            <span className={styles.max} onClick={inputMax}>
              max
            </span>
          ) : null}

          <span className={styles.select} onClick={modal}>
            {SwapBoxFromParams.token0Data ? (
              <span>
                {SwapBoxFromParams.token0Data.symbol}{" "}
                {SwapBoxFromParams.isJoinPoolOn ||
                SwapBoxFromParams.isRemoveMyLiquidityOn ? null : (
                  <KeyboardArrowDownIcon />
                )}
              </span>
            ) : (
              <span>
                select Token <KeyboardArrowDownIcon />
              </span>
            )}
          </span>
        </div>
      </div>
      {/* {SwapBoxFromParams.isRemoveMyLiquidityOn ||
      SwapBoxFromParams.isAddLiquidityOn ||
      SwapBoxFromParams.isJoinPoolOn ? (
        <div>
          {SwapBoxFromParams.isAddLiquidityOn ||
          SwapBoxFromParams.isJoinPoolOn ? (
            <p className={styles.left}>Min Amount</p>
          ) : (
            <p className={styles.left}>Minimum Output Amount</p>
          )}
          <input
            className={styles.input2}
            type="number"
            onChange={setTokenMinAmount}
            value={SwapBoxFromParams.amount0Min}
          ></input>
        </div>
      ) : null} */}
    </div>
  );
}
export default SwapBoxFrom;
