const MyNFT = artifacts.require("MyNFT");

module.exports = function (deployer) {
  deployer.deploy(MyNFT, "Blockedgree Certificate NFT", "BCERT");
};
