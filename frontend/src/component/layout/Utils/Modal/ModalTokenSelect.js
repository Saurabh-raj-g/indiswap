// -----------------    optimal ------------------------

import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import ManageTokenModal from "./ManageTokenModal";
import styles from "./ModalTokenSelect.module.css";
import TokenList from "../../../../TokenList";
import {
  getTokenData,
  getTokenDataWithBalance,
} from "../../../../actions/contractFunction";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors } from "../../../../actions/userAction";

import * as chains from "../../../../constants/chains.js";
import { useAlert } from "react-alert";

import HelpOutlineIcon from "@material-ui/icons/HelpOutline";

const TokenCard = ({ token, func, auth }) => {
  return (
    <div
      className={`${styles.box} `}
      onClick={() => {
        if (token) {
          func(token.tokenAddress);
        }
      }}
    >
      <div className={styles.token_box}>
        <p className={styles.token_box_left}>
          <p>
            {" "}
            <strong style={{ fontSize: "large" }}>
              {token ? token.symbol : null}
            </strong>
          </p>
          <p
            style={{
              color: "white",
              fontSize: "small",
            }}
          >
            {token ? (token.name ? token.name : token.symbol) : null}

            {token ? (
              token.isAddedByMe ? (
                <text>
                  <strong
                    style={{
                      fontSize: "large",
                      marginTop: "-200px",
                    }}
                  >
                    {" . "}
                  </strong>
                  {"add by user"}
                </text>
              ) : null
            ) : null}
          </p>
        </p>
      </div>
      <p className={`${styles.box_right} ${styles.join} `}>
        {!auth
          ? null
          : token && token.balance
          ? Number(token.balance).toFixed(4)
          : 0}
      </p>
    </div>
  );
};

