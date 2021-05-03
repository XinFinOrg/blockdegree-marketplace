import React from "react";
import { connect } from "react-redux";

import { Container, Row, Col } from "react-bootstrap";

class ResponseDisplay extends React.Component {
  render() {
    return (
      <div className="highlighted-note">
        <div className="highlighted-note--title">Status</div>
        <div className="highlighted-note--body">
          <Container>
            <Row>
              <Col lg={4} md={4} sm={4} className="highlighted-note--body_key">
                Status
              </Col>

              <Col
                lg={8}
                md={8}
                sm={8}
                className="highlighted-note--body_field"
              >
                {data.status}
              </Col>
            </Row>
            <Row>
              <Col lg={4} md={4} sm={4} className="highlighted-note--body_key">
                TX Hash
              </Col>

              <Col
                lg={8}
                md={8}
                sm={8}
                className="highlighted-note--body_field"
              >
                {data.txHash}
              </Col>
            </Row>

            <Row>
              <Col lg={4} md={4} sm={4} className="highlighted-note--body_key">
                Link
              </Col>

              <Col
                lg={8}
                md={8}
                sm={8}
                className="highlighted-note--body_field"
              >
                <a href={data.link} rel="noreferrer" target="_blank">
                  {data.txHash.substr(0, 10)}...
                </a>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ response }) {
  return { response };
}

export default connect(mapStateToProps)(ResponseDisplay);
