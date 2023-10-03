import React, { useCallback } from 'react';
import { useReactFlow } from 'reactflow';

import addLogo from '../../assets/icons/material-symbols_add.svg';

import '../../assets/css/pane.css'

export default function PaneMenu({ id, top, left, right, bottom, ...props }) {
    const { getNode, setNodes, addNodes, setEdges } = useReactFlow();

    /*const duplicateNode = useCallback(() => {
      console.log(id)
      const node = getNode(id);
      const position = {
        x: node.position.x + 50,
        y: node.position.y + 50,
      };
  
      addNodes({ ...node, id: `${node.id}-copy`, position });
    }, [id, getNode, addNodes]);*/


    return (
        <div style={{ top, left, right, bottom }} className="paneMenu" {...props}>
            <div className='paneTitle'>
                <div className='paneTitleGroup'>
                    <img src={addLogo} />
                    <div className='paneTitleText'>Add Node</div>
                </div>
            </div>
            <div className='paneFilter'>
                <input onClickCapture={(e) => e.preventDefault()} onClick={(e) => e.preventDefault()} className='paneFilterTextBox' placeholder='Type to filter' />
            </div>
            
            <div className='paneResult'>
                API - GET - https://example.com - v1/accounts/myProfile
            </div>
            <div className='paneResult'>
                API - GET - https://example.com - v1/accounts/myProfile
            </div>
            <div className='paneResult'>
                API - GET - https://example.com - v1/accounts/myProfile
            </div>
            <div className='paneResult'>
                API - GET - https://example.com - v1/accounts/myProfile
            </div>
        </div>
    );
}
