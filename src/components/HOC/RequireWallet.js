import React, { Component } from "react";
import { connect } from "react-redux";

const DefaultFallback = () => (
  <div className="component-panel u-text-center">
    PLEASE CONNECT WALLET
  </div>
);

const RequireWalletConnected = (FallbackComponent = DefaultFallback) => (
  ComposedComponent
) => {
  class Connected extends Component {
    render() {
      if (this.props.wallet.connected && this.props.wallet.valid_network)
        return <ComposedComponent {...this.props} />;
      if (!FallbackComponent) return <DefaultFallback />;
      return <FallbackComponent />;
    }
  }

  function mapStateToProps({ wallet }) {
    return { wallet };
  }

  return connect(mapStateToProps)(Connected);
};

export default RequireWalletConnected;
