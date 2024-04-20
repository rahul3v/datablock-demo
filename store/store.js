import { applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
 
export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
 
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