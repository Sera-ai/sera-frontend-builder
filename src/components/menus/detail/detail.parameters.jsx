import React, { memo, useState } from 'react';
import circlesLogo from '../../../assets/icons/tabler_circles.svg';
import chevronDown from '../../../assets/icons/tabler_chevron-down.svg';

export default memo(({ nodeDetails, nodes, edges, handleConnectChange }) => {

    //grab entrypoint id
    const nodeId = nodeDetails.id
    const edgesTest = edges

    const GetParams = ({ input }) => {

        console.log((nodes.filter((node) => node.id == nodeId)))
        console.log((nodes.filter((node) => node.id == nodeId))[0])


        const fields = (nodes.filter((node) => node.id == nodeId))[0].data.fields[input] ?? {}
        const returnables = Object.keys(fields).map((field) => {
            if (!field.includes("__")) {

                const step2 = nodes.filter((node) => node.id !== nodeId)
                    .flatMap(node => {
                        console.log(input === "in" ? "out" : "in")
                        console.log(node)
                        const relevantFields = node.data.fields[input === "in" ? "out" : "in"] ?? {}
                        return Object.keys(relevantFields)
                            .filter(field2 => !field2.includes("__") && relevantFields[field2].type === fields[field].type)
                            .map(field2 => {

                                return { name: field2, type: fields[field].type, id: node.id }
                            })

                    }).sort();

                return <Detail data={field} field={fields[field]} options={step2} edges={edgesTest} parentId={nodeId} input={input} handleConnectChange={handleConnectChange} />
            }
        }) ?? []

        return returnables.length > 0 ? returnables : <EmptyDetail data={"None"} />
    }

    return (
        <div className='detailsMenuComponent'>
            <div className='detailsOverview'>
                <div className='functionText'>
                    <div className='nodeTitle'>Input Parameters</div>
                    <div className='nodeSubtitle'>Inputs to Block</div>
                </div>
                <GetParams input={"in"} />
            </div>
            <div className='detailsOverview'>
                <div className='functionText'>
                    <div className='nodeTitle'>Output Parameters</div>
                    <div className='nodeSubtitle'>Outputs to Block</div>
                </div>
                <GetParams input={"out"} />

            </div>
        </div>
    );
});

function getHex(type) {
    switch (type) {
        case "integer": return "#a456e5";
        case "flow": return "#ffffff";
        case "string": return "#2bb74a";
        default: return "#ffffff80"
    }
}

const Detail = ({ data, field, options = [], edges, parentId, input, handleConnectChange }) => {
    const type = field ? field.type : null
    const io = input == "in" ? "target" : "source"
    const revio = input == "in" ? "source" : "target"

    const edge = edges.filter(edge => edge[io] === parentId && edge.id.split("-")[2] === data)[0];



    return (<div className={`detailParameterBox`}>
        <GetImage hex={getHex(type)} />
        <div className='detailParameterFrame'>
            <div className='detailFont'>
                {data} <span style={{ color: getHex(type) }}>(</span>{type ?? "None"}<span style={{ color: getHex(type) }}>)</span>
            </div>
            <div className='detailDropdown'>
                <select
                    className='detailFont detailFontCase'
                    value={edge ? `${edge.id.split("-")[2]}-${type}-${edge[revio]}` : "none"}
                    disabled={!type ?? true}
                    onChange={(e) => changeData(e, handleConnectChange, parentId, input)}>
                    <GetOptions data={[...options, { name: "none" }]} edges={edges} />
                </select>
            </div>
        </div>
    </div>)
}


const EmptyDetail = ({ data, field, options = [], edges, parentId, input }) => {

    return (<div className={`detailParameterBox`}>
        <GetImage hex={"#ffffff"} />
        <div className='detailParameterFrame'>
            <div className='detailFont'>
                None Available <span style={{ color: "#fff" }}>(</span>{"None"}<span style={{ color: "#fff" }}>)</span>
            </div>
            <div className='detailDropdown'>
                <select className='detailFont detailFontCase' value={null} disabled={true} /*onChange={handleChange}*/>

                </select>
            </div>
        </div>
    </div>)
}

const GetOptions = ({ data }) => {
    return data.map((d) => {
        return (<option className='dropdownOption' value={d.name == "none" ? "none" : `${d.name}-${d.type}-${d.id}`}>{d.name == "none" ? "Not Connected" : `${d.name} (${d.type}) [${d.id}]`}</option>)
    })
}

const GetImage = ({ hex }) => {
    return (<svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="tabler:circles">
            <path id="Vector" d="M5.33317 5.16667C5.33317 5.87391 5.61412 6.55219 6.11422 7.05229C6.61432 7.55238 7.29259 7.83333 7.99984 7.83333C8.70708 7.83333 9.38536 7.55238 9.88546 7.05229C10.3856 6.55219 10.6665 5.87391 10.6665 5.16667C10.6665 4.45942 10.3856 3.78115 9.88546 3.28105C9.38536 2.78095 8.70708 2.5 7.99984 2.5C7.29259 2.5 6.61432 2.78095 6.11422 3.28105C5.61412 3.78115 5.33317 4.45942 5.33317 5.16667ZM1.6665 11.8333C1.6665 12.5406 1.94746 13.2189 2.44755 13.719C2.94765 14.219 3.62593 14.5 4.33317 14.5C5.04041 14.5 5.71869 14.219 6.21879 13.719C6.71889 13.2189 6.99984 12.5406 6.99984 11.8333C6.99984 11.1261 6.71889 10.4478 6.21879 9.94772C5.71869 9.44762 5.04041 9.16667 4.33317 9.16667C3.62593 9.16667 2.94765 9.44762 2.44755 9.94772C1.94746 10.4478 1.6665 11.1261 1.6665 11.8333ZM8.99984 11.8333C8.99984 12.5406 9.28079 13.2189 9.78089 13.719C10.281 14.219 10.9593 14.5 11.6665 14.5C12.3737 14.5 13.052 14.219 13.5521 13.719C14.0522 13.2189 14.3332 12.5406 14.3332 11.8333C14.3332 11.1261 14.0522 10.4478 13.5521 9.94772C13.052 9.44762 12.3737 9.16667 11.6665 9.16667C10.9593 9.16667 10.281 9.44762 9.78089 9.94772C9.28079 10.4478 8.99984 11.1261 8.99984 11.8333Z" stroke={hex} stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
        </g>
    </svg>
    )
}

const changeData = (e, handleConnectChange, parentId, input) => {
    if (e.target.value != "none") {
        const targetData = e.target.value.split("-")
        const type = targetData[0]
        const source = input == "in" ? targetData[2] : parentId
        const target = input == "in" ? parentId : targetData[2]

        const data = {
            source: source,
            sourceHandle: `flow-source-${source}-${type}`,
            target: target,
            targetHandle: `flow-target-${target}-${type}`,
        }

        handleConnectChange(data)
    } else {
        console.log("boop")
    }

}