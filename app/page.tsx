'use client';

import React from 'react';
import ReactFlow, {
  Panel,
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider,
} from 'reactflow';

import FileBlock from '@/blocks/input/file-block';
import FilterBlock from '@/blocks/transform/filter-block';
import ExportBlock from '@/blocks/output/export-block';

import 'reactflow/dist/style.css';
import '@/style/overview.css';
import '@/style/interface.css';
import { exportCsvData, exportJsonData } from '@/lib/data-block.lib';
import { MoonStar } from 'lucide-react'
import { Blocks, Workspace, SelectionDataDisplay } from '@/components'

import { useShallow } from 'zustand/react/shallow';
import { type RFState, useStore } from '@/store/store';
import { FileName } from '@/components/FileName';
import NewFile from '@/components/NewFile';
import SaveFile from '@/components/SaveFile';
import { HistoryUi } from '@/components/appui/HistoryUi';
import ExportFile from '@/components/ExportFile';

const nodeTypes = {
  filepicker: FileBlock,
  filter: FilterBlock,
  exportfile: ExportBlock,
};

const minimapStyle = {
  height: 100,
  width: 150
};

const DATA = [{ a: 23, b: 45 }]

const buttonStyle = `px-3 py-1 rounded-xl border-violet-950 z-10 bg-indigo-800 cursor-pointer opacity-80 duration-200 hover:opacity-100 shadow`

const selector = (store: RFState) => ({
  nodes: store.nodes,
  edges: store.edges,
  name: store.name,
  onNodesChange: store.onNodesChange,
  onEdgesChange: store.onEdgesChange,
  onConnect: store.onConnect,
  addEdge: store.addEdge,
  setName: store.setName,
  addFilter: () => store.createNode('filter'),
  addFile: () => store.createNode('filepicker'),
  addExportFile: () => store.createNode('exportfile')
});

const OverviewFlow = () => {
  const store = useStore(useShallow(selector));

  return (
    <ReactFlowProvider>
      <div className='board'>
        <div className='header justify-between'>
          <div className='flex gap-4'>
            <div><Workspace /></div>
            <div>
              <SaveFile />
            </div>
            <div>
              <NewFile />
            </div>
          </div>
          <FileName />
          <div className='flex gap-4'>
            <ExportFile />
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
            onConnect={store.onConnect}
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
              <button className={buttonStyle} onClick={store.addExportFile}>
                Add Export
              </button>
            </Panel>
            <Panel position="bottom-left" className={'space-x-4 translate-x-12'} >
              <HistoryUi />
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
            <SelectionDataDisplay />
          </div>
        </div>
      </div>
    </ReactFlowProvider>);
};

export default OverviewFlow;