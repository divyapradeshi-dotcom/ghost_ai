"use client";

import React from "react";
import { ReactFlow, MiniMap } from "@xyflow/react";
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow";
import "@xyflow/react/dist/style.css";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-flow/styles.css";

export default function CanvasFlow() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    });

  return (
    <div style={{ width: "100%", height: "100%" }} className="relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        fitView
      >
        <MiniMap />
        <Cursors />
      </ReactFlow>
    </div>
  );
}
