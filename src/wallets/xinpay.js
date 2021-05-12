import Xdc3, { utils } from "xdc3";
import detectEthereumProvider from "@metamask/detect-provider";
import _ from "lodash";

import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  HTTP_PROVIDER,
} from "../helpers/constant";

import * as actions from "../actions";
import store from "../redux/store";
import { toast } from "react-toastify";

let addresses, xdc3, addressChangeIntervalRef;

export function IsXdc3Supported() {
  return Boolean(window.ethereum);
}

export async function GetProvider() {
  const provider = await detectEthereumProvider();
  return provider;
}

export const MainnetProvider = () => {
  return new Xdc3.providers.HttpProvider(HTTP_PROVIDER[50]);
};

export const ApothemProvider = () => {
  return new Xdc3.providers.HttpProvider(HTTP_PROVIDER[50]);
};

export async function GetChainId() {
  let xdc3 = new Xdc3(await GetProvider());
  return await xdc3.eth.net.getId();
}

export async function initXdc3() {
  try {
    const isLocked = await IsLocked();
    if (isLocked === true) {
      toast("Please unlock XinPay wallet to continue");
      return store.dispatch(actions.WalletDisconnected());
    }
    const isXdc3Supported = IsXdc3Supported();
    if (!isXdc3Supported) {
      toast(
        <div>
          XinPay not available in the browser. Please refer <a href="/">here</a>
        </div>
      );

      return store.dispatch(actions.WalletDisconnected());
    }
    if ((await GetCurrentProvider()) !== "xinpay") {
      toast(
        <div>
          XinPay not available in the browser. Please refer <a href="/">here</a>
        </div>
      );
      return store.dispatch(actions.WalletDisconnected());
    }
    // const isConnected = await window.ethereum.isConnected();
    await window.ethereum.enable();
    _initListerner();
    const provider = await GetProvider();
    xdc3 = new Xdc3(provider);
    const accounts = await xdc3.eth.getAccounts();
    addresses = accounts;
    const chain_id = await xdc3.eth.getChainId();
    return store.dispatch(
      actions.WalletConnected({ address: accounts[0], chain_id })
    );
  } catch (e) {
    console.log(e);
  }
}

export function _initListerner() {
  window.ethereum.removeAllListeners();

  if (addressChangeIntervalRef) clearInterval(addressChangeIntervalRef);

  addressChangeIntervalRef = setInterval(async () => {
    const accounts = await xdc3.eth.getAccounts();
    if (_.isEqual(accounts, addresses)) return;
    console.log("accounts", accounts);
    addresses = accounts;
    store.dispatch(actions.AccountChanged(accounts[0]));
  }, 1000);

  window.ethereum.on("accountsChanged", async (data) => {
    const accounts = await xdc3.eth.getAccounts();
    console.log("accounts", accounts);
    addresses = accounts;
    store.dispatch(actions.AccountChanged(accounts[0]));
  });

  window.ethereum.on("chainChanged", async (data) => {
    const chain_id = await xdc3.eth.getChainId();
    store.dispatch(actions.NetworkChanged(chain_id));
  });

  window.ethereum.on("connect", async (data) => {
    xdc3 = new Xdc3(await GetProvider());
    const accounts = await xdc3.eth.getAccounts();
    const chain_id = await xdc3.eth.getChainId();
    addresses = accounts;
    return store.dispatch(
      actions.WalletConnected({ address: accounts[0], chain_id })
    );
  });

  window.ethereum.on("disconnect", (data) => {
    console.log("disconnect", data);
    return store.dispatch(actions.WalletDisconnected());
  });

  window.ethereum.on("message", (data) => {
    console.log("message", data);
  });
}

export async function GetCurrentProvider() {
  if (IsXdc3Supported() !== true) return null;

  if (window.web3.currentProvider.isMetaMask) {
    const chainId = await GetChainId();
    console.log("chainId", chainId, [50, 51].includes(chainId));
    if ([50, 51].includes(chainId)) return "xinpay";
    return "metamask";
  }

  if (window.web3.currentProvider.isTrust) return "trust";

  if (window.web3.currentProvider.isStatus) return "status";

  if (typeof window.SOFA !== "undefined") return "coinbase";

  if (typeof window.__CIPHER__ !== "undefined") return "cipher";

  if (window.web3.currentProvider.constructor.name === "EthereumProvider")
    return "mist";

  if (window.web3.currentProvider.constructor.name === "Xdc3FrameProvider")
    return "parity";

  if (
    window.web3.currentProvider.host &&
    window.web3.currentProvider.host.indexOf("infura") !== -1
  )
    return "infura";

  if (
    window.web3.currentProvider.host &&
    window.web3.currentProvider.host.indexOf("localhost") !== -1
  )
    return "localhost";

  return "unknown";
}

