import React from "react";
import { connect } from "react-redux";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import _ from "lodash";

import { SubmitContractTxGeneral } from "../../wallets";
import { EmptyCard, NFTCard, NFTSkeleton } from "../common/NFTCard";
import {
  AddMultiplier,
  CONTRACT_ADDRESS,
  PROJECT_NAME,
} from "../../helpers/constant";
import * as types from "../../actions/types";
import { toast } from "react-toastify";
import Collections from "./Collections";
import AddCollection from "./AddCollection";

const initiaForm = {
  startDate: new Date(),
  endDate: new Date(),
};

class MyAssets extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalForm: { ...initiaForm },
      formLoading: false,

      showModal: false,
      modalContent: "",
    };

    this.onSell = this.onSell.bind(this);
    this.setForm = this.setForm.bind(this);
    this.onApprove = this.onApprove.bind(this); //submitSell
    this.submitSell = this.submitSell.bind(this);
  }

  clearModal() {
    this.setState({
      modalContent: "",
      modalForm: { ...initiaForm },
      showModal: false,
    });
  }

  setForm(e, v) {
    const q = {};
    q[e] = v;
    this.setState({ modalForm: { ...this.state.modalForm, ...q } });
  }

  onApprove(asset) {
    SubmitContractTxGeneral(
      "approve",
      { type: "nft", address: asset.assetAddress },
      "nonpayable",
      CONTRACT_ADDRESS.auction,
      asset.assetId
    )
      .then(() => {
        this.props.getAssets();
        toast("Success");
      })
      .catch((e) => {
        console.log("error", e);
        toast("Error", { type: "error" });
      });
  }

  submitSell() {
    const startSec = this.state.modalForm.startDate.getTime() / 1000;
    const endSec = this.state.modalForm.endDate.getTime() / 1000;

    SubmitContractTxGeneral(
      "createAuction",
      { type: "auction" },
      "nonpayable",
      this.state.modalForm.assetAddress,
      this.state.modalForm.assetId,
      AddMultiplier(this.state.modalForm.seedPrice),
      startSec,
      endSec - startSec
    )
      .then(() => {
        this.props.getAssets();
        toast("Success");
      })
      .catch(() => toast("Error"));
  }

  onSell(asset) {
    console.log("asset", asset);
    this.setState({
      showModal: true,
      modalForm: {
        assetId: asset.assetId,
        assetAddress: asset.assetAddress,
      },
    });
  }

  renderUserAssets() {
    if (this.props.marketplace.userAssets.loading === true)
      return NFTSkeleton(5);

    if (_.isEmpty(this.props.marketplace.userAssets.data)) return <EmptyCard />;

    return this.props.marketplace.userAssets.data.map(
      ({ owner, name, description, tokenURI, ...rst }) => (
        <Col>
          <NFTCard
            onApprove={this.onApprove}
            onSell={this.onSell}
            data={{
              owner,
              name,
              description,
              tokenURI,
              ...rst,
            }}
          />
        </Col>
      )
    );
  }

  render() {
    let submit =
      this.state.formLoading === false ? (
        <Button onClick={() => this.submitSell()}>SUBMIT</Button>
      ) : (
        <Button disabled onClick={() => this.submitSell()}>
          LOADING
        </Button>
      );

    return (
      <>
        <Container>
          <Row>
            <Col>
              <Button
                style={{ float: "right" }}
                onClick={() => this.props.getAssets()}
              >
                REFRESH
              </Button>
            </Col>
          </Row>
        </Container>

        <div className="component-panel my-assets">
          <div className="my-assets__collections">
            <Container>
              <Row>
                <Collections />
              </Row>

              <Row>
                <AddCollection />
              </Row>
            </Container>
          </div>
          <div className="my-assets__assets">
            <Container>
              <Row>{this.renderUserAssets()}</Row>
            </Container>
          </div>

          <Modal show={this.state.showModal} onHide={() => this.clearModal()}>
            <Modal.Header closeButton>
              <Modal.Title>{PROJECT_NAME}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container className="modal-form">
                <Row>
                  <Col>
                    <div className="modal-form__title">SUBMIT FOR AUCTION</div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={4} md={4} sm={12}>
                    <label className="form-control">Seed Price</label>
                  </Col>
                  <Col lg={8} md={8} sm={12}>
                    <input
                      className="form-control"
                      type="number"
                      onChange={(e) => {
                        if (!isNaN(parseFloat(e.target.value)))
                          this.setForm("seedPrice", parseFloat(e.target.value));
                      }}
                      value={this.state.modalForm.seedPrice}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col lg={4} md={4} sm={12}>
                    <label className="form-control">Start Date</label>
                  </Col>
                  <Col lg={8} md={8} sm={12}>
                    <DatePicker
                      selected={this.state.modalForm.startDate}
                      onChange={(date) => this.setForm("startDate", date)}
                      showTimeSelect
                      timeFormat="p"
                      timeIntervals={15}
                      dateFormat="Pp"
                    />
                  </Col>
                </Row>

                <Row>
                  <Col lg={4} md={4} sm={12}>
                    <label className="form-control">End Date</label>
                  </Col>
                  <Col lg={8} md={8} sm={12}>
                    <DatePicker
                      selected={this.state.modalForm.endDate}
                      onChange={(date) => this.setForm("endDate", date)}
                      showTimeSelect
                      timeFormat="p"
                      timeIntervals={15}
                      dateFormat="Pp"
                    />
                  </Col>
                </Row>

                <Row>
                  <Col lg={12}>
                    <div className="modal-form__submit">{submit}</div>
                  </Col>
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => this.clearModal()}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </>
    );
  }
}

function mapStateToProps({ marketplace }) {
  return { marketplace };
}

const mapDispatchToProps = (dispatch) => {
  return {
    getAssets: () => dispatch({ type: types.GET_ASSETS }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(MyAssets);
