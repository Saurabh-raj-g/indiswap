import React, { Fragment, useEffect, useRef, useState } from "react";

import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavbarToggler,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown,
  Button,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, login, logout } from "../../../actions/userAction";
import { slippageAction, deadlineAction } from "../../../actions/utilsAction";
import { useAlert } from "react-alert";
import * as chains from "../../../constants/chains.js";
import style from "./Header.module.css";
import DyWalletButton from "../Utils/Button/WalletButton";

import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import SettingsIcon from "@material-ui/icons/Settings";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import WarningAmberIcon from "@material-ui/icons/Warning";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const SlipageRadioButton = ({ e, slip, func }) => {
  return (
    <button
      className={`${style.slipageWallet} ${
        slip === e ? style.slipageWalletActive : null
      }`}
      onClick={() => {
        func(e);
      }}
    >
      {e}%
    </button>
  );
};

function Header(props) {
  const dispatch = useDispatch();
  const alert = useAlert();
  const [networkDropdownData, setNetworkDropdownData] = useState({
    chainId: 5,
    networkName: "Goerli test Network",
  });
  const [error, setError] = useState(null);

  const [isCopied, setIsCopied] = useState(false);
  let slipageArray = [0.1, 0.5, 1];
  const [isNavOpen, setNavOpen] = useState();
  const [isDropDownSettingOpen, setIsDropDownSettingOpen] = useState(false);
  const [isDropDownDotsOpen, setIsDropDownDotsOpen] = useState(false);
  const [isDropDownWalletOpen, setIsDropDownWalletOpen] = useState(false);
  const [isDropDownNetworkOpen, setIsDropDownNetworkOpen] = useState(false);
  const { transactionStatus } = useSelector((state) => state.transactionStatus);
  //const container = useRef(null);
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);
  const { slippage } = useSelector((state) => state.slippage);
  const { deadline } = useSelector((state) => state.deadline);

  const connectWallet = async (e) => {
    e.preventDefault();
    // console.log(props.network.chainId);
    // if (chains.networks.includes(props.network.chainId)) {
    dispatch(login());
    //}
    setIsDropDownWalletOpen(false);
    // if (!chains.networks.includes(props.network.chainId)) {
    //   let p = await chains.changeNetwork(5);
    //   if (p) {
    //     dispatch(login());
    //   }
    // }

    if (!chains.networks.includes(props.network.chainId)) {
      setNetworkDropdownData({
        chainId: props.network.chainId,
        networkName: "Unsupported Network",
      });
    }
  };
  const disconnectWallet = async (e) => {
    e.preventDefault();
    setError(null);
    if (chains.networks.includes(props.network.chainId)) {
      setNetworkDropdownData({
        chainId: props.network.chainId,
        networkName: await chains.getNetworkName.get(props.network.chainId),
      });
    }
    setIsDropDownWalletOpen(false);
    dispatch(logout());
  };

  const DropDownSettingToggle = () => {
    setIsDropDownSettingOpen(!isDropDownSettingOpen);
  };
  const DropDownWalletToggle = () => {
    setIsDropDownWalletOpen(!isDropDownWalletOpen);
    setIsCopied(false);
  };

  const DropDownNetworkToggle = () => {
    setIsDropDownNetworkOpen(!isDropDownNetworkOpen);
  };

  const DropDownDotsToggle = () => {
    setIsDropDownDotsOpen(!isDropDownDotsOpen);
  };
  const navToggle = () => {
    setNavOpen(!isNavOpen);
  };

  // useEffect(() => {
  //   if (error) {
  //     alert.error(error);
  //     dispatch(clearErrors());
  //   }

  function DropdownWalletDetail() {
    return (
      <>
        {isAuthenticated ? (
          <DropdownMenu className={` ${style.dropdownWalletMenu}`} end>
            <DropdownItem className={style.dnav} text={true}>
              <p>
                {user.account.toString().substring(0, 5) +
                  "..." +
                  user.account
                    .toString()
                    .substring(
                      user.account.toString().length - 4,
                      user.account.toString().length
                    )}
              </p>
              <p
                style={{
                  marginLeft: "-12px",
                  color: isCopied ? "green" : null,
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigator.clipboard.writeText(user.account);
                  setIsCopied(true);
                }}
              >
                <ContentCopyIcon />
              </p>
              <p
                style={{ cursor: "pointer" }}
                onClick={async () => {
                  if (chains.networks.includes(props.network.chainId)) {
                    let u = await chains.getNetworkInfo.get(
                      props.network.chainId
                    ).explorerUrl;
                    u = u.toString();
                    let url = u + `/address/${user.account}`;
                    window.open(url, "_blank", "noopener,noreferrer");
                    setIsDropDownWalletOpen(false);
                  }
                }}
              >
                <OpenInNewIcon />
              </p>
              <p
                style={{
                  marginLeft: "-7px",
                  cursor: "pointer",
                }}
                onClick={disconnectWallet}
              >
                <PowerSettingsNewIcon />
              </p>
            </DropdownItem>
            <DropdownItem className={style.dbalance} text={true}>
              <p>
                {Number(user.balance).toFixed(4)}{" "}
                {props.network ? (
                  props.network.chainId === 97 ||
                  props.network.chainId === 56 ? (
                    <span>BNB</span>
                  ) : (
                    <span>ETH</span>
                  )
                ) : null}
              </p>
            </DropdownItem>
            <DropdownItem text={true}>
              <hr></hr>
            </DropdownItem>
            <DropdownItem className={style.dlanguage}>
              <p className={style.dlanguageLeft}>language</p>
              <p className={style.dlanguageRight}>
                <KeyboardArrowRightIcon />
              </p>
            </DropdownItem>
            <DropdownItem className={style.dlanguage}>
              <p className={style.dlanguageLeft}>Dark</p>
              <p className={style.dlanguageRight}>
                <DarkModeIcon />
              </p>
            </DropdownItem>
          </DropdownMenu>
        ) : (
          <DropdownMenu className={` ${style.dropdownWalletMenu}`} end>
            <DropdownItem className={`${style.dnav}`} text={true}>
              <DyWalletButton connectWallet={connectWallet} />
            </DropdownItem>
            <DropdownItem text={true}>
              <hr></hr>
            </DropdownItem>
            <DropdownItem className={style.dlanguage}>
              <p className={style.dlanguageLeft}>language</p>
              <p className={style.dlanguageRight}>
                <KeyboardArrowRightIcon />
              </p>
            </DropdownItem>
            <DropdownItem className={style.dlanguage}>
              <p className={style.dlanguageLeft}>Dark</p>
              <p className={style.dlanguageRight}>
                <DarkModeIcon />
              </p>
            </DropdownItem>
          </DropdownMenu>
        )}
      </>
    );
  }
  function NetworkName() {
    return (
      <Fragment>
        <div className={style.container1}>
          <div
            className={style.accountaddressbox}
            style={{ cursor: "pointer" }}
            onClick={DropDownNetworkToggle}
          >
            {isAuthenticated &&
            props.network &&
            chains.networks.includes(props.network.chainId) ? (
              <Dropdown
                isOpen={isDropDownNetworkOpen}
                toggle={DropDownNetworkToggle}
              >
                <span className="d-md-none">
                  {
                    chains.getNetworkName
                      .get(props.network.chainId)
                      .toString()
                      .split(" ")[0]
                  }
                  <span> {<KeyboardArrowDownIcon />}</span>
                </span>
                <span className="d-none d-md-block">
                  {chains.getNetworkName.get(props.network.chainId)}
                  <span> {<KeyboardArrowDownIcon />}</span>
                </span>

                <DropdownMenu
                  className={` ${style.dropDownMenu} `}
                  style={{
                    borderRadius: 20,
                  }}
                >
                  {chains.networks &&
                    chains.networks.map((id) => (
                      <DropdownItem
                        onClick={async () => {
                          try {
                            await chains.changeNetwork(id).then((p) => {
                              if (!p) {
                                setError("Error Occured");
                                alert.error("Failed to Switch the network");
                              } else {
                                setError(null);
                              }
                            });
                          } catch (e) {
                            setError("Error Occured");
                            alert.error("Failed to Switch the network");
                          }
                        }}
                      >
                        {chains.getNetworkName.get(id)}
                      </DropdownItem>
                    ))}
                </DropdownMenu>
              </Dropdown>
            ) : // <div className={` ${style.networkDropdown}`}>
            //   <div className={style.networkName}>
            //     <span className="d-md-none">
            //       {
            //         chains.getNetworkName
            //           .get(props.network.chainId)
            //           .toString()
            //           .split(" ")[0]
            //       }
            //       <span> {<KeyboardArrowDownIcon />}</span>
            //     </span>
            //     <span className="d-none d-md-block">
            //       {chains.getNetworkName.get(props.network.chainId)}
            //       <span> {<KeyboardArrowDownIcon />}</span>
            //     </span>
            //   </div>
            //   <div className={`${style.networkDropdownMenu}`}>
            //     {chains.networks &&
            //       chains.networks.map((id) => (
            //         <div
            //           className={`${style.networkDropdownItem}`}
            //           onClick={async () => {
            //             try {
            //               await chains.changeNetwork(id).then((p) => {
            //                 if (!p) {
            //                   setError("Error Occured");
            //                   alert.error("Failed to Switch the network");
            //                 } else {
            //                   setError(null);
            //                 }
            //               });
            //             } catch (e) {
            //               setError("Error Occured");
            //               alert.error("Failed to Switch the network");
            //             }
            //           }}
            //         >
            //           {chains.getNetworkName.get(id)}
            //         </div>
            //       ))}
            //   </div>
            // </div>
            isAuthenticated &&
              props.network &&
              !chains.networks.includes(props.network.chainId) ? (
              <Dropdown
                isOpen={isDropDownNetworkOpen}
                toggle={DropDownNetworkToggle}
              >
                {props.network.randomNumber < 9 &&
                props.network.randomNumber > 5 ? (
                  <span>
                    <span className="d-md-none">
                      {
                        chains.getNetworkName
                          .get(props.network.randomNumber / 7)
                          .toString()
                          .split(" ")[0]
                      }
                      <span> {<KeyboardArrowDownIcon />}</span>
                    </span>
                    <span className="d-none d-md-block">
                      {chains.getNetworkName.get(
                        props.network.randomNumber / 7
                      )}
                      <span> {<KeyboardArrowDownIcon />}</span>
                    </span>
                  </span>
                ) : (
                  <span>
                    <span className="d-md-none">
                      {String("Unsupported Network").split(" ")[0]}
                      <span> {<KeyboardArrowDownIcon />}</span>
                    </span>
                    <span className="d-none d-md-block">
                      {"Unsupported Network"}
                      <span> {<KeyboardArrowDownIcon />}</span>
                    </span>
                  </span>
                )}

                <DropdownMenu
                  className={` ${style.dropDownMenu} `}
                  style={{
                    borderRadius: 20,
                  }}
                >
                  {chains.networks &&
                    chains.networks.map((id) => (
                      <DropdownItem
                        onClick={async () => {
                          try {
                            await chains.changeNetwork(id).then((p) => {
                              if (!p) {
                                setError("Error Occured");
                                alert.error("Failed to Switch the network");
                              } else {
                                setError(null);
                              }
                            });
                          } catch (e) {
                            setError("Error Occured");
                            alert.error("Failed to Switch the network");
                          }
                        }}
                      >
                        {chains.getNetworkName.get(id)}
                      </DropdownItem>
                    ))}
                </DropdownMenu>
              </Dropdown>
            ) : (
              // <div className={` ${style.networkDropdown}`}>
              //   <div className={style.networkName}>
              //     {props.network.randomNumber < 9 &&
              //     props.network.randomNumber > 5 ? (
              //       <span>
              //         <span className="d-md-none">
              //           {
              //             chains.getNetworkName
              //               .get(props.network.randomNumber / 7)
              //               .toString()
              //               .split(" ")[0]
              //           }
              //           <span> {<KeyboardArrowDownIcon />}</span>
              //         </span>
              //         <span className="d-none d-md-block">
              //           {chains.getNetworkName.get(props.network.chainId)}
              //           <span> {<KeyboardArrowDownIcon />}</span>
              //         </span>
              //       </span>
              //     ) : (
              //       <span>
              //         <span className="d-md-none">
              //           {String("Unsupported Network").split(" ")[0]}
              //           <span> {<KeyboardArrowDownIcon />}</span>
              //         </span>
              //         <span className="d-none d-md-block">
              //           {"Unsupported Network"}
              //           <span> {<KeyboardArrowDownIcon />}</span>
              //         </span>
              //       </span>
              //     )}
              //   </div>
              //   <div className={`${style.networkDropdownMenu}`}>
              //     {chains.networks &&
              //       chains.networks.map((id) => (
              //         <div
              //           className={`${style.networkDropdownItem}`}
              //           onClick={async () => {
              //             try {
              //               await chains.changeNetwork(id).then((p) => {
              //                 if (!p) {
              //                   setError("Error Occured");
              //                   alert.error("Failed to Switch the network");
              //                 } else {
              //                   setError(null);
              //                 }
              //               });
              //             } catch (e) {
              //               setError("Error Occured");
              //               alert.error("Failed to Switch the network");
              //             }
              //           }}
              //         >
              //           {chains.getNetworkName.get(id)}
              //         </div>
              //       ))}
              //   </div>
              // </div>
              <Dropdown
                isOpen={isDropDownNetworkOpen}
                toggle={DropDownNetworkToggle}
              >
                {!isAuthenticated && networkDropdownData ? (
                  <span>
                    <span className="d-md-none">
                      {networkDropdownData.networkName.toString().split(" ")[0]}
                      <span> {<KeyboardArrowDownIcon />}</span>
                    </span>
                    <span className="d-none d-md-block">
                      {networkDropdownData.networkName}
                      <span> {<KeyboardArrowDownIcon />}</span>
                    </span>
                  </span>
                ) : (
                  <span>
                    <span className="d-md-none">
                      {String("Unsupported Network").split(" ")[0]}
                      <span> {<KeyboardArrowDownIcon />}</span>
                    </span>
                    <span className="d-none d-md-block">
                      {"Unsupported Network"}
                      <span> {<KeyboardArrowDownIcon />}</span>
                    </span>
                  </span>
                )}

                <DropdownMenu
                  className={`${style.dropDownMenu}`}
                  style={{
                    borderRadius: 20,
                  }}
                >
                  {chains.networks &&
                    chains.networks.map((id) => (
                      <DropdownItem
                        onClick={async () => {
                          setNetworkDropdownData({
                            chainId: id,
                            networkName: await chains.getNetworkName.get(id),
                          });
                        }}
                      >
                        {chains.getNetworkName.get(id)}
                      </DropdownItem>
                    ))}
                </DropdownMenu>
              </Dropdown>
              // <div className={` ${style.networkDropdown}`}>
              //   <div className={style.networkName}>
              //     {!isAuthenticated && networkDropdownData ? (
              //       <span>
              //         <span className="d-md-none">
              //           {networkDropdownData.networkName.toString().split(" ")[0]}
              //           <span> {<KeyboardArrowDownIcon />}</span>
              //         </span>
              //         <span className="d-none d-md-block">
              //           {networkDropdownData.networkName}
              //           <span> {<KeyboardArrowDownIcon />}</span>
              //         </span>
              //       </span>
              //     ) : (
              //       <span>
              //         <span className="d-md-none">
              //           {String("Unsupported Network").split(" ")[0]}
              //           <span> {<KeyboardArrowDownIcon />}</span>
              //         </span>
              //         <span className="d-none d-md-block">
              //           {"Unsupported Network"}
              //           <span> {<KeyboardArrowDownIcon />}</span>
              //         </span>
              //       </span>
              //     )}
              //   </div>
              //   <div className={`${style.networkDropdownMenu}`}>
              //     {chains.networks &&
              //       chains.networks.map((id) => (
              //         <div
              //           className={`${style.networkDropdownItem}`}
              //           onClick={async () => {
              //             setNetworkDropdownData({
              //               chainId: id,
              //               networkName: await chains.getNetworkName.get(id),
              //             });
              //           }}
              //         >
              //           {chains.getNetworkName.get(id)}
              //         </div>
              //       ))}
              //   </div>
              // </div>
            )}
          </div>
        </div>
      </Fragment>
    );
  }
  const slipageFunc = (e) => {
    dispatch(slippageAction(e));
  };

  function WalletButton({ connectWallet, err, load, text }) {
    return (
      <Fragment>
        <div className={style.container1}>
          <div
            className={style.accountaddressbox}
            onClick={err ? DropDownWalletToggle : null}
            style={{ cursor: err ? "pointer" : "" }}
          >
            {err ? (
              <Dropdown
                isOpen={isDropDownWalletOpen}
                toggle={DropDownWalletToggle}
              >
                <WarningAmberIcon />
                <strong>{err}</strong>
                <DropdownWalletDetail />
              </Dropdown>
            ) : load ? (
              <span>
                <strong>{load}</strong>
              </span>
            ) : (
              <Dropdown
                isOpen={isDropDownWalletOpen}
                toggle={DropDownWalletToggle}
              >
                <span>
                  <span
                    onClick={
                      connectWallet ? async (e) => await connectWallet(e) : null
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {text}
                  </span>
                  <span>{" | "}</span>
                  <span
                    onClick={DropDownWalletToggle}
                    style={{ cursor: "pointer" }}
                  >
                    {isDropDownWalletOpen ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </span>
                </span>

                <DropdownWalletDetail />
              </Dropdown>
            )}
          </div>
        </div>
      </Fragment>
      // <div
      //   className={style.connectWallet}
      //   onClick={err ? DropDownWalletToggle : null}
      //   style={{ cursor: err ? "pointer" : "" }}
      // >
      //   {err ? (
      //     <Dropdown isOpen={isDropDownWalletOpen} toggle={DropDownWalletToggle}>
      //       <WarningAmberIcon />
      //       <strong>{err}</strong>
      //       <DropdownWalletDetail />
      //     </Dropdown>
      //   ) : load ? (
      //     <p className={style.connectWalletPending}>
      //       <strong>{load}</strong>
      //     </p>
      //   ) : (
      //     <Dropdown isOpen={isDropDownWalletOpen} toggle={DropDownWalletToggle}>
      //       <p style={{ marginBottom: "40px" }}>
      //         <span
      //           className={style.connectWalletNotConnected}
      //           onClick={
      //             connectWallet ? async (e) => await connectWallet(e) : null
      //           }
      //         >
      //           {text}{" "}
      //         </span>
      //         <span className={style.connectWalletNotConnected1}>
      //           {" |   "}
      //         </span>
      //         <span
      //           className={style.connectWalletNotConnected2}
      //           onClick={DropDownWalletToggle}
      //         >
      //           {isDropDownWalletOpen ? (
      //             <KeyboardArrowUpIcon />
      //           ) : (
      //             <KeyboardArrowDownIcon />
      //           )}
      //         </span>
      //       </p>
      //       <DropdownWalletDetail />
      //     </Dropdown>
      //   )}
      // </div>
    );
  }
  function AccountBalance() {
    return (
      <>
        {error ? (
          <WalletButton err={error} />
        ) : (
          <div className={style.container1}>
            <div className={style.accountaddressbox}>
              <Dropdown
                isOpen={isDropDownWalletOpen}
                toggle={DropDownWalletToggle}
              >
                {transactionStatus &&
                transactionStatus.transactionStatus === 3 ? (
                  <span>Pending...</span>
                ) : (
                  <span>
                    <span>
                      {user.account.toString().substring(0, 4) +
                        "..." +
                        user.account
                          .toString()
                          .substring(
                            user.account.toString().length - 3,
                            user.account.toString().length
                          )}
                    </span>
                    <span
                      style={{ marginLeft: 10, cursor: "pointer" }}
                      onClick={DropDownWalletToggle}
                    >
                      {isDropDownWalletOpen ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </span>
                  </span>
                )}

                <DropdownWalletDetail />
              </Dropdown>
            </div>
          </div>
        )}
      </>
    );
  }

  //className="" inNavbar nav> className={style.navbarcss}
  return (
    <div>
      <Navbar color="light" expand="sm" light>
        <NavbarBrand href="/">INDISWAP</NavbarBrand>
        <NavbarToggler onClick={navToggle} />
        <Collapse isOpen={isNavOpen} navbar>
          <Nav className={` ms-auto ${style.navbarcss}`} navbar>
            <NavItem className={style.navbarcss1}>
              <NetworkName />
            </NavItem>
            <NavItem className={style.navbarcss1}>
              {isAuthenticated ? (
                <AccountBalance />
              ) : (
                <WalletButton
                  connectWallet={connectWallet}
                  load={loading ? "pending" : null}
                  text={"connect"}
                />
              )}
            </NavItem>
            <NavItem className={style.navbarcss1}>
              <Dropdown
                isOpen={isDropDownSettingOpen}
                toggle={DropDownSettingToggle}
              >
                <DropdownToggle type="button" className={style.container1}>
                  <p className={style.setting}>
                    <SettingsIcon />
                  </p>
                </DropdownToggle>
                <DropdownMenu
                  className="mt-2"
                  style={{
                    backgroundColor: "black",
                    borderRadius: 20,
                  }}
                  end
                >
                  <DropdownItem
                    style={{
                      color: "white",
                      fontSize: 20,
                      fontWeight: 700,
                    }}
                    text={true}
                  >
                    Transaction Settings
                  </DropdownItem>

                  <DropdownItem
                    style={{
                      color: "wheat",
                      fontWeight: 700,
                    }}
                    text={true}
                  >
                    Slippage tolerance {<HelpOutlineIcon />}
                  </DropdownItem>

                  <DropdownItem
                    text={true}
                    className={`${style.dropDownItemInput} `}
                  >
                    {slipageArray.map((s) => (
                      <SlipageRadioButton
                        key={s}
                        e={s}
                        slip={slippage.slippage}
                        func={slipageFunc}
                      />
                    ))}

                    <input
                      className={style.slipapageInput}
                      type="number"
                      value={slippage.slippage}
                      onChange={(e) => {
                        dispatch(slippageAction(Number(e.target.value)));
                      }}
                    ></input>
                    <DropdownItem
                      className={style.percentageSymbol}
                      text={true}
                    >
                      %
                    </DropdownItem>
                  </DropdownItem>

                  <DropdownItem
                    style={{
                      color: "white",
                      fontWeight: 700,
                      fontSize: 17,
                    }}
                    text={true}
                  >
                    Transaction deadline {<HelpOutlineIcon />}
                  </DropdownItem>
                  <DropdownItem
                    className={`${style.dropDownItemInput} `}
                    text={true}
                  >
                    <input
                      className={style.deadlineInput}
                      type="number"
                      value={deadline.deadline}
                      onChange={(e) => {
                        dispatch(deadlineAction(Number(e.target.value)));
                      }}
                    />
                    <DropdownItem
                      style={{
                        color: "white",
                      }}
                      text={true}
                    >
                      minutes
                    </DropdownItem>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavItem>
            <NavItem>
              <Dropdown
                isOpen={isDropDownDotsOpen}
                toggle={DropDownDotsToggle}
                className="d-none d-md-block"
              >
                <DropdownToggle type="button" className={style.container1}>
                  <p className={style.setting}>
                    <MoreHorizIcon />
                  </p>
                </DropdownToggle>
                <DropdownMenu
                  className={`mt-2 ${style.dropDownMenu} `}
                  style={{
                    backgroundColor: "black",
                    borderRadius: 20,
                  }}
                  end
                >
                  <DropdownItem
                    className={` ${style.dropDownItem} `}
                    style={{
                      color: "white",
                    }}
                    onClick={function () {}}
                  >
                    About
                  </DropdownItem>
                  <DropdownItem
                    className={` ${style.dropDownItem} `}
                    style={{
                      color: "white",
                    }}
                    onClick={function () {}}
                  >
                    Docs
                  </DropdownItem>
                  <DropdownItem
                    className={` ${style.dropDownItem} `}
                    style={{
                      color: "white",
                    }}
                    onClick={function () {}}
                  >
                    Code
                  </DropdownItem>
                  <DropdownItem
                    className={` ${style.dropDownItem} `}
                    style={{
                      color: "white",
                    }}
                    onClick={function () {}}
                  >
                    Discord
                  </DropdownItem>
                  <DropdownItem
                    className={` ${style.dropDownItem} `}
                    style={{
                      color: "white",
                    }}
                    onClick={function () {}}
                  >
                    Analytics
                  </DropdownItem>
                  {/* {isAuthenticated ? (
                  <>
                    <DropdownItem
                      style={{
                        color: "white",
                        margin: "-5px 0px -10px 0px",
                      }}
                      text={true}
                    >
                      <hr style={{ height: 3 }} />
                    </DropdownItem>
                    <DropdownItem
                      className={` ${style.dropDownItem} `}
                      style={{
                        color: "white",
                        fontWeight: 900,
                        fontSize: "large",
                      }}
                      onClick={disconnectWallet}
                    >
                      disconnect
                    </DropdownItem>
                  </>
                ) : null} */}
                </DropdownMenu>
              </Dropdown>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default Header;
