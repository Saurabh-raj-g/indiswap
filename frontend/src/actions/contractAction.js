import {
  GET_ROUTER_REQUEST,
  GET_ROUTER_SUCCESS,
  GET_ROUTER_FAIL,
  GET_FACTORY_REQUEST,
  GET_FACTORY_SUCCESS,
  GET_FACTORY_FAIL,
  GET_WETH_REQUEST,
  GET_WETH_SUCCESS,
  GET_WETH_FAIL,
  GET_TOKEN_REQUEST,
  GET_TOKEN_SUCCESS,
  GET_TOKEN_FAIL,
  GET_TOKEN0_DATA_REQUEST,
  GET_TOKEN0_DATA_FAIL,
  GET_TOKEN0_DATA_SUCCESS,
  GET_TOKEN1_DATA_REQUEST,
  GET_TOKEN1_DATA_FAIL,
  GET_TOKEN1_DATA_SUCCESS,
  GET_MY_POOLED_ASSETS_REQUEST,
  GET_MY_POOLED_ASSETS_SUCCESS,
  GET_MY_POOLED_ASSETS_FAIL,
  GET_POOL_ASSETS_REQUEST,
  GET_POOL_ASSETS_SUCCESS,
  GET_POOL_ASSETS_FAIL,
  CLEAR_ERRORS,
} from "../constants/contractConstants.js";
import {
  getRouter,
  getFactory,
  getTokenContract,
  getWeth,
  getPairAddress,
  isFeeOn,
  getpairContract,
  getTokenData,
  getTokenDataWithBalance,
  getDataForPairs,
  getDataForPairsWithoutAuth,
  quote,
  getPairs,
  getAmountOut,
  fetchReserves,
  getReserves,
  getYourAllLiquidityPair,
  quoteAddLiquidity,
  quoteRemoveLiquidity,
} from "./contractFunction";
// import Web3 from "web3";
// import { ethers } from "ethers";

//const web3 = new Web3(window.ethereum);

// export const getToken0Data =
//   (contractAddress, isAuthenticated, user) => async (dispatch) => {
//     try {
//       dispatch({ type: GET_TOKEN0_DATA_REQUEST });
//       let token;
//       if (isAuthenticated) {
//         token = await getTokenDataWithBalance(contractAddress, user.account);
//       } else {
//         token = await getTokenData(contractAddress);
//       }
//       dispatch({ type: GET_TOKEN0_DATA_SUCCESS, payload: token });
//     } catch (error) {
//       dispatch({
//         type: GET_TOKEN0_DATA_FAIL,
//         payload: error.message,
//       });
//     }
//   };

// export const getToken1Data =
//   (contractAddress, isAuthenticated, user) => async (dispatch) => {
//     try {
//       dispatch({ type: GET_TOKEN1_DATA_REQUEST });
//       let token;
//       if (isAuthenticated) {
//         token = await getTokenDataWithBalance(contractAddress, user.account);
//       } else {
//         token = await getTokenData(contractAddress);
//       }

//       dispatch({ type: GET_TOKEN1_DATA_SUCCESS, payload: token });
//     } catch (error) {
//       dispatch({
//         type: GET_TOKEN1_DATA_FAIL,
//         payload: error.message,
//       });
//     }
//   };

export const myPooledAssetsAction =
  (user, factoryContract, wethAddress, chainId) => async (dispatch) => {
    try {
      dispatch({ type: GET_MY_POOLED_ASSETS_REQUEST });
      const d = await getYourAllLiquidityPair(user.account, factoryContract);
      if (d.length > 0) {
        let p = [];
        for (let i = 0; i < d.length; i++) {
          const data = await getDataForPairs(
            user.account,
            d[i],
            factoryContract,
            wethAddress,
            chainId
          );
          p.push(data[0]);
        }
        // importing pair and fetching to show
        let localData = await JSON.parse(localStorage.getItem("pairTokens"));
        if (localData) {
          if (localData[chainId]) {
            for (let i = 0; i < localData.length; i++) {
              for (let j = 0; j < d.length; j++) {
                if (
                  (await localData[i].pairAddress.toString().toLowerCase()) !==
                  (await d[j].toString().toLowerCase())
                ) {
                  if (j === d.length - 1) {
                    let data = await getDataForPairs(
                      user.account,
                      localData[i].pairAddress,
                      factoryContract,
                      wethAddress,
                      chainId
                    );

                    let mk = {
                      isMyAssets: true,
                    };

                    const final = await Object.assign(data[0], mk);
                    p.push(final);
                  }
                } else {
                  j = d.length;
                  continue;
                }
              }
            }
          }
        }
        dispatch({ type: GET_MY_POOLED_ASSETS_SUCCESS, payload: p });
      }
      if (d.length === 0) {
        let p = [];
        // importing pair and fetching to show
        let localData = await JSON.parse(localStorage.getItem("pairTokens"));
        if (localData) {
          if (localData[chainId]) {
            for (let i = 0; i < localData.length; i++) {
              let data = await getDataForPairs(
                user.account,
                localData[i].pairAddress,
                factoryContract,
                wethAddress,
                chainId
              );

              let mk = {
                isMyAssets: true,
              };

              const final = await Object.assign(data[0], mk);
              p.push(final);
            }
          }
        }
        dispatch({ type: GET_MY_POOLED_ASSETS_SUCCESS, payload: p });
      }
    } catch (error) {
      dispatch({
        type: GET_MY_POOLED_ASSETS_FAIL,
        payload: error.message,
      });
    }
  };

