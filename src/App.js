import React, { Component } from "react";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import { Switch, Route, Redirect } from "react-router-dom";

import * as actions from "./actions/index";

import Header from "./components/Header";
import NFT from "./components/NFT";
import WalletPage from "./components/NFT/Wallet";
import RequireWallet from "./components/HOC/RequireWallet";

import CacheBuster from "./cacheBuster";
import packageJson from "../package.json";

import "./assets/scss/main.scss";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";

const ComposedWallet = RequireWallet()(WalletPage);

class App extends Component {
  componentDidMount() {}

  render() {
    return (
      <div className="App">
        <CacheBuster>
          {({ loading, isLatestVersion, refreshCacheAndReload }) => {
            // console.log("[*] cache policy", loading, isLatestVersion);
            if (loading) return null;
            console.log(`UI Version:`, packageJson.version);
            if (!loading && !isLatestVersion) {
              // You can decide how and when you want to force reload
              refreshCacheAndReload();
            }

            return null;
          }}
        </CacheBuster>
        <ToastContainer />
        <Header />

        <Switch>
          <Route exact path="/" component={NFT} />

          <Route exact path="/wallet-page" component={ComposedWallet} />
        </Switch>
      </div>
    );
  }
}

function mapStateToProps({ stats }) {
  return { stats };
}

export default connect(mapStateToProps, actions)(App);
