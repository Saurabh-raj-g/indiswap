// -----------------    optimal ------------------------

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  isTokenToModalOpen,
  isTokenFromModalOpen,
} from "../../../../actions/utilsAction";
import {
  checkForPairExists,
  getAmountIn,
  quoteAddLiquidity,
  fetchReserves,
  getPairAddress,
  getpairContract,
  getAmoutOutRemoveLiquidity,
  SmartRoutes,
} from "../../../../actions/contractFunction";
import { useAlert } from "react-alert";
import styles from "./SwapBoxTo.module.css";

import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";

function SwapBoxTo({ SwapBoxToParams, network }) {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { user, error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );
  const { poolAssets } = useSelector((state) => state.poolAssets);

  const setPoolPriceForAddLiqORJoinLiq = async (amount) => {
    if (
      (SwapBoxToParams.token0Data.isEth &&
        (await SwapBoxToParams.token1Data.tokenAddress
          .toString()
          .toLowerCase()
          .includes(await network.wethAddress.toString().toLowerCase()))) ||
      ((await SwapBoxToParams.token0Data.tokenAddress
        .toString()
        .toLowerCase()
        .includes(await network.wethAddress.toString().toLowerCase())) &&
        SwapBoxToParams.token1Data.isEth)
    ) {
    } else {
      const reserves = await fetchReserves(
        SwapBoxToParams.token0Data.isEth
          ? await network.wethAddress
          : SwapBoxToParams.token0Data.tokenAddress,
        SwapBoxToParams.token1Data.isEth
          ? await network.wethAddress
          : SwapBoxToParams.token1Data.tokenAddress,
        network.factory
      );

      if (reserves[0] === 0 && reserves[1] === 0) {
        let p = [];
        p.push(0);
        p.push(0);
        p.push(100);
        await SwapBoxToParams.sendPoolPrice(p);
      } else {
        if (amount > 0) {
          const quote = await quoteAddLiquidity(
            SwapBoxToParams.token0Data.isEth
              ? await network.wethAddress
              : SwapBoxToParams.token0Data.tokenAddress,
            SwapBoxToParams.token1Data.isEth
              ? await network.wethAddress
              : SwapBoxToParams.token1Data.tokenAddress,
            amount,
            true,
            network.factory
          );
          if (quote.length > 0) {
            await SwapBoxToParams.sendInputAmount0(Number(quote[0]));
            let p = [];
            p.push(reserves[1] / reserves[0]);
            p.push(reserves[0] / reserves[1]);
            const pair = await getPairAddress(
              SwapBoxToParams.token0Data.isEth
                ? await network.wethAddress
                : SwapBoxToParams.token0Data.tokenAddress,
              SwapBoxToParams.token1Data.isEth
                ? await network.wethAddress
                : SwapBoxToParams.token1Data.tokenAddress,
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
            // console.log(" to  " + p[2]);
            await SwapBoxToParams.sendPoolPrice(p);
          }
        }
      }
    }
  };

  // async function setTokenMinAmount(event) {
  //   if (SwapBoxToParams.token0Data && SwapBoxToParams.token1Data) {
  //     await SwapBoxToParams.sendInputAmount1Min(event.target.value);
  //     if (SwapBoxToParams.amount1) {
  //       const data = await getAmoutOutRemoveLiquidity(
  //         SwapBoxToParams.token0Data.tokenAddress,
  //         SwapBoxToParams.token1Data.tokenAddress,
  //         event.target.value,
  //         true
  //       );
  //       if (data) {
  //         await SwapBoxToParams.sendInputAmount0Min(data[1]);
  //         //await SwapBoxFromParams.sendLiquidity_BN(data[0]);
  //       }
  //     }
  //   } else {
  //     alert.show("Please select tokens first");
  //     await SwapBoxToParams.sendInputAmount1Min("");
  //   }
  // }

  async function setTokenAmount(event) {
    if (SwapBoxToParams.token0Data && SwapBoxToParams.token1Data) {
      await SwapBoxToParams.sendInputAmount1(event.target.value);

      if (SwapBoxToParams.isAddLiquidityOn) {
        await SwapBoxToParams.sendFetchingStatus(true);
        await setPoolPriceForAddLiqORJoinLiq(event.target.value);
        await SwapBoxToParams.sendFetchingStatus(false);
      } else if (SwapBoxToParams.isJoinPoolOn) {
        await setPoolPriceForAddLiqORJoinLiq(event.target.value);
      } else if (SwapBoxToParams.isRemoveMyLiquidityOn) {
        if (isAuthenticated) {
          if (event.target.value > SwapBoxToParams.token1Data.balance) {
            alert.error("insufficient liquidity");
          } else if (event.target.value > 0) {
            const data = await getAmoutOutRemoveLiquidity(
              SwapBoxToParams.token0Data.tokenAddress,
              SwapBoxToParams.token1Data.tokenAddress,
              event.target.value,
              true,
              network.factory
            );
            if (data) {
              await SwapBoxToParams.sendInputAmount0(data[1]);
              await SwapBoxToParams.sendLiquidity_BN(data[0]);
            }
          }
        } else {
          alert.error("You are not authorised");
        }
      } else {
        // if (
        //   await checkForPairExists(
        //     SwapBoxToParams.token0Data.tokenAddress,
        //     SwapBoxToParams.token1Data.tokenAddress,
        //     network.factory
        //   )
        // ) {
        //   if (event.target.value > 0) {
        //     const reserves = await fetchReserves(
        //       SwapBoxToParams.token0Data.tokenAddress,
        //       SwapBoxToParams.token1Data.tokenAddress,
        //       network.factory
        //     );
        //     if (Number(event.target.value) > Number(reserves[1])) {
        //       alert.error(
        //         `greater than reserve !\n amount should be less than ${reserves[1]}`
        //       );
        //     } else {
        //       const amount = await getAmountIn(
        //         [
        //           SwapBoxToParams.token0Data.tokenAddress,
        //           SwapBoxToParams.token1Data.tokenAddress,
        //         ],
        //         event.target.value,
        //         network.router
        //       );

        //       await SwapBoxToParams.sendInputAmount0(amount);
        //       await SwapBoxToParams.sendSmartRoute([
        //         SwapBoxToParams.token0Data.tokenAddress,
        //         SwapBoxToParams.token1Data.tokenAddress,
        //       ]);
        //     }
        //   }
        // } else
        if (event.target.value > 0) {
          //console.log("nc");
          if (
            SwapBoxToParams.token0Data.isEth &&
            SwapBoxToParams.token1Data.tokenAddress
              .toString()
              .toLowerCase()
              .includes(await network.wethAddress.toString().toLowerCase())
          ) {
            //console.log("hsk");
            await SwapBoxToParams.sendInputAmount0(event.target.value);
            //let weth = await getWethContract(await network.wethAddress)
          } else if (
            SwapBoxToParams.token1Data.isEth &&
            SwapBoxToParams.token0Data.tokenAddress
              .toString()
              .toLowerCase()
              .includes(await network.wethAddress.toString().toLowerCase())
          ) {
            await SwapBoxToParams.sendInputAmount0(event.target.value);
          } else {
            if (poolAssets && Object.values(poolAssets).length > 0) {
              if (event.target.value > 0) {
                await SwapBoxToParams.sendFetchingStatus(true);
                let routes = await SmartRoutes(
                  Object.values(poolAssets),
                  SwapBoxToParams.token0Data.isEth
                    ? network.wethAddress
                    : SwapBoxToParams.token0Data.tokenAddress,
                  SwapBoxToParams.token1Data.isEth
                    ? network.wethAddress
                    : SwapBoxToParams.token1Data.tokenAddress
                );
                if (routes.length > 0) {
                  let bestPrice = 0;
                  let bestRoute = [];
                  let i = routes.length;
                  for (const item of routes) {
                    const reserves = await fetchReserves(
                      item[item.length - 2],
                      item[item.length - 1],
                      network.factory
                    );
                    if (i === 1) {
                      if (
                        Number(event.target.value) > Number(reserves[1]) &&
                        bestRoute.length === 0
                      ) {
                        await SwapBoxToParams.sendInputAmount1("");
                        alert.error(
                          `greater than reserve !\n amount should be less than ${reserves[1]}`
                        );
                      } else if (
                        Number(event.target.value) > Number(reserves[1]) &&
                        bestRoute.length !== 0
                      ) {
                        continue;
                      } else if (
                        Number(event.target.value) <= Number(reserves[1])
                      ) {
                        let price = await getAmountIn(
                          item,
                          event.target.value,
                          network.router
                        );
                        if (price > bestPrice) {
                          bestPrice = price;
                          bestRoute = item;
                        }
                      }
                    } else {
                      i--;
                      if (Number(event.target.value) > Number(reserves[1])) {
                        continue;
                      } else {
                        let price = await getAmountIn(
                          item,
                          event.target.value,
                          network.router
                        );
                        if (price > bestPrice) {
                          bestPrice = price;
                          bestRoute = item;
                        }
                      }
                    }
                  }
                  // eth -weth
                  if (SwapBoxToParams.token0Data.isEth) {
                    bestRoute[0] = SwapBoxToParams.token0Data.tokenAddress;
                  } else if (SwapBoxToParams.token1Data.isEth) {
                    bestRoute[bestRoute.length - 1] =
                      SwapBoxToParams.token1Data.tokenAddress;
                  }
                  //
                  if (bestPrice !== 0) {
                    await SwapBoxToParams.sendInputAmount0(bestPrice);
                    await SwapBoxToParams.sendSmartRoute(bestRoute);
                  }
                } else {
                  alert.error("No route found");
                }
                await SwapBoxToParams.sendFetchingStatus(false);
              }
            } else {
              await SwapBoxToParams.sendInputAmount1("");
              alert.info("Please wait while loading data");
            }
          }
        }
      }
    } else {
      alert.show("Please select tokens first");
      await SwapBoxToParams.sendInputAmount1("");
    }
  }

  const modal = async () => {
    if (SwapBoxToParams.isJoinPoolOn) {
    } else if (SwapBoxToParams.isRemoveMyLiquidityOn) {
    } else {
      SwapBoxToParams.togglemodal();
      dispatch(isTokenFromModalOpen(false));
      dispatch(isTokenToModalOpen(true));
    }
  };

  const inputMax = async () => {
    if (
      isAuthenticated &&
      SwapBoxToParams.token0Data &&
      SwapBoxToParams.token1Data &&
      SwapBoxToParams.token1Data.balance
    ) {
      await SwapBoxToParams.sendInputAmount1(
        SwapBoxToParams.token1Data.balance
      );
      if (SwapBoxToParams.isAddLiquidityOn) {
        await setPoolPriceForAddLiqORJoinLiq(
          SwapBoxToParams.token1Data.balance
        );
      } else if (SwapBoxToParams.isJoinPoolOn) {
        await setPoolPriceForAddLiqORJoinLiq(
          SwapBoxToParams.token1Data.balance
        );
      } else if (SwapBoxToParams.isRemoveMyLiquidityOn) {
        if (SwapBoxToParams.token1Data.balance > 0) {
          const data = await getAmoutOutRemoveLiquidity(
            SwapBoxToParams.token0Data.tokenAddress,
            SwapBoxToParams.token1Data.tokenAddress,
            SwapBoxToParams.token1Data.balance,
            true,
            network.factory
          );
          if (data) {
            await SwapBoxToParams.sendInputAmount0(data[1]);
            await SwapBoxToParams.sendLiquidity_BN(data[0]);
          }
        }
      } else {
        // if (
        //   await checkForPairExists(
        //     SwapBoxToParams.token0Data.tokenAddress,
        //     SwapBoxToParams.token1Data.tokenAddress,
        //     network.factory
        //   )
        // ) {
        //   if (SwapBoxToParams.token1Data.balance > 0) {
        //     const reserves = await fetchReserves(
        //       SwapBoxToParams.token0Data.tokenAddress,
        //       SwapBoxToParams.token1Data.tokenAddress,
        //       network.factory
        //     );
        //     if (SwapBoxToParams.token1Data.balance > reserves[1]) {
        //       alert.error(
        //         `greater than reserve !\n amount should be less than ${reserves[1]}`
        //       );
        //     } else {
        //       const amount = await getAmountIn(
        //         [
        //           SwapBoxToParams.token0Data.tokenAddress,
        //           SwapBoxToParams.token1Data.tokenAddress,
        //         ],
        //         SwapBoxToParams.token1Data.balance,
        //         network.router
        //       );

        //       await SwapBoxToParams.sendInputAmount0(amount);
        //       await SwapBoxToParams.sendSmartRoute([
        //         SwapBoxToParams.token0Data.tokenAddress,
        //         SwapBoxToParams.token1Data.tokenAddress,
        //       ]);
        //     }
        //   }
        // } else
        if (
          SwapBoxToParams.token0Data.isEth &&
          SwapBoxToParams.token1Data.tokenAddress
            .toString()
            .toLowerCase()
            .includes(await network.wethAddress.toString().toLowerCase())
        ) {
          //console.log("hsk");
          await SwapBoxToParams.sendInputAmount0(
            SwapBoxToParams.token1Data.balance
          );
          //let weth = await getWethContract(await network.wethAddress)
        } else if (
          SwapBoxToParams.token1Data.isEth &&
          SwapBoxToParams.token0Data.tokenAddress
            .toString()
            .toLowerCase()
            .includes(await network.wethAddress.toString().toLowerCase())
        ) {
          await SwapBoxToParams.sendInputAmount0(
            SwapBoxToParams.token1Data.balance
          );
        } else {
          if (poolAssets && Object.values(poolAssets).length > 0) {
            if (SwapBoxToParams.token1Data.balance > 0) {
              await SwapBoxToParams.sendFetchingStatus(true);
              let routes = await SmartRoutes(
                Object.values(poolAssets),
                SwapBoxToParams.token0Data.isEth
                  ? network.wethAddress
                  : SwapBoxToParams.token0Data.tokenAddress,
                SwapBoxToParams.token1Data.isEth
                  ? network.wethAddress
                  : SwapBoxToParams.token1Data.tokenAddress
              );
              if (routes.length > 0) {
                let bestPrice = 0;
                let bestRoute = [];
                let i = routes.length;
                for (const item of routes) {
                  const reserves = await fetchReserves(
                    item[item.length - 2],
                    item[item.length - 1],
                    network.factory
                  );
                  if (i === 1) {
                    if (
                      SwapBoxToParams.token1Data.balance > reserves[1] &&
                      bestRoute.length === 0
                    ) {
                      alert.error(
                        `greater than reserve !\n amount should be less than ${reserves[1]}`
                      );
                    } else if (
                      SwapBoxToParams.token1Data.balance > reserves[1] &&
                      bestRoute.length !== 0
                    ) {
                      continue;
                    } else if (
                      SwapBoxToParams.token1Data.balance < reserves[1]
                    ) {
                      let price = await getAmountIn(
                        item,
                        SwapBoxToParams.token1Data.balance,
                        network.router
                      );
                      if (price > bestPrice) {
                        bestPrice = price;
                        bestRoute = item;
                      }
                    }
                  } else {
                    i--;
                    if (SwapBoxToParams.token1Data.balance > reserves[1]) {
                      continue;
                    } else {
                      let price = await getAmountIn(
                        item,
                        SwapBoxToParams.token1Data.balance,
                        network.router
                      );
                      if (price > bestPrice) {
                        bestPrice = price;
                        bestRoute = item;
                      }
                    }
                  }
                }
                // eth -weth
                if (SwapBoxToParams.token0Data.isEth) {
                  bestRoute[0] = SwapBoxToParams.token0Data.tokenAddress;
                } else if (SwapBoxToParams.token1Data.isEth) {
                  bestRoute[bestRoute.length - 1] =
                    SwapBoxToParams.token1Data.tokenAddress;
                }
                //
                if (bestPrice !== 0) {
                  await SwapBoxToParams.sendInputAmount0(bestPrice);
                  await SwapBoxToParams.sendSmartRoute(bestRoute);
                }
              } else {
                alert.error("No route found");
              }
              await SwapBoxToParams.sendFetchingStatus(false);
            }
          } else {
            await SwapBoxToParams.sendInputAmount1("");
            alert.info("Please wait while loading data");
          }
        }
      }
    } else if (!SwapBoxToParams.token0Data || !SwapBoxToParams.token1Data) {
      alert.show("Please select tokens first");
    }
  };

  async function load() {}

  useEffect(() => {
    load();
  }, [
    dispatch,
    poolAssets,
    // SwapBoxToParams.token1Address,
    // SwapBoxToParams.token2Address,
    SwapBoxToParams.amount1,
    user,
    error,
    loading,
    isAuthenticated,
  ]);

  return (
    <div className={styles.swap_box}>
      <div>
        <p className={styles.from}>
          {SwapBoxToParams.isAddLiquidityOn ||
          SwapBoxToParams.isJoinPoolOn ||
          SwapBoxToParams.isRemoveMyLiquidityOn
            ? "Input"
            : "To"}
        </p>
        <p className={styles.balance}>
          {isAuthenticated &&
          SwapBoxToParams.isRemoveMyLiquidityOn &&
          SwapBoxToParams.token1Data ? (
            "Your Reserve : "
          ) : isAuthenticated && SwapBoxToParams.token1Data ? (
            "Balance : "
          ) : (
            <p></p>
          )}

          {SwapBoxToParams.token1Data && SwapBoxToParams.token1Data.balance ? (
            Number(SwapBoxToParams.token1Data.balance).toFixed(4)
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
          value={SwapBoxToParams.amount1}
          placeholder="0.0"
        ></input>
        <div className={styles.tk_right}>
          {isAuthenticated &&
          SwapBoxToParams.token0Data &&
          SwapBoxToParams.token1Data ? (
            <span className={styles.max} onClick={inputMax}>
              max
            </span>
          ) : null}

          <span className={styles.select} onClick={modal}>
            {SwapBoxToParams.token1Data ? (
              <span>
                {SwapBoxToParams.token1Data.symbol}{" "}
                {SwapBoxToParams.isJoinPoolOn ||
                SwapBoxToParams.isRemoveMyLiquidityOn ? null : (
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
      {/* {SwapBoxToParams.isRemoveMyLiquidityOn ? (
        <div>
          <p className={styles.left}>Minimum Output Amount</p>
          <input
            className={styles.input2}
            type="number"
            onChange={setTokenMinAmount}
            value={SwapBoxToParams.amount1Min}
          ></input>
        </div>
      ) : null} */}
    </div>
  );
}
export default SwapBoxTo;
