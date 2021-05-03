import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import Select from "react-select";

import NFTIcon from "../../assets/img/brand/favicon.png";

const CollectionElement = ({ icon = NFTIcon, name, link }) => {
  return (
    <a
      target="_blank"
      rel="noreferrer"
      href={link}
      className="collection-element"
    >
      <span className="collection-element__icon">
        <img src={icon} alt="NFT logo" />
      </span>
      <span className="collection-element__name">{name}</span>
    </a>
  );
};

const CollectionElementWrapper = ({ collections }) => {
  return (
    <Container>
      {collections.map((rst) => (
        <CollectionElement {...rst} />
      ))}
    </Container>
  );
};

class Collections extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: null,
      collections: [],
    };
  }

  static getDerivedStateFromProps(props, state) {
    return { ...state, collections: props.collections.collections };
  }

  render() {
    const elements =
      this.state.filter !== null
        ? this.state.collections.filter(
            ({ name }) => name === this.state.filter.value
          )
        : this.state.collections;

    return (
      <div className="collections">
        <Container>
          <Row>
            <Col>
              <div className="collections__title">Listed Collections</div>
            </Col>
          </Row>

          <Row>
            <Col>
              <div className="collections__filter">
                <Select
                  isClearable={true}
                  options={elements.map(({ name }) => {
                    return { label: name, value: name };
                  })}
                  onChange={(x) => {
                    this.setState({ filter: x });
                  }}
                />
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <div className="collections__elements">
                <CollectionElementWrapper collections={elements} />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

function mapStateToProps({ collections }) {
  return { collections };
}

export default connect(mapStateToProps)(Collections);
