import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const PageNavigation = ({ setactivePath, activePath, links }) => {
  return (
    <div className="page-navigation">
      <Container>
        <Row>
          <Col>
            <div className="page-navigation__wrapper">
              {links.map(({ name, link }) => (
                <span
                  className={
                    link === activePath ? "nav-link__ active" : "nav-link__"
                  }
                  to={link}
                  onClick={() => setactivePath(link)}
                >
                  {name}
                </span>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PageNavigation;
