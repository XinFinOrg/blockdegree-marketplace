import * as types from "../../actions/types";

const initialState = {
  userAssets: { data: [], loading: false },
  allAssets: { data: [], loading: false },
  auctions: { data: [], loading: false },
};

const MarketplaceReducer = (state = initialState, payload) => {
  switch (payload.type) {
    case types.NFT_ASSETS_START: {
      return {
        ...state,
        userAssets: { ...state.userAssets, loading: true },
        allAssets: { ...state.allAssets, loading: true },
      };
    }

    case types.NFT_ASSETS_SUCCESS: {
      return {
        ...state,
        userAssets: { ...payload.payload.userAssets },
        allAssets: { ...payload.payload.allAssets },
      };
    }

    case types.NFT_AUCTION_START: {
      return {
        ...state,
        auctions: { ...state.auctions, loading: true },
      };
    }

    case types.NFT_AUCTION_SUCCESS: {
      return {
        ...state,
        auctions: { ...payload.payload.auctions },
      };
    }

    default: {
      return state;
    }
  }
};

export default MarketplaceReducer;
