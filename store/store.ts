import { Node, Connection, OnConnect, Edge, applyNodeChanges, applyEdgeChanges, OnNodesChange, OnEdgesChange, addEdge } from 'reactflow';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { nodes, edges } from './data'
import { getLocalStorageData, setLocalStorage } from '@/lib/data-block.lib';

import { type FileBlockData } from '@/blocks/input/file-block'
import { type FilterBlockData } from '@/blocks/transform/filter-block';
import { type NodeTypes } from '@/blocks';

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
  createNode: (type: NodeTypes) => void;
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
    const filteredNodes = structuredClone(this.nodes)
    filteredNodes.forEach(({ data }) => {
      if ('fileData' in data) {
        data.fileData = null
      }
      if ('datasource' in data) {
        data.datasource = null
      }
      if ('column' in data) {
        data.column = null
      }
    })
    const data: WorkspaceType = {
      name: this.name,
      nodes: filteredNodes,
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
    console.log('setEdge', edges)
    set({ edges });
  },
  onConnect(connection: Connection) {
    console.log("connection", connection)
    const id = connection.source
    const targetNode = get().nodes.find(node => node.id == id)

    //source
    switch (targetNode?.type) {
      case "exampledata":
      case "filter":
      case 'filepicker': {
        const connectedNode = get().nodes.find(node => node.id == connection.target)

        switch (connectedNode?.type) {
          case 'filter': {
            const dataset = targetNode.data.fileData || []
            const colums = Object.keys(dataset.length ? dataset[0] : [])
            const newColums = colums.map(colum => {
              return {
                value: colum,
                label: colum
              }
            })

            set({
              nodes: get().nodes.map(node =>
                node.id === connectedNode.id
                  ? { ...node, data: { column: newColums, selectedColumn: newColums.length ? newColums[0]?.value : null, condition: null, datasource: dataset } }
                  : node
              ),
              // edges: addEdge(connection, get().edges),
            });
            // this.updateNode(connectedNode.id, { column: newColums, selectedColumn: null, condition: null })
          }
        }
        console.log("targetEdges-onConnect ", connectedNode)
        break;
      }
    }
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
      case 'exampledata': {
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
    console.log('onNodesChange', changes) // logic targeted area
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange(changes) {
    console.log('onEdgesChange', changes) // logic targeted area
    changes.forEach(change => {
      if (change.type === 'remove') {
        const edgeConnection = get().edges.find((edge) => edge.id == change.id)
        if (edgeConnection) {
          // console.log('idddEdge', edgeConnection)
          const id = edgeConnection.source
          const targetNode = get().nodes.find(node => node.id == id)

          //source
          switch (targetNode?.type) {
            case "exampledata":
            case "filter":
            case 'filepicker': {
              const connectedNode = get().nodes.find(node => node.id == edgeConnection.target)

              switch (connectedNode?.type) {
                case 'filter': {
                  get().updateNode(connectedNode.id, { column: null, selectedColumn: null, condition: null, datasource: undefined, fileData: null })
                }
              }
              console.log("targetEdges-onEdgesChange ", connectedNode)
              break;
            }
          }
        }

      }
    })

    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  addEdge(data) {
    const id = nanoid(6);
    console.log("addEdge", data)
    const edge = { ...data, id };

    set({ edges: [edge, ...get().edges] });
    connect(data.source, data.target);
  },

  // onEdgesDelete(deleted:Edge[]) {
  //   for ({ source, target } of deleted) {
  //     disconnect(source, target);
  //   }
  // },

  // onEdgesDelete:(edges:Edge[])=>{
  //   console.log("edgesss",edges)
  //   set({ edges });
  // },

  // onEdgeUpdate(oldEdge: Edge, newConnection: Connection ){

  // },

  deleteNode(id: string) {
    set({
      nodes: get().nodes.filter(node => node.id !== id)
    })
  },

  updateNode(id, data) {
    console.log('updateNode', id, data) // logic targeted area

    const targetNode = get().nodes.find(node => node.id == id)

    switch (targetNode?.type) {
      case "exampledata":
      case "filter":
      case 'filepicker': {
        //source
        const targetEdges = get().edges.filter(edge => edge.source == id)
        targetEdges.forEach((edge) => {
          const connectedNode = get().nodes.find(node => node.id == edge.target)

          switch (connectedNode?.type) {
            case 'filter': {
              const dataset = data.fileData || []
              const colums = Object.keys(dataset.length ? dataset[0] : [])
              const newColums = colums.map(colum => {
                return {
                  value: colum,
                  label: colum
                }
              })

              get().updateNode(connectedNode.id, { column: newColums, selectedColumn: null, condition: null, datasource: dataset, fileData: null })
            }
          }
        })
        // console.log("targetEdges",targetEdges)
        break;
      }
      // case 'filter': {
      //   const targetEdges = get().edges.filter(edge=>edge.target == id)
      //   console.log("targetEdges",targetEdges)
      //   break;
      // }
    }
    set({
      nodes: get().nodes.map(node =>
        node.id === id
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
      fileData: data.fileData ? data.fileData : []
    });
  },

  // removeNodes(nodes: Node[]) {
  //   for (const { id } of nodes) {
  //     removeFilterNode(id)
  //   }
  // },
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

export function connect(sourceId: string, targetId: string) {
  const source = customNodes.get(sourceId);
  const target = customNodes.get(targetId);

  source.connect(target);
}

export function disconnect(sourceId: string, targetId: string) {
  const source = customNodes.get(sourceId);
  const target = customNodes.get(targetId);

  source.disconnect(target);
}