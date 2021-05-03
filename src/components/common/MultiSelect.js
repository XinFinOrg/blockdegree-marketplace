import React, { useCallback, useMemo } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import chroma from "chroma-js";

const animatedComponents = makeAnimated();

function MultiSelect(props) {
  const options = useMemo(() => [...props.options], []);

  const styles = useMemo(
    () => ({
      multiValue: (styles, { data }) => {
        const color = chroma(data.color);
        return {
          ...styles,
          backgroundColor: color.alpha(0.1).css(),
        };
      },
      multiValueLabel: (styles, { data }) => ({
        ...styles,
        color: data.color,
      }),
      multiValueRemove: (styles, { data }) => ({
        ...styles,
        color: data.color,
        ":hover": {
          backgroundColor: data.color,
          color: "white",
        },
      }),
    }),
    []
  );

  const orderByLabel = useCallback(
    (a, b) => a.label.localeCompare(b.label),
    []
  );

  const orderOptions = useCallback(
    (values) =>
      values
        .filter((v) => v.isFixed)
        .sort(orderByLabel)
        .concat(values.filter((v) => !v.isFixed).sort(orderByLabel)),
    [orderByLabel]
  );

  const [value, setValue] = [props.value, props.setValue];

  const handleChange = useCallback(
    (inputValue, { action, removedValue }) => {
      switch (action) {
        case "remove-value":
        case "pop-value":
          if (removedValue.isFixed) {
            setValue(orderOptions([...inputValue, removedValue]));
            return;
          }
          break;
        case "clear":
          setValue(options.filter((v) => v.isFixed));
          return;
        default:
      }
      setValue(inputValue);
    },
    [options, orderOptions]
  );

  return (
    <div className="multi-select">
      <Select
        isMulti // show multiple options
        components={animatedComponents} // animate builtin components
        isClearable={value.some((v) => !v.isFixed)} // clear button shows conditionally
        styles={styles} // styles that do not show 'x' for fixed options
        options={options} // all options
        value={value} // selected values
        onChange={handleChange} // handler for changes
      />
    </div>
  );
}

export default MultiSelect;
