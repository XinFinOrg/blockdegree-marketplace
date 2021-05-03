// File: contracts/Auction/SafeMath.sol

pragma solidity ^0.4.24;


/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
  function mul(uint256 _a, uint256 _b) internal pure returns (uint256 c) {
    // Gas optimization: this is cheaper than asserting 'a' not being zero, but the
    // benefit is lost if 'b' is also tested.
    // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
    if (_a == 0) {
      return 0;
    }

    c = _a * _b;
    assert(c / _a == _b);
    return c;
  }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
  function div(uint256 _a, uint256 _b) internal pure returns (uint256) {
    // assert(_b > 0); // Solidity automatically throws when dividing by 0
    // uint256 c = _a / _b;
    // assert(_a == _b * c + _a % _b); // There is no case in which this doesn't hold
    return _a / _b;
  }

  /**
  * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 _a, uint256 _b) internal pure returns (uint256) {
    assert(_b <= _a);
    return _a - _b;
  }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
  function add(uint256 _a, uint256 _b) internal pure returns (uint256 c) {
    c = _a + _b;
    assert(c >= _a);
    return c;
  }
}

// File: contracts/Auction/AddressUtils.sol

pragma solidity ^0.4.24;


/**
 * Utility library of inline functions on addresses
 */
library AddressUtils {

  /**
   * Returns whether the target address is a contract
   * @dev This function will return false if invoked during the constructor of a contract,
   * as the code is not actually created until after the constructor finishes.
   * @param _addr address to check
   * @return whether the target address is a contract
   */
  function isContract(address _addr) internal view returns (bool) {
    uint256 size;
    // XXX Currently there is no better way to check if there is a contract in an address
    // than to check the size of the code at that address.
    // See https://ethereum.stackexchange.com/a/14016/36603
    // for more details about how this works.
    // TODO Check this again before the Serenity release, because all addresses will be
    // contracts then.
    // solium-disable-next-line security/no-inline-assembly
    assembly { size := extcodesize(_addr) }
    return size > 0;
  }

}

// File: contracts/Auction/IERC721.sol

// SPDX-License-Identifier: MIT

pragma solidity ^0.4.24;

/**
 * @dev Required interface of an ERC721 compliant contract.
 */
interface IERC721  {
    /**
     * @dev Emitted when `tokenId` token is transferred from `from` to `to`.
     */
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    /**
     * @dev Emitted when `owner` enables `approved` to manage the `tokenId` token.
     */
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);

    /**
     * @dev Emitted when `owner` enables or disables (`approved`) `operator` to manage all of its assets.
     */
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    /**
     * @dev Returns the number of tokens in ``owner``'s account.
     */
    function balanceOf(address owner) external view returns (uint256 balance);

    /**
     * @dev Returns the owner of the `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function ownerOf(uint256 tokenId) external view returns (address owner);

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients
     * are aware of the ERC721 protocol to prevent tokens from being forever locked.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must exist and be owned by `from`.
     * - If the caller is not `from`, it must be have been allowed to move this token by either {approve} or {setApprovalForAll}.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function safeTransferFrom(address from, address to, uint256 tokenId) external;

    /**
     * @dev Transfers `tokenId` token from `from` to `to`.
     *
     * WARNING: Usage of this method is discouraged, use {safeTransferFrom} whenever possible.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must be owned by `from`.
     * - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 tokenId) external;

    /**
     * @dev Gives permission to `to` to transfer `tokenId` token to another account.
     * The approval is cleared when the token is transferred.
     *
     * Only a single account can be approved at a time, so approving the zero address clears previous approvals.
     *
     * Requirements:
     *
     * - The caller must own the token or be an approved operator.
     * - `tokenId` must exist.
     *
     * Emits an {Approval} event.
     */
    function approve(address to, uint256 tokenId) external;

    /**
     * @dev Returns the account approved for `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function getApproved(uint256 tokenId) external view returns (address operator);

    /**
     * @dev Approve or remove `operator` as an operator for the caller.
     * Operators can call {transferFrom} or {safeTransferFrom} for any token owned by the caller.
     *
     * Requirements:
     *
     * - The `operator` cannot be the caller.
     *
     * Emits an {ApprovalForAll} event.
     */
    function setApprovalForAll(address operator, bool _approved) external;

    /**
     * @dev Returns if the `operator` is allowed to manage all of the assets of `owner`.
     *
     * See {setApprovalForAll}
     */
    function isApprovedForAll(address owner, address operator) external view returns (bool);

    /**
      * @dev Safely transfers `tokenId` token from `from` to `to`.
      *
      * Requirements:
      *
      * - `from` cannot be the zero address.
      * - `to` cannot be the zero address.
      * - `tokenId` token must exist and be owned by `from`.
      * - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
      * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
      *
      * Emits a {Transfer} event.
      */
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes data) external;


    function transfer(address to, uint256 tokenId) external;

}

// File: contracts/Auction/Auction.sol

pragma solidity ^0.4.24;





