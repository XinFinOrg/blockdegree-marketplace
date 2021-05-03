import { toast } from "react-toastify";

import * as metamask from "./metamask";
import * as xinpay from "./xinpay";

import store from "../redux/store";
import { EXPLORER, INTERFACE_ID } from "../helpers/constant";

function GetFuncFromChainId(chainId) {
  switch (`${chainId}`) {
    case "50":
    case "51":
      return xinpay;
    default:
      return xinpay;
  }
}

export function GetNativeBalance(...params) {
  return new Promise((resolve, reject) => {
    const wallet = store.getState();
    GetFuncFromChainId(wallet.wallet.chain_id)
      .GetNativeBalance(...params)
      .then((resp) => {
        resolve(resp);
      })
      .catch((e) => {
        console.log("resp", IsJsonRpcError(e));
        console.log("resp", e);
        reject(e);
      });
  });
}

export function IsLocked(...params) {
  return new Promise((resolve, reject) => {
    const wallet = store.getState();
    GetFuncFromChainId(wallet.wallet.chain_id)
      .IsLocked(...params)
      .then((resp) => {
        resolve(resp);
      })
      .catch((e) => {
        console.log("resp", IsJsonRpcError(e));
        console.log("resp", e);
        reject(e);
      });
  });
}

export function SubmitContractTxGeneral(...params) {
  return new Promise((resolve, reject) => {
    const wallet = store.getState();
    let toastId;
    if (params[2] !== "view")
      toastId = toast("Processing TX ...", {
        position: "bottom-right",
        type: "processing-tx",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        closeButton: false,
      });

    console.log("params[2]", params[2], toastId, params);

    GetFuncFromChainId(wallet.wallet.chain_id)
      .SubmitContractTxGeneral(...params)
      .then((resp) => {
        console.log("params[2] resp", resp);

        if (resp.transactionHash) {
          const { transactionHash } = resp;
          toast(
            <div>
              Sucsess&nbsp;
              <a
                href={`${EXPLORER}tx/${transactionHash}`}
                rel="noreferrer"
                target="_blank"
              >
                HASH
              </a>
            </div>,
            {
              position: "bottom-right",
              type: "success-tx",
              autoClose: false,
              hideProgressBar: false,
              closeButton: true,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            }
          );
        }

        resolve(resp);
      })
      .catch((e) => {
        console.log("resp", IsJsonRpcError(e));
        console.log("resp", e);
        reject(e);
      })
      .finally(() => {
        if (toastId) toast.dismiss(toastId);
      });
  });
}

export async function GetFromAddress(hash) {
  const wallet = store.getState();
  return await GetFuncFromChainId(wallet.wallet.chain_id).GetFromAddress(hash);
}

export async function GetBlock(hash) {
  const wallet = store.getState();
  return await GetFuncFromChainId(wallet.wallet.chain_id).GetBlock(hash);
}


export async function GetPastEvents(abi, address) {
  const wallet = store.getState();
  return await GetFuncFromChainId(wallet.wallet.chain_id).GetPastEvents(
    abi,
    address
  );
}

export const IsJsonRpcError = (err) => {
  return err.message.split("\n")[0] === "Internal JSON-RPC error.";
};

export const GetJsonRpcError = (err) => {
  return JSON.parse(err.message.split("\n").slice(1).join("").trim());
};

export const IsValidNFT = async (address) => {
  try {
    const resp = await Promise.all([
      SubmitContractTxGeneral(
        "supportsInterface",
        { type: "nft", address },
        "view",
        INTERFACE_ID.ERC165
      ),
      SubmitContractTxGeneral(
        "supportsInterface",
        { type: "nft", address },
        "view",
        INTERFACE_ID.ERC721
      ),
      SubmitContractTxGeneral(
        "supportsInterface",
        { type: "nft", address },
        "view",
        INTERFACE_ID.ERC721Enumerable
      ),
      SubmitContractTxGeneral(
        "supportsInterface",
        { type: "nft", address },
        "view",
        INTERFACE_ID.ERC721Metadata
      ),
    ]);
    return resp.reduce((acc, cur) => acc && cur, true);
  } catch (e) {
    return false;
  }
};

export const IsAddressEqual = (a, b) => {
  a = xinpay.fromXdcAddress(a).toLowerCase();
  b = xinpay.fromXdcAddress(b).toLowerCase();
  return a === b;
};

// IsValidNFT().then(console.log);
