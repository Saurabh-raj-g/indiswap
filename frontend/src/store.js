import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import { userReducer } from "./reducers/userReducer";
import {
  contractReducer,
  Token0DataReducer,
  Token1DataReducer,
  myPooledAssetsReducer,
  PoolAssetsReducer,
  wethReducer,
} from "./reducers/contractReducer";
import {
  TokenFromModalReducer,
  TokenToModalReducer,
  TokenFromAddLiquidityModalReducer,
  TokenToAddLiquidityModalReducer,
  slippageReducer,
  deadlineReducer,
  transactionStatusReducer,
} from "./reducers/utilsReducer";

const reducer = combineReducers({
  user: userReducer,
  contract: contractReducer,
  isTokenFromMOpen: TokenFromModalReducer,
  isTokenToMOpen: TokenToModalReducer,
  isTokenFromAddLiquidityMOpen: TokenFromAddLiquidityModalReducer,
  isTokenToAddLiquidityMOpen: TokenToAddLiquidityModalReducer,
  slippage: slippageReducer,
  deadline: deadlineReducer,
  Token0Data: Token0DataReducer,
  Token1Data: Token1DataReducer,
  myPooledAssets: myPooledAssetsReducer,
  poolAssets: PoolAssetsReducer,
  transactionStatus: transactionStatusReducer,
  weth: wethReducer,
});

let initialState = {};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
