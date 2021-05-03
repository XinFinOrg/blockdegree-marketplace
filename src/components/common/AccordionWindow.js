import React, { Component } from "react";
import _ from "lodash";

import { Container, Row, Col, Card, Accordion } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronDown,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";

class AccordionWindow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: props.defActive === true ? "0" : "-1",
    };
  }

  renderSymbol() {
    return this.state.active === "0" ? faChevronDown : faChevronRight;
  }

  render() {
    return (
      <Accordion className="liquidator-config" activeKey={this.state.active}>
        <Card>
          <Accordion.Toggle
            as={Card.Header}
            eventKey="0"
            onClick={() =>
              this.setState({ active: this.state.active === "0" ? "-1" : "0" })
            }
          >
            <span>{this.props.title}</span>
            <span className="u-float-r">
              <FontAwesomeIcon icon={this.renderSymbol()} />
            </span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body className={this.props.childClass}>
              {this.props.children}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    );
  }
}

export default AccordionWindow;
