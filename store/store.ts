import { Node, Connection, OnConnect, Edge, applyNodeChanges, applyEdgeChanges, OnNodesChange, OnEdgesChange, addEdge } from 'reactflow';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { nodes, edges } from './data'
import { getLocalStorageData, setLocalStorage } from '@/lib/data-block.lib';

import { type FileBlockData } from '@/blocks/input/file-block'
import { type FilterBlockData } from '@/blocks/transform/filter-block';

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
  fileData: { [key: string]: string }[];
  setFileData: (data: { [key: string]: string }[]) => void;
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
  updateNode: (id: string, data: FileBlockData | FilterBlockData) => void;
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
  fileData: [],

  setFileData(data) {
    set({ fileData: data })
  },

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
    let selectedWorkspace = this.selectedWorkspace
    // if workspace is new
    if (this.isNew) {

      // check if workspace already exists
      if (workspaces) {
        workspaces.push(data)
        selectedWorkspace = workspaces.length - 1
        setLocalStorage(workspaces)
      } else {
        selectedWorkspace = 0
        setLocalStorage([data])
      }
    } else {
      if (workspaces) {
        workspaces[selectedWorkspace] = data
        setLocalStorage(workspaces)
      } else {
        setLocalStorage([data])
      }
    }

    set({ isNew: false, selectedWorkspace })
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
        data = <FilterBlockData>{
          condition: null,
          column: null,
        };
        break;
      }
      case 'filepicker': {
        data = <FileBlockData>{
          fileData: null
        };
        break;
      }
      case 'exportfile': {
        data = {

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
    connect(data.source, data.target);
  },

  // onEdgesDelete(deleted:Edge[]) {
  //   for ({ source, target } of deleted) {
  //     disconnect(source, target);
  //   }
  // },
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
      ),
      fileData: data.fileData ? data.fileData : []
    });
  },

  removeNodes(nodes: Node[]) {
    for (const { id } of nodes) {
      removeFilterNode(id)
    }
  },
}));


const customNodes = new Map();

export function updateFilterNode(id: string, data: FilterBlockData) {
  const node = customNodes.get(id);

  for (const [key, val] of Object.entries(data)) {
    if (node[key] instanceof AudioParam) {
      node[key].value = val;
    } else {
      node[key] = val;
    }
  }
}

export function removeFilterNode(id: string) {
  const node = customNodes.get(id);

  node.disconnect();
  node.stop?.();

  customNodes.delete(id);
}

export function connect(sourceId:string, targetId:string) {
  const source = customNodes.get(sourceId);
  const target = customNodes.get(targetId);
 
  source.connect(target);
}

export function disconnect(sourceId:string, targetId:string) {
  const source = customNodes.get(sourceId);
  const target = customNodes.get(targetId);

  source.disconnect(target);
}