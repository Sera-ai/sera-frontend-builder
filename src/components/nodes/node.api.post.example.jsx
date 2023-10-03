import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

//<input className="nodrag" type="color" onChange={data.onChange} defaultValue={data.color} />
import FlowComponent from '../fields/component.field.flow';
import ApiHeaderComponent from '../headers/component.header.api';
import FieldComponent from '../fields/component.field.input';

export default memo(({ data, isConnectable }) => {
  return (
    <>
      {data.headerType && (<div className="nodeTag">
        <a>entrypoint</a>
      </div>)}

      <ApiHeaderComponent
        data={{
          method: data.header.method,
          host: data.header.host,
          path: data.header.path,

        }} />

      <table className="outTable">
        <tbody>

          <FlowComponent
            data={{
              target: { id: null, type: null },
              source: { id: "1", type: null },
              nodeType: 0,
            }} />

          <FieldComponent
            data={{
              target: { id: null, type: null, title: null, },
              source: { id: "a", type: null, title: "email", },
              nodeType: 0,
            }} />

          <FieldComponent
            data={{
              target: { id: null, type: null, title: null, },
              source: { id: "b", type: null, title: "password", },
              nodeType: 0,
            }} />

        </tbody>
      </table>
    </>
  );
});
