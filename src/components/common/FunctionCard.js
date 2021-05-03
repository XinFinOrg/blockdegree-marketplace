import { Card, Container } from "react-bootstrap";

import { DynamicForm } from "./RenderCustomView";

const FunctionCard = ({
  title,
  inputs,
  stateMutability,
  setModalContent,
  contractType = "token",
  abi, 
  address
}) => {
  const mutabilityClass = `title__state-mutability ${stateMutability}`;
  return (
    <Card className="custom-card-2">
      <Card.Title>
        <div className="title">
          <span className="title__function-name">{title}</span>
          <span className={mutabilityClass}>{stateMutability}</span>
          <div className="title__bottom"></div>
        </div>
      </Card.Title>
      <Card.Body>
        <DynamicForm
          data={[...inputs]}
          method={title}
          contractType={contractType}
          stateMutability={stateMutability}
          setModalContent={setModalContent}
          abi={abi}
          address={address}
        />
      </Card.Body>
    </Card>
  );
};

export default FunctionCard;
