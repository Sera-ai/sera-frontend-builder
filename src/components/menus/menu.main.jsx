import React, { memo } from 'react';
import Collapsible from 'react-collapsible';
import stringLogo from '../../assets/icons/tabler_text-recognition.svg';
import booleanLogo from '../../assets/icons/radix-icons_component-boolean.png';
import integerLogo from '../../assets/icons/tabler_decimal.svg';
import arrayLogo from '../../assets/icons/tabler_brackets-contain.svg';

import TreeView from './main/main.tree';

export default memo(({ oas }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };



  return (
    <aside>
      <Collapsible
        contentOuterClassName='nodeCategoryContainer'
        contentInnerClassName='nodeCategoryInner'
        triggerClassName='nodeCategoryText'
        triggerOpenedClassName='nodeCategoryText'
        trigger="API Builder"
        open
        transitionTime={100}>
        <div className='scrollContainer'>
          <TreeView oas={oas} />
        </div>
      </Collapsible>
      <Collapsible
        contentOuterClassName='nodeCategoryContainer'
        contentInnerClassName='nodeCategoryInner'
        triggerClassName='nodeCategoryText'
        triggerOpenedClassName='nodeCategoryText'
        trigger="Components"
        open
        transitionTime={100}>
        <Collapsible
          contentOuterClassName='nodeCategoryContainer'
          contentInnerClassName='nodeCategoryInner'
          triggerClassName='nodeCategoryText font-blue'
          triggerOpenedClassName='nodeCategoryText font-blue'
          trigger="Functions"
          open
          transitionTime={100}>
          <div className='scrollContainer'>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'stringNode')} draggable>
              <div>
                <img src={stringLogo} />
              </div>
              <div className='functionText'>
                <div className='nodeTitle'>Create String</div>
                <div className='nodeSubtitle'>String component to define a static string</div>
              </div>

            </div>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'integerNode')} draggable>
              <div>
                <img src={integerLogo} />
              </div>
              <div>
                <div className='nodeTitle'>Create integer</div>
                <div className='nodeSubtitle'>integer component to define a static integer</div>
              </div>
            </div>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'arrayNode')} draggable>
              <div>
                <img src={arrayLogo} />
              </div>
              <div>
                <div className='nodeTitle'>Create Array</div>
                <div className='nodeSubtitle'>Array component to define a static array</div>
              </div>
            </div>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'booleanNode')} draggable>
              <div>
                <img src={booleanLogo} />
              </div>
              <div className='functionText'>
                <div className='nodeTitle'>Create Boolean</div>
                <div className='nodeSubtitle'>Boolean component to define a static boolean</div>
              </div>
            </div>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'scriptNode')} draggable>
              <div>
                <img src={booleanLogo} />
              </div>
              <div>
                <div className='nodeTitle'>Create Script</div>
                <div className='nodeSubtitle'>Add Custom Script to your builder</div>
              </div>
            </div>
          </div>
        </Collapsible>
        <Collapsible
          contentOuterClassName='nodeCategoryContainer'
          contentInnerClassName='nodeCategoryInner'
          triggerClassName='nodeCategoryText font-green'
          triggerOpenedClassName='nodeCategoryText font-green'
          trigger="Plugins"
          transitionTime={100}>
          <div className='scrollContainer'>

          </div>
        </Collapsible>
        <Collapsible
          contentOuterClassName='nodeCategoryContainer'
          contentInnerClassName='nodeCategoryInner'
          triggerClassName='nodeCategoryText font-orange'
          triggerOpenedClassName='nodeCategoryText font-orange'
          trigger="Endpoints"
          transitionTime={100}>
          <div className='scrollContainer'>

          </div>
        </Collapsible>
      </Collapsible>

    </aside>
  );
});
