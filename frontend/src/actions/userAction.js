import {
  LOGIN_REQUEST,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  CLEAR_ERRORS,
} from "../constants/userConstants";

import getWeb3 from "../getWeb3.js";
import { ethers } from "ethers";
import * as chains from "../constants/chains.js";
import Cookies from "js-cookie";
// Login
export const login = () => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });
    // let provider = new ethers.providers.Web3Provider(window.ethereum);
    // const network = await provider.getNetwork();
    // if (!chains.networks.includes(network.chainId)) {
    //   dispatch({ type: LOGIN_FAIL, payload: error.message });
    //   return;
    // }
    var web3 = await getWeb3();
    //console.log("metamask is here !");

    const accounts = await web3.eth.getAccounts();

    const balance = web3.utils.fromWei(
      await web3.eth.getBalance(accounts[0]),
      "ether"
    );

    const data = {
      account: accounts[0],
      balance: balance,
    };
    Cookies.set("INDISWAPUSER", JSON.stringify(data), { path: "/" });

    // window.sessionStorage.setItem("INDISWAPUSER", JSON.stringify(data));
    //("INDISWAPUSER", JSON.stringify(data));

    dispatch({ type: LOGIN_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: LOGIN_FAIL, payload: error.message });
  }
};

// Logout
export const logout = () => async (dispatch) => {
  try {
    Cookies.remove("INDISWAPUSER", { path: "/" });
    dispatch({ type: LOGOUT_SUCCESS });
  } catch (error) {
    dispatch({ type: LOGOUT_FAIL, payload: error.message });
  }
};

//   // Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