export const GetNativeBalance = (address) => {
  const xdc3 = new Xdc3(window.web3.currentProvider);
  return xdc3.eth.getBalance(address);
};

export async function SubmitContractTxGeneral(
  method,
  { type, address },
  stateMutability,
  ...params
) {
  return new Promise((resolve, reject) => {
    GetProvider()
      .then(async (provider) => {
        const xdc3 = new Xdc3(provider);

        const { abi, address: contractAddress } = getContractAddress(type);

        if (type !== "nft") address = contractAddress;

        console.log("typetype", type, address, arguments);

        const contract = new xdc3.eth.Contract(abi, address);

        if (stateMutability === "view") {
          contract.methods[method](...params)
            .call()
            .then((resp) => {
              resolve(resp);
            })
            .catch(reject);
        } else if (stateMutability === "payable") {
          const [value] = params.splice(params.length - 1, 1);

          const data = contract.methods[method](...params).encodeABI();

          const tx = {
            from: addresses[0],
            to: address,
            data,
            value,
          };

          const gasLimit = await xdc3.eth.estimateGas(tx);

          xdc3.eth.sendTransaction(tx, (err, hash) => {
            if (err) reject(err);
            let interval = setInterval(async () => {
              const receipt = await xdc3.eth.getTransactionReceipt(hash);
              console.log("receipt", receipt);
              if (receipt !== null) {
                if (receipt.status) {
                  clearInterval(interval);
                  resolve(receipt);
                } else {
                  reject(receipt);
                }
              }
            }, 2000);
          });
          // })
          // .catch(reject);
        } else {
          console.log("addresses[0]", addresses[0], method, params);

          const data = contract.methods[method](...params).encodeABI();

          const tx = {
            from: addresses[0],
            to: address,
            data,
          };

          const gasLimit = await xdc3.eth.estimateGas(tx);

          xdc3.eth.sendTransaction(tx, (err, hash) => {
            if (err) reject(err);
            let interval = setInterval(async () => {
              const receipt = await xdc3.eth.getTransactionReceipt(hash);
              if (receipt !== null) {
                if (receipt.status) {
                  clearInterval(interval);
                  resolve(receipt);
                } else {
                  reject(receipt);
                }
              }
            }, 2000);
          });
        }
      })
      .catch((e) => {
        console.log(arguments, e);
        console.log("resp", IsJsonRpcError(e));
        console.log("resp", e);
        reject(e);
      });
  });

  // } catch (e) {
  //   console.log("resp", IsJsonRpcError(e));
  //   console.log("resp", e);
  //   throw e;
  // }
}

export async function SubmitContractTxGeneralNonAuth(
  method,
  { type, address },
  ...params
) {
  return new Promise((resolve, reject) => {
    const xdc3 = new Xdc3(MainnetProvider());

    const { abi, address: contractAddress } = getContractAddress(type);

    if (type !== "nft") address = contractAddress;

    const contract = new xdc3.eth.Contract(abi, address);

    contract.methods[method](...params)
      .call()
      .then((resp) => {
        resolve(resp);
      })
      .catch(reject);
  });
}

export const IsJsonRpcError = (err) => {
  return err.message.split("\n")[0] === "Internal JSON-RPC error.";
};

export const GetPastEvents = async (abi, address, ...opts) => {
  const xdc3 = new Xdc3(await GetProvider());
  const contract = new xdc3.eth.Contract(abi, address);
  const query = {
    fromBlock: 0,
    toBlock: "latest",
    ...opts,
  };
  return await contract.getPastEvents("allEvents", { ...query });
};

export const GetFromAddress = async (hash) => {
  const xdc3 = new Xdc3(await GetProvider());
  const tx = await xdc3.eth.getTransaction(hash);
  const block = await xdc3.eth.getBlock(tx.blockHash);
  return { from: tx.from, timestamp: block.timestamp };
};

// export const GetBlock = async (hash) => {
//   const xdc3 = new Xdc3(await GetProvider());
//   return (await xdc3.eth.getBlock(hash)).from;
// };

export const GetJsonRpcError = (err) => {
  return JSON.parse(err.message.split("\n").slice(1).join("").trim());
};

function getContractAddress(type) {
  return {
    address: CONTRACT_ADDRESS[type],
    abi: CONTRACT_ABI[type],
  };
}

export function fromXdcAddress(address) {
  return utils.fromXdcAddress(address);
}

export function toXdcAddress(address) {
  return utils.toXdcAddress(address).toLowerCase();
}

export async function IsLocked() {
  let xdc3 = new Xdc3(await GetProvider());
  const accounts = await xdc3.eth.getAccounts();
  console.log("xx accounts", accounts);
  return _.isEmpty(accounts);
}
