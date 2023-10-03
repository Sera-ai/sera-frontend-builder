import React, { memo } from 'react';
import '../../../assets/css/tree.css'
import { generateRandomString } from '../../../helpers/helper.node';


export default memo(({oas}) => {
    return <OasParser oasData={oas} />
})

function parseOasPaths(paths) {
    const result = {};
    for (const path in paths) {
        const parts = path.split('/').filter(Boolean);
        let currentLevel = result;
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (!currentLevel[part]) {
                currentLevel[part] = {
                    methods: [],
                    children: {}
                };
            }
            if (i === parts.length - 1) { // If it's the last part of the path
                for (const method in paths[path]) {
                    currentLevel[part].methods.push(method);
                }
            } else {
                currentLevel = currentLevel[part].children;
            }
        }
    }
    return result;
}

function Method({ path, type, host }) {
    const colorClass = `${type.toUpperCase()}-color`;
    const methodId = `/${host}/${path}/${type}`.replace(/[ <>#"%'{}|\\^~\[\]`]/g, '');
    return (
        <li>
            <div className={`title ${colorClass}`} id={methodId}>
                <div className="fill"></div>
                <a href={methodId}>{type.toUpperCase()}</a>
            </div>
        </li>
    );
}


function Endpoint({ path, name, data, host }) {
    const random = generateRandomString();
    return (
        <li>
            <input id={`${name}-${random}`} type="checkbox" />
            <label htmlFor={`${name}-${random}`}>{name}</label>
            <ul>
                {data.methods && data.methods.map(method => (
                    <Method key={method} host={host} path={path} type={method} />
                ))}
                {Object.entries(data.children).map(([childName, childData]) => (
                    <Endpoint key={childName} host={host} path={`${path}/${childName}`} name={childName} data={childData} />
                ))}
            </ul>
        </li>
    );
}


function OasParser({ oasData }) {
    const { host, paths, servers } = oasData;
    const displayHost = host ? host : (servers && servers[0] ? servers[0].url : "");
    const parsedHost = new URL(displayHost).host
    const parsedPaths = parseOasPaths(paths);

    return (
        <ul>
            <li>{parsedHost}
                <ul>
                    {Object.entries(parsedPaths).map(([pathName, pathData]) => (
                        <Endpoint key={pathName} host={parsedHost} path={pathName} name={pathName} data={pathData} />
                    ))}
                </ul>
            </li>
        </ul>
    );
}



