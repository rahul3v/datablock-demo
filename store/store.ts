import { Node, Edge, applyNodeChanges, applyEdgeChanges, OnNodesChange, OnEdgesChange } from 'reactflow';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { nodes, edges } from './data'

export type NodeType = 'filter' | 'filepicker'

export type WorkspaceType = {
  name: string,
  creationDate: number,
  updateDate: number,
  nodes: [],
  edges: []
}

export type RFState = {
  nodes: Node[];
  edges: Edge[];
  name: string;
  createdDate: number;
  updatedDate: number;
  darkmode: boolean;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setName: (name: string) => void;
  setNewWorkspace: () => void;
  loadNewWorkspace: (workspace: WorkspaceType) => void;
  createNode: (type: NodeType) => void;
  addEdge: (data: Edge) => void;
  deleteNode: (id: string) => void;
  updateNode: (id: string, data: Node) => void;
};

export const useStore = create<RFState>((set, get) => ({
  nodes: nodes,
  edges: edges,
  createdDate: Date.now(),
  updatedDate: Date.now(),
  name: 'data-flow',
  darkmode: true,

  setNewWorkspace() {
    set({
      name: 'data-flow',
      nodes: [],
      edges: [],
      createdDate: Date.now(),
      updatedDate: Date.now(),
    })
  },

  loadNewWorkspace(workspace: WorkspaceType) {
    set({
      ...workspace
    })
  },
  setName(name: string) {
    set({ name })
  },
  setNodes: (nodes: Node[]) => {
    set({ nodes });
  },
  setEdges: (edges: Edge[]) => {
    set({ edges });
  },

  createNode(type) {
    const id = nanoid();

    switch (type) {
      case 'filter': {
        const data = {
          selects: {
            'handle-0': 'smoothstep',
            'handle-1': 'smoothstep',
          },
        };
        const position = { x: -240, y: 400 };
        set({ nodes: [...get().nodes, { id, type, data, position }] });

        break;
      }
      case 'filepicker': {
        const data = {
          selects: {
            'handle-0': 'smoothstep',
            'handle-1': 'smoothstep',
          },
        };
        const position = { x: -140, y: 400 };
        set({ nodes: [...get().nodes, { id, type, data, position }] });

        break;
      }

    }
  },
  onNodesChange(changes) {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange(changes) {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  addEdge(data) {
    const id = nanoid(6);
    const edge = { ...data, id };

    set({ edges: [edge, ...get().edges] });
  },

  deleteNode(id: string) {
    set({
      nodes: get().nodes.filter(node => node.id !== id)
    })
  },

  updateNode(id, data) {
    set({
      nodes: get().nodes.map(node =>
        node.id === id
          ? { ...node, data: { ...node.data, ...data } }
          : node
      )
    });
  },

}));