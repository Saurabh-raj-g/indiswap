import Web3 from "web3";
import { ethers } from "ethers";
const getWeb3 = async () => {
  // Modern dapp browsers...
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);

    // console.log(" nb  " + web3.utils.toHex(56));

    // console.log(" nb  " + ethers.utils.hexValue(56));
    try {
      // Request account access if needed

      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Accounts now exposed
      //resolve(web3);
      return web3;
    } catch (error) {
      //alert(error.message);
    }
  }
  // Legacy dapp browsers...
  //else
  if (window.web3) {
    // Use Mist/MetaMask's provider.
    const web3 = new Web3(window.web3.currentProvider);

    return web3;
  }
  // Fallback to localhost; use dev console port by default...
  else {
    alert("No web3 instance injected, using Local web3");
    const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
    const web3 = new Web3(provider);
    console.log("No web3 instance injected, using Local web3.");

    return web3;
  }
};
export default getWeb3;
