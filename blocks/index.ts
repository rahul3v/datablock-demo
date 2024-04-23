import FileBlock from '@/blocks/input/file-block';
import FilterBlock from '@/blocks/transform/filter-block';
import ExportBlock from '@/blocks/output/export-block';

export const nodeTypes = {
  filepicker: FileBlock,
  filter: FilterBlock,
  exportfile: ExportBlock,
};

export type NodeTypes = keyof typeof nodeTypes
