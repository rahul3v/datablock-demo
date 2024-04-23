import { Panel, useStore } from 'reactflow';

export default function ViewportLogger() {
  const viewport = useStore(
    (s) =>
      `x: ${s.transform[0].toFixed(2)}, y: ${s.transform[1].toFixed(
        2,
      )}, zoom: ${s.transform[2].toFixed(2)}`,
  );

  return <Panel position="top-right" className='translate-y-12'>
    <div className='px-3 py-1 bg-white rounded-2xl text-black'>{viewport}</div>
  </Panel>;
}
