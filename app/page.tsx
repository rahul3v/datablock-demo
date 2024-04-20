//@ts-nocheck
'use client';

import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  Panel,
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
import { DataFileFormat, setLocalStorage, exportCsvData, exportJsonData } from '@/lib/data-block.lib';
import { MoonStar, Download } from 'lucide-react'
const nodeTypes = {
  custom: CustomNode,
  filepicker: FileBlock,
  filter: FilterBlock
};

const minimapStyle = {
  height: 100,
  width: 150
};

const DATA: DataFileFormat = {
  name: "",
  creationDate: "2022-03-19T06:38:18.468Z",
  updateDate: "2022-03-19T06:38:18.468Z",
  datablock: [{ a: 23, b: 45 }]
}

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
        <div><button>Workspace</button></div>
        <div>
          <button onClick={() => {
            setLocalStorage(DATA)
          }}>Save</button>
        </div>
        <div>
          <button>New</button>
        </div>
      </div>
      <div contentEditable className='focus:outline-none focus:underline' dangerouslySetInnerHTML={{ __html: "data flow" }}></div>
      <div className='flex gap-2 cursor-pointer'>
        <MoonStar size={20} />
      </div>
    </div>
    <div className='flow'>
      <div className='absolute top-4 left-4 px-2 py-1 rounded-xl border-violet-950 z-10 bg-indigo-800 cursor-pointer'>+ block</div>
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
        <Panel className={'space-x-4'} position="top-right">
          <button className={buttonStyle}>
            Add File
          </button>
          <button className={buttonStyle}>
            Add Filter
          </button>
        </Panel>
        <MiniMap style={minimapStyle} zoomable pannable />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
    <div className='results'>
      <div className='result-head flex gap-2 px-2 py-2 items-center'>
        <div> Export : </div>
        <button className={buttonStyle} onClick={() => {
          exportCsvData(DATA)
        }}>CSV</button>
        <button className={buttonStyle} onClick={() => {
          exportJsonData(DATA)
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
const DummyData = [{
  A: 1,
  B: 2,
  C: 4,
},
{
  A: 111,
  B: 211,
  C: 411,
}]

function Table() {
  const keys = Object.keys(DummyData[0])
  const rows = DummyData

  return <table className='text-left border border-collapse px-4'>
    <thead>
      <tr>
        {
          keys.map(key => {
            return <th className='w-10' key={key}>{key}</th>
          })
        }
      </tr>
    </thead>
    <tbody>
      {
        rows.map((row, i) => {
          return <tr key={i}>
            {keys.map(key => {
              return <td key={key}>{row[key]}</td>
            })
            }
          </tr>
        })
      }
    </tbody>
  </table>
}