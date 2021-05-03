import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { RemoveMultiplier, TIMER_FORMAT } from "../helpers/constant";
import Timer from "./common/Timer";

const KeyFieldView = ({ k, v }) => (
  <Row>
    <Col className="key" sm={6} md={6} lg={6}>
      {k}
    </Col>
    <Col className="value" sm={6} md={6} lg={6}>
      {v}
    </Col>
  </Row>
);

class Home extends React.Component {
  renderCurrentPool() {
    if (!this.props.matkaDetails.currentPool) return "";
    return (
      <Container>
        {KeyFieldView({
          k: `Can Bet `,
          v: `${
            this.props.matkaDetails.poolActive &&
            new Date().getTime() <
              this.props.matkaDetails.currentPool.endTime * 1000
          }`,
        })}
        {KeyFieldView({
          k: `Pool Number`,
          v: `${this.props.matkaDetails.currentPool.poolId}`,
        })}
        {KeyFieldView({
          k: "Total Amount In Pool",
          v: RemoveMultiplier(
            this.props.matkaDetails.currentPool.totalPoolAmount
          ),
        })}
        {KeyFieldView({
          k: `Bet End In (${TIMER_FORMAT})`,
          v: (
            <Timer
              startDate={new Date().getTime()}
              endDate={this.props.matkaDetails.currentPool.endTime * 1000}
            />
          ),
        })}
      </Container>
    );
  }

  render() {
    return (
      <div className="single-matka">
        <Container>
          <Row>
            <Col lg={12} sm={12} md={12} className="single-matka-section">
              <div className="single-matka-section--title">Matka Details</div>
              <div className="single-matka-section--body">
                {this.renderCurrentPool()}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Home;
