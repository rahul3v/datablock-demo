import {
  useState,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
  HTMLAttributes,
} from 'react';
import { Panel } from 'reactflow';

import NodeInspector from './NodeInspector';
import ChangeLogger from './ChangeLogger';
import ViewportLogger from './ViewportLogger';
import EdgeInspector from './EdgeInspector';

export default function DevTools() {
  const [nodeInspectorActive, setNodeInspectorActive] = useState(false);
  const [edgeInspectorActive, setEdgeInspectorActive] = useState(false);
  const [changeLoggerActive, setChangeLoggerActive] = useState(false);
  const [viewportLoggerActive, setViewportLoggerActive] = useState(false);

  return (
    <div className="react-flow__devtools">
      <Panel position="bottom-right" className='flex gap-4 translate-x-[-10rem]'>
        <DevToolButton
          setActive={setNodeInspectorActive}
          active={nodeInspectorActive}
          title="Toggle Node Inspector"
        >
          Node Inspector
        </DevToolButton>
        <DevToolButton
          setActive={setEdgeInspectorActive}
          active={edgeInspectorActive}
          title="Toggle Node Inspector"
        >
          Edge Inspector
        </DevToolButton>
        <DevToolButton
          setActive={setChangeLoggerActive}
          active={changeLoggerActive}
          title="Toggle Change Logger"
        >
          Change Logger
        </DevToolButton>
        <DevToolButton
          setActive={setViewportLoggerActive}
          active={viewportLoggerActive}
          title="Toggle Viewport Logger"
        >
          Viewport Logger
        </DevToolButton>
      </Panel>
      {changeLoggerActive && <ChangeLogger />}
      {nodeInspectorActive && <NodeInspector />}
      {edgeInspectorActive && <EdgeInspector />}
      {viewportLoggerActive && <ViewportLogger />}
    </div>
  );
}
const buttonStyle = `px-2 py-1 w-full text-[10px] rounded-xl text-white	cursor-pointer whitespace-nowrap`

function DevToolButton({
  active,
  setActive,
  children,
  ...rest
}: {
  active: boolean;
  setActive: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
} & HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      onClick={() => setActive((a) => !a)}
      className={`${buttonStyle} ${active ? 'bg-rose-500' : 'bg-rose-900'}`}
      {...rest}
    >
      {children}
    </button>
  );
}
