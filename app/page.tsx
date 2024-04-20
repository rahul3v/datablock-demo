//@ts-nocheck
'use client';

import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  updateEdge
} from 'reactflow';

import { nodes as initialNodes, edges as initialEdges } from '@/store/data';
import CustomNode from '@/blocks/nodes/CustomNode';
import FileBlock from '@/blocks/input/file-block';
import FilterBlock from '@/blocks/transform/filter-block';

import 'reactflow/dist/style.css';
import '@/style/overview.css';
import '@/style/interface.css';
import { setLocalStorage, exportCsvData, exportJsonData } from '@/lib/data-block.lib';
import { MoonStar, Download } from 'lucide-react'
import { Table, Blocks, Workspace, WORKSPACE } from '@/components'

const nodeTypes = {
  custom: CustomNode,
  filepicker: FileBlock,
  filter: FilterBlock
};

const minimapStyle = {
  height: 100,
  width: 150
};

const DATA = [{ a: 23, b: 45 }]
const SELECTED = 0

const buttonStyle = `px-3 py-1 rounded-xl border-violet-950 z-10 bg-indigo-800 cursor-pointer opacity-80 duration-200 hover:opacity-100 shadow`

const OverviewFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), []);
  const edgeUpdateSuccessful = useRef(true);

  // we are using a bit of a shortcut here to adjust the edge type
  // this could also be done with a custom edge for example
  const edgesWithUpdatedTypes = edges.map((edge) => {
    if (edge.sourceHandle) {
      const customType = nodes.find((node) => node.type === 'custom')
      if (customType) {
        const edgeType = customType.data.selects[edge.sourceHandle];
        edge.type = edgeType;
      }
    }

    return edge;
  });

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    edgeUpdateSuccessful.current = true;
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  }, []);

  const onEdgeUpdateEnd = useCallback((_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeUpdateSuccessful.current = true;
  }, []);

  return (<div className='board'>
    <div className='header justify-between'>
      <div className='flex gap-2'>
        <div><Workspace /></div>
        <div>
          <button onClick={() => {
            setLocalStorage(WORKSPACE)
          }}>Save</button>
        </div>
        <div>
          <button>New</button>
        </div>
      </div>
      <div contentEditable className='focus:outline-none focus:underline' dangerouslySetInnerHTML={{ __html: "data flow" }}></div>
      <div className='flex gap-4'>
        <div className='flex gap-1 cursor-pointer' onClick={() => {
          exportJsonData(WORKSPACE[SELECTED], 'workspace')
        }}>
          <div>
            <Download size={16} />
          </div>
          <div>Export</div>
        </div>
        <div className='cursor-pointer'>
          <MoonStar size={16} />
        </div>
      </div>
    </div>
    <div className='flow'>
      <Blocks />
      <ReactFlow
        nodes={nodes}
        edges={edgesWithUpdatedTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgeUpdate={onEdgeUpdate}
        onEdgeUpdateStart={onEdgeUpdateStart}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
        onConnect={onConnect}
        fitView
        proOptions={{ hideAttribution: true }}
        nodeTypes={nodeTypes}
      >
        <MiniMap style={minimapStyle} zoomable pannable />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
    <div className='results'>
      <div className='result-head flex gap-2 px-2 py-2 items-center'>
        <div> Export : </div>
        <button className={buttonStyle} onClick={() => {
          exportCsvData(DATA, 'data')
        }}>CSV</button>
        <button className={buttonStyle} onClick={() => {
          exportJsonData(DATA, 'data')
        }}>JSON</button>
      </div>
      <div className='result-table p-2'>
        <Table />
      </div>
    </div>
  </div>
  );
};

export default OverviewFlow;