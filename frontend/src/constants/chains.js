import { ethers } from "ethers";
//import { mnemonicToEntropy } from "ethers/lib/utils";
export const networks = [5, 97];

export const ChainId = {
  GÖRLI: 5,
  SMARTCHAIN: 97,
};
export const getNetworkName = new Map();
getNetworkName.set(ChainId.GÖRLI, "Goerli test Network");
getNetworkName.set(ChainId.SMARTCHAIN, "Smart Chain-Testnet");

export const getNetworkInfo = new Map();
getNetworkInfo.set(ChainId.GÖRLI, {
  name: "Goerli test network",
  url: "https://goerli.infura.io/v3/",
  chainID: 5,
  symbol: "GoerliETH",
  explorerUrl: "https://goerli.etherscan.io",
});
getNetworkInfo.set(ChainId.SMARTCHAIN, {
  name: "Smart Chain – Testnet",
  url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  chainID: 97,
  symbol: "BNB",
  explorerUrl: "https://testnet.bscscan.com",
});

export const routerAddress = new Map();
routerAddress.set(ChainId.GÖRLI, "0xF084e30459bc708720C8AB4aF7Ea09e934488845");
routerAddress.set(
  ChainId.SMARTCHAIN,
  "0xF084e30459bc708720C8AB4aF7Ea09e934488845"
);

export const factoryAddress = new Map();
factoryAddress.set(ChainId.GÖRLI, "0x9740fcc1a7841c462c85fcdfe3766e9befdc8ca9");
factoryAddress.set(
  ChainId.SMARTCHAIN,
  "0x9740FcC1a7841C462C85FCDFe3766e9BEFDC8CA9"
);

export const changeNetwork = async (chainId) => {
  try {
    if (window.ethereum) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ethers.utils.hexValue(chainId) }],
      });
      return 1;
    }
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        if (window.ethereum) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: ethers.utils.hexValue(chainId).toString(),
                chainName: (await getNetworkInfo.get(chainId)).name.toString(),
                rpcUrls: [
                  (await getNetworkInfo.get(chainId)).url.toString(),
                ] /* ... */,
              },
            ],
          });
          return 1;
        }
      } catch (addError) {
        return;
        alert("Having trouble to switch the network");
      }
    }
    // handle other "switch" errors
  }
};
