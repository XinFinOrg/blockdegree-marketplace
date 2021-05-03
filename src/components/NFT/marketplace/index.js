import React from "react";
import { connect } from "react-redux";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import _ from "lodash";

import { EmptyCard, NFTAuctionCard, NFTSkeleton } from "../../common/NFTCard";
import MultiSelect from "../../common/MultiSelect";
import * as types from "../../../actions/types";

import {
  AddMultiplier,
  PROJECT_NAME,
  RemoveMultiplier,
} from "../../../helpers/constant";
import { SubmitContractTxGeneral } from "../../../wallets";
import { toast } from "react-toastify";

const Status = Object.freeze({
  pending: "pending",
  active: "active",
  finished: "finished",
});

const Options = [
  { label: "Upcoming", value: "pending", color: "orange" },
  { label: "Active", value: "active", color: "green" },
  { label: "My Assets", value: "my-assets", color: "navy" },
  { label: "Finished", value: "finished", color: "grey" },
  { label: "My Bids", value: "my-bids", color: "magenta" },
  { label: "My Winnings", value: "my-wins", color: "purple" },
];

class Marketplace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: [],

      modalForm: {},
      formLoading: false,

      showModal: false,
      modalContent: "",
    };

    this.setFilter = this.setFilter.bind(this);
    this.onBid = this.onBid.bind(this);
    this.reClaimAsset = this.reClaimAsset.bind(this);
    this.claimTokens = this.claimTokens.bind(this);
    this.claimAsset = this.claimAsset.bind(this);
  }

  componentDidMount() {
    // this.props.getAuction();
  }

  clearModal() {
    this.setState({ modalContent: "", modalForm: {}, showModal: false });
  }

  setForm(e, v) {
    const q = {};
    q[e] = v;
    this.setState({ modalForm: { ...this.state.modalForm, ...q } });
  }

  submitBid() {
    SubmitContractTxGeneral(
      "bid",
      { type: "auction" },
      "payable",
      `${this.state.modalForm.auctionIndex}`,
      AddMultiplier(this.state.modalForm.amount)
    )
      .then(() => {
        toast("Success");
        this.props.getAuction();
      })
      .catch(() => toast("Error", { type: "error" }));
  }

  reClaimAsset(auctionIndex) {
    SubmitContractTxGeneral(
      "reclaimAsset",
      { type: "auction" },
      "nonpayable",
      `${auctionIndex}`
    )
      .then(() => toast("Success"))
      .catch(() => toast("Error", { type: "error" }));
  }

  claimAsset(auctionIndex) {
    SubmitContractTxGeneral(
      "claimAsset",
      { type: "auction" },
      "nonpayable",
      `${auctionIndex}`
    )
      .then(() => toast("Success"))
      .catch(() => toast("Error", { type: "error" }));
  }

  claimTokens(auctionIndex) {
    SubmitContractTxGeneral(
      "claimTokens",
      { type: "auction" },
      "nonpayable",
      `${auctionIndex}`
    )
      .then(() => toast("Success"))
      .catch(() => toast("Error", { type: "error" }));
  }

  onBid(auction) {
    let submit =
      this.state.formLoading === false ? (
        <Button onClick={() => this.submitBid()}>SUBMIT BID</Button>
      ) : (
        <Button disabled onClick={() => this.submitBid()}>
          LOADING
        </Button>
      );

    const form = (
      <Container className="modal-form">
        <Row>
          <Col>
            <div className="modal-form__title">BID</div>
          </Col>
        </Row>
        <Row>
          <Col lg={4} md={4} sm={12}>
            <label className="form-control">
              Amount ( {">" + RemoveMultiplier(auction.currentBidAmount)} )
            </label>
          </Col>
          <Col lg={8} md={8} sm={12}>
            <input
              className="form-control"
              type="number"
              onChange={(e) => {
                if (!isNaN(parseFloat(e.target.value)))
                  this.setForm("amount", parseFloat(e.target.value));
              }}
              value={this.state.modalForm.amount}
            />
          </Col>
        </Row>

        <Row>
          <Col lg={12}>
            <div className="modal-form__submit">{submit}</div>
          </Col>
        </Row>
      </Container>
    );

    this.setState({
      modalContent: form,
      showModal: true,
      modalForm: {
        auctionIndex: auction.auctionIndex,
        assetId: auction.assetId,
        amount: 0,
      },
    });
  }

  setFilter(filter) {
    this.setState({ filter });
  }

  getStatus(auction) {
    const ts = Math.ceil(Date.now() / 1000);
    if (ts < parseFloat(auction.startTime)) {
      return Status.pending;
    } else if (
      ts <
      parseFloat(auction.startTime) + parseFloat(auction.duration)
    ) {
      return Status.active;
    } else {
      return Status.finished;
    }
  }

  getTags(auction) {
    const tags = [];
    const auctionStatus = this.getStatus(auction);
    tags.push(auctionStatus);
    if (auction.creator === this.props.wallet.address) tags.push("my-assets");
    if (auction.currentBidOwner === this.props.wallet.address) {
      if (auctionStatus === "active") tags.push("my-bids");
      if (auctionStatus === "finished") tags.push("my-wins");
    }
    return tags;
  }

  renderCards() {
    let data = this.props.marketplace.auctions.data;

    // return NFTSkeleton(5);

    if (this.props.marketplace.auctions.loading) return NFTSkeleton(5);

    if (!_.isEmpty(this.state.filter)) {
      data = data.filter((obj) => {
        const tags = this.getTags(obj);
        let x = tags.some(
          (status) =>
            this.state.filter.includesPartial({ value: status }) !== null
        );
        return x;
      });
    }

    if (_.isEmpty(data)) return <EmptyCard />;

    return data.map((obj) => {
      obj.status = this.getStatus(obj);
      obj.tags = this.getTags(obj);

      return (
        <Col>
          <NFTAuctionCard
            userAddress={this.props.wallet.address}
            onBid={this.onBid}
            data={obj}
            onReClaim={this.reClaimAsset}
            onClaimToken={this.claimTokens}
            onClaimAsset={this.claimAsset}
          />
        </Col>
      );
    });
  }

  render() {
    return (
      <div className="marketplace">
        <Container>
          <Row>
            <Col lg={10} className="marketplace__filter-box">
              <MultiSelect
                value={this.state.filter}
                setValue={this.setFilter}
                options={Options}
              />
            </Col>
            <Col lg={2} className="marketplace__refresh-btn">
              <Button onClick={() => this.props.getAuction()}>REFRESH</Button>
            </Col>
          </Row>

          <Row>
            <Col className="marketplace__body">
              <Container>
                <Row>{this.renderCards()}</Row>
              </Container>
            </Col>
          </Row>
        </Container>

        <Modal show={this.state.showModal} onHide={() => this.clearModal()}>
          <Modal.Header closeButton>
            <Modal.Title>{PROJECT_NAME}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.state.modalContent}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.clearModal()}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps({ marketplace, wallet }) {
  return { marketplace, wallet };
}

const mapDispatchToProps = (dispatch) => {
  return {
    getAuction: () => dispatch({ type: types.GET_AUCTION }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Marketplace);
