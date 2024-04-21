//@ts-nocheck
'use client';

import React from 'react';
import ReactFlow, {
  Panel,
  MiniMap,
  Controls,
  Background,
} from 'reactflow';

import CustomNode from '@/blocks/nodes/CustomNode';
import FileBlock from '@/blocks/input/file-block';
import FilterBlock from '@/blocks/transform/filter-block';

import 'reactflow/dist/style.css';
import '@/style/overview.css';
import '@/style/interface.css';
import { setLocalStorage, exportCsvData, exportJsonData } from '@/lib/data-block.lib';
import { MoonStar, Download } from 'lucide-react'
import { Table, Blocks, Workspace, WORKSPACE } from '@/components'

import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@/store/store';
import { FileName } from '@/components/FileName';

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
const selector = (store) => ({
  nodes: store.nodes,
  edges: store.edges,
  name: store.name,
  onNodesChange: store.onNodesChange,
  onEdgesChange: store.onEdgesChange,
  addEdge: store.addEdge,
  setName: store.setName,
  addFilter: () => store.createNode('filter'),
  addFile: () => store.createNode('filepicker')
});

const OverviewFlow = () => {
  const store = useStore(useShallow(selector));

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
      <FileName/>
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
        nodes={store.nodes}
        edges={store.edges}
        onNodesChange={store.onNodesChange}
        onEdgesChange={store.onEdgesChange}
        onConnect={store.addEdge}
        proOptions={{ hideAttribution: true }}
        fitView
        nodeTypes={nodeTypes}
      >
        <Panel position="top-right" className={'space-x-4'} >
          <button className={buttonStyle} onClick={store.addFile}>
            Add File
          </button>
          <button className={buttonStyle} onClick={store.addFilter}>
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