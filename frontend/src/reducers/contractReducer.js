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

export const contractReducer = (state = { contract: {} }, action) => {
  switch (action.type) {
    case GET_ROUTER_REQUEST:
    case GET_FACTORY_REQUEST:
    case GET_WETH_REQUEST:
    case GET_TOKEN_REQUEST:
      return {
        loading: true,
      };
    case GET_ROUTER_SUCCESS:
    case GET_FACTORY_SUCCESS:
    case GET_WETH_SUCCESS:
    case GET_TOKEN_SUCCESS:
      return {
        ...state,
        loading: false,
        contract: action.payload,
      };

    case GET_ROUTER_FAIL:
    case GET_FACTORY_FAIL:
    case GET_WETH_FAIL:
    case GET_TOKEN_FAIL:
      return {
        ...state,
        loading: false,
        contract: null,
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

export const Token0DataReducer = (state = { Token0Data: {} }, action) => {
  switch (action.type) {
    case GET_TOKEN0_DATA_REQUEST:
      return {
        loading: true,
      };
    case GET_TOKEN0_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        Token0Data: action.payload,
      };

    case GET_TOKEN0_DATA_FAIL:
      return {
        ...state,
        loading: false,
        Token0Data: null,
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

export const Token1DataReducer = (state = { Token1Data: {} }, action) => {
  switch (action.type) {
    case GET_TOKEN1_DATA_REQUEST:
      return {
        loading: true,
      };
    case GET_TOKEN1_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        Token1Data: action.payload,
      };

    case GET_TOKEN1_DATA_FAIL:
      return {
        ...state,
        loading: false,
        Token1Data: null,
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

export const myPooledAssetsReducer = (
  state = { myPooledAssets: {} },
  action
) => {
  switch (action.type) {
    case GET_MY_POOLED_ASSETS_REQUEST:
      return {
        loading: true,
      };
    case GET_MY_POOLED_ASSETS_SUCCESS:
      return {
        ...state,
        loading: false,
        myPooledAssets: action.payload,
      };

    case GET_MY_POOLED_ASSETS_FAIL:
      return {
        ...state,
        loading: false,
        myPooledAssets: null,
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

export const PoolAssetsReducer = (state = { poolAssets: {} }, action) => {
  switch (action.type) {
    case GET_POOL_ASSETS_REQUEST:
      return {
        loading: true,
      };
    case GET_POOL_ASSETS_SUCCESS:
      return {
        ...state,
        loading: false,
        poolAssets: action.payload,
      };

    case GET_POOL_ASSETS_FAIL:
      return {
        ...state,
        loading: false,
        poolAssets: null,
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

export const wethReducer = (state = { weth: {} }, action) => {
  switch (action.type) {
    case GET_WETH_REQUEST:
      return {
        loading: true,
      };
    case GET_WETH_SUCCESS:
      return {
        ...state,
        loading: false,
        weth: action.payload,
      };

    case GET_WETH_FAIL:
      return {
        ...state,
        loading: false,
        weth: null,
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

// export const Token0DataAuthReducer = (
//   state = { Token0DataAuth: {} },
//   action
// ) => {
//   switch (action.type) {
//     case GET_TOKEN0_DATA_AUTH_REQUEST:
//       return {
//         loading: true,
//       };
//     case GET_TOKEN0_DATA_AUTH_SUCCESS:
//       return {
//         ...state,
//         loading: false,
//         Token0DataAuth: action.payload,
//       };

//     case GET_TOKEN0_DATA_AUTH_FAIL:
//       return {
//         ...state,
//         loading: false,
//         Token0DataAuth: null,
//         error: action.payload,
//       };

//     case CLEAR_ERRORS:
//       return {
//         ...state,
//         error: null,
//       };

//     default:
//       return state;
//   }
// };

// export const Token1DataAuthReducer = (
//   state = { Token1DataAuth: {} },
//   action
// ) => {
//   switch (action.type) {
//     case GET_TOKEN1_DATA_AUTH_REQUEST:
//       return {
//         loading: true,
//       };
//     case GET_TOKEN1_DATA_AUTH_SUCCESS:
//       return {
//         ...state,
//         loading: false,
//         Token1DataAuth: action.payload,
//       };

//     case GET_TOKEN1_DATA_AUTH_FAIL:
//       return {
//         ...state,
//         loading: false,
//         Token1DataAuth: null,
//         error: action.payload,
//       };

//     case CLEAR_ERRORS:
//       return {
//         ...state,
//         error: null,
//       };

//     default:
//       return state;
//   }
// };
