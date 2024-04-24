import FileBlock from '@/blocks/input/file-block';
import FilterBlock from '@/blocks/transform/filter-block';
import ExportBlock from '@/blocks/output/export-block';
import ExampleDataBlock from '@/blocks/input/exampledata-block';

export const nodeTypes = {
  filepicker: FileBlock,
  filter: FilterBlock,
  exportfile: ExportBlock,
  exampledata: ExampleDataBlock
};

export type NodeTypes = keyof typeof nodeTypes
