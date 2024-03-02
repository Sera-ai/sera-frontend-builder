import React, { useCallback } from 'react';
import { useReactFlow } from 'reactflow';

export default function ContextMenu({ onDelete, id, top, left, right, bottom, ...props }) {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();
  const duplicateNode = useCallback(() => {
    console.log(id)
    const node = getNode(id);
    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    };

    addNodes({ ...node, id: `${node.id}-copy`, position });
  }, [id, getNode, addNodes]);

  function deleteNode() {
    const node = getNode(id);

    

    onDelete([node])
  }

  return (
    <div style={{ top, left, right, bottom, display: !id ? "none" : "initial", width: "150px" }} className="context-menu" {...props}>
      <p style={{ margin: '0.5em' }}>
        <small>node: {id}</small>
      </p>
      <button onClick={duplicateNode}>duplicate</button>
      <button onClick={deleteNode}>delete</button>
    </div>
  );
}
