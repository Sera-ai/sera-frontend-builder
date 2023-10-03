import React, { memo } from 'react';
import apiLogo from '../../assets/icons/ph_link-bold.png';

//<input className="nodrag" type="color" onChange={data.onChange} defaultValue={data.color} />

export default memo(({ data, isConnectable }) => {

    return (
        <div>
            <div style={{ backgroundColor: data.color }} className={`nodeHeader`}>
                <div className='nodeHeaderDetails'>
                    <div style={{ fontWeight: "400" }}>API Request</div>
                </div>

            </div>
            <div className='nodeHeaderContent'>
                <div className='nodeHeaderContentDetails'>
                    <div style={{ fontSize: 10, color: "#ffffff70", flex: 1 }}>Builder</div>
                    <img style={{ height: 8 }} src={apiLogo} />
                </div>
                <div className='nodeHeaderContentDetails'>
                    <div style={{ fontSize: 8, fontWeight: "700", color: data.color }}>{data.method}</div>
                    <div style={{ fontSize: 10 }}>{data.host}{data.path.replace(/\//g, " / ")}</div>
                </div>
            </div>
        </div>
    )
})