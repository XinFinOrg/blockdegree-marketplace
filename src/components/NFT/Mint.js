import React from "react";
import { connect } from "react-redux";
import { Card, Button, Container, Row, Col } from "react-bootstrap";

import * as types from "../../actions/types";
import { SubmitContractTxGeneral } from "../../wallets";
import { toast } from "react-toastify";

class Mint extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formLoading: false,
      form: {
        owner: props.wallet.address,
        tokenId: "",
        name: "",
        description: "",
        tokenURI: "",
      },
    };
  }

  componentDidMount() {
    this.props.getAssets();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.wallet.address !== this.props.wallet.address) {
      this.setState({
        form: { ...this.state.form, owner: this.props.wallet.address },
      });
    }
  }

  submitMint() {
    this.setState({ formLoading: true });
    SubmitContractTxGeneral(
      "mint",
      "nft",
      "nonpayble",
      ...Object.keys(this.state.form).map((k) => this.state.form[k])
    )
      .then((e) => {
        this.props.getAssets();
        toast("Success");
      })
      .catch(() => toast("Error", { type: "error" }));
  }

  setForm(e, v) {
    const q = {};
    q[e] = v;
    this.setState({ form: { ...this.state.form, ...q } });
  }

  render() {
    let submit =
      this.state.formLoading === false ? (
        <Button onClick={() => this.submitMint()}>MINT</Button>
      ) : (
        <Button disabled onClick={() => this.submitMint()}>
          LOADING
        </Button>
      );

    return (
      <div className="mint-nft component-panel">
        <Container>
          <Row>
            <Col lg={6} className="mint">
              <Container className="mint-form">
                <Row>
                  <Col>
                    <div className="mint-form__title">MINT NEW NFT</div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={4} md={4} sm={12}>
                    <label className="form-control">Owner Address</label>
                  </Col>
                  <Col lg={8} md={8} sm={12}>
                    <input
                      className="form-control"
                      type="text"
                      onChange={(e) => this.setForm("owner", e.target.value)}
                      value={this.state.form.owner}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col lg={4} md={4} sm={12}>
                    <label className="form-control">Custom NFT Asset ID</label>
                  </Col>
                  <Col lg={8} md={8} sm={12}>
                    <input
                      className="form-control"
                      type="text"
                      onChange={(e) => this.setForm("tokenId", e.target.value)}
                      value={this.state.form.tokenId}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col lg={4} md={4} sm={12}>
                    <label className="form-control">NFT Asset Name</label>
                  </Col>
                  <Col lg={8} md={8} sm={12}>
                    <input
                      className="form-control"
                      type="text"
                      onChange={(e) => this.setForm("name", e.target.value)}
                      value={this.state.form.name}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col lg={4} md={4} sm={12}>
                    <label className="form-control">
                      NFT Asset Description
                    </label>
                  </Col>
                  <Col lg={8} md={8} sm={12}>
                    <input
                      className="form-control"
                      type="text"
                      onChange={(e) =>
                        this.setForm("description", e.target.value)
                      }
                      value={this.state.form.description}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col lg={4} md={4} sm={12}>
                    <label className="form-control">NFT Token URI</label>
                  </Col>
                  <Col lg={8} md={8} sm={12}>
                    <input
                      className="form-control"
                      type="text"
                      onChange={(e) => this.setForm("tokenURI", e.target.value)}
                      value={this.state.form.tokenURI}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col lg={12}>
                    <div className="mint-form__submit">{submit}</div>
                  </Col>
                </Row>
              </Container>
            </Col>
            <Col lg={6} className="details">
              <Card className="text-center nft-card">
                <Card.Body>
                  <Card.Text>Enter Details Here</Card.Text>
                </Card.Body>
                <Card.Footer className="text-muted"></Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

function mapStateToProps({ wallet }) {
  return { wallet };
}

const mapDispatchToProps = (dispatch) => {
  return {
    getAssets: () => dispatch({ type: types.GET_ASSETS }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Mint);
