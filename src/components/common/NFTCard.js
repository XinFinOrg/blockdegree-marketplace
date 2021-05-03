import React from "react";
import PropType from "prop-types";
import _ from "lodash";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";

import { EXPLORER, RemoveMultiplier } from "../../helpers/constant";
import Timer from "./Timer";
import { toXdcAddress } from "../../wallets/xinpay";

const Status = Object.freeze({
  pending: "pending",
  active: "active",
  finished: "finished",
});

function getTimer(auction) {
  const status = auction.status;
  if (status === Status.active) {
    return (
      <Timer
        startDate={Date.now()}
        endDate={
          (parseFloat(auction.startTime) + parseFloat(auction.duration)) * 1000
        }
      />
    );
  }
  return "";
}

function RenderStatus(status) {
  let icon = <FontAwesomeIcon icon={faCircle} />;
  switch (status) {
    case Status.active: {
      icon = <FontAwesomeIcon className="green" icon={faCircle} />;
      break;
    }
    case Status.finished: {
      icon = <FontAwesomeIcon className="red" icon={faCircle} />;
      break;
    }
    case Status.pending: {
      icon = <FontAwesomeIcon className="lightgrey" icon={faCircle} />;
      break;
    }
    default:
      icon = <FontAwesomeIcon className="green" icon={faCircle} />;
      break;
  }

  return (
    <div>
      <span>{status}</span>
      <span>{icon}</span>
    </div>
  );
}

function nftCard(props) {
  const { owner, name, description, tokenURI, assetAddress } = props.data;

  const src = require(`../../assets/img/cards/${
    ((description + name + tokenURI + assetAddress).length % 4) + 1
  }.jpg`).default;

  const assetLink = `${EXPLORER}addr/${toXdcAddress(assetAddress)}`;
  const ownerLink = `${EXPLORER}addr/${toXdcAddress(owner)}`;
  const tokenElement = _.isEmpty(tokenURI) ? (
    ""
  ) : (
    <a target="_blank" rel="noreferrer" href={tokenURI}>
      Token URI
    </a>
  );

  const btn = props.data.isApproved ? (
    <Button onClick={() => props.onSell(props.data)} variant={"info"}>
      Sell
    </Button>
  ) : (
    <Button onClick={() => props.onApprove(props.data)} variant={"warning"}>
      Approve
    </Button>
  );

  return (
    <Card className="text-center nft-card">
      <Card.Img className="nft-card__img" variant="top" src={src} />
      <Card.Body>
        <Card.Text>
          <Container>
            <Row>
              <Col className="nft-card__key" lg={4}>
                Name
              </Col>
              <Col className="nft-card__field">{name}</Col>
            </Row>

            <Row>
              <Col className="nft-card__key" lg={4}>
                Description
              </Col>
              <Col className="nft-card__field">{description}</Col>
            </Row>

            <Row>
              <Col className="nft-card__key" lg={4}>
                Token URI
              </Col>
              <Col className="nft-card__field">{tokenElement}</Col>
            </Row>
          </Container>
        </Card.Text>
      </Card.Body>
      <Card.Footer className="text-muted">
        <Container>
          <Row>
            <Col>
              <a target="_blank" rel="noreferrer" href={assetLink}>
                Asset
              </a>
            </Col>
            <Col>
              <a target="_blank" rel="noreferrer" href={ownerLink}>
                Owner
              </a>
            </Col>
            <Col>{btn}</Col>
          </Row>
        </Container>
      </Card.Footer>
    </Card>
  );
}

nftCard.propTypes = {
  owner: PropType.string,
  description: PropType.string,
  tokenURI: PropType.string,
  name: PropType.string,
  asset: PropType.string,
};

