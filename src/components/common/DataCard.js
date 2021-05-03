import { Card } from "react-bootstrap";

const DataCard = ({ title, data, children }) => {
  return (
    <Card className="custom-card-3">
      <Card.Title>
        <div className="title">{title}</div>
      </Card.Title>
      <Card.Body>{children}</Card.Body>
    </Card>
  );
};

export default DataCard;
