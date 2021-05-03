import _ from "lodash";

// import NFT from "../abi/NFT.json";
import Auction from "../abi/Auction.json";
import MinimalNFT from "../abi/MinimalRequirement.json";

export const SubPath = "/";

export const PROJECT_NAME = "NFT";

export const RemoveExpo = (x) => {
  var data = String(x).split(/[eE]/);
  if (data.length === 1) return data[0];

  var z = "",
    sign = x < 0 ? "-" : "",
    str = data[0].replace(".", ""),
    mag = Number(data[1]) + 1;

  if (mag < 0) {
    z = sign + "0.";
    while (mag++) z += "0";
    return z + str.replace(/^\-/, "");
  }
  mag -= str.length;
  while (mag--) z += "0";
  return str + z;
};

/**
 *
 * EXTRA NFT: 0xd27d597314c24588a8a8dbf26c6bfd2c73f7d742
 *
 * OLD BNFT: xdcffa7a698de2efd1c8b11c293484c51eff635ee4b
 *
 * OLD - 2 :  xdc1bed335ff67b4408646fb4c8a9040a14f4ac5046
 *
 * OLD Auction:xdc60c5d9edc2135f79c260baa1ed291f6db682ba75
 *
 *
 *
 * Current Blockdegree NFT: xdc7e5ad558ccf303599185c9a5810abf7aa2f32379
 * EXTRA NFT: xdc4baba389befbb7f740283a76cd72dc00ddedc16b
 * Auction: xdcfe87751eeaecc02146f54250a6fa428654ab54dd
 *
 * auction latest: xdc9a4167231bb8a5b7ffa3b13c5d34e3ad67e64536
 *
 *
 * LIVE auction: xdca1de6525e281a4455009699c6c3977243976f3a6
 * LIVE NFT: xdcc2f4f58261df5324e66e862b6c8a7e0c1df02552
 * LIVE NFT BCERT: final:: xdcb1b4218ad6a2df75bf07cfddf7732915911dd1b4
 *
 */

export const CONTRACT_ADDRESS = {
  auction: "xdca1de6525e281a4455009699c6c3977243976f3a6", //
  nft: "xdcb1b4218ad6a2df75bf07cfddf7732915911dd1b4", //
};

export const CONTRACT_ABI = {
  auction: Auction,
  nft: MinimalNFT,
};

/**
 * @constant VALID_CHAINS  correct chain id, in decimal
 */
// export const VALID_CHAINS = [50, 51];
export const VALID_CHAINS = [50];

export const CHAIN_DATA = {
  50: "https://explorer.xinfin.network",
  51: "https://explorer.apothem.network",
};

export const HTTP_PROVIDER = {
  50: "https://rpc.xinfin.network",
  51: "https://rpc.apothem.network",
};

export const WS_PROVIDER = {};

export const ObjToArr = (obj) => Object.keys(obj).map((key) => obj[key]);

export const FilterStructResp = (obj) =>
  Object.keys(obj)
    .filter((e, i) => {
      if (i < Object.keys(obj).length / 2) return false;
      return true;
    })
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});

export const IsHex = (n) => {
  const re = /[0-9A-Fa-f]{6}/g;

  if (re.test(n)) {
    return true;
  } else {
    return false;
  }
};

export const GetTimerData = (seconds) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor(((seconds % 86400) % 3600) / 60);
  const sec = Math.floor(((seconds % 86400) % 3600) % 60);
  return { days, hours, minutes, seconds: sec };
};

export const FormatSeconds = (seconds) => {
  const { days, hours, minutes, seconds: sec } = GetTimerData(seconds);
  return (
    <span className="timer">
      <span className="days">{days}</span>:
      <span className="hours">{hours}</span>:
      <span className="minutes">{minutes}</span>::
      <span className="seconds">{sec}</span>
    </span>
  );
};

export const AddMultiplier = (amount) => {
  const multiplier = Math.pow(10, 18);

  return RemoveExpo(parseFloat(amount) * multiplier);
};

export const RemoveMultiplier = (amount) => {
  const multiplier = Math.pow(10, 18);

  return parseFloat(amount) / multiplier;
};

export const TIMER_FORMAT = "DD:HH:MM::SS";

export const IsJson = (abi) => {
  try {
    JSON.parse(abi);
  } catch (e) {
    return false;
  }
  return true;
};

export const Random = (min, max) => {
  return min + Math.random() * (max - min);
};

export const RandomInt = (min, max) => {
  return Math.round(min + Math.random() * (max - min));
};

export const EXPLORER = "https://explorer.xinfin.network/";

export const INTERFACE_ID = {
  ERC721: "0x80ac58cd",
  ERC721Metadata: "0x5b5e139f",
  ERC721Enumerable: "0x780e9d63",
  ERC165: "0x01ffc9a7",
};

export const DEFAULT_COLLECTIONS = [
  {
    name: "Blockdegree NFT",
    link: "https://www.blockdegree.org/",
    symbol: "BLOCK-NFT",
    address: "xdcb1b4218ad6a2df75bf07cfddf7732915911dd1b4",
    icon: require("../assets/img/NFT/blockdegree.png").default,
  },
  // {
  //   name: "Rudresh NFT",
  //   link: "https://www.blockdegree.org/",
  //   symbol: "R-NFT",
  //   address: "xdcd27d597314c24588a8a8dbf26c6bfd2c73f7d742",
  //   icon: require("../assets/img/NFT/blockdegree.png").default,
  // },
];

export const DateStringFormat = (date) => {
  date = new Date(date);
  if (_.isDate(date))
    return `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  return date;
};

Object.defineProperty(Object.prototype, "partialMatch", {
  value: function (fields) {
    for (let key of Object.keys(fields)) {
      if (Object.keys(this).includes(key)) {
        if (this[key] === fields[key]) continue;
        return false;
      } else {
        return false;
      }
    }
    return true;
  },
});

Object.defineProperty(Array.prototype, "includesPartial", {
  value: function (fields) {
    for (let i = 0; i < this.length; i++) {
      const obj = this[i];
      console.log("objobj", obj);
      if (obj.partialMatch(fields)) {
        return i;
      }
    }
    return null;
  },
});
