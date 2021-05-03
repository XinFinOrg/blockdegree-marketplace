import React from "react";
import { connect } from "react-redux";
import _ from "lodash";
// import { compose } from "react";
import { Row, Container, Col, Button } from "react-bootstrap";

import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  EXPLORER,
  DateStringFormat,
} from "../../helpers/constant";
import PageNavigation from "../common/Navigation";
import Collections from "./Collections";
import {
  GetPastEvents,
  GetFromAddress,
  IsAddressEqual,
} from "../../wallets/index";
import { toXdcAddress } from "../../wallets/xinpay";

const LINKS = [
  {
    name: "Wallet",
    link: "wallet",
  },
  {
    name: "My Transactions",
    link: "history",
  },
];

class Wallet extends React.Component {
  renderBalances() {
    if (!this.props.balance)
      return (
        <tr>
          <td colSpan={6} style={{ textAlign: "center" }}>
            Loading
          </td>
        </tr>
      );

    const { native = null, tokens = null } = this.props.balance;

    if (!native || !tokens)
      return (
        <tr>
          <td colSpan={6} style={{ textAlign: "center" }}>
            Loading
          </td>
        </tr>
      );

    let ret = tokens.map((x, i) => (
      <tr>
        <td>{i + 2}</td>
        <td className="highlight">{x.collection.name}</td>
        <td>
          <a target="_blank" rel="noreferrer" href={`${EXPLORER}addr/${x.address}`}> Asset Address </a>
        </td>
        <td>{x.balance}</td>
      </tr>
    ));
    ret.splice(
      0,
      0,
      <tr>
        <td>1</td>
        <td className="highlight">XDC</td>
        <td>N.A.</td>
        <td>{native.toFixed(2)}</td>
      </tr>
    );

    return ret;
  }

  render() {
    return (
      <div className="wallet">
        <table className="custom-view-table">
          <thead>
            <th>SR. No.</th>
            <th>Asset Name</th>
            <th>Asset Address</th>
            <th>Balance</th>
          </thead>

          <tbody>
            {this.renderBalances()}
            {/* <tr>
              <td>1</td>
              <td className="highlight">XDC</td>
              <td>
                <a href="/">TEST</a>
              </td>
              <td>1000</td>
            </tr> */}
          </tbody>
        </table>
      </div>
    );
  }
}

function mapStateToProps_Wallet({ balance }) {
  return { balance };
}

const ConnectedWallet = connect(mapStateToProps_Wallet)(Wallet);

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.getPastEvents();
  }

  componentDidUpdate(prevProps) {
    if (
      !_.isEqual(prevProps.wallet, this.props.wallet) ||
      !_.isEqual(prevProps.collections, this.props.collections)
    ) {
      this.getPastEvents();
    }
  }

  getPastEvents() {
    this.setState({ loading: true });
    const contracts = this.props.collections.collections.reduce((acc, cur) => {
      const q = {};
      q[toXdcAddress(cur.address)] = cur.name;
      return { ...acc, ...q };
    }, {});
    GetPastEvents(CONTRACT_ABI.auction, CONTRACT_ADDRESS.auction)
      .then((resp) => {
        return Promise.all(
          resp.map(async (e) => {
            const { from, timestamp } = await GetFromAddress(e.transactionHash);

            return {
              ...e,
              from,
              timestamp,
              assetName: e.returnValues._asset
                ? contracts[toXdcAddress(e.returnValues._asset)]
                : "",
            };
          })
        );
      })
      .then((resp) => {
        console.log("respxx", resp, this.props.wallet.address);

        resp = resp.filter((x) =>
          IsAddressEqual(this.props.wallet.address, x.from)
        );

        this.setState({ data: resp, loading: false });
      })
      .catch((e) => {
        console.log("resp", e);
        this.setState({ data: [], loading: false });
      });
  }

  renderReturnValues(returnValues) {
    return (
      <Container>
        {Object.keys(returnValues)
          .filter((x) => isNaN(x))
          .map((v, i) => (
            <Row key={i} style={{ textAlign: "left" }}>
              <Col lg={4}>{v}</Col>
              <Col lg={8}>{returnValues[v]}</Col>
            </Row>
          ))}
      </Container>
    );
  }

  renderTXHistory() {
    const { loading, data } = this.state;

    if (loading)
      return (
        <tr>
          <td colSpan={6} style={{ textAlign: "center" }}>
            Loading
          </td>
        </tr>
      );

    if (_.isEmpty(data))
      return (
        <tr>
          <td colSpan={6} style={{ textAlign: "center" }}>
            No History
          </td>
        </tr>
      );

    return data.map((x, i) => (
      <tr>
        <td>{i + 1}</td>
        <td>{DateStringFormat(x.timestamp * 1000)}</td>
        <td className="highlight">{x.assetName}</td>
        <td>
          <a href={`${EXPLORER}addr/${x.address}`}> Asset Address </a>
        </td>
        <td>
          <a href={`${EXPLORER}tx/${x.transactionHash}`}> TX HASH </a>
        </td>
        <td>{x.event}</td>
        {/* <td>{this.renderReturnValues(x.returnValues)}</td> */}
      </tr>
    ));
  }

  render() {
    return (
      <div className="history">
        <table className="custom-view-table">
          <thead>
            <th>SR. No.</th>
            <th>Date</th>
            <th>Asset Name</th>
            <th>Asset Address</th>
            <th>TX HASH</th>
            <th>Event Name</th>
            {/* <th>Event Output</th> */}
          </thead>

          <tbody>{this.renderTXHistory()}</tbody>
        </table>
        <div style={{ padding: "1rem" }} className="u-float-r">
          <Button onClick={() => this.getPastEvents()} variant="info">
            Refresh
          </Button>
        </div>
      </div>
    );
  }
}

function mapStateToProps_History({ wallet, collections }) {
  return { wallet, collections };
}

const ConnectedHistory = connect(mapStateToProps_History)(History);

class WalletPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      acitveTab: "wallet",
    };
  }

  renderPanel() {
    switch (this.state.acitveTab) {
      case "history":
        return <ConnectedHistory />;
      case "wallet":
      default:
        return <ConnectedWallet />;
    }
  }

  render() {
    return (
      <div className="component-panel wallet-page">
        <Container>
          <Row>
            <Col>
              <PageNavigation
                setactivePath={(x) => this.setState({ acitveTab: x })}
                activePath={this.state.acitveTab}
                links={LINKS}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Container>
                <Row>
                  <Col lg={4}>
                    <Collections />
                  </Col>

                  <Col lg={8}>{this.renderPanel()}</Col>
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default WalletPage;
