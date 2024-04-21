import { Node, Connection, OnConnect, Edge, applyNodeChanges, applyEdgeChanges, OnNodesChange, OnEdgesChange, addEdge } from 'reactflow';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { nodes, edges } from './data'
import { getLocalStorageData, setLocalStorage } from '@/lib/data-block.lib';

export type NodeType = 'filter' | 'filepicker' | 'exportfile'

export type WorkspaceType = {
  name: string,
  creationDate: number,
  updateDate: number,
  nodes: Node[],
  edges: Edge[]
}
export const WORKSPACE_KEY = 'workspace'

export type RFState = {
  nodes: Node[];
  edges: Edge[];
  name: string;
  createdDate: number;
  updatedDate: number;
  isNew: boolean;
  darkmode: boolean;
  selectedWorkspace: number;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setName: (name: string) => void;
  setNewWorkspace: () => void;
  saveWorkspace: () => void;
  loadNewWorkspace: (workspace: WorkspaceType, id: number) => void;
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
  isNew: false,
  selectedWorkspace: 0,

  setNewWorkspace() {
    set({
      name: `data-flow-${Date.now()}`,
      nodes: [],
      edges: [],
      createdDate: Date.now(),
      updatedDate: Date.now(),
      isNew: true,
    })
  },

  saveWorkspace() {
    const data: WorkspaceType = {
      name: this.name,
      nodes: this.nodes,
      edges: this.edges,
      creationDate: this.createdDate,
      updateDate: Date.now()
    }
    const workspaces = getLocalStorageData(WORKSPACE_KEY)
    // if workspace is new
    if (this.isNew) {

      // check if workspace already exists
      if (workspaces) {
        workspaces.push(data)
        setLocalStorage(workspaces)
      } else {
        setLocalStorage([data])
      }
    } else {
      if (workspaces) {
        workspaces[this.selectedWorkspace] = data
        setLocalStorage(workspaces)
      } else {
        setLocalStorage([data])
      }
    }

    set({ isNew: false })
  },

  loadNewWorkspace(workspace, id) {
    set({
      ...workspace,
      isNew: false,
      selectedWorkspace: id
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
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  createNode(type) {
    const id = nanoid();
    const position = { x: -240, y: 400 };
    let data = {}
    switch (type) {
      case 'filter': {
        data = {
          selects: {
            'handle-0': 'smoothstep',
            'handle-1': 'smoothstep',
          },
        };
        break;
      }
      case 'filepicker': {
        data = {
          selects: {
            'handle-0': 'smoothstep',
            'handle-1': 'smoothstep',
          },
        };
        break;
      }
      case 'exportfile': {
        data = {
          selects: {
            'handle-0': 'smoothstep',
          },
        };

        break;
      }
    }
    set({ nodes: [...get().nodes, { id, type, data, position }] });
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