import _ from "lodash";

import AccordionWindow from "./AccordionWindow";

export const GeneralObjectViewer = (data) => {
  return (
    <div className="general-object-viewer">{_generalObjectViewer(data)}</div>
  );
};
const _generalObjectViewer = (data) => {
  if (!_.isArray(data) && !_.isObject(data)) {
    return <div>{data}</div>;
  }

  if (_.isArray(data)) {
    return data.map((x, k) => {
      let child;
      if (_.isObject(data[k])) {
        child = GeneralObjectViewer(data[k]);
        return <AccordionWindow title={k}>{child}</AccordionWindow>;
      } else {
        child = data[k];
        return <div>{child}</div>;
      }
    });
  } else {
    return Object.keys(data).map((k) => {
      let child;
      if (_.isObject(data[k])) {
        child = GeneralObjectViewer(data[k]);
      } else {
        child = data[k];
      }
      return <AccordionWindow title={k}>{child}</AccordionWindow>;
    });
  }
};

export const GeneralObjectUpdater = () => {};
