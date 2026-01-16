import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from '@xyflow/react';

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  workflowHistory: any[]; // Define more specific type if known
  selectedNodes: string[];
  isRunning: boolean;
  runningNodes: Set<string>;

  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  addNode: (node: Partial<Node>) => void;
  updateNode: (nodeId: string, data: any) => void;
  deleteNode: (nodeId: string) => void;

  addToHistory: (run: any) => void;
  setRunningNodes: (nodeIds: string[]) => void;
  addRunningNode: (nodeId: string) => void;
  removeRunningNode: (nodeId: string) => void;
  setSelectedNodes: (nodeIds: string[]) => void;

  loadSampleWorkflow: () => void;
}

const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  workflowHistory: [],
  selectedNodes: [],
  isRunning: false,
  runningNodes: new Set(),

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes: NodeChange[]) => set({
    nodes: applyNodeChanges(changes, get().nodes),
  }),
  onEdgesChange: (changes: EdgeChange[]) => set({
    edges: applyEdgeChanges(changes, get().edges),
  }),
  onConnect: (connection: Connection) => set({
    edges: addEdge(connection, get().edges),
  }),

  addNode: (node) => set((state) => ({
    // @ts-ignore - uuidv4 return type vs string mismatch if strict
    nodes: [...state.nodes, { ...node, id: node.id || uuidv4() }] as Node[]
  })),

  updateNode: (nodeId, data) => set((state) => ({
    nodes: state.nodes.map(node =>
      node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
    )
  })),

  deleteNode: (nodeId) => set((state) => ({
    nodes: state.nodes.filter(node => node.id !== nodeId),
    edges: state.edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId)
  })),

  addToHistory: (run) => set((state) => ({
    workflowHistory: [{
      ...run,
      id: uuidv4(),
      timestamp: new Date().toISOString()
    }, ...state.workflowHistory]
  })),

  setRunningNodes: (nodeIds) => set({ runningNodes: new Set(nodeIds) }),

  addRunningNode: (nodeId) => set((state) => {
    const newSet = new Set(state.runningNodes);
    newSet.add(nodeId);
    return { runningNodes: newSet };
  }),

  removeRunningNode: (nodeId) => set((state) => {
    const newSet = new Set(state.runningNodes);
    newSet.delete(nodeId);
    return { runningNodes: newSet };
  }),

  setSelectedNodes: (nodeIds) => set({ selectedNodes: nodeIds }),

  loadSampleWorkflow: () => {
    const sampleNodes: Node[] = [
      // Branch A: Image Processing
      {
        id: 'upload-image-1',
        type: 'uploadImage',
        position: { x: 100, y: 100 },
        data: { label: 'Upload Product Image', imageUrl: null }
      },
      {
        id: 'crop-image-1',
        type: 'cropImage',
        position: { x: 350, y: 100 },
        data: { label: 'Crop Product Photo', xPercent: 10, yPercent: 10, widthPercent: 80, heightPercent: 80 }
      },
      {
        id: 'text-system-1',
        type: 'text',
        position: { x: 100, y: 300 },
        data: { label: 'System Prompt', text: 'You are a professional marketing copywriter. Generate a compelling one-paragraph product description.' }
      },
      {
        id: 'text-product-1',
        type: 'text',
        position: { x: 100, y: 450 },
        data: { label: 'Product Details', text: 'Product: Wireless Bluetooth Headphones. Features: Noise cancellation, 30-hour battery, foldable design.' }
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 600, y: 250 },
        data: { label: 'Generate Product Description', model: 'gemini-2.0-flash', result: null }
      },
      // Branch B: Video Processing
      {
        id: 'upload-video-1',
        type: 'uploadVideo',
        position: { x: 100, y: 650 },
        data: { label: 'Upload Demo Video', videoUrl: null }
      },
      {
        id: 'extract-frame-1',
        type: 'extractFrame',
        position: { x: 350, y: 650 },
        data: { label: 'Extract Frame', timestamp: '50%' }
      },
      // Convergence
      {
        id: 'text-final-system',
        type: 'text',
        position: { x: 600, y: 550 },
        data: { label: 'Final System Prompt', text: 'You are a social media manager. Create a tweet-length marketing post based on the product image and video frame.' }
      },
      {
        id: 'llm-2',
        type: 'llm',
        position: { x: 900, y: 450 },
        data: { label: 'Final Marketing Post', model: 'gemini-2.0-flash', result: null }
      }
    ];

    const sampleEdges: Edge[] = [
      // Branch A connections
      { id: 'e1', source: 'upload-image-1', target: 'crop-image-1', sourceHandle: 'output', targetHandle: 'image_url', animated: true, style: { stroke: '#D946EF' } },
      { id: 'e2', source: 'crop-image-1', target: 'llm-1', sourceHandle: 'output', targetHandle: 'images', animated: true, style: { stroke: '#2DD4BF' } },
      { id: 'e3', source: 'text-system-1', target: 'llm-1', sourceHandle: 'output', targetHandle: 'system_prompt', animated: true, style: { stroke: '#D946EF' } },
      { id: 'e4', source: 'text-product-1', target: 'llm-1', sourceHandle: 'output', targetHandle: 'user_message', animated: true, style: { stroke: '#2DD4BF' } },
      // Branch B connections
      { id: 'e5', source: 'upload-video-1', target: 'extract-frame-1', sourceHandle: 'output', targetHandle: 'video_url', animated: true, style: { stroke: '#D946EF' } },
      // Convergence connections
      { id: 'e6', source: 'llm-1', target: 'llm-2', sourceHandle: 'output', targetHandle: 'user_message', animated: true, style: { stroke: '#D946EF' } },
      { id: 'e7', source: 'text-final-system', target: 'llm-2', sourceHandle: 'output', targetHandle: 'system_prompt', animated: true, style: { stroke: '#2DD4BF' } },
      { id: 'e8', source: 'crop-image-1', target: 'llm-2', sourceHandle: 'output', targetHandle: 'images', animated: true, style: { stroke: '#3B82F6' } },
      { id: 'e9', source: 'extract-frame-1', target: 'llm-2', sourceHandle: 'output', targetHandle: 'images', animated: true, style: { stroke: '#3B82F6' } }
    ];

    set({ nodes: sampleNodes, edges: sampleEdges });
  }
}));

export default useWorkflowStore;