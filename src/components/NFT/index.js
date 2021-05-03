import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Container, Row, Col } from "react-bootstrap";

import RequireWallet from "../HOC/RequireWallet";
import PageNavigation from "../common/Navigation";
import Home from "./Home";
import MyAssets from "./MyAssets";
import Marketplace from "./marketplace";
import Mint from "./Mint";

// import { PROJECT_NAME } from "../../helpers/constant";

// const ComposedHome = compose(RequireWallet)(Home);
const ComposedMyAssets = compose(RequireWallet())(MyAssets);
const ComposedMarketplace = compose(RequireWallet())(Marketplace);
const ComposedMint = compose(RequireWallet())(Mint);

const LINKS = [
  {
    name: "HOME",
    link: "home",
  },
  {
    name: "MARKETPLACE",
    link: "marketplace",
  },
  {
    name: "MY ASSETS",
    link: "myAssets",
  },
];

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      modalContent: "",

      openTab: "home",
    };

    this.setModalContent = this.setModalContent.bind(this);
    this.setShowModal = this.setShowModal.bind(this);
  }

  setShowModal() {
    this.setState({ showModal: true });
  }

  setModalContent(modalContent) {
    this.setState({ modalContent, showModal: true });
  }

  renderDasboard() {
    switch (this.state.openTab) {
      case "home":
        return <Home />;
      case "marketplace":
        return <ComposedMarketplace />;
      case "myAssets":
        return <ComposedMyAssets />;
      case "mint":
        return <ComposedMint />;
      default:
        return <Home />;
    }
  }

  render() {
    return (
      <div className="main-panel nft-dapp-index">
        <Container>
          <Row>
            <Col>
              <PageNavigation
                setactivePath={(x) => this.setState({ openTab: x })}
                activePath={this.state.openTab}
                links={LINKS}
              />
            </Col>
          </Row>

          <Row>
            <Col>{this.renderDasboard()}</Col>
          </Row>
        </Container>
      </div>
    );
  }
}

function mapStateToProps({ wallet, balance }) {
  return { wallet, balance };
}

export default connect(mapStateToProps)(Dashboard);
