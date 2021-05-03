pragma solidity ^0.4.24;

import "./SafeMath.sol";
import "./AddressUtils.sol";
import "./IERC721.sol";


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