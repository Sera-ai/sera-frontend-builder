import React, { memo, useState } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';

//<input className="nodrag" type="color" onChange={data.onChange} defaultValue={data.color} />
import { socket } from '../../helpers/socket';


export default memo(({ data, node, id }) => {
    console.log("id", id)
    const [inputFieldData, setInputFieldData] = useState({
        target: data.target ?? { id: null, type: null, title: null },
        source: data.source ?? { id: null, type: null, title: null },
        nodeType: data.nodeType ?? "flow",
        inputData: data.inputData ?? null
    });

    console.log("data", node)

    const updateNodeInternals = useUpdateNodeInternals();


    const updateField = (newData) => {
        console.log("updateField", id)
        let dataUpdate = data
        dataUpdate.inputData = newData
        let updateData = inputFieldData
        updateData.inputData = dataUpdate.inputData
        setInputFieldData(updateData)
        console.log("dataUpdate", dataUpdate.inputData)
        updateNodeInternals(id, { data: data.function == "string" ? dataUpdate : parseInt(dataUpdate) })
        socket.emit("updateField", { id: `inputfor-${id}`, value: newData })
    }

    const NodeFieldTitle = () => {
        return (<input
            id={`inputfor-${id}`}
            onChange={(e) => updateField(e.target.value)}
            onClickCapture={(e) => e.preventDefault()}
            onClick={(e) => e.preventDefault()}
            className='inlineTextBox'
            type={data.function == "string" ? "text" : "integer"}

            placeholder='Input'
            defaultValue={inputFieldData.inputData}
        />)
    }

    const LeftHandle = () => {
        return (
            <Handle
                type="target"
                position={Position.Left}
                id={data.target.id}
                className={`ioHandle ${data.target.type}Edge`}
            />
        )
    }

    const RightHandle = () => {
        return (
            <Handle
                type="source"
                position={Position.Right}
                id={"flow-source-" + id + "-" + data.function}
                className={`ioHandle ${data.function}Edge`}
            />
        )
    }

    (<tr>
        <td>
            {(data.nodeType == 1 || data.nodeType == 2) && <LeftHandle />}
            {(data.nodeType == 0) && <NodeFieldTitle node={data.source} />}
        </td>
        <td className={(data.nodeType == 1 || data.nodeType == 0) && 'endHandle'}>
            {(data.nodeType == 1 || data.nodeType == 0) && <RightHandle />}
            {(data.nodeType == 2) && <NodeFieldTitle node={data.target} />}
        </td>
    </tr>)


    return (
        <div className='nodeHeaderContentDetails'>
            {data.nodeType == 0 && (<NodeFieldTitle node={data.target} />)}

            <div style={{ fontSize: 10, color: "#ffffff70", flex: 1 }}></div>

            {(data.nodeType == 1 || data.nodeType == 0) && <RightHandle />}

        </div>


    )
})