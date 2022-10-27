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
//isTokenFromAddLiquidityModalOpen;
export const TokenFromModalReducer = (
  state = { isTokenFromMOpen: {} },
  action
) => {
  switch (action.type) {
    case GET_TOKEN_FROM_SELECTED_REQUEST:
      return {
        loading: true,
      };
    case GET_TOKEN_FROM_SELECTED_SUCCESS:
      return {
        ...state,
        loading: false,
        isTokenFromMOpen: action.payload,
      };

    case GET_TOKEN_FROM_SELECTED_FAIL:
      return {
        ...state,
        loading: false,
        isTokenFromMOpen: null,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const TokenToModalReducer = (state = { isTokenToMOpen: {} }, action) => {
  switch (action.type) {
    case GET_TOKEN_TO_SELECTED_REQUEST:
      return {
        loading: true,
      };
    case GET_TOKEN_TO_SELECTED_SUCCESS:
      return {
        ...state,
        loading: false,
        isTokenToMOpen: action.payload,
      };

    case GET_TOKEN_TO_SELECTED_FAIL:
      return {
        ...state,
        loading: false,
        isTokenToMOpen: null,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const TokenFromAddLiquidityModalReducer = (
  state = { isTokenFromAddLiquidityMOpen: {} },
  action
) => {
  switch (action.type) {
    case GET_TOKEN_FROM_ADD_LIQUIDITY_SELECTED_REQUEST:
      return {
        loading: true,
      };
    case GET_TOKEN_FROM_ADD_LIQUIDITY_SELECTED_SUCCESS:
      return {
        ...state,
        loading: false,
        isTokenFromAddLiquidityMOpen: action.payload,
      };

    case GET_TOKEN_FROM_ADD_LIQUIDITY_SELECTED_FAIL:
      return {
        ...state,
        loading: false,
        isTokenFromAddLiquidityMOpen: null,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const TokenToAddLiquidityModalReducer = (
  state = { isTokenToAddLiquidityMOpen: {} },
  action
) => {
  switch (action.type) {
    case GET_TOKEN_TO_ADD_LIQUIDITY_SELECTED_REQUEST:
      return {
        loading: true,
      };
    case GET_TOKEN_TO_ADD_LIQUIDITY_SELECTED_SUCCESS:
      return {
        ...state,
        loading: false,
        isTokenToAddLiquidityMOpen: action.payload,
      };

    case GET_TOKEN_TO_ADD_LIQUIDITY_SELECTED_FAIL:
      return {
        ...state,
        loading: false,
        isTokenToAddLiquidityMOpen: null,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const slippageReducer = (state = { slippage: {} }, action) => {
  switch (action.type) {
    case GET_SLIPPAGE_REQUEST:
      return {
        loading: true,
      };
    case GET_SLIPPAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        slippage: action.payload,
      };

    case GET_SLIPPAGE_FAIL:
      return {
        ...state,
        loading: false,
        slippage: null,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const deadlineReducer = (state = { deadline: {} }, action) => {
  switch (action.type) {
    case GET_DEADLINE_REQUEST:
      return {
        loading: true,
      };
    case GET_DEADLINE_SUCCESS:
      return {
        ...state,
        loading: false,
        deadline: action.payload,
      };

    case GET_DEADLINE_FAIL:
      return {
        ...state,
        loading: false,
        deadline: null,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const transactionStatusReducer = (
  state = { transactionStatus: {} },
  action
) => {
  switch (action.type) {
    case GET_TRANSACTION_STATUS_REQUEST:
      return {
        loading: true,
      };
    case GET_TRANSACTION_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        transactionStatus: action.payload,
      };

    case GET_TRANSACTION_STATUS_FAIL:
      return {
        ...state,
        loading: false,
        transactionStatus: null,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
