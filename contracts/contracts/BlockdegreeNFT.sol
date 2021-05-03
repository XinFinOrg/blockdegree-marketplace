// SPDX-License-Identifier: MIT

pragma solidity ^0.4.24;

import "./NFT.sol";
import "./Ownable.sol";

contract BlockdegreeNFT is ERC721Token, Ownable {


    // Token Metadata
  struct TokenMetadata {
    string name;
    string description;
  }

  // TokenId to TokenMetadata
  mapping(uint256 => TokenMetadata) public tokenMetadata;

  constructor (string memory name_, string memory symbol_) ERC721Token(name_, symbol_) public {
  }


  /**  
  
    User Funtionality Starts

   */
  function mint(address to, uint256 tokenId, string memory name, string memory description, string memory _tokenURI) onlyOwner public {
    _mint(to, tokenId);
    tokenMetadata[tokenId] = TokenMetadata(name, description);
    _setTokenURI(tokenId, _tokenURI);

  }

  function transfer(address to, uint256 tokenId) public {
    transferFrom(msg.sender, to, tokenId);
  }

  function setTokenURI(uint256 tokenId, string memory _tokenURI) public {
    require(ownerOf(tokenId)==msg.sender,"BlockdegreeNFT: not token owner");
    _setTokenURI(tokenId, _tokenURI);
  }

}