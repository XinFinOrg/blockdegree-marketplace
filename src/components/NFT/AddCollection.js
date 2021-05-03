import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { connect } from "react-redux";
import _ from "lodash";
import { toast } from "react-toastify";

import { IsValidNFT } from "../../wallets/index";
import * as actions from "../../actions/index";
import * as types from "../../actions/types";

const initialState = {
  form: {
    name: "",
    symbol: "",
    address: "",
  },
  loading: false,
};

class AddCollection extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...initialState };

    this.onSubmit = this.onSubmit.bind(this);
  }

  isValid() {
    return (
      !_.isEmpty(this.state.form.name) &&
      !_.isEmpty(this.state.form.symbol) &&
      !_.isEmpty(this.state.form.address)
    );
  }

  async onSubmit() {
    try {
      const { name, symbol, address } = this.state.form;
      const isValid = await IsValidNFT(address);
      if (!isValid) {
        toast(
          <div>
            Address does not implement the required interface. &nbsp;
            <a
              href="https://eips.ethereum.org/EIPS/eip-165"
              rel="noreferrer"
              target="_blank"
            >
              Refer
            </a>
          </div>,
          { type: "error", autoClose: 5000 }
        );
        return;
      }
      this.props.addCollection({ name, symbol, address });
      toast("Success");
      this.setState({ ...initialState });
    } catch (e) {
      console.log("e", e);
      toast("Error", { type: "error" });
    }
  }

  render() {
    const disabled = this.isValid();

    return (
      <Container className="add-collection">
        <Row>
          <Col className="add-collection__title">Add NFT</Col>
        </Row>

        <Row>
          <Col className="add-collection__body">
            <Container>
              <Row>
                <Col className="field-name">Name</Col>
                <Col className="field-input">
                  <input
                    onChange={(e) =>
                      this.setState({
                        form: { ...this.state.form, name: e.target.value },
                      })
                    }
                    type="text"
                    placeholder="NFT Name"
                    value={this.state.form.name}
                  />
                </Col>
              </Row>

              <Row>
                <Col className="field-name">Symbol</Col>
                <Col className="field-input">
                  <input
                    onChange={(e) =>
                      this.setState({
                        form: { ...this.state.form, symbol: e.target.value },
                      })
                    }
                    type="text"
                    placeholder="NFT Symbol"
                    value={this.state.form.symbol}
                  />
                </Col>
              </Row>

              <Row>
                <Col className="field-name">Address</Col>
                <Col className="field-input">
                  <input
                    onChange={(e) =>
                      this.setState({
                        form: { ...this.state.form, address: e.target.value },
                      })
                    }
                    type="text"
                    placeholder="NFT Address"
                    value={this.state.form.address}
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  <Button
                    className="u-float-r"
                    disabled={!disabled}
                    onClick={this.onSubmit}
                  >
                    Submit
                  </Button>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    );
  }
}

function mapStateToProps({ collections }) {
  return { collections };
}

function mapDispatchToProps(dispatch) {
  return {
    addCollection: (data) => dispatch(actions.AddCollection(data)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCollection);
