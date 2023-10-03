import React, { memo } from 'react';

export default memo(({ data, color }) => {
    if (data == 0) {
        return null
    } else {

        return (
            <div style={{ borderWidth: 1, borderStyle: "solid", borderColor: color }} className={`nodeTag ${tagData(data)}`}>
                <a>{tagData(data)}</a>
            </div>
        )
    }
})

const tagData = (data) => {
    switch (data) {
        case 1: return "client";
        case 2: return "request";
        case 3: return "response";
        case 4: return "client";
    }
}