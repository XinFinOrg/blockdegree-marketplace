import _ from "lodash";

import * as types from "../actions/types";
import { CONTRACT_ADDRESS } from "../helpers/constant";
import {
  SubmitContractTxGeneral,
  GetNativeBalance,
  IsAddressEqual,
} from "../wallets/index";
import { fromXdcAddress } from "../wallets/xinpay";

async function getAssets(store, address_) {
  const address = address_ || store.getState().wallet.address;
  const allCollections = store.getState().collections.collections;
  const collections = store
    .getState()
    .collections.collections.map(({ address }) => address);

  console.log(
    "collections",
    collections,
    store.getState().collections.collections
  );
  if (_.isUndefined(address))
    store.dispatch({ type: types.WALLET_DISCONNECTED });
  store.dispatch({
    type: types.NFT_ASSETS_START,
  });

  const nativeBalance = await GetNativeBalance(address);

  const tokenBalances = await Promise.all([
    ...collections.map((assetAddress) =>
      SubmitContractTxGeneral(
        "balanceOf",
        { type: "nft", address: assetAddress },
        "view",
        address
      )
    ),
  ]);

  const totalSupplies = await Promise.all([
    ...collections.map((address) =>
      SubmitContractTxGeneral("totalSupply", { type: "nft", address }, "view")
    ),
  ]);

  const tokenBalancesToAddress = tokenBalances.map((bal, i) => {
    return {
      balance: bal,
      address: collections[i],
      collection: allCollections[i],
    };
  });

  const tokenSuppliesToAddress = totalSupplies.map((totalSupply, i) => {
    return { totalSupply, address: collections[i] };
  });

  store.dispatch({
    type: types.WALLET_BALANCE_DATA,
    payload: {
      native: Multiplier(nativeBalance),
      tokens: tokenBalancesToAddress,
    },
  });

  const allData = [];
  let formatedAllData;
  for (let i = 0; i < tokenSuppliesToAddress.length; i++) {
    const { totalSupply, address } = tokenSuppliesToAddress[i];
    for (let j = 0; j < totalSupply; j++) {
      const assetId = await SubmitContractTxGeneral(
        "tokenByIndex",
        { type: "nft", address },
        "view",
        `${j}`
      );
      let data = await Promise.all([
        SubmitContractTxGeneral(
          "ownerOf",
          { type: "nft", address },
          "view",
          assetId
        ),
        SubmitContractTxGeneral(
          "tokenMetadata",
          { type: "nft", address },
          "view",
          assetId
        ),
        SubmitContractTxGeneral(
          "tokenURI",
          { type: "nft", address },
          "view",
          assetId
        ),
        SubmitContractTxGeneral(
          "getApproved",
          { type: "nft", address },
          "view",
          assetId
        ),
      ]);
      allData.push([...data, assetId, address]);
    }
  }

  formatedAllData = allData.reduce(
    (
      acc,
      [
        owner,
        { name, description },
        tokenURI,
        approvedAddress,
        assetId,
        assetAddress,
      ]
    ) => {
      acc.push({
        owner,
        name,
        description,
        tokenURI,
        assetId,
        isApproved: IsAddressEqual(approvedAddress, CONTRACT_ADDRESS.auction),
        assetAddress,
      });
      return acc;
    },
    []
  );

  store.dispatch({
    type: types.NFT_ASSETS_SUCCESS,
    payload: {
      allAssets: { data: [...formatedAllData], loading: false },
      userAssets: {
        data: [...formatedAllData.filter(({ owner }) => owner === address)],
        loading: false,
      },
    },
  });
}

const getAuctionAssets = (store) => {
  store.dispatch({ type: types.NFT_AUCTION_START });
  const collections = store
    .getState()
    .collections.collections.map(({ address }) =>
      fromXdcAddress(address).toLowerCase()
    );

  console.log("collections", collections);

  SubmitContractTxGeneral("getTotalAuctions", { type: "auction" }, "view")
    .then((total) => {
      const allPromise = [];
      for (let i = 0; i < total; i++) {
        allPromise.push(
          SubmitContractTxGeneral("auctions", { type: "auction" }, "view", i)
        );
      }
      return Promise.all(allPromise);
    })
    .then((allAuctions) => {
      return Promise.all(
        allAuctions
          .map((x, i) => {
            return { ...x, auctionIndex: i };
          })
          .filter((x) =>
            collections.includes(fromXdcAddress(x.assetAddress).toLowerCase())
          )
          .map(async (x, i) => {
            let data = await Promise.all([
              SubmitContractTxGeneral(
                "ownerOf",
                { type: "nft", address: x.assetAddress },
                "view",
                x.assetId
              ),
              SubmitContractTxGeneral(
                "tokenMetadata",
                { type: "nft", address: x.assetAddress },
                "view",
                x.assetId
              ),
              SubmitContractTxGeneral(
                "tokenURI",
                { type: "nft", address: x.assetAddress },
                "view",
                x.assetId
              ),
            ]);
            const [owner, { name, description }, tokenURI] = data;

            return {
              ...x,
              owner,
              name,
              description,
              tokenURI,
            };
          })
      );
    })
    .then((allAuctions) => {
      allAuctions = allAuctions.reduce((acc, x) => {
        const {
          assetAddress,
          assetId,
          creator,
          startTime,
          duration,
          currentBidAmount,
          currentBidOwner,
          bidCount,
          assetClaimed,
          winningBidClaimed,
          owner,
          name,
          description,
          tokenURI,
          auctionIndex,
        } = x;

        acc.push({
          assetAddress,
          assetId,
          creator,
          startTime,
          duration,
          currentBidAmount,
          currentBidOwner,
          bidCount,
          assetClaimed,
          winningBidClaimed,
          owner,
          name,
          description,
          tokenURI,
          auctionIndex,
        });
        return acc;
      }, []);

      store.dispatch({
        type: types.NFT_AUCTION_SUCCESS,
        payload: {
          auctions: {
            data: [...allAuctions],
            loading: false,
          },
        },
      });
    });
};

export const GetWalletBalance = (store) => (next) => async (action) => {
  next(action);

  if (
    [
      types.WALLET_CONNECTED,
      types.WALLET_CHAIN_CHANGED,
      types.WALLET_ADDRESS_CHANGED,
      types.WALLET_OPENED,
    ].includes(action.type)
  ) {
    const { address } = action.payload;

    if (_.isUndefined(address))
      store.dispatch({ type: types.WALLET_DISCONNECTED });
    else {
      await getAssets(store, address);
      await getAuctionAssets(store);
    }
  } else if (action.type === types.GET_ASSETS) {
    await getAssets(store);
  } else if (action.type === types.GET_AUCTION) {
    await getAuctionAssets(store);
  } else if (action.type === types.NFT_COLLECTION_ADDED) {
    await getAssets(store);
  }
};

function Multiplier(amount) {
  const multiplier = Math.pow(10, 18);
  return parseFloat(amount) / multiplier;
}