export const PoolAssetsAction =
  (isAuthenticated, user, factoryContract, wethAddress, chainId) =>
  async (dispatch) => {
    try {
      dispatch({ type: GET_POOL_ASSETS_REQUEST });
      const d = await getPairs(factoryContract);

      if (isAuthenticated) {
        const myAssets = await getYourAllLiquidityPair(
          user.account,
          factoryContract
        );
        if (d.length > 0) {
          if (myAssets.length > 0) {
            let p = [];
            for (let i = 0; i < d.length; i++) {
              for (let k = 0; k < myAssets.length; k++) {
                const data = await getDataForPairsWithoutAuth(
                  d[i],
                  factoryContract,
                  wethAddress,
                  chainId
                );
                if (
                  (await myAssets[k].toString().toLowerCase()) ===
                  (await data[0].pairAddress.toString().toLowerCase())
                ) {
                  const isMy = {
                    isMyAssets: true,
                  };
                  const final = Object.assign(data[0], isMy);
                  p.push(final);
                  k = myAssets.length;
                }
                if (
                  k === myAssets.length - 1 &&
                  (await myAssets[k].toString().toLowerCase()) !==
                    (await data[0].pairAddress.toString().toLowerCase())
                ) {
                  p.push(data[0]);
                }
              }
            }
            // importing pair and fetching to show
            let localData = await JSON.parse(
              localStorage.getItem("pairTokens")
            );
            if (localData) {
              if (localData[chainId]) {
                for (let i = 0; i < localData.length; i++) {
                  for (let j = 0; j < p.length; j++) {
                    if (
                      (await localData[i].pairAddress
                        .toString()
                        .toLowerCase()) !==
                      (await p[j].pairAddress.toString().toLowerCase())
                    ) {
                      if (j === p.length - 1) {
                        const data = await getDataForPairsWithoutAuth(
                          localData[i].pairAddress,
                          factoryContract,
                          wethAddress,
                          chainId
                        );
                        for (let k = 0; k < myAssets.length; k++) {
                          if (
                            (await localData[i].pairAddress
                              .toString()
                              .toLowerCase()) ===
                            (await myAssets[k].toString().toLowerCase())
                          ) {
                            let mk = {
                              isMyAssets: true,
                            };

                            const final = await Object.assign(data[0], mk);
                            p.push(final);

                            k = myAssets.length;
                            break;
                          } else {
                            if ((k = myAssets.length - 1)) {
                              p.push(data[0]);
                            }
                          }
                        }
                      }
                    } else {
                      j = p.length;
                      continue;
                    }
                  }
                }
              }
            }

            dispatch({ type: GET_POOL_ASSETS_SUCCESS, payload: p });
          } else {
            let p = [];
            for (let i = 0; i < d.length; i++) {
              const data = await getDataForPairsWithoutAuth(
                d[i],
                factoryContract,
                wethAddress,
                chainId
              );

              p.push(data[0]);
            }

            // importing pair and fetching to show
            let localData = await JSON.parse(
              localStorage.getItem("pairTokens")
            );
            if (localData) {
              if (localData[chainId]) {
                for (let i = 0; i < localData.length; i++) {
                  for (let j = 0; j < p.length; j++) {
                    if (
                      (await localData[i].pairAddress
                        .toString()
                        .toLowerCase()) !==
                      (await p[j].pairAddress.toString().toLowerCase())
                    ) {
                      if (j === p.length - 1) {
                        const data = await getDataForPairsWithoutAuth(
                          localData[i].pairAddress,
                          factoryContract,
                          wethAddress,
                          chainId
                        );

                        p.push(data[0]);
                      }
                    } else {
                      j = p.length;
                      continue;
                    }
                  }
                }
              }
            }

            dispatch({ type: GET_POOL_ASSETS_SUCCESS, payload: p });
          }
        }
      } else {
        if (d.length > 0) {
          let p = [];
          for (let i = 0; i < d.length; i++) {
            const data = await getDataForPairsWithoutAuth(
              d[i],
              factoryContract,
              wethAddress,
              chainId
            );
            p.push(data[0]);
          }

          // importing pair and fetching to show
          let localData = await JSON.parse(localStorage.getItem("pairTokens"));
          if (localData) {
            if (localData[chainId]) {
              for (let i = 0; i < localData.length; i++) {
                for (let j = 0; j < p.length; j++) {
                  if (
                    (await localData[i].pairAddress
                      .toString()
                      .toLowerCase()) !==
                    (await p[j].pairAddress.toString().toLowerCase())
                  ) {
                    if (j === p.length - 1) {
                      const data = await getDataForPairsWithoutAuth(
                        localData[i].pairAddress,
                        factoryContract,
                        wethAddress,
                        chainId
                      );

                      p.push(data[0]);
                    }
                  } else {
                    j = p.length;
                    continue;
                  }
                }
              }
            }
          }

          dispatch({ type: GET_POOL_ASSETS_SUCCESS, payload: p });
        }
      }
    } catch (error) {
      dispatch({
        type: GET_POOL_ASSETS_FAIL,
        payload: error.message,
      });
    }
  };