contract AuctionEngine {
    using SafeMath for uint256;
    using AddressUtils for address;

    event AuctionCreated(uint256 _auctionIndex, address _creator, address _asset, uint256 _assetId);
    event AuctionBid(uint256 _auctionIndex, address _bidder, uint256 amount, address _asset);
    event ClaimAsset(uint256 _auctionIndex, address _claimer, address _asset);
    event ClaimWinningBid(uint256 _auctionIndex, address _claimer,address _asset );
    event AssetReclaimed(uint256 _auctionIndex, address _claimer,address _asset);

    enum Status{ pending, active, finished }
    struct Auction {
        address assetAddress;
        uint256 assetId;

        address creator;

        uint256 startTime;
        uint256 duration;
        uint256 currentBidAmount;
        address currentBidOwner;
        uint256 bidCount;
        
        bool assetClaimed;
        bool winningBidClaimed;
        bool assetReclaimed;
    }
    Auction[] public auctions;

    function createAuction(IERC721 _assetAddress,
                           uint256 _assetId,
                           
                           uint256 _startPrice,
                           uint256 _startTime,
                           uint256 _duration) public returns (uint256) {

        require(_assetAddress.ownerOf(_assetId) == msg.sender,"Auction: not asset owner");
        require(_assetAddress.getApproved(_assetId) == address(this),"Auction: asset not approved");

        _assetAddress.transferFrom(msg.sender, address(this), _assetId);

        if (_startTime == 0) { _startTime = block.timestamp; }

        Auction memory auction = Auction({
            creator: msg.sender,
            assetAddress: address(_assetAddress),
            assetId: _assetId,
            startTime: _startTime,
            duration: _duration,
            currentBidAmount: _startPrice,
            currentBidOwner: address(0),
            bidCount: 0,
            assetClaimed:false,
            winningBidClaimed:false,
            assetReclaimed:false
        });
        auctions.push(auction);
        
        uint256 index = auctions.length-1;

        emit AuctionCreated(index, msg.sender, address(_assetAddress), _assetId);

        return index;
    }

    function bid(uint256 auctionIndex) public payable returns (bool) {
        Auction storage auction = auctions[auctionIndex];
        uint256 amount = msg.value;

        
        require(auction.creator != address(0),"Auction: auction not present");
        require(isActive(auctionIndex),"Auction: auction not active");
        require(amount > auction.currentBidAmount,"Auction: invalid bid amount");
        require(msg.sender!=auction.creator,"Auction: asset owner cannot bid");
        require(msg.sender!=auction.currentBidOwner,"Auction: cannot outbid yourself");


        if (auction.currentBidAmount != 0 && auction.currentBidOwner!= address(0)) {
            // return funds to the previuos bidder
            address to = auction.currentBidOwner;
            to.transfer(                    
                auction.currentBidAmount
            );
        }
        // register new bidder
        auction.currentBidAmount = amount;
        auction.currentBidOwner = msg.sender;
        auction.bidCount = auction.bidCount.add(1);

        emit AuctionBid(auctionIndex, msg.sender, amount, auction.assetAddress);
        return true;
    }

    function getTotalAuctions() public view returns (uint256) { return auctions.length; }

    function isActive(uint256 index) public view returns (bool) { return getStatus(index) == Status.active; }

    function isFinished(uint256 index) public view returns (bool) { return getStatus(index) == Status.finished; }

    function getStatus(uint256 index) public view returns (Status) {
        Auction storage auction = auctions[index];
        if (block.timestamp < auction.startTime) {
            return Status.pending;
        } else if (block.timestamp < auction.startTime.add(auction.duration)) {
            return Status.active;
        } else {
            return Status.finished;
        }
    }

    function getCurrentBidOwner(uint256 auctionIndex) public view returns (address) { return auctions[auctionIndex].currentBidOwner; }

    function getCurrentBidAmount(uint256 auctionIndex) public view returns (uint256) { return auctions[auctionIndex].currentBidAmount; }

    function getBidCount(uint256 auctionIndex) public view returns (uint256) { return auctions[auctionIndex].bidCount; }

    function getWinner(uint256 auctionIndex) public view returns (address) {
        require(isFinished(auctionIndex));
        return auctions[auctionIndex].currentBidOwner;
    }

    function claimTokens(uint256 auctionIndex) public {
        require(isFinished(auctionIndex),"Auction: auction not yet completed");
        Auction storage auction = auctions[auctionIndex];

        require(auction.creator == msg.sender,"Auction: require asset owner");
        require(auction.winningBidClaimed == false,"Auction: require asset owner");
        
        msg.sender.transfer(auction.currentBidAmount);
        auction.winningBidClaimed=true;

        emit ClaimWinningBid(auctionIndex, auction.creator,auction.assetAddress);
    }
    
    function reclaimAsset(uint256 auctionIndex) public {
        require(isFinished(auctionIndex),"Auction: auction not yet completed");
        Auction memory auction = auctions[auctionIndex];
        
        require(auction.creator == msg.sender,"Auction: require asset owner");
        require(auction.bidCount == 0,"Auction: auction has bids, cannot reclaim");
        require(auction.currentBidOwner == address(0),"Auction: current bid ownernt not 0x");
        require(auction.assetReclaimed==false,"Auction: asset already reclaimed");
        
        IERC721 token = IERC721(auction.assetAddress);
        token.transferFrom(address(this),msg.sender, auction.assetId);
        auction.assetReclaimed=true;
        
        emit AssetReclaimed(auctionIndex, msg.sender,auction.assetAddress);
    }

    function claimAsset(uint256 auctionIndex) public {
        require(isFinished(auctionIndex),"Auction: auction not yet completed");
        Auction storage auction = auctions[auctionIndex];

        address winner = getWinner(auctionIndex);
        require(winner == msg.sender,"Auction: sender not winner");
        require(auction.assetClaimed==false,"Auction: asset already claimed");

        IERC721 asset = IERC721(auction.assetAddress);
        asset.transferFrom(address(this),winner, auction.assetId);
        auction.assetClaimed=true;

        emit ClaimAsset(auctionIndex, winner,auction.assetAddress);
    }
}
