export type CanvasNodeData = {
  label?: string;
  color?: string;
  shape?: string;
};

export type CanvasNode = {
  id: string;
  position: { x: number; y: number };
  data: CanvasNodeData;
  type?: string;
};

export type CanvasEdge = {
  id: string;
  source: string;
  target: string;
  label?: string;
};

export type CanvasState = {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
};
