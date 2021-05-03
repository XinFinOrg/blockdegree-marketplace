import React from "react";
import { connect } from "react-redux";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";

import { PROJECT_NAME } from "../../helpers/constant";
// import { initWeb3 } from "../../wallets/metamask";
import { initXdc3 } from "../../wallets/xinpay";

// import MetamaskIcon from "../../assets/img/wallets/metamask.webp";
import XinPayIcon from "../../assets/img/wallets/xinpay.png";

import { toast } from "react-toastify";

const WalletProviders = [
  // {
  //   name: "metamask",
  //   icon: MetamaskIcon,
  //   provider: initWeb3,
  // },
  {
    name: "xinpay",
    icon: XinPayIcon,
    provider: initXdc3,
  },
];
class WalletConnect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.wallet.connected !== this.props.wallet.connected &&
      this.props.wallet.connected
    ) {
      this.setState({ showModal: false }, () => {
        toast("Wallet Connected", { autoClose: 2000 });
      });
    }
  }

  RenderWalletProvider() {
    return (
      <Container>
        <Row>
          {WalletProviders.map(({ name, icon, provider }) => (
            <Col sm={12}>
              <Container>
                <Row
                  className={this.state.loading ? "disabled" : ""}
                  onClick={async () => {
                    this.setState({ loading: true });
                    await provider();
                    console.log("returned");
                    this.setState({ loading: false });
                  }}
                >
                  <Col className="wallet-icon--wrapper" sm={2} lg={2} md={2}>
                    <div className="wallet-icon">
                      <img src={icon} alt={"logo"} />
                    </div>
                  </Col>
                  <Col className="wallet-name-wrapper" sm={10} lg={10} md={10}>
                    <div className="wallet-name">{name}</div>
                  </Col>
                </Row>
              </Container>
            </Col>
          ))}
        </Row>
      </Container>
    );
  }

  render() {
    const BTN_MSG = this.props.btnName || "CONNECT";
    const disabled = this.props.disabled || false;

    return (
      <div className="wallet-connect">
        <Button
          variant={"primary"}
          onClick={() => this.setState({ showModal: true })}
          disabled={disabled}
        >
          {BTN_MSG}
        </Button>
        <Modal
          className="wallet-connect"
          show={this.state.showModal}
          onHide={() => this.setState({ showModal: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>{PROJECT_NAME}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.RenderWalletProvider()}</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => this.setState({ showModal: false })}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps({ wallet }) {
  return { wallet };
}

export default connect(mapStateToProps)(WalletConnect);