const ModalTokenSelect = ({ modalParams, network }) => {
  const [lit, setLit] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredTokens, setFilteredTokens] = useState([]);
  const [localStorageTokens, setlocalStorageTokens] = useState([]);
  const dispatch = useDispatch();
  const alert = useAlert();

  const [manageTokenModal, setManageTokenModal] = useState(false);

  const { user, error, isAuthenticated } = useSelector((state) => state.user);

  const { isTokenFromMOpen } = useSelector((state) => state.isTokenFromMOpen);
  const { isTokenToMOpen } = useSelector((state) => state.isTokenToMOpen);
  //const { chainChanged } = useSelector((state) => state.chainChanged);

  const toggleManageTokenModal = () => {
    setManageTokenModal(!manageTokenModal);
  };
  const toggleThisModal = () => {
    modalParams.togglemodal();
    setSearch("");
  };

  const setSearchInput = async (e) => {
    setSearch(e.target.value);

    let array0 = [];
    let array1 = [];
    if (lit) {
      array0 = lit.filter(
        (ee) =>
          ee.tokenAddress.toString().toLowerCase() ===
            e.target.value.toString().toLowerCase() ||
          ee.symbol.toLowerCase().includes(e.target.value.toLowerCase())
      );
    }
    if (localStorageTokens) {
      array1 = localStorageTokens.filter(
        (ee) =>
          ee.tokenAddress.toString().toLowerCase() ===
            e.target.value.toString().toLowerCase() ||
          ee.symbol.toLowerCase().includes(e.target.value.toLowerCase())
      );
    }
    const r = array0.concat(array1);
    //console.log(r);
    setFilteredTokens(r);
    if (!e.target.value) {
      setSearch("");
    }
  };

  const selectToken = async (address) => {
    if (isTokenFromMOpen) {
      if (modalParams.tokenFrom) {
        await modalParams.tokenFrom(address);
        modalParams.togglemodal();
      }
    }
    if (isTokenToMOpen) {
      if (modalParams.tokenTo) {
        await modalParams.tokenTo(address);
        modalParams.togglemodal();
      }
    }
    if (modalParams.sendInputToken) {
      await modalParams.sendInputToken(address);
      modalParams.togglemodal();
    }
  };

  const list = async () => {
    // for tokens
    if (isAuthenticated) {
      let l = [];
      if (network) {
        // console.log(chainChanged.chainId);
        if (chains.networks.includes(network.chainId)) {
          for (
            let i = 0;
            i < (await TokenList.get(network.chainId).length);
            i++
          ) {
            const p = await getTokenDataWithBalance(
              await TokenList.get(network.chainId)[i],
              network.wethAddress,
              network.chainId,
              user.account
            );
            l.push(p);
          }
          setLit(l);

          //get and set local token
          let localData = localStorage.getItem("tokens")
            ? JSON.parse(localStorage.getItem("tokens"))[network.chainId]
              ? JSON.parse(localStorage.getItem("tokens"))[network.chainId]
              : []
            : [];
          let tm = [];
          for (let i = 0; i < localData.length; i++) {
            const p = await getTokenDataWithBalance(
              localData[i].tokenAddress,
              network.wethAddress,
              network.chainId,
              user.account
            );
            tm.push(p);
          }
          setlocalStorageTokens(tm);
        } else {
          setLit([]);
          setlocalStorageTokens([]);
          // console.log("sjs");
          // alert.error("Connect to Goerli or smart chain testnet network");
          // return;
        }
      }
    } else {
      let l = [];
      if (network) {
        //console.log(chains.networks.includes(chainChanged.chainId));
        if (chains.networks.includes(network.chainId)) {
          for (
            let i = 0;
            i < (await TokenList.get(network.chainId).length);
            i++
          ) {
            const p = await getTokenData(
              await TokenList.get(network.chainId)[i],
              network.wethAddress,
              network.chainId
            );
            l.push(p);
          }
          setLit(l);

          //get and set local token
          // let localData = localStorage.getItem("tokens")
          //   ? JSON.parse(localStorage.getItem("tokens"))[network.chainId]
          //     ? JSON.parse(localStorage.getItem("tokens"))[network.chainId]
          //     : []
          //   : [];
          //   let tm = [];
          //   for (let i = 0;i < localData.length; i++){
          //     const p = await getTokenData(
          //       localData[i].tokenAddress,
          //       network.wethAddress,
          //       network.chainId
          //     );
          //     tm.push(p);
          //   }
          setlocalStorageTokens(
            localStorage.getItem("tokens")
              ? JSON.parse(localStorage.getItem("tokens"))[network.chainId]
                ? JSON.parse(localStorage.getItem("tokens"))[network.chainId]
                : []
              : []
          );
        } else {
          setLit([]);
          setlocalStorageTokens([]);
          // console.log(chainChanged.chainId);
          // console.log("edsjs");
          // alert.error("Connect to Goerli or smart chain testnet network");
          // return;
        }
      } else {
        //console.log("ndsjs");
      }
    }

    //console.log(JSON.parse(localStorage.getItem("tokens")));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    list();
    if (!modalParams.togglemodal) {
      setSearch("");
    }
  }, [
    dispatch,
    //list,
    modalParams.togglemodal,
    isTokenFromMOpen,
    isTokenToMOpen,
    filteredTokens,
    network,
    user,
    error,
    alert,
    isAuthenticated,
  ]);

  const params = {
    manageTokenModal,
    toggleManageTokenModal,
    isTokenAddress: true,
    list,
  };
  return (
    <Modal
      isOpen={modalParams.modal ? modalParams.modal : false}
      toggle={toggleThisModal}
    >
      <ModalHeader toggle={toggleThisModal}>
        <span>Select a token </span>
        <span className={styles.iButton}>
          <HelpOutlineIcon />
        </span>
      </ModalHeader>
      <ModalBody>
        <input
          type="text"
          className={styles.input}
          onChange={setSearchInput}
          placeholder="Search Name or paste address"
        />
        <p className={styles.text}>Token Name</p>
        <div className={styles.box_overflow}>
          {!search ? (
            <>
              {lit.length > 0 &&
                lit.map((token) => (
                  <TokenCard
                    key={token ? token.symbol : null}
                    token={token}
                    func={selectToken}
                    auth={isAuthenticated}
                  />
                ))}
              {localStorageTokens
                ? Object.values(localStorageTokens).map((token) => (
                    <TokenCard
                      key={token ? token.symbol : null}
                      token={token}
                      func={selectToken}
                      auth={isAuthenticated}
                    />
                  ))
                : null}
            </>
          ) : (
            filteredTokens.map((token) => (
              <TokenCard
                key={token ? token.symbol : null}
                token={token}
                func={selectToken}
                auth={isAuthenticated}
              />
            ))
          )}
        </div>

        <div className={`${styles.simple} `}>
          <p>
            Having trouble finding a token ?{" "}
            <span onClick={toggleManageTokenModal}>manage</span>
          </p>
          <ManageTokenModal params={params} network={network} />
        </div>
      </ModalBody>
    </Modal>
  );
};
export default ModalTokenSelect;
// {
//   /* <p className={styles.token_box_left}>
// {/* <img
//   className={styles.token_logo}
//   src={`https://assets-cdn.trustwallet.com/blockchains/ethereum/assets/${token.tokenAddress.toString()}/logo.png`}
//   //src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${token.tokenAddress.toString()}/logo.png`}
//   alt={token ? token.symbol : null}
// /> */
// }
// //</p>
// //*/}
