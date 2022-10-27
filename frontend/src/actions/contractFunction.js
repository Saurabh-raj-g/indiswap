import Web3 from "web3";
import { ethers } from "ethers";
import Graph from "./graph.js";

const ROUTER = require("../contracts/UniswapV2Router02.json");
const ERC20 = require("../contracts/IERC20.json");
const FACTORY = require("../contracts/UniswapV2Factory.json");
const PAIR = require("../contracts/UniswapV2Pair.json");
import * as chains from "../constants/chains.js";
const web3 = new Web3(window.ethereum);

//v 0000
// goerli network
// factory = 0x9740fcc1a7841c462c85fcdfe3766e9befdc8ca9
// init code = 9f4f4adf0a79ee463862940a433d07138b8ae3ffefb433af2205cc62ef632679
// router address =  0xF084e30459bc708720C8AB4aF7Ea09e934488845
//weth = 0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6

//smart chain testate
// factory = 0x9740FcC1a7841C462C85FCDFe3766e9BEFDC8CA9
// init code = 9f4f4adf0a79ee463862940a433d07138b8ae3ffefb433af2205cc62ef632679
// router address =  0xF084e30459bc708720C8AB4aF7Ea09e934488845
//wbnb=0xae13d989dac2f0debff460ac112a837c89baa7cd

export async function getNetwork(provider) {
  const network = await provider.getNetwork();
  return network.chainId;
}

export async function getblockNumber(provider) {
  const network = await provider.getNetwork();
  return network.chainId;
}
export async function getAccount(isAuthenticated) {
  if (isAuthenticated) {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    return accounts[0];
  }
}
// export const getfactoryAddress = async () => {
//   try {
//     let provider = new ethers.providers.Web3Provider(window.ethereum);
//     const network = await provider.getNetwork();
//     if (chains.networks.includes(network.chainId)) {
//       //let routerAddress = await chains.routerAddress.get(network.chainId);

//       // let factoryAddress = await routerContract.methods.factory().call();
//       let factoryAddress = await chains.factoryAddress.get(network.chainId);
//       return factoryAddress;
//     }
//   } catch (err) {
//     // alert(
//     //   "Failed to detect factory address\nSwitch to Goerli Or Smart chain-testnet"
//     // );
//   }
// };

// export const getRouterAddress = async () => {
//   try {
//     let provider = new ethers.providers.Web3Provider(window.ethereum);
//     const network = await provider.getNetwork();
//     if (chains.networks.includes(network.chainId)) {
//       let routerAddress = await chains.routerAddress.get(network.chainId);

//       return routerAddress;
//     }
//   } catch (err) {
//     // alert(
//     //   "Failed to detect router address\nSwitch to Goerli Or Smart chain-testnet"
//     // );
//   }
// };
export const toWei = async (amount, decimals) => {
  try {
    // let amounts = ethers.BigNumber.from(Number(amount)).mul(
    //   ethers.BigNumber.from(10).pow(Number(decimals))
    // ); //(await amount) * 10 ** decimals;
    // amount = (await amount) * 10 ** decimals;
    //let amounts = ethers.BigNumber.from(amount);
    if (Number(amount) < 0.01) {
      amount = (await amount) * 10 ** decimals;
    } else {
      amount = ethers.utils.parseUnits(String(amount), decimals);
    }

    amount = amount.toString();
    // console.log("g -> " + amounts);
    if (amount.includes(".")) {
      let index = await amount.indexOf(".");

      amount = await amount.slice(0, index);

      return amount;
    } else {
      return amount;
    }
  } catch (error) {
    //alert("An error occured while converting to Wei");
    return;
  }
};

export const fromWei = async (amount, decimals) => {
  try {
    amount = (await amount) * 10 ** -decimals;
    amount = await amount.toString();
    return amount;
  } catch (error) {
    // alert("An error occured while converting to decimals");
    return;
  }
};

export const calSlippage = async (amount, decimals, slippage) => {
  try {
    amount = (await amount) * (1 - slippage * 0.01);
    amount = await toWei(amount, decimals);

    return amount;
  } catch (error) {
    // alert("An error occured while calculating slippage");
    return;
  }
};

export const getRouter = async (contractAddress) => {
  try {
    return new web3.eth.Contract(ROUTER.abi, contractAddress);
  } catch (error) {
    // alert(
    //   "failed to load router\nMake sure you are connected to Goerli Network"
    // );
    return;
  }
};

export const getFactory = async (contractAddress) => {
  try {
    return new web3.eth.Contract(FACTORY.abi, contractAddress);
  } catch (error) {
    // alert(
    //   "failed to load factory\nMake sure you are connected to Goerli Network"
    // );
    return;
  }
};

export const getWeth = async (contractAddress) => {
  try {
    return new web3.eth.Contract(ERC20.abi, contractAddress);
    // let routerAddress = await getRouterAddress();

    // const routerContract = await getRouter(routerAddress);

    // let a = await routerContract.methods.WETH().call();
    // return a;
  } catch (error) {
    //   //alert("failed to load Eth\nMake sure you are connected to Goerli Network");
    return;
  }
};

