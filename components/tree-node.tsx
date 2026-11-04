'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { mapReferralTree } from '@/utils/affiliate/mapReferralTree';
import { getImageUrl, getRandomColor, getTextColor } from '@/utils/common/common';
import { capitalizeFirstWord, capitalizeSubstring } from '@/utils/helpers/capitalize';
import Link from 'next/link';

export interface TreeNodeData {
  id: string;
  name: string;
  designation: string;
  level: number;
  status: 'confirmed' | 'not-confirmed';
  children?: TreeNodeData[];
  hasLoaded?: boolean;
  profile_image?: any;
  profile_img_path?: any;
}

interface TreeNodeProps {
  node: TreeNodeData;
  depth: number;
}

export function TreeNode({ node, depth }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(depth === 0);
  const [isLoading, setIsLoading] = useState(false);
  const [children, setChildren] = useState<TreeNodeData[]>(node.children || []);

  async function handleToggle() {
    setIsExpanded(!isExpanded);
    if (node.hasLoaded) return;

    try {
      setIsLoading(true);
      const res = await fetch(
        `/api/dash/affiliate/genealogy/${node.id}/${node.level}`,
        { credentials: 'include' }
      );

      const json = await res.json();

      if (!json?.data || json.data.count === 0) {
        setChildren([]);
        node.hasLoaded = true;
        return;
      }

      const mappedRoot = mapReferralTree(json.data);
      setChildren(mappedRoot.children || []);
      node.hasLoaded = true;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      {/* NODE CARD */}
      <div className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-slate-50 dark:hover:bg-white/5">

        {/* TOGGLE / LOADER */}
        <button
          type="button"
          aria-label={isExpanded ? "Collapse" : "Expand"}
          onClick={handleToggle}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/60 dark:hover:bg-white/10"
        >
          {isLoading ? (
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#16c75f] border-t-transparent" />
          ) : (
            <ChevronRight
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''
                }`}
            />
          )}
        </button>

        {/* CONTENT */}
        <div className="flex-1 min-w-0">
          <Link href={`/dash/admin/level-manager/${node?.id}`}
          title={`View details`}>
          <div className="flex items-center gap-2 flex-wrap">
            {(node?.profile_image?.url || node?.profile_img_path) ? (
              <img
                // src={getImageUrl(user?.profile_image?.url)}
                src={
                  node?.profile_image?.url
                    ? `${getImageUrl(node?.profile_image?.url)}?t=${Date.now()}`
                    : node?.profile_img_path ? `${process.env.NEXT_PUBLIC_PROFILE_IMG_URL}/uploads/${node?.profile_img_path}` : "/assets/images/fallback-profile.png"
                }
                className="h-10 w-10 rounded-full object-cover"
                alt=""
              />
            ) : (
              <div
                className="h-9 w-9 rounded-full flex items-center justify-center text-white font-bold text-[12px] uppercase"
                style={{ backgroundColor: getRandomColor(node?.id), color: getTextColor(getRandomColor(node?.id)) }}
              >
                {node?.name
                  ?.split(' ')
                  .map((name: any) => name[0])
                  .slice(0, 2)
                  .join('')}

              </div>
            )}
            <div className='flex flex-col min-w-0'>
              <span className="truncate text-sm font-semibold text-[#0b1b33] dark:text-slate-100">
              {capitalizeSubstring(node.name)}
            </span>
               <div className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400"
          >
            {node.designation}
          </div>
            </div>
            

            {/* STATUS BADGE */}
            <span
              className={`ml-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${node.status === 'confirmed' ? 'bg-[#e9f8ef] text-[#0e9f4a]' : 'bg-red-50 text-red-600'}`}
            >
              {node.status === 'confirmed' ? 'Active' : 'Inactive'}
            </span>

            {/* LEVEL BADGE */}
            {/* <span
              className={`px-2 py-0.3 text-[11px] rounded-full font-medium shadow-sm
                ${levelBadgeMap[node.level] ?? 'bg-gray-400 text-white'}
              `}
            >
              { node.level == 0 ? "Root" : `Level ${node.level}` }
            </span> */}
          </div>
          </Link>
         
        </div>
      </div>

      {/* CHILDREN */}
      {isExpanded && (
        <div className="ml-5 border-l border-slate-200 pl-3 dark:border-slate-700">
          {!isLoading && children.length === 0 && (
            <p
              className="text-xs italic text-slate-500 dark:text-slate-400 py-2"
              style={{ paddingLeft: 8 }}
            >
              No users found
            </p>
          )}

          {children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
