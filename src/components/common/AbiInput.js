import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function AbiInput({ abi = "", addr = "", setAbi, setAddress }) {
  return (
    <div className="abi-input">
      <Container>
        <Row>
          <Col lg={12} md={12} sm={12} className="field-name">
            ABI
          </Col>
          <Col lg={12} md={12} sm={12}>
            <textarea
              value
              className="form-control abi-json"
              value={JSON.stringify(abi, null,"\t")}
              onChange={(e) => setAbi(e.target.value)}
              spellcheck="false"
            />
          </Col>
        </Row>
        <Row>
        <Col lg={12} md={12} sm={12} className="field-name">
            Contract Addresss
          </Col>
          <Col lg={12} md={12} sm={12}>
            <input
              className="form-control contract-address"
              value={addr}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AbiInput;
