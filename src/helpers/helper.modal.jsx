import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import '../assets/css/modal.css'

//<input classNameName="nodrag" type="color" onChange={data.onChange} defaultValue={data.color} />


export default memo(({ data, create }) => {

    const question = (data) => {
        switch (data.error) {
            case "NoEndpoint":
                return "Although defined in the OAS, This endpoint has not been tracked yet within Sera, create Endpoint and Builder data now?";
            case "NoBuilder":
                return "Create builder for endpoint?";
        }
    }

    return (
        <div className="mac-window-screen" id="img-move-1">
            <header>
                <div className="close">
                </div>
            </header>
            <div className="run-screen">
                <p>{question(data)}</p>
                <div className="buttons">
                    <button onClick={() => create(data)} className="cta-01"><span>Create</span></button>
                    <button className="cta-02"><span>Go Back</span></button>
                </div>
            </div>
        </div>
    )
})