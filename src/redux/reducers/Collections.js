import * as types from "../../actions/types";
import { DEFAULT_COLLECTIONS } from "../../helpers/constant";

const initialState = {
  collections: [
    ...DEFAULT_COLLECTIONS.map((x) => {
      return { ...x, default: true };
    }),
  ],
};

const Collections = (state = initialState, payload) => {
  switch (payload.type) {
    case types.NFT_COLLECTION_ADDED: {
      const { name, link = "", address, symbol } = payload.payload;
      const collections = state.collections;
      collections.push({
        name,
        link,
        address,
        symbol,
        default: false,
      });

      return {
        ...state,
        collections: [...collections],
      };
    }
    default:
      return state;
  }
};

export default Collections;
