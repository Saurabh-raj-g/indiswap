import {
  GET_TOKEN_FROM_SELECTED_REQUEST,
  GET_TOKEN_FROM_SELECTED_SUCCESS,
  GET_TOKEN_FROM_SELECTED_FAIL,
  GET_TOKEN_TO_SELECTED_REQUEST,
  GET_TOKEN_TO_SELECTED_SUCCESS,
  GET_TOKEN_TO_SELECTED_FAIL,
  GET_TOKEN_FROM_ADD_LIQUIDITY_SELECTED_REQUEST,
  GET_TOKEN_FROM_ADD_LIQUIDITY_SELECTED_SUCCESS,
  GET_TOKEN_FROM_ADD_LIQUIDITY_SELECTED_FAIL,
  GET_TOKEN_TO_ADD_LIQUIDITY_SELECTED_REQUEST,
  GET_TOKEN_TO_ADD_LIQUIDITY_SELECTED_SUCCESS,
  GET_TOKEN_TO_ADD_LIQUIDITY_SELECTED_FAIL,
  GET_SLIPPAGE_REQUEST,
  GET_SLIPPAGE_SUCCESS,
  GET_SLIPPAGE_FAIL,
  GET_DEADLINE_REQUEST,
  GET_DEADLINE_SUCCESS,
  GET_DEADLINE_FAIL,
  GET_TRANSACTION_STATUS_REQUEST,
  GET_TRANSACTION_STATUS_SUCCESS,
  GET_TRANSACTION_STATUS_FAIL,
  CLEAR_ERRORS,
} from "../constants/utilsConstants.js";

//import { factoryAndRouterAddressSetup } from "./contractFunction";
export const isTokenFromModalOpen = (t) => async (dispatch) => {
  try {
    dispatch({ type: GET_TOKEN_FROM_SELECTED_REQUEST });

    dispatch({ type: GET_TOKEN_FROM_SELECTED_SUCCESS, payload: t });
  } catch (error) {
    dispatch({
      type: GET_TOKEN_FROM_SELECTED_FAIL,
      payload: error.message,
    });
  }
};

export const isTokenToModalOpen = (t) => async (dispatch) => {
  try {
    dispatch({ type: GET_TOKEN_TO_SELECTED_REQUEST });

    dispatch({ type: GET_TOKEN_TO_SELECTED_SUCCESS, payload: t });
  } catch (error) {
    dispatch({
      type: GET_TOKEN_TO_SELECTED_FAIL,
      payload: error.message,
    });
  }
};

export const isTokenFromAddLiquidityModalOpen = (t) => async (dispatch) => {
  try {
    dispatch({ type: GET_TOKEN_FROM_ADD_LIQUIDITY_SELECTED_REQUEST });

    dispatch({
      type: GET_TOKEN_FROM_ADD_LIQUIDITY_SELECTED_SUCCESS,
      payload: t,
    });
  } catch (error) {
    dispatch({
      type: GET_TOKEN_FROM_ADD_LIQUIDITY_SELECTED_FAIL,
      payload: error.message,
    });
  }
};

export const isTokenToAddLiquidityModalOpen = (t) => async (dispatch) => {
  try {
    dispatch({ type: GET_TOKEN_TO_ADD_LIQUIDITY_SELECTED_REQUEST });

    dispatch({ type: GET_TOKEN_TO_ADD_LIQUIDITY_SELECTED_SUCCESS, payload: t });
  } catch (error) {
    dispatch({
      type: GET_TOKEN_TO_ADD_LIQUIDITY_SELECTED_FAIL,
      payload: error.message,
    });
  }
};

export const slippageAction = (t) => async (dispatch) => {
  try {
    dispatch({ type: GET_SLIPPAGE_REQUEST });
    const data = {
      slippage: t,
    };
    dispatch({ type: GET_SLIPPAGE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_SLIPPAGE_FAIL,
      payload: error.message,
    });
  }
};

export const deadlineAction = (t) => async (dispatch) => {
  try {
    dispatch({ type: GET_DEADLINE_REQUEST });
    const data = {
      deadline: t,
    };
    dispatch({ type: GET_DEADLINE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_DEADLINE_FAIL,
      payload: error.message,
    });
  }
};

export const transactionStatusAction = (t) => async (dispatch) => {
  try {
    // 0 -> 0 state 1 -> succeed 2->failed 3-> pending
    dispatch({ type: GET_TRANSACTION_STATUS_REQUEST });
    const data = {
      transactionStatus: t,
    };

    dispatch({ type: GET_TRANSACTION_STATUS_SUCCESS, payload: data });
    // }
  } catch (error) {
    dispatch({
      type: GET_TRANSACTION_STATUS_FAIL,
      payload: error.message,
    });
  }
};

//   // Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
