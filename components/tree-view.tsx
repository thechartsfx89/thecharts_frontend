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
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-emerald-600 to-blue-600 dark:from-blue-400 dark:via-emerald-400 dark:to-blue-400">
            {title}
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-2 font-medium">
            Explore the hierarchical network with interactive expanding nodes
          </p>
        </div>
      )}
      <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950/30 dark:to-emerald-950/30 border border-blue-200 dark:border-emerald-800 rounded-xl p-5 mb-6">
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">Confirmed Member</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-red-500 to-pink-500 shadow-md" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">Not Confirmed</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 dark:bg-blue-500" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">Leaf Node</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <TreeNode node={data} depth={0} />
        </div>
      </div>
    </div>
  );
}
