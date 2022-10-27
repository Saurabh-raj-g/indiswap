import { React, useEffect, useState } from "react";
// import './App.css';
import "font-awesome/css/font-awesome.css";
import "bootstrap-social/bootstrap-social.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.css";
//import Header from "./component/layout/Header/Header.js";
import SwapPage from "./component/Pages/SwapPage.js";
import SendPage from "./component/Pages/SendPage.js";
import PoolPage from "./component/Pages/PoolPage.js";
import AddLiquidityPage from "./component/Pages/AddLiquidityPage.js";
import RemoveMyLiquidityPage from "./component/Pages/RemoveMyLiquidityPage.js";
import JoinPoolPage from "./component/Pages/JoinPoolPage.js";
//import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HashRouter, Route, Routes } from "react-router-dom";
import WebFont from "webfontloader";
import { slippageAction, deadlineAction } from "./actions/utilsAction";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./actions/userAction";
//import { useAlert } from "react-alert";
import store from "./store";
import NetworkProvider from "./networkProvider";

import { ethers } from "ethers";
import { getNetwork } from "./actions/contractFunction";
function App() {
  const dispatch = useDispatch();
  const [networkId, setNetworkId] = useState();
  // const alert = useAlert();
  const { user, error, isAuthenticated } = useSelector((state) => state.user);
  async function log() {
    //console.log(isAuthenticated);
    if (isAuthenticated) {
      dispatch(login());
      // console.log(isAuthenticated);
      // setIsStateChanged(!isStateChanged);
    }
  }
  useEffect(() => {
    // if (error) {
    //   alert.error(error);
    //   dispatch(clearErrors());
    // }

    // if (isAuthenticated) {
    //   store.dispatch(myPooledAssetsAction(user));
    //   store.dispatch(PoolAssetsAction(isAuthenticated, user));
    // }
    // if (!isAuthenticated) {
    //   if (Cookies.get("INDISWAPUSER")) {
    //     dispatch(login());
    //   }
    //   dispatch(PoolAssetsAction(isAuthenticated, user));
    // }

    window.ethereum.on("accountsChanged", async function () {
      await log();
      // console.log(isAuthenticated);
    });
    window.ethereum.on("chainChanged", async function () {
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      await getNetwork(provider).then(async (chainID) => {
        setNetworkId(chainID);
      });
    });
    store.dispatch(slippageAction(0.5));
    store.dispatch(deadlineAction(20));
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
  }, [isAuthenticated]); //user, error, alert, isAuthenticated

  return (
    <HashRouter>
      {/* <Routes>
        <Route exact path="/" element={<SwapPage />}></Route>
        <Route exact path="/swap" element={<SwapPage />} />
        <Route exact path="/send" element={<SendPage />} />
        <Route exact path="/pool" element={<PoolPage />} />
        <Route exact path="/add/new" element={<AddLiquidityPage />} />
        <Route exact path="/add/:address" element={<JoinPoolPage />} />
        <Route
          exact
          path="/remove/:address"
          element={<RemoveMyLiquidityPage />}
        />
      </Routes> */}

      <NetworkProvider
        chainId={networkId}
        render={(network) => (
          <div>
            <Routes>
              <Route
                exact
                path="/"
                element={<SwapPage network={network} />}
              ></Route>
              <Route
                exact
                path="/swap"
                element={<SwapPage network={network} />}
              />
              <Route
                exact
                path="/send"
                element={<SendPage network={network} />}
              />
              <Route
                exact
                path="/pool"
                element={<PoolPage network={network} />}
              />
              <Route
                exact
                path="/add/new"
                element={<AddLiquidityPage network={network} />}
              />
              <Route
                exact
                path="/add/:address"
                element={<JoinPoolPage network={network} />}
              />
              <Route
                exact
                path="/remove/:address"
                element={<RemoveMyLiquidityPage network={network} />}
              />
            </Routes>
          </div>
        )}
      ></NetworkProvider>
    </HashRouter>
  );
}

export default App;

/*

"@emotion/react": "^11.10.4",
    "@emotion/styled": "^11.10.4",
     "@mui/icons-material": "^5.10.9",
    "@mui/material": "^5.10.9",
    "@mui/styled-engine-sc": "^5.10.6",
     "styled-components": "^5.3.6",

  
*/
