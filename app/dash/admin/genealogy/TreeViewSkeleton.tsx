'use client';

export function TreeViewSkeleton() {
  return (
    <div className="w-full animate-pulse">
      
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-xl">
        
        <div className="pl-0 lg:pl-6 space-y-4">
          <div className="mb-6 space-y-3">
        <div className="h-8 w-64 rounded-xl bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-96 rounded-lg bg-slate-200 dark:bg-slate-700" />
      </div>
          <SkeletonRow />
          <div className="space-y-4">
            <SkeletonRow />
            <SkeletonRow />
          </div>
          <div className="space-y-4">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 py-2 px-4 rounded-lg bg-slate-100 dark:bg-slate-800">
      <div className="w-5 h-5 rounded-full bg-slate-300 dark:bg-slate-600" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-40 rounded bg-slate-300 dark:bg-slate-600" />
        <div className="h-3 w-28 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}