function nftAuctionCard(props) {
  const {
    owner = "",
    name = "",
    description = "",
    tokenURI = "",
    assetAddress = "",
    currentBidAmount,
    bidCount,
    currentBidOwner,
    creator,
    auctionIndex,
  } = props.data;

  const src = require(`../../assets/img/cards/${
    ((description + name + tokenURI + assetAddress).length % 4) + 1
  }.jpg`).default;

  const userAddress = props.userAddress;

  const assetLink = `${EXPLORER}addr/${toXdcAddress(assetAddress)}`;
  const ownerLink = `${EXPLORER}addr/${toXdcAddress(owner)}`;
  const tokenElement = _.isEmpty(tokenURI) ? (
    ""
  ) : (
    <a target="_blank" rel="noreferrer" href={tokenURI}>
      Token URI
    </a>
  );

  let postAuctionButton;

  if (props.data.status === "finished") {
    if (bidCount == 0) {
      if (creator === userAddress) {
        // show re-claim asset
        postAuctionButton = (
          <Button variant="info" onClick={() => props.onReClaim(auctionIndex)}>
            RECLAIM
          </Button>
        );
      } else {
        // show unsold
        postAuctionButton = (
          <Button variant="danger" disabled>
            UN-SOLD
          </Button>
        );
      }
    } else {
      if (creator === userAddress) {
        // show claim token
        postAuctionButton = (
          <Button
            variant="success"
            disabled={props.data.winningBidClaimed}
            onClick={() => props.onClaimToken(auctionIndex)}
          >
            CLAIM TOKEN
          </Button>
        );
      } else if (currentBidOwner === userAddress) {
        // show claim asset
        postAuctionButton = (
          <Button
            variant="success"
            disabled={props.data.assetClaimed}
            onClick={() => props.onClaimAsset(auctionIndex)}
          >
            CLAIM ASSET
          </Button>
        );
      } else {
        //show sold
        postAuctionButton = (
          <Button variant="danger" disabled>
            SOLD
          </Button>
        );
      }
    }
  } else {
    postAuctionButton = (
      <Button onClick={() => props.onBid(props.data)} variant="warning">
        BID
      </Button>
    );
  }

  return (
    <Card className="text-center nft-auction-card">
      <Card.Header className="text-muted">
        <Container>
          <Row>
            <Col className="nft-auction-card__title" lg={7}>
              {RenderStatus(props.data.status)}
            </Col>
            <Col className="nft-auction-card__timer" lg={5}>
              {getTimer(props.data)}
            </Col>
          </Row>
        </Container>
      </Card.Header>
      <Card.Img className="nft-auction-card__img" variant="top" src={src} />
      <Card.Body>
        <Card.Text>
          <Container>
            <Row>
              <Col className="nft-auction-card__key" lg={5}>
                Name
              </Col>
              <Col className="nft-auction-card__field" lg={7}>
                {name}
              </Col>
            </Row>

            <Row>
              <Col className="nft-auction-card__key" lg={5}>
                Description
              </Col>
              <Col className="nft-auction-card__field" lg={7}>
                {description}
              </Col>
            </Row>

            <Row>
              <Col className="nft-auction-card__key" lg={5}>
                Token URI
              </Col>
              <Col className="nft-auction-card__field" lg={7}>
                {tokenElement}
              </Col>
            </Row>

            <Row>
              <Col className="nft-auction-card__key" lg={5}>
                Current Bid
              </Col>
              <Col className="nft-auction-card__field" lg={7}>
                {RemoveMultiplier(currentBidAmount)}
              </Col>
            </Row>

            <Row>
              <Col className="nft-auction-card__key" lg={5}>
                Total Bids
              </Col>
              <Col className="nft-auction-card__field" lg={7}>
                {bidCount}
              </Col>
            </Row>
          </Container>
        </Card.Text>
      </Card.Body>
      <Card.Footer className="text-muted">
        <Container>
          <Row>
            <Col>
              <a target="_blank" rel="noreferrer" href={assetLink}>
                Asset
              </a>
            </Col>
            <Col>
              <a target="_blank" rel="noreferrer" href={ownerLink}>
                Owner
              </a>
            </Col>
            <Col>{postAuctionButton}</Col>
          </Row>
        </Container>
      </Card.Footer>
    </Card>
  );
}

nftAuctionCard.propTypes = {
  owner: PropType.string,
  description: PropType.string,
  tokenURI: PropType.string,
  name: PropType.string,
  asset: PropType.string,
};

const nftSkeleton = (count = 2) => {
  const singleSkeleton = (
    <Col>
      <div className="nft-skeleton">
        <Skeleton className="nft-skeleton__title" height={170} />
        <br />
        <Skeleton height={20} count={4} />
      </div>
    </Col>
  );

  const multiSkeleton = [];

  for (let i = 0; i < count; i++) {
    multiSkeleton.push(singleSkeleton);
  }

  // return <div className="nft-skeleton-wrapper">{multiSkeleton}</div>;
  return (
    <Container>
      <Row>{multiSkeleton}</Row>
    </Container>
  );
};

const emptyCards = () => {
  return (
    <div className="nft-empty-cards">
      <div className="emptyCard">
        <div className="text">NO NFT HERE YET</div>
      </div>
    </div>
  );
};

export const NFTCard = nftCard;
export const NFTAuctionCard = nftAuctionCard;
export const NFTSkeleton = nftSkeleton;
export const EmptyCard = emptyCards;
