import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import _ from "lodash";

import {
  GetJsonRpcError,
  IsJsonRpcError,
  SubmitContractTxGeneral,
} from "../../wallets";
import { EXPLORER } from "../../helpers/constant";
import { GeneralObjectViewer } from "./ObjectComponent";

const RenderInput = ({ field, ...inputProps }) => (
  <Row>
    <Col lg={4} md={4} sm={12}>
      <label className="form-control">{field}</label>
    </Col>
    <Col lg={8} md={8} sm={12}>
      <input className="form-control" {...inputProps} />
    </Col>
  </Row>
);
/**
 *
 * !FIX: DOB & File input types
 */
export const RenderInputCustomType = ({
  field,
  onChange: cb,
  type = "text",
  value,
  setInput,
  onBlur = () => {},
  formData,
  setFormData,
  ...inputProps
}) => {
  let customInput = null;
  switch (type) {
    case "text":
    case "number":
      customInput = (
        <input
          type={type}
          className="form-control"
          onChange={(e) => {
            cb(e.target.value);
          }}
          value={value}
          onBlur={(e) => onBlur(e, { setInput, formData, setFormData })}
          {...inputProps}
        />
      );
      break;
    case "select":
      customInput = (
        <select
          className="form-control"
          onChange={(e) => {
            cb(e.target.value);
          }}
          value={value}
        >
          {inputProps.options.map(({ label, value: curVal }, i) => (
            <option key={i + 1} value={curVal}>
              {label}
            </option>
          ))}
        </select>
      );
      break;
    case "radio":
      customInput = (
        <>
          {inputProps.options.map(({ value: curVal, label }, i) => (
            <div className="input-dynamic-form__input-radio" key={i + 1}>
              <Form.Label>
                <input
                  type={type}
                  value={curVal}
                  name={field}
                  key={i + 1}
                  onClick={(e) => {
                    cb(e.target.value);
                  }}
                  defaultChecked={curVal === value}
                />
                {label}
              </Form.Label>
            </div>
          ))}
        </>
      );
      break;
    default:
      return <></>;
  }
  return (
    <Row>
      <Col lg={4} md={4} sm={12}>
        <label className="form-control">{field}</label>
      </Col>
      <Col lg={8} md={8} sm={12}>
        {customInput}
      </Col>
    </Row>
  );
};

export const RenderInputCustomType2 = ({
  field,
  onChange: cb,
  type = "text",
  value,
  setInput,
  onBlur = () => {},
  formData,
  setFormData,
  ...inputProps
}) => {
  let customInput = null;
  switch (type) {
    case "text":
    case "number":
      customInput = (
        <input
          type={type}
          className="form-control"
          onChange={(e) => {
            cb(e.target.value);
          }}
          value={value}
          onBlur={(e) => onBlur(e, { setInput, formData, setFormData })}
          {...inputProps}
        />
      );
      break;
    case "select":
      customInput = (
        <select
          className="form-control"
          onChange={(e) => {
            cb(e.target.value);
          }}
          value={value}
        >
          {inputProps.options.map(({ label, value: curVal }, i) => (
            <option key={i + 1} value={curVal}>
              {label}
            </option>
          ))}
        </select>
      );
      break;
    case "radio":
      customInput = (
        <>
          {inputProps.options.map(({ value: curVal, label }, i) => (
            <div className="input-dynamic-form__input-radio" key={i + 1}>
              <Form.Label>
                <input
                  type={type}
                  value={curVal}
                  name={field}
                  key={i + 1}
                  onClick={(e) => {
                    cb(e.target.value);
                  }}
                  defaultChecked={curVal === value}
                />
                {label}
              </Form.Label>
            </div>
          ))}
        </>
      );
      break;
    default:
      return <></>;
  }
  return (
    <Row>
      <Col lg={12} md={12} sm={12}>
        <label className="form-control field-label">{field}</label>
      </Col>
      <Col className="field-input" lg={12} md={12} sm={12}>
        {customInput}
      </Col>
    </Row>
  );
};

/**
 *
 * @param {*} props class properties
 */
export const DynamicForm = (props) => {
  const [inputs, setInputs] = useState(
    props.data.map(({ value = "", defaultValue = "" }) => {
      if (value !== "") {
        return value;
      } else if (defaultValue !== "") {
        return defaultValue;
      }
    })
  );

  const [loading, setLoading] = useState(false);
  const [formData, setFormDatas] = useState(props.data);

  useEffect(() => {
    setFormDatas(props.data);
  }, [props.data]);

  const setInput = (i, v) => setInputs(Object.assign([...inputs], { [i]: v }));
  const setFormData = (i, v) =>
    setFormDatas(Object.assign([...formData], { [i]: v }));

  return (
    <Container className="custom-input-1 dynamic-form">
      {formData.map(({ name, type, ...rest }, i) => (
        <RenderInputCustomType2
          field={name}
          type={type}
          value={inputs[i]}
          key={i}
          setInput={(i, e) => setInput(i, e)}
          onChange={(e) => setInput(i, e)}
          formData={formData}
          setFormData={setFormData}
          {...rest}
        />
      ))}
      <Button
        onClick={() => {
          setLoading(true);
          SubmitContractTxGeneral(
            props.method,
            props.contractType || "token",
            props.stateMutability,
            props.abi,
            props.address,
            ...inputs
          )
            .then((resp) => {
              let respStr;
              if (_.isObject(resp) === true)
                respStr = GeneralObjectViewer(resp);
              else respStr = `${resp}`;

              if (resp && resp.transactionHash) {
                const content = (
                  <Container>
                    <Row>
                      <Col lg={4} md={4} sm={4}>
                        <span>Transaction Hash</span>
                      </Col>
                      <Col lg={8} md={8} sm={8}>
                        <span>
                          {/* <a
                            target="_blank"
                            href={`${EXPLORER}/tx/${resp.transactionHash}`}
                          >
                            TX HASH
                          </a> */}
                        </span>
                      </Col>
                    </Row>
                  </Container>
                );
                props.setModalContent(content);
              } else if (resp !== null) {
                const content = (
                  <Container>
                    <Row>
                      <Col lg={4} md={4} sm={4}>
                        <span>Response</span>
                      </Col>
                      <Col lg={8} md={8} sm={8}>
                        <span>{respStr}</span>
                      </Col>
                    </Row>
                  </Container>
                );
                props.setModalContent(content);
              } else {
                props.setModalContent("error");
              }

              setLoading(false);
            })
            .catch((e) => {
              console.log("err", e);
              if (IsJsonRpcError(e)) {
                const err = GetJsonRpcError(e);
                props.setModalContent(`Error: ${err.message}`);
                setLoading(false);
                return;
              }
              toast("Error", { type: "error" });
              setLoading(false);
            });
        }}
        variant="primary"
        style={{ width: "10rem", float: "right" }}
        disabled={loading}
      >
        Submit
      </Button>
    </Container>
  );
};

export const SelectOption = [{ label: "Select", value: null }];

export const DynamicActionBtn = (props) => {
  const [loading, setLoading] = useState(false);
  let customBtn = null;
  switch (props.type) {
    case "actionBtn":
      customBtn = (
        <Button
          variant={props.options.variant}
          onClick={() => {
            setLoading(false);
            // PostApi(props.api, "", () => setLoading(true));
          }}
        >
          {" "}
          {props.options.name}
        </Button>
      );
      break;
    default:
      return <></>;
  }
  return customBtn;
};
