import * as chains from "./constants/chains.js";
const TokenList = new Map();
TokenList.set(chains.ChainId.GÖRLI, [
  //"0xa9a466b8f415bCC5883934EDA70016F8b23Ea776",
  "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
  "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844",
  // "0xdc31ee1784292379fbb2964b3b9c4124d8f89c60",
  // "0xaD6D458402F60fD3Bd25163575031ACDce07538D",
  // "0xb33EDD6448eC2F93d0728DB8223EDc8Bb3cF2E6c",
  // "0x2E2582e7aA28fa9374c2b32890C1CFF066f86028",
]);
TokenList.set(chains.ChainId.SMARTCHAIN, [
  "0xae13d989dac2f0debff460ac112a837c89baa7cd",
  "0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee",
]);

export default TokenList;
