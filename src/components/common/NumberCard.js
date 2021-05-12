import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Col, Row } from "react-bootstrap";

export const AnimatedNumberCard = ({ title, icon, number, color = null }) => {
  // const [no, setNo] = useState(0);
  // let currNo = no;
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (currNo != NaN)
  //       if (currNo >= number) {
  //         clearInterval(interval);
  //         return;
  //       }
  //     let incr = Math.floor((30 * (number - currNo)) / 1000)
  //       ? Math.floor((30 * (number - currNo)) / 1000)
  //       : Math.ceil((30 * (number - currNo)) / 1000);

  //     console.log("currNo", currNo, incr);
  //     currNo += incr;
  //     setNo(currNo);
  //   }, 30);
  // });

  const cName = `animated-number-card ${color}-bg`;

  return (
    <div className={cName}>
      <Container>
        <Row>
          {/* <Col lg={4}>
            <div className="animated-number-card__icon">
              <FontAwesomeIcon icon={icon} />
            </div>
          </Col> */}
          <Col lg={12}>
            <Container>
              <Row>
                <div className="animated-number-card__title">{title}</div>
              </Row>
              <Row>
                <div className="animated-number-card__number">{number}</div>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
