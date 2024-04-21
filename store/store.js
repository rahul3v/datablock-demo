import { applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { nodes, edges } from './data'

export const useStore = create((set, get) => ({
  nodes: nodes,
  edges: edges,
  name: 'data-flow',

  setName(name) {
    set({ name })
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
    const edge = { id, ...data };

    set({ edges: [edge, ...get().edges] });
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