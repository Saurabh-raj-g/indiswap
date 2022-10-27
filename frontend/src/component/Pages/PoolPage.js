// -----------------    optimal ------------------------

import React, { useEffect, useState } from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { useNavigate } from "react-router-dom";
import Nav from "../layout/Utils/Nav/Nav.js";
import WalletButton from "../layout/Utils/Button/WalletButton.js";

import XsmallLoader from ".././layout/Loader/XsmallLoader.js";
import ManageTokenModal from "../layout/Utils/Modal/ManageTokenModal";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { getSmartRoute } from "../../actions/contractFunction";
import styles from "./PoolPage.module.css";
import { useDispatch, useSelector } from "react-redux";

import { clearErrors, login } from "../../actions/userAction";
import { useAlert } from "react-alert";
//import { margin, padding } from "@mui/system";

const PoolPage = (props) => {
  const [modal, setModal] = useState(false);
  const [isManageTokenModal, setIsManageTokenModal] = useState(false);

  const [search, setSearch] = useState("");
  const [filteredTokens, setFilteredTokens] = useState([]);

  const [isliquidityAccordianOpen, setIsliquidityAccordianOpen] = useState([]);
  const [
    isPoolDetailsWithoutAuthAccordianOpen,
    setIsPoolDetailsWithoutAuthAccordianOpen,
  ] = useState([]);

  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();

  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { myPooledAssets, loading, error } = useSelector(
    (state) => state.myPooledAssets
  );

  const { poolAssets } = useSelector((state) => state.poolAssets);

  const toggle = () => {
    setModal(!modal);
    setSearch("");
  };

  const manageTokenModaltoggle = () => {
    setIsManageTokenModal(!isManageTokenModal);
  };

  const connectWallet = (e) => {
    e.preventDefault();
    dispatch(login());
  };

  const setSearchInput = async (e) => {
    setSearch(e.target.value);

    if (Object.values(poolAssets)) {
      let array0 = Object.values(poolAssets).filter(
        (ee) =>
          ee.pairAddress.toString().toLowerCase() ===
            e.target.value.toString().toLowerCase() ||
          ee.token0Data.symbol
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          ee.token1Data.symbol
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
      );
      setFilteredTokens(array0);
    }

    if (!e.target.value) {
      setSearch("");
    }
  };

  if (window.ethereum) {
    // async function listenChainChanged() {
    window.ethereum.on("chainChanged", async function () {
      setIsPoolDetailsWithoutAuthAccordianOpen([]);
      setFilteredTokens([]);
      setSearch("");
      setIsliquidityAccordianOpen([]);
    });
  }

  async function load() {
    //if (poolAssets && Object.values(poolAssets).length > 0) {
    //await getSmartRoute(Object.values(poolAssets), "EnjB", "DAI");
    //}
    //await getSmartRoute();
  }

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    load();
  }, [dispatch, poolAssets, user, error, alert, isAuthenticated]);

  const joinPool = (e) => {
    Navigate("/add/" + e);
  };

  function JoinAnotherPoolButton({ toggle }) {
    return (
      <Button className={styles.button_box} size="md" onClick={toggle}>
        Join another pool
      </Button>
    );
  }

  function getLiquidityDetails(e) {
    if (isliquidityAccordianOpen.includes(e)) {
      let p = [];

      setIsliquidityAccordianOpen(p);
    } else {
      let p = [];
      p.push(e);
      setIsliquidityAccordianOpen(p);
    }
  }

  function getLiquidityPoolDetailsWithoutAuth(e) {
    if (isPoolDetailsWithoutAuthAccordianOpen.includes(e)) {
      let p = [];

      setIsPoolDetailsWithoutAuthAccordianOpen(p);
    } else {
      let p = [];
      p.push(e);
      setIsPoolDetailsWithoutAuthAccordianOpen(p);
    }
  }

  function YourLiquidity({ token0, token1, liquidity, pairAddress, func }) {
    //if (!isliquidityAccordianOpen) {
    return (
      <div className={styles.box}>
        <div className={styles.box1}>
          <div className={styles.token_box}>
            <p className={styles.token_box_left}>{null}</p>
            <p className={styles.token_box_right}>
              {token0.symbol}/{token1.symbol}
            </p>
          </div>
          {isliquidityAccordianOpen.includes(pairAddress) ? (
            <p
              className={`${styles.box_right} ${styles.arrow}`}
              onClick={() => {
                func(pairAddress);
              }}
            >
              <KeyboardArrowUpIcon />
            </p>
          ) : (
            <p
              className={`${styles.box_right} ${styles.arrow}`}
              onClick={() => {
                func(pairAddress);
              }}
            >
              <KeyboardArrowDownIcon />
            </p>
          )}
        </div>
        {isliquidityAccordianOpen.includes(pairAddress) && isAuthenticated ? (
          <>
            <div className={styles.child_box}>
              <div>
                <p>{Number(token0.balance).toFixed(4)}</p>
                <p>{Number(token1.balance).toFixed(4)}</p>
                <p>{Number(liquidity).toFixed(4)}</p>
              </div>
              <div>
                <p className={styles.child_box_text}>{token0.symbol}</p>
                <p className={styles.child_box_text}>{token1.symbol}</p>
                <p className={styles.child_box_text}>liquidity</p>
              </div>
            </div>
            <Button
              onClick={() => {
                Navigate("/remove/" + pairAddress);
              }}
              className={styles.button_box01}
              size="lg"
            >
              Remove
            </Button>
          </>
        ) : null}
      </div>
    );
  }

  function LiquidityPoolWithoutAuth({
    token0,
    token1,
    reserve0,
    reserve1,
    pairAddress,
    func,
    join,
    isYourLiquidity,
  }) {
    return (
      <div className={`${styles.box} `}>
        <div className={styles.box1}>
          <div className={styles.token_box}>
            <p className={styles.token_box_left}>{null}</p>
            <p
              className={styles.token_box_right}
              onClick={() => {
                func(pairAddress);
              }}
            >
              {token0.symbol}/{token1.symbol}
            </p>
          </div>
          <p
            className={`${styles.box_right} ${styles.join} `}
            onClick={() => {
              join(pairAddress);
            }}
          >
            {isYourLiquidity ? "add Liquidity" : "join"}
          </p>
        </div>
        {isPoolDetailsWithoutAuthAccordianOpen.includes(pairAddress) ? (
          <div className={styles.child_box}>
            <div>
              <p>{Number(reserve0).toFixed(4)}</p>
              <p>{Number(reserve1).toFixed(4)}</p>
            </div>
            <div>
              <p className={styles.child_box_text}>{token0.symbol}</p>
              <p className={styles.child_box_text}>{token1.symbol}</p>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  const managePairTokenParams = {
    manageTokenModal: isManageTokenModal,
    toggleManageTokenModal: manageTokenModaltoggle,
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.container_box}>
          <Nav />

          {isAuthenticated ? (
            <JoinAnotherPoolButton toggle={toggle} />
          ) : (
            <WalletButton connectWallet={connectWallet} />
          )}
          {isAuthenticated ? (
            <div className={styles.free_float}>
              <p className={styles.free_float_left}>Your Liquidity</p>
              <p className={styles.free_float_right}>
                <HelpOutlineIcon />
              </p>
            </div>
          ) : null}

          {isAuthenticated && loading ? (
            <XsmallLoader text={"loading..."} />
          ) : (
            [
              isAuthenticated &&
              myPooledAssets &&
              Object.values(myPooledAssets).length > 0 ? (
                Object.values(myPooledAssets).map((l) => (
                  <YourLiquidity
                    key={l.pairAddress}
                    token0={l.token0Data}
                    token1={l.token1Data}
                    liquidity={l.liquidity}
                    pairAddress={l.pairAddress}
                    func={getLiquidityDetails}
                  />
                ))
              ) : isAuthenticated ? (
                <div
                  style={{
                    color: "rgba(255, 200, 0, 0.877)",
                    marginLeft: "35%",
                    padding: "1%",
                  }}
                >
                  No Data Found
                </div>
              ) : null,
            ]
          )}
        </div>
      </div>

      <Button
        className={styles.creatpoolButton}
        size="sm"
        onClick={function () {
          Navigate("/add/new");
        }}
      >
        + Create Pool
      </Button>
      {/* Modal   -->>>>   select a pool  */}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          <span>Select a pool </span>
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
          <p className={styles.text}>Pool Name</p>
          <div className={styles.box_overflow}>
            {!search ? (
              <>
                {loading ? (
                  <XsmallLoader text={"loading..."} />
                ) : (
                  [
                    poolAssets && Object.values(poolAssets).length > 0 ? (
                      Object.values(poolAssets).map((l) => (
                        <LiquidityPoolWithoutAuth
                          key={l.pairAddress}
                          token0={l.token0Data}
                          token1={l.token1Data}
                          reserve0={l.reserve0}
                          reserve1={l.reserve1}
                          pairAddress={l.pairAddress}
                          func={getLiquidityPoolDetailsWithoutAuth}
                          join={joinPool}
                          isYourLiquidity={l.isMyAssets} //{IsYourLiquidity.includes(l.pairAddress)}
                        />
                      ))
                    ) : (
                      <div
                        style={{
                          color: "rgba(255, 200, 0, 0.877)",
                          marginLeft: "35%",
                          padding: "1%",
                        }}
                      >
                        No Data Found
                      </div>
                    ),
                  ]
                )}
              </>
            ) : (
              filteredTokens.map((l) => (
                <LiquidityPoolWithoutAuth
                  key={l.pairAddress}
                  token0={l.token0Data}
                  token1={l.token1Data}
                  reserve0={l.reserve0}
                  reserve1={l.reserve1}
                  pairAddress={l.pairAddress}
                  func={getLiquidityPoolDetailsWithoutAuth}
                  join={joinPool}
                  isYourLiquidity={l.isMyAssets}
                />
              ))
            )}
          </div>

          <div className={`${styles.simple} `}>
            <p>
              Don't see a pool ?{" "}
              <span onClick={manageTokenModaltoggle}>import it</span>{" "}
            </p>
            <ManageTokenModal
              params={managePairTokenParams}
              network={props.network}
            />
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default PoolPage;
