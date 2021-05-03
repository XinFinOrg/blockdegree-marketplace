import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

function ToggleModal({
  children,
  btnName = "View",
  btnVariant = "info",
  disableSubmit = false,
  btnClass = "",
  ...rest
}) {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const submitBtn = (
    <Button
      variant="primary"
      onClick={() => {
        if (rest.onSubmit && typeof rest.onSubmit === "function") {
          rest.onSubmit();
        }
      }}
    >
      {rest.btnNameSubmit || "Understood"}
    </Button>
  );

  return (
    <>
      <Button className={btnClass} variant={btnVariant} onClick={handleShow}>
        {btnName}
      </Button>
      <Modal
        className="custom-modal"
        {...rest}
        show={showModal}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>{rest.modalName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              handleClose();
              if (rest.onClose && typeof rest.onClose === "function") {
                rest.onClose();
              }
            }}
          >
            {rest.btnNameClose || "Close"}
          </Button>
          {disableSubmit === true ? "" : submitBtn}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ToggleModal;
