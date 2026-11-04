'use client';

import { TreeNode, type TreeNodeData } from './tree-node';

interface TreeViewProps {
  data: TreeNodeData;
  title?: string;
}

export function TreeView({ data, title }: TreeViewProps) {
  return (
    <div className="w-full">
      {title && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#0b1b33] dark:text-white">
            {title}
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-2 font-medium">
            Explore the hierarchical network with interactive expanding nodes
          </p>
        </div>
      )}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-wrap gap-x-6 gap-y-2 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#16c75f]" />
            Confirmed Member
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            Not Confirmed
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-slate-300" />
            Leaf Node
          </div>
        </div>
        <div className="overflow-x-auto p-4">
          <TreeNode node={data} depth={0} />
        </div>
      </div>
    </div>
  );
}
