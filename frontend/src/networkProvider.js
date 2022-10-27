import { useEffect, useState, useRef } from "react";
import { ethers } from "ethers";
import "font-awesome/css/font-awesome.css";
import "bootstrap-social/bootstrap-social.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.css";
import Header from "./component/layout/Header/Header.js";
//import App from "./App";
import { UncontrolledAlert } from "reactstrap";
import {
  getFactory,
  getRouter,
  getNetwork,
  getWeth,
  getAccount,
} from "./actions/contractFunction";
import {
  myPooledAssetsAction,
  PoolAssetsAction,
} from "./actions/contractAction.js";
import Cookies from "js-cookie";
import { login } from "./actions/userAction";
import { useDispatch, useSelector } from "react-redux";

import * as chains from "./constants/chains";
import TokenList from "./TokenList";
import Loader from "./component/layout/Loader/Loader.js";

import { useAlert } from "react-alert";
import store from "./store";
const NetworkProvider = (props) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const [isConnected, setConnected] = useState(false);
  const [isStateChanged, setIsStateChanged] = useState(false);

  const [master, setmaster] = useState({});

  let network = Object.create({});
  network.provider = useRef(null);
  network.signer = useRef(null);

  network.listedToken = [];
  network.chainId = useRef();
  network.router = useRef(null);
  network.factory = useRef(null);
  network.wethAddress = useRef(null);
  network.weth = useRef(null);
  network.randomNumber = useRef(null);

  const { user, error, isAuthenticated } = useSelector((state) => state.user);

  async function setupConnection() {
    try {
      //setConnected(false);
      console.log("started setting up!");
      network.provider = new ethers.providers.Web3Provider(window.ethereum);
      network.signer = await network.provider.getSigner();
      await getNetwork(network.provider).then(async (chainID) => {
        // Set chainID
        network.chainId = chainID;
        if (chains.networks.includes(chainID)) {
          // Get the router using the chainID
          network.router = await getRouter(chains.routerAddress.get(chainID));

          // Get default coins for network
          network.listedToken = await TokenList.get(chainID);
          // Get Weth address from router
          await network.router.methods
            .WETH()
            .call()
            .then(async (address) => {
              network.wethAddress = address;
              network.weth = await getWeth(address);
            });
          // Get the factory address from the router
          await network.router.methods
            .factory()
            .call()
            .then(async (factory_address) => {
              network.factory = await getFactory(factory_address);
            });
          network.randomNumber = Math.floor(Math.random() * 10);
          setmaster(network);
          setConnected(true);
        } else {
          setmaster(network);
          setConnected(false);

          alert("Connect to Goerli or smart chain testnet network");
        }
      });
    } catch (e) {
      setConnected(false);
      alert("Something went wrong\nPlease try after sometime");
    }
  }
  async function log() {
    if (isAuthenticated) {
      dispatch(login());
      console.log(isAuthenticated);
      setIsStateChanged(!isStateChanged);
    }
  }

  // setInterval(async () => {
  //   // console.log("Heartbeat");
  //   try {
  //     // Check the account has not changed

  //     if (isAuthenticated) {
  //       const acc = await getAccount(isAuthenticated);

  //       // console.log(
  //       //   (await acc.toString().toLowerCase()) !==
  //       //     (await user.account.toString().toLowerCase())
  //       // );
  //       if (
  //         (await acc.toString().toLowerCase()) !==
  //         (await user.account.toString().toLowerCase())
  //       ) {
  //         dispatch(login());
  //       }
  //     }

  //     const chainID = await getNetwork(network.provider);
  //     //console.log();
  //     // console.log(chainID !== network.chainId);
  //     if (chainID !== network.chainId) {
  //       console.log("bnzcjs");
  //       await setupConnection();
  //       if (isAuthenticated) {
  //         dispatch(login());
  //       }
  //     }
  //   } catch (e) {
  //     // console.log("bnzcjs");
  //     // setConnected(false);
  //     // await setupConnection();
  //   }
  // }, 1000);

  useEffect(() => {
    // Initial setup
    //console.log(isAuthenticated);
    try {
      async function listen() {
        await setupConnection();
        console.log("network: ", network);
      }
      listen();
    } catch (err) {
      setConnected(false);
      //alert("Something went wrong\nPlease try after sometime");
    }
    // Start background listener
  }, []);

  useEffect(() => {
    // if (error) {
    //   alert.error(error);
    //   dispatch(clearErrors());
    // }
    if (isConnected) {
      if (isAuthenticated) {
        store.dispatch(
          myPooledAssetsAction(
            user,
            master.factory,
            master.wethAddress,
            master.chainId
          )
        );
        store.dispatch(
          PoolAssetsAction(
            isAuthenticated,
            user,
            master.factory,
            master.wethAddress,
            master.chainId
          )
        );
      }
      if (!isAuthenticated) {
        if (Cookies.get("INDISWAPUSER")) {
          dispatch(login());
        }
        dispatch(
          PoolAssetsAction(
            isAuthenticated,
            user,
            master.factory,
            master.wethAddress,
            master.chainId
          )
        );
      }
    }
  }, [user, error, alert, isAuthenticated, isConnected]);

  useEffect(() => {
    async function listen() {
      if (props && props.chainId && props.chainId !== network.chainId) {
        console.log("bnzcjs");
        await setupConnection();
        if (isAuthenticated) {
          dispatch(login());
        }
      }
    }
    listen();
  }, [props ? props.chainId : null]);
  return (
    <>
      <Header network={master} />
      {/* <UncontrolledAlert color="info" fade={true}>
        This Application only supports <strong>Goerli</strong> or
        <strong> Smart Chain testnet</strong> network
      </UncontrolledAlert> */}
      {!isConnected && <Loader />}
      {isConnected && <div> {props.render(master)}</div>}
    </>
  );
};

export default NetworkProvider;
// //<div> {props.render(network)}</div>
