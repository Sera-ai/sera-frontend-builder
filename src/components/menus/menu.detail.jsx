import React, { memo, useState } from 'react';
import apiLogo from '../../assets/icons/tabler_api.svg';
import playLogo from '../../assets/icons/tabler_player-play.svg';
import copyLogo from '../../assets/icons/tabler_copy.svg';
import deleteLogo from '../../assets/icons/tabler_trash.svg';

import integerLogo from '../../assets/icons/tabler_decimal.svg';
import stringLogo from '../../assets/icons/tabler_text-recognition.svg';
import arrayLogo from '../../assets/icons/tabler_brackets-contain.svg';
import booleanLogo from '../../assets/icons/radix-icons_component-boolean.png';

import DetailParameters from './detail/detail.parameters';

export default memo(({ nodeDetails, nodes, edges }) => {

  const [selectedHeader, setHeader] = useState(0);
  const nodeData = getData(nodeDetails)
  const navItems = ['Details', 'Parameters'];

  const getDetailMenuItem = () => {
    switch (selectedHeader) {
      case 0: return null;
      case 1: return <DetailParameters nodeDetails={nodeDetails} nodes={nodes} edges={edges} />;
      case 2: return null;
      case 3: return null;
    }
  }
  return
  return (
    <aside className='detailsMenu'>
      <div className='detailsOverview'>
        <div className='detailsOverviewHeader'>
          <div>
            <img src={nodeData?.logo} />
          </div>
          <div style={{ flex: 1 }} className='functionText'>
            <div className='nodeTitle'>{nodeData?.header[0]}</div>
            <div className='nodeSubtitle'>{nodeData?.header[1]}</div>
          </div>
          <div className='debugButtonContainer'>
            <div className='nodeSubtitle'>Debug</div>
            <img src={playLogo} />
          </div>
        </div>
        <div className='detailsAction'>
          <img src={copyLogo} />
          <img src={deleteLogo} />
        </div>
      </div>
      <div className='detailsNavBar'>
        <div className='detailsNavBarContainer'>
          {navItems.map((label, index) => (
            <div
              key={index}
              onClick={() => setHeader(index)}
              className={`navBarFont ${selectedHeader === index ? 'navselect' : ""}`}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
      {getDetailMenuItem()}

    </aside>
  );
});




const getData = (node) => {
  switch (node.type) {
    case "apiNode": return { header: getHeaderAPI(node), logo: apiLogo };
    case "functionNode": return { header: getHeaderFunc(node), logo: getHeaderFunc(node)[2] };
  }
}

const getHeaderAPI = (node) => {
  switch (node.data.headerType) {
    case 1: return ["Client", "Incoming request receive node"]
    case 2: return ["Request", "Incoming request send node"]
    case 3: return ["Response", "Response data received node"]
    case 4: return ["Client", "Return data to client node"]
  }
}

const getHeaderFunc = (node) => {
  switch (node.data.function) {
    case "integer": return ["Integer", "Set a integer Value", integerLogo]
    case "string": return ["String", "Set a String Value", stringLogo]
    case "array": return ["Array", "Set a Array Value", arrayLogo]
    case "boolean": return ["Boolean", "Set a Boolean Value", booleanLogo]
  }
}
