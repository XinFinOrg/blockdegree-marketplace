import { Col, Container, Row } from "react-bootstrap";
import { PROJECT_NAME } from "../../helpers/constant";
import GeneralModal from "./GeneralModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet } from "@fortawesome/free-solid-svg-icons";

const BalanceModal = ({ data = [] }) => {
  const balances = data.map(({ name, balance }) => (
    <Col className="balance-item">
      <div className="balance-item__name">{name}</div>
      <div className="balance-item__value">{balance}</div>
    </Col>
  ));

  return (
    <GeneralModal
      centered="true"
      btnVariant="white"
      btnName={<FontAwesomeIcon icon={faWallet} size="lg" />}
      disableSubmit={true}
      modalName={`${PROJECT_NAME} Wallet`}
      className="balance-modal"
      btnClass="balance-btn"
    >
      <div>
        <Container>
          <Row>{balances}</Row>
        </Container>
      </div>
    </GeneralModal>
  );
};

export default BalanceModal;