// export const getWethAction = () => async (dispatch) => {
//   try {
//     dispatch({ type: GET_WETH_REQUEST });
//     //var web3 = await getWeb3();
//     const weth = await getWeth();
//     dispatch({ type: GET_WETH_SUCCESS, payload: weth });
//   } catch (error) {
//     dispatch({
//       type: GET_WETH_FAIL,
//       payload: error.message,
//     });
//   }
// };

// export const getToken0DataAuth = (contractAddress) => async (dispatch) => {
//   try {
//     dispatch({ type: GET_TOKEN0_DATA_AUTH_REQUEST });
//     const token = await getTokenDataWithBalance(contractAddress);

//     dispatch({ type: GET_TOKEN0_DATA_AUTH_SUCCESS, payload: token });
//   } catch (error) {
//     dispatch({
//       type: GET_TOKEN0_DATA_AUTH_FAIL,
//       payload: error.message,
//     });
//   }
// };

// export const getToken1DataAuth = (contractAddress) => async (dispatch) => {
//   try {
//     dispatch({ type: GET_TOKEN1_DATA_AUTH_REQUEST });
//     const token = await getTokenDataWithBalance(contractAddress);

//     dispatch({ type: GET_TOKEN1_DATA_AUTH_SUCCESS, payload: token });
//   } catch (error) {
//     dispatch({
//       type: GET_TOKEN1_DATA_AUTH_FAIL,
//       payload: error.message,
//     });
//   }
//};

// export const getRouter = (contractAddress) => async (dispatch) => {
//   try {
//     dispatch({ type: GET_ROUTER_REQUEST });
//     //var web3 = await getWeb3();
//     const routerContract = await new web3.eth.Contract(
//       ROUTER.abi,
//       contractAddress
//     );
//     dispatch({ type: GET_ROUTER_SUCCESS, payload: 3 });
//   } catch (error) {
//     dispatch({
//       type: GET_ROUTER_FAIL,
//       payload: error.message,
//     });
//   }
// };

// export const getFactory = (contractAddress) => async (dispatch) => {
//   try {
//     dispatch({ type: GET_FACTORY_REQUEST });
//     //var web3 = await getWeb3();
//     const factoryContract = await new web3.eth.Contract(
//       FACTORY.abi,
//       contractAddress
//     );
//     dispatch({ type: GET_FACTORY_SUCCESS, payload: factoryContract });
//   } catch (error) {
//     dispatch({
//       type: GET_FACTORY_FAIL,
//       payload: error.message,
//     });
//   }
// };

// export const getToken = (contractAddress) => async (dispatch) => {
//   try {
//     dispatch({ type: GET_TOKEN_REQUEST });
//     //var web3 = await getWeb3();
//     const tokenContract = await new web3.eth.Contract(
//       ERC20.abi,
//       contractAddress
//     );
//     dispatch({ type: GET_TOKEN_SUCCESS, payload: tokenContract });
//   } catch (error) {
//     dispatch({
//       type: GET_TOKEN_FAIL,
//       payload: error.message,
//     });
//   }
// };

// export const getTokenBalanceAndSymbol =
//   (tokenAddress, account) => async (dispatch) => {
//     try {
//       dispatch({ type: GET_TOKEN_BALANCE_AND_SYMBOL_REQUEST });

//       const token = new web3.eth.Contract(ERC20.abi, tokenAddress);

//       const balance = web3.utils.fromWei(
//         await token.methods.balanceOf(account).call(),
//         "ether"
//       );
//       const symbol = await token.methods.symbol().call();
//       const data = {
//         balance: balance,
//         symbol: symbol,
//       };
//       dispatch({ type: GET_TOKEN_BALANCE_AND_SYMBOL_SUCCESS, payload: data });
//     } catch (error) {
//       dispatch({
//         type: GET_TOKEN_FAIL,
//         payload: error.message,
//       });
//     }
//   };

//   // Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