export const getTokenContract = async (contractAddress) => {
  try {
    return new web3.eth.Contract(ERC20.abi, contractAddress);
  } catch (error) {
    alert("Failed to load token contract ");
    return false;
  }
};

export async function getPairAddress(a0, a1, factoryContract) {
  try {
    // let factoryAddress = await getfactoryAddress();
    // const factoryContract = await getFactory(factoryAddress);
    //console.log("s " + [a0, a1]);
    const pairAddress = await factoryContract.methods.getPair(a0, a1).call();
    if (String(pairAddress) === "0x0000000000000000000000000000000000000000") {
      return false;
    } else {
      return pairAddress;
    }
  } catch (err) {
    // alert("While fetching pair address an error occured !");
    return false;
  }
}

export async function isFeeOn(factoryContract) {
  try {
    // let factoryAddress = await getfactoryAddress();
    // const factoryContract = await getFactory(factoryAddress);
    if (factoryContract) {
      const feeToAddress = await factoryContract.methods.feeTo().call();
      if (
        String(feeToAddress) === "0x0000000000000000000000000000000000000000"
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      alert("Sorry, Couldn't load factory contract");
    }
  } catch (err) {
    // alert("While checking feeOn status an error occured !");
    return;
  }
}

export const checkForPairExists = async (
  token0Address,
  token1Address,
  factoryContract
) => {
  try {
    // let factoryAddress = await getfactoryAddress();
    // const factoryContract = await getFactory(factoryAddress);
    if (factoryContract) {
      const pairAddress = await factoryContract.methods
        .getPair(token0Address, token1Address)
        .call();
      if (
        String(pairAddress) === "0x0000000000000000000000000000000000000000"
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      alert("Sorry, Couldn't load factory contract");
    }
  } catch (err) {
    // alert("While checking pair exists an error occured !");
    return false;
  }
};

export const getpairContract = async (contractAddress) => {
  try {
    let a = new web3.eth.Contract(PAIR.abi, contractAddress);
    return a;
  } catch (error) {
    //alert("Failed to load pair contract");
    return false;
  }
};

export const getTokenData = async (tokenAddress, wethAddress, chainId) => {
  try {
    // const link = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${tokenAddress}/logo.png`;
    // const img = await axios.get(
    //   `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x71F239DBb135Ccf3C9cDC2cEa711062F5070c978/logo.png`
    // );
    const token = await getTokenContract(tokenAddress);
    if (
      (await tokenAddress.toString().toLowerCase()) ===
      (await wethAddress.toString().toLowerCase())
    ) {
      if (token) {
        return {
          symbol:
            (await chainId) === 56 || (await chainId) === 97 ? "BNB" : "ETH",
          name:
            (await chainId) === 56 || (await chainId) === 97
              ? "Binance chain native token"
              : "ether",
          decimals: 18,
          tokenAddress: wethAddress,
        };
      } else if (!token) {
        alert("Token does not exists");
        return;
      }
    }

    if (token) {
      return {
        name: await token.methods.name().call(),
        symbol: await token.methods.symbol().call(),
        tokenAddress: tokenAddress,
        decimals: await token.methods.decimals().call(),
      };
    } else if (!token) {
      alert("Token does not exists");
      return;
    }
  } catch (error) {
    //alert("Failed to load your token data");
  }
};

export const getTokenDataWithBalance = async (
  tokenAddress,
  wethAddress,
  chainId,
  account
) => {
  try {
    // const link = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${tokenAddress}/logo.png`;
    // const img = await axios.get(
    //   `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x71F239DBb135Ccf3C9cDC2cEa711062F5070c978/logo.png`
    // );
    const token = await getTokenContract(tokenAddress);
    if (
      (await tokenAddress.toString().toLowerCase()) ===
      (await wethAddress.toString().toLowerCase())
    ) {
      if (token) {
        const t = new ethers.providers.Web3Provider(window.ethereum);
        const bal = (await t.getBalance(account.toString())) * 10 ** -18;
        return {
          balance: bal,
          symbol:
            (await chainId) === 56 || (await chainId) === 97 ? "BNB" : "ETH",
          name:
            (await chainId) === 56 || (await chainId) === 97
              ? "Binance chain native token"
              : "ether",
          decimals: 18,
          tokenAddress: wethAddress,
        };
      } else if (!token) {
        alert("Token does not exists");
        return;
      }
    }

    if (token) {
      return {
        balance:
          Number(await token.methods.balanceOf(account).call()) *
          10 ** -Number(await token.methods.decimals().call()),

        symbol: await token.methods.symbol().call(),
        name: await token.methods.name().call(),
        decimals: await token.methods.decimals().call(),
        tokenAddress: tokenAddress,
      };
    } else if (!token) {
      alert("Token does not exists");
      return;
    }
  } catch (error) {
    // alert("Failed to load your token data and balance");
  }
};

export async function getDataForPairs(
  account,
  pairAddress,
  factoryContract,
  wethAddress,
  chainId
) {
  const pairContract = await getpairContract(pairAddress);
  if (pairContract) {
    const token0Address = await pairContract.methods.token0().call();
    const token1Address = await pairContract.methods.token1().call();
    const _totalSupply =
      Number(await pairContract.methods.totalSupply().call()) *
      10 ** -Number(await pairContract.methods.decimals().call());
    const reserves = await fetchReserves(
      token0Address,
      token1Address,
      factoryContract
    );
    const liquidity =
      (await pairContract.methods.balanceOf(account).call()) *
      10 ** -(await pairContract.methods.decimals().call());
    let token0Data = await getTokenDataWithBalance(
      token0Address,
      wethAddress,
      chainId,
      account
    );
    let token1Data = await getTokenDataWithBalance(
      token1Address,
      wethAddress,
      chainId,
      account
    );

    token0Data.balance = (liquidity * reserves[0]) / _totalSupply;
    token1Data.balance = (liquidity * reserves[1]) / _totalSupply;

    return [{ token0Data, token1Data, pairAddress, liquidity }];
  } else if (!pairContract) {
    alert("Pair address does not exists");
  }
}

export async function getDataForPairsWithoutAuth(
  pairAddress,
  factoryContract,
  wethAddress,
  chainId
) {
  const pairContract = await getpairContract(pairAddress);
  if (pairContract) {
    const token0Address = await pairContract.methods.token0().call();
    const token1Address = await pairContract.methods.token1().call();
    const reserves = await fetchReserves(
      token0Address,
      token1Address,
      factoryContract
    );
    const reserve0 = reserves[0];
    const reserve1 = reserves[1];
    const token0Data = await getTokenData(token0Address, wethAddress, chainId);
    const token1Data = await getTokenData(token1Address, wethAddress, chainId);

    return [{ token0Data, token1Data, reserve0, reserve1, pairAddress }];
  } else if (!pairContract) {
    alert("Pair address does not exist");
  }
}
// check if token already approved
export async function isTokenAlreadyApproved(
  address,
  amount,
  account,
  routerAddress
) {
  try {
    // let routerAddress = await getRouterAddress();

    const token = await getTokenContract(address);

    if (token) {
      //let amountIn = await toWei(amount, await token.methods.decimals().call());
      let amountAllowed = await token.methods
        .allowance(account, routerAddress)
        .call();
      amountAllowed = await fromWei(
        amountAllowed,
        await token.methods.decimals().call()
      );
      if (Number(amountAllowed) >= Number(amount)) {
        return true;
      } else {
        return false;
      }
    } else {
      alert("Token doesn't exist\nMake sure connected to Goerli network");
      return false;
    }
  } catch (err) {
    //alert("while checking token already approved an error occured");
    return;
  }
}
// approve token
export async function approveToken(address, routerAddress, account) {
  try {
    const token = await getTokenContract(address);
    if (token) {
      // let amountIn = await toWei(amount, await token.methods.decimals().call());
      let approvalAmount = 10 ** 20;
      approvalAmount = await toWei(
        approvalAmount,
        await token.methods.decimals().call()
      );
      await token.methods
        .approve(routerAddress, approvalAmount)
        .send({ from: account });
      return 1;
    } else {
      alert("Token doesn't exist");
      return;
    }
  } catch (err) {
    alert("Approval rejected");
  }
}

// check if lp token already approved
export async function isLpTokenAlreadyApproved(
  address,
  amount,
  account,
  routerAddress
) {
  try {
    // let routerAddress = await getRouterAddress();

    const pairContract = await getpairContract(address);

    if (pairContract) {
      //let amountIn = await toWei(amount, await token.methods.decimals().call());
      let amountAllowed = await pairContract.methods
        .allowance(account, routerAddress)
        .call();
      amountAllowed = await fromWei(
        amountAllowed,
        await pairContract.methods.decimals().call()
      );
      if (Number(amountAllowed) >= Number(amount)) {
        return true;
      } else {
        return false;
      }
    } else {
      alert("Pool doesn't exist");
      return false;
    }
  } catch (err) {
    //alert("while checking token already approved an error occured");
    return;
  }
}
// approve lp token
export async function approveLpToken(address, routerAddress, account) {
  try {
    const pairContract = await getpairContract(address);
    if (pairContract) {
      // let amountIn = await toWei(amount, await token.methods.decimals().call());
      let approvalAmount = 10 ** 20;
      approvalAmount = await toWei(
        approvalAmount,
        await pairContract.methods.decimals().call()
      );
      await pairContract.methods
        .approve(routerAddress, approvalAmount)
        .send({ from: account });
      return 1;
    } else {
      alert("Pool doesn't exist");
      return;
    }
  } catch (err) {
    alert("Approval rejected");
    return;
  }
}

/* -----------------sendPage------------------------ */

export async function sendToken(
  tokenAddress,
  wethAddress,
  recipient,
  amount,
  account
) {
  try {
    if (
      (await tokenAddress.toString().toLowerCase()) ===
      (await wethAddress.toString().toLowerCase())
    ) {
      const amt = await toWei(amount, 18); // web3.utils.toWei(String(amount), "ether");
      const t = new ethers.providers.Web3Provider(window.ethereum);
      //const p0 = t.listAccounts();
      const signer = t.getSigner(account);
      // console.log(p);
      let tx = {
        to: recipient,
        value: amt,
      };
      let k = signer.sendTransaction(tx);
      return [await k.status, await k.transactionHash];
    } else {
      const token = await getTokenContract(tokenAddress);
      //const amt = web3.utils.toWei(String(amount), "ether");
      // to wei

      //amount * 10 ** Number(token.methods.decimals().call());
      if (token) {
        let amt = await toWei(amount, await token.methods.decimals().call());
        let k = await token.methods
          .transfer(recipient, amt)
          .send({ from: account });
        // console.log(await k.status);
        // console.log(await k.transactionHash);
        return [await k.status, await k.transactionHash];
      } else if (!token) {
        alert("Token does not exists");
        return;
      }
    }
  } catch (err) {
    //alert("An error occured while sending the token");
    return;
  }
}

/* -----------------swapPage------------------------ */

export async function swap(
  path,
  amount,
  amountOut,
  slippage,
  deadline,
  account,
  routerContract,
  wethAddress
) {
  try {
    //let routerAddress = await routerContract.address;

    const token0 = await getTokenContract(path[0]);
    const OutputToken = await getTokenContract(path[path.length - 1]);
    //const routerContract = await getRouter(routerAddress);
    // const wethAddress = await getWeth();

    let amountIn = await toWei(amount, await token0.methods.decimals().call());

    amountOut = await calSlippage(
      amountOut,
      await OutputToken.methods.decimals().call(),
      slippage
    );

    // amountOut = amountOut[amountOut.length - 1] * (1 - slippage * 0.01);
    // amountOut = amountOut.toString(); //* 0.995; //10 ** -18;
    //console.log(amountOut);

    // await token0.methods
    //   .approve(routerAddress, amountIn)
    //   .send({ from: account });

    deadline = ethers.BigNumber.from(
      Math.floor(Date.now() / 1000) + Number(deadline) * 60 * 1000
    );

    if (
      wethAddress &&
      (await path[0].toString().toLowerCase()) ===
        (await wethAddress.toString().toLowerCase())
    ) {
      //console.log(path);
      //console.log([amountOut, path, account, deadline.toString(), amountIn]);

      let k = await routerContract.methods
        .swapExactETHForTokens(amountOut, path, account, deadline)
        .send({ from: account, value: amountIn });

      return [await k.status, await k.transactionHash];
    } else if (
      wethAddress &&
      (await path[path.length - 1].toString().toLowerCase()) ===
        (await wethAddress.toString().toLowerCase())
    ) {
      let k = await routerContract.methods
        .swapExactTokensForETH(amountIn, amountOut, path, account, deadline)
        .send({ from: account });

      // console.log(await k.status);
      return [await k.status, await k.transactionHash];
    } else {
      let k = await routerContract.methods
        .swapExactTokensForTokens(amountIn, amountOut, path, account, deadline)
        .send({ from: account });

      //console.log(await k.status);
      return [await k.status, await k.transactionHash];
    }
  } catch (err) {
    //alert(err);
    //alert("An error occured while swapping the token");
  }
}

/* -----------------addLiquidityPage------------------------ */

export async function addLiquidity(
  token0Address,
  token1Address,
  amount0,
  amount1,
  slippage,
  deadline,
  account,
  routerContract,
  wethAddress
) {
  try {
    // let routerAddress = await getRouterAddress();

    //const routerContract = await getRouter(routerAddress);
    // const wethAddress = await getWeth();

    const token0 = await getTokenContract(token0Address);
    const token1 = await getTokenContract(token1Address);

    if (token0 && token1) {
      const amountIn0 = await toWei(
        amount0,
        await token0.methods.decimals().call()
      );
      const amountIn1 = await toWei(
        amount1,
        await token1.methods.decimals().call()
      );

      let amount0Min = (await amount0) * (1 - slippage * 0.01);
      let amount1Min = (await amount1) * (1 - slippage * 0.01);
      amount0Min = await toWei(
        amount0Min,
        await token0.methods.decimals().call()
      );
      amount1Min = await toWei(
        amount1Min,
        await token1.methods.decimals().call()
      );

      deadline = ethers.BigNumber.from(
        Math.floor(Date.now() / 1000) + Number(deadline) * 60 * 1000
      );

      if (
        (await token0Address.toString().toLowerCase()) ===
        (await wethAddress.toString().toLowerCase())
      ) {
        // Eth + Token
        let k = await routerContract.methods
          .addLiquidityETH(
            token1Address,
            amountIn1,
            amount1Min,
            amount0Min,
            account,
            deadline
          )
          .send({ value: amountIn0, from: account });
        return [await k.status, await k.transactionHash];
      } else if (
        (await token1Address.toString().toLowerCase()) ===
        (await wethAddress.toString().toLowerCase())
      ) {
        // Token + Eth
        let k = await routerContract.methods
          .addLiquidityETH(
            token0Address,
            amountIn0,
            amount0Min,
            amount1Min,
            account,
            deadline
          )
          .send({ value: amountIn1, from: account });

        return [await k.status, await k.transactionHash];
      } else {
        let k = await routerContract.methods
          .addLiquidity(
            token0Address,
            token1Address,
            amountIn0,
            amountIn1,
            amount0Min,
            amount1Min,
            account,
            deadline
          )
          .send({ from: account });
        return [await k.status, await k.transactionHash];
      }
    } else if (!token0 || !token1) {
      alert("Token does not exists");
      return;
    }
  } catch (err) {
    // alert("An error occured while adding Liquidity");
    return;
  }
}

export async function removeLiquidity(
  token0Address,
  token1Address,
  liquidity_tokens,
  slippage,
  deadline,
  account,
  factoryContract,
  routerContract,
  wethAddress
) {
  try {
    //let routerAddress = await getRouterAddress();
    //let factoryAddress = await getfactoryAddress();
    const token0 = await getTokenContract(token0Address);
    const token1 = await getTokenContract(token1Address);
    // const factoryContract = await getFactory(factoryAddress);
    // const routerContract = await getRouter(routerAddress);
    //const wethAddress = await getWeth();

    const pairAddress = await factoryContract.methods
      .getPair(token0Address, token1Address)
      .call();

    if (String(pairAddress) === "0x0000000000000000000000000000000000000000") {
      return;
    }
    const pairContract = await getpairContract(pairAddress);

    if (pairContract) {
      const data = await quoteRemoveLiquidity(
        token0Address,
        token1Address,
        liquidity_tokens,
        factoryContract
      );
      const liquidity = await toWei(
        liquidity_tokens,
        await pairContract.methods.decimals().call()
      );

      let amount0Min = data[1] * (1 - slippage * 0.01);

      let amount1Min = data[2] * (1 - slippage * 0.01);

      amount0Min = await toWei(
        amount0Min,
        await token0.methods.decimals().call()
      );
      amount1Min = await toWei(
        amount1Min,
        await token1.methods.decimals().call()
      );

      // await pairContract.methods
      //   .approve(routerContract._address, liquidity)
      //   .send({ from: account });

      deadline = ethers.BigNumber.from(
        Math.floor(Date.now() / 1000) + Number(deadline) * 60 * 1000
      );

      if (
        (await token0Address.toString().toLowerCase()) ===
        (await wethAddress.toString().toLowerCase())
      ) {
        // Eth + Token
        let k = await routerContract.methods
          .removeLiquidityETH(
            token1Address,
            liquidity,
            amount1Min,
            amount0Min,
            account,
            deadline
          )
          .send({ from: account });
        return [await k.status, await k.transactionHash];
      } else if (
        (await token1Address.toString().toLowerCase()) ===
        (await wethAddress.toString().toLowerCase())
      ) {
        // Token + Eth
        let k = await routerContract.methods
          .removeLiquidityETH(
            token0Address,
            liquidity,
            amount0Min,
            amount1Min,
            account,
            deadline
          )
          .send({ from: account });

        return [await k.status, await k.transactionHash];
      } else {
        let k = await routerContract.methods
          .removeLiquidity(
            token0Address,
            token1Address,
            liquidity,
            amount0Min,
            amount1Min,
            account,
            deadline
          )
          .send({ from: account });
        return [await k.status, await k.transactionHash];
      }
    }
  } catch (err) {
    // alert("An error occured while removing liquidity");
    return;
  }
}

/* -----------------Utils------------------------ */

export async function quote(amount0, reserve0, reserve1) {
  const amount1 = amount0 * (reserve1 / reserve0);
  const amountOut = Math.sqrt(amount1 * amount0);
  return [amount1, amountOut];
}

export async function getAmountOut(path, amount, routerContract) {
  try {
    // const path = [token0Address, token1Address];
    //let routerAddress = await getRouterAddress();

    const token = await getTokenContract(path[0]);
    const OutputToken = await getTokenContract(path[path.length - 1]);

    const amountIn = await toWei(amount, await token.methods.decimals().call());
    //console.log(amountIn);
    //const routerContract = await getRouter(routerAddress);

    const amountOut = await routerContract.methods
      .getAmountsOut(amountIn, path)
      .call();

    return Number(
      await fromWei(
        amountOut[path.length - 1],
        await OutputToken.methods.decimals().call()
      )
    );
  } catch (err) {
    //  alert(err );
  }
}

export async function getArrayOfPriceAtPaid(path, amount, routerContract) {
  try {
    // const path = [token0Address, token1Address];
    // let routerAddress = await getRouterAddress();

    let decimalArr = [];
    for (let j = 0; j < path.length; j++) {
      const token = await getTokenContract(path[j]);
      let dec = await token.methods.decimals().call();
      decimalArr.push(dec);
    }

    const amountIn = await toWei(amount, decimalArr[0]);

    // const routerContract = await getRouter(routerAddress);

    const amountOut = await routerContract.methods
      .getAmountsOut(amountIn, path)
      .call();

    let r = [];
    for (let i = 0; i < amountOut.length - 1; i++) {
      let t0 = await fromWei(amountOut[i], decimalArr[i]);
      let t1 = await fromWei(amountOut[i + 1], decimalArr[i + 1]);
      let p = Number(t0) / Number(t1);
      r.push(Number(p));
    }
    return r;
  } catch (err) {
    // alert(err + " kad");
    return;
  }
}
export async function getArrayOfPoolPrice(path, factoryContract) {
  try {
    let r = [];
    for (let i = 0; i < path.length - 1; i++) {
      let pair = await getPairAddress(path[i], path[i + 1], factoryContract);

      if (pair) {
        let reserves = await fetchReserves(
          path[i],
          path[i + 1],
          factoryContract
        );
        // console.log(Number(reserves[0]));
        // console.log(Number(reserves[1]));
        //console.log(reserves);
        r.push(Number(reserves[0]) / Number(reserves[1]));
      } else {
        alert("pair doesn't exists");
      }
    }
    return r;
  } catch (err) {
    //alert("Error: While calculating pool price");
    return;
  }
}

export async function getAmountIn(path, amount, routerContract) {
  try {
    //const path = [token0Address, token1Address];
    //let routerAddress = await getRouterAddress();

    const OutputToken = await getTokenContract(path[path.length - 1]);
    const token = await getTokenContract(path[0]);

    const amountOut = await toWei(
      amount,
      await OutputToken.methods.decimals().call()
    );

    //const routerContract = await getRouter(routerAddress);

    const amountIn = await routerContract.methods
      .getAmountsIn(amountOut, path)
      .call();

    return Number(
      await fromWei(amountIn[0], await token.methods.decimals().call())
    );
  } catch (err) {
    // alert("hg");
    // alert(err);
  }
}

export async function getPairs(factoryContract) {
  try {
    // let factoryAddress = await getfactoryAddress();
    // const factoryContract = await getFactory(factoryAddress);
    const pairLength = await factoryContract.methods.allPairsLength().call();
    let pairs = [];
    for (let i = 0; i < pairLength; i++) {
      const pair = await factoryContract.methods.allPairs(i).call();
      pairs.push(pair);
    }
    return pairs;
  } catch (err) {
    //alert("Error: while fetching all pool pairs");
  }
}

export async function fetchReserves(
  token0Address,
  token1Address,
  factoryContract
) {
  try {
    //console.log(" d  " + [token0Address, token1Address]);

    // let factoryAddress = await getfactoryAddress();
    // const factoryContract = await getFactory(factoryAddress);
    const pairAddress = await factoryContract.methods
      .getPair(token0Address, token1Address)
      .call();
    if (String(pairAddress) === "0x0000000000000000000000000000000000000000") {
      return [0, 0];
    }

    const pairContract = await getpairContract(pairAddress);
    if (pairContract) {
      const reservesRaw = await pairContract.methods.getReserves().call();
      const token0 = await getTokenContract(token0Address);
      const token1 = await getTokenContract(token1Address);
      let results = [
        await fromWei(reservesRaw[0], await token0.methods.decimals().call()),
        await fromWei(reservesRaw[1], await token1.methods.decimals().call()),
      ];
      //console.log(results);
      // let k1 = await pairContract.methods.token1().call();
      let address0 = await pairContract.methods.token0().call(); //=== token0Address;
      let address1 = await pairContract.methods.token1().call(); // === token1Address;
      // address0 = await address0.toString();
      // address1 = await address1.toString();

      address0 = await address0.toString().toLowerCase();
      address1 = await address1.toString().toLowerCase();

      // token0Address = await token0Address.toString();
      // token1Address = await token1Address.toString();

      token0Address = await token0Address.toString().toLowerCase();
      token1Address = await token1Address.toString().toLowerCase();

      return [
        String(address0).includes(String(token0Address))
          ? results[0]
          : results[1],
        String(address1).includes(String(token1Address))
          ? results[1]
          : results[0],
      ];
    }
  } catch (err) {
    // alert(err + "dsk");
  }
}

export async function getReserves(
  token0Address,
  token1Address,
  account,
  factoryContract
) {
  try {
    //let routerAddress = await getRouterAddress();
    // let factoryAddress = await getfactoryAddress();
    //const factoryContract = await getFactory(factoryAddress);
    const pairAddress = await factoryContract.methods
      .getPair(token0Address, token1Address)
      .call();
    const pairContract = await getpairContract(pairAddress);
    const reservesRaw = await fetchReserves(
      token0Address,
      token1Address,
      factoryContract
    );
    if (pairAddress === "0x0000000000000000000000000000000000000000") {
      return [Number(reservesRaw[0]), Number(reservesRaw[1]), 0];
    } else {
      const liquidityTokens_BN = await pairContract.methods
        .balanceOf(account)
        .call();
      const liquidityTokens = await fromWei(
        liquidityTokens_BN,
        await pairContract.methods.decimals().call()
      );

      return [
        Number(reservesRaw[0]),
        Number(reservesRaw[1]),
        Number(liquidityTokens),
      ];
    }
  } catch (err) {
    // alert(err + " csfkc");
  }
}

export async function getYourAllLiquidityPair(account, factoryContract) {
  try {
    const pairs = await getPairs(factoryContract);
    let yourPairs = [];
    for (let i = 0; i < pairs.length; i++) {
      const pairContract = await getpairContract(pairs[i]);
      const liquidityTokens_BN = await pairContract.methods
        .balanceOf(account)
        .call();
      if (liquidityTokens_BN > 0) {
        yourPairs.push(pairs[i]);
      }
    }
    return yourPairs;
  } catch (err) {
    // alert("Error: while fetching your all pairs in the pool");
    return;
  }
}

export async function quoteAddLiquidity(
  token0Address,
  token1Address,
  amount,
  isamountBGiven,
  factoryContract
) {
  const reservesRaw = await fetchReserves(
    token0Address,
    token1Address,
    factoryContract
  );
  const reserveA = reservesRaw[0];
  const reserveB = reservesRaw[1];

  if (reserveA === 0 && reserveB === 0) {
    //let amountOut = Math.sqrt(reserveA * reserveB);
    return []; //[
    //   amountADesired.toString(),
    //   //amountBDesired.toString(),
    //   amountOut.toString(),
    // ];
  } else {
    if (isamountBGiven) {
      let [amountAOptimal, amountOut] = await quote(amount, reserveB, reserveA);

      return [
        amountAOptimal.toString(),
        amount.toString(),
        amountOut.toString(),
      ];
    } else {
      let [amountBOptimal, amountOut] = await quote(amount, reserveA, reserveB);
      return [
        amount.toString(),
        amountBOptimal.toString(),
        amountOut.toString(),
      ];
    }
  }
}
export async function getAmoutOutRemoveLiquidity(
  token0Address,
  token1Address,
  amount,
  isAmount1Given,
  factoryContract
) {
  try {
    // let routerAddress = await getRouterAddress();
    // let factoryAddress = await getfactoryAddress();
    //const factoryContract = await getFactory(factoryAddress);

    const pairAddress = await factoryContract.methods
      .getPair(token0Address, token1Address)
      .call();
    if (pairAddress === "0x0000000000000000000000000000000000000000") {
      return;
    }
    const pairContract = await getpairContract(pairAddress);
    if (pairContract) {
      const reservesRaw = await fetchReserves(
        token0Address,
        token1Address,
        factoryContract
      );
      const reserveA = reservesRaw[0];
      const reserveB = reservesRaw[1];

      const _totalSupply = await pairContract.methods.totalSupply().call();
      let totalSupply = Number(
        await fromWei(
          _totalSupply,
          await pairContract.methods.decimals().call()
        )
      );
      let liquidity;
      if (isAmount1Given) {
        liquidity = (amount * totalSupply) / reserveB;
      } else {
        liquidity = (amount * totalSupply) / reserveA;
      }
      const Aout = (reserveA * liquidity) / totalSupply;
      const Bout = (reserveB * liquidity) / totalSupply;
      //console.log(liquidity);
      return [liquidity, Aout, Bout];
    } else {
      return;
    }
  } catch (err) {
    //alert(err);
  }
}
export async function quoteRemoveLiquidity(
  token0Address,
  token1Address,
  liquidity,
  factoryContract
) {
  try {
    //  let routerAddress = await getRouterAddress();
    //let factoryAddress = await getfactoryAddress();
    // const factoryContract = await getFactory(factoryAddress);

    const pairAddress = await factoryContract.methods
      .getPair(token0Address, token1Address)
      .call();
    if (pairAddress === "0x0000000000000000000000000000000000000000") {
      return;
    }
    const pairContract = await getpairContract(pairAddress);
    if (pairContract) {
      const reservesRaw = await fetchReserves(
        token0Address,
        token1Address,
        factoryContract
      );
      const reserveA = reservesRaw[0];
      const reserveB = reservesRaw[1];

      const _totalSupply = await pairContract.methods.totalSupply().call();
      let totalSupply = Number(
        await fromWei(
          _totalSupply,
          await pairContract.methods.decimals().call()
        )
      );
      const Aout = (reserveA * liquidity) / totalSupply;
      const Bout = (reserveB * liquidity) / totalSupply;

      return [liquidity, Aout, Bout];
    } else {
      return;
    }
  } catch (err) {
    //alert("Error : While fetching burning assets amount");
  }
}

//  Smart Route

async function find_paths(parent, u, paths = [], path = []) {
  // Base Case
  if (u === -1) {
    //paths.push([12, 1]);
    var p = [];
    for (const i of path) {
      p.push(i);
    }
    paths.push(p);
    return;
  }
  if (parent[u]) {
    parent[u].forEach((par) => {
      path.push(u);
      //console.log("parent[0]");
      find_paths(parent, par, paths, path);

      path.pop();
    });
  }

  return paths;
}

async function bfs(adj, start) {
  // dist will contain shortest distance
  // from start to every other vertex
  var parent = {};
  // for (let j = 0; j < n; j++) {
  //   parent[j] = [];
  // }
  var dist = {}; //n

  //dist.fill(Number.MAX_VALUE, 0, n);

  //Queue<Integer> q = new LinkedList<>();
  var q = [];

  // Insert source vertex in queue and make
  // its parent -1 and distance 0
  q.push(start);
  //q.offer(start);

  parent[start] = [];
  parent[start].push(-1);
  dist[start] = 0;

  // Until Queue is empty
  while (q.length > 0) {
    var u = q.shift();
    adj[u].forEach((v) => {
      if (dist[v] === undefined || dist[v] > dist[u] + 1) {
        //console.log(v);
        dist[v] = dist[u] + 1;
        q.push(v);
        parent[v] = [];
        parent[v].push(u);
      } else if (dist[v] === dist[u] + 1) {
        parent[v].push(u);
      }
    });
  }
  // for (const i of parent) {
  //   console.log(i);
  // }
  // console.log(dist);
  return parent;
}

async function print_paths(adj, start, end) {
  let parent = await bfs(adj, start);

  // console.log(parent);
  // Function call to find_paths
  let r = await find_paths(parent, end);
  let p = [];
  //console.log(r.length);
  if (r.length > 0) {
    r.forEach((m) => {
      m.reverse();
      p.push(m);
    });
    console.log(p);
    return p;
  } else {
    return r;
  }
}

export async function SmartRoutes(list, src, target) {
  var graph = new Graph();
  for (let i = 0; i < list.length; i++) {
    graph.addEdge(
      list[i].token0Data.tokenAddress,
      list[i].token1Data.tokenAddress
    );
  }

  // graph.addEdge("A", "C");
  // graph.addEdge("B", "C");
  // // graph.addEdge("D", "M");
  // graph.addEdge("B", "D");
  // graph.addEdge("D", "A");
  // graph.addEdge("C", "E");
  // graph.addEdge("E", "F");
  // graph.addEdge("F", "B");
  // graph.addEdge('E', 'F');

  let r = await print_paths(graph.neighbors, src, target);
  return r;
}

/*

{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@material-ui/icons": "^4.11.3",
    "@testing-library/jest-dom": "^5.16.4",
    "@testing-library/react": "^13.3.0",
    "@testing-library/user-event": "^13.5.0",
    "bootstrap": "^5.1.3",
    "bootstrap-social": "^5.1.1",
    "ethers": "^5.6.9",
    "font-awesome": "^4.7.0",
    "material-ui": "^0.20.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "4.0.3",
    "web-vitals": "^2.1.4",
    "web3": "^1.7.3"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "assert": "^2.0.0",
    "axios": "^0.27.2",
    "buffer": "^6.0.3",
    "crypto-browserify": "^3.12.0",
    "eslint": "^8.19.0",
    "eslint-config-prettier": "^8.5.0",
    "eslint-plugin-prettier": "^4.2.1",
    "https-browserify": "^1.0.0",
    "os-browserify": "^0.3.0",
    "prettier": "^2.7.1",
    "process": "^0.11.10",
    "react-alert": "^7.0.3",
    "react-alert-template-basic": "^1.0.2",
    "react-app-rewired": "^2.2.1",
    "react-helmet": "^6.1.0",
    "react-icons": "^4.4.0",
    "react-redux": "^8.0.2",
    "react-router-dom": "^6.3.0",
    "reactstrap": "^9.1.1",
    "redux": "^4.2.0",
    "redux-devtools-extension": "^2.13.9",
    "redux-thunk": "^2.4.1",
    "stream-browserify": "^3.0.0",
    "stream-http": "^3.2.0",
    "url": "^0.11.0",
    "webfontloader": "^1.6.28"
     
  }
}


"react-error-overlay": "6.0.9"

 "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },

{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@material-ui/core": "^4.12.3",
    "@material-ui/data-grid": "^4.0.0-alpha.37",
    "@material-ui/icons": "^4.11.2",
    "@material-ui/lab": "^4.0.0-alpha.60",
    "@testing-library/jest-dom": "^5.11.6",
    "@testing-library/react": "^11.2.2",
    "@testing-library/user-event": "^12.2.2",
    "bootstrap": "^5.1.3",
    "bootstrap-social": "^5.1.1",
    "ethers": "^5.6.9",
    "font-awesome": "^4.7.0",
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "react-scripts": "4.0.3",
    "web-vitals": "^2.1.4",
    "web3": "^1.7.3"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": "react-app"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "axios": "^0.27.2",
    "gh-pages": "^4.0.0",
    "prettier": "^2.7.1",
    "process": "^0.11.10",
    "react-alert": "^7.0.3",
    "react-alert-template-basic": "^1.0.2",
    "react-app-rewired": "^2.2.1",
    "react-helmet": "^6.1.0",
    "react-icons": "^4.4.0",
    "react-redux": "^8.0.2",
    "react-router-dom": "^6.3.0",
    "reactstrap": "^9.1.1",
    "redux": "^4.2.0",
    "redux-devtools-extension": "^2.13.9",
    "redux-thunk": "^2.4.1",
    "webfontloader": "^1.6.28"
  }
}


*/
