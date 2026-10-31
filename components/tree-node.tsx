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

  /* -------------------- THEME STYLES -------------------- */

  const rowTheme =
    node.status === 'confirmed'
      ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border-emerald-200 dark:border-emerald-800'
      : 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/40 dark:to-pink-950/40 border-red-200 dark:border-red-800';

  const levelBadgeMap: Record<number, string> = {
    1: 'bg-blue-100 text-blue-700',
    2: 'bg-indigo-100 text-indigo-700',
    3: 'bg-purple-100 text-purple-700',
    4: 'bg-pink-100 text-pink-700',
    5: 'bg-rose-100 text-rose-700',
    6: 'bg-orange-100 text-orange-700',
    7: 'bg-amber-100 text-amber-700',
    8: 'bg-yellow-100 text-yellow-700',
    9: 'bg-lime-100 text-lime-700',
    10: 'bg-emerald-100 text-emerald-700',
  };
  const levelRowBgMap: Record<number, string> = {
    1: 'bg-blue-50/60 dark:bg-blue-950/30',
    2: 'bg-indigo-50/60 dark:bg-indigo-950/30',
    3: 'bg-purple-50/60 dark:bg-purple-950/30',
    4: 'bg-pink-50/60 dark:bg-pink-950/30',
    5: 'bg-rose-50/60 dark:bg-rose-950/30',
    6: 'bg-orange-50/60 dark:bg-orange-950/30',
    7: 'bg-amber-50/60 dark:bg-amber-950/30',
    8: 'bg-yellow-50/60 dark:bg-yellow-950/30',
    9: 'bg-lime-50/60 dark:bg-lime-950/30',
    10: 'bg-emerald-50/60 dark:bg-emerald-950/30',
  };

  const levelBg =
    levelRowBgMap[node.level] ?? 'bg-slate-50 dark:bg-slate-900/40';

  const statusOverlay =
    node.status === 'confirmed'
      ? 'hover:ring-1 hover:ring-emerald-300/40 hover:bg-success/10'
      : 'hover:ring-1 hover:ring-rose-300/40 hover:bg-danger/10';


  return (
    <div>
      {/* NODE CARD */}
      {/* <div
        className={`flex items-center gap-3 py-3 px-4 rounded-xl border shadow-sm hover:shadow-md transition-all backdrop-blur-md ${rowTheme}`}
        style={{ paddingLeft: depth * 24 }}
      > */}
      <div
        className={`flex items-center gap-3 py-2 px-4 rounded-lg transition-all
    ${levelBg}
    ${statusOverlay}
    hover:shadow-sm
  `}
        style={{ paddingLeft: depth * 24 }}
      >

        {/* TOGGLE / LOADER */}
        <button
          onClick={handleToggle}
          className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"
        >
          {isLoading ? (
            <span className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
              <span className="font-semibold text-slate-800 dark:text-slate-100 truncate">
              {capitalizeSubstring(node.name)}
            </span>
               <div className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5"
          >
            {node.designation}
          </div>
            </div>
            

            {/* STATUS BADGE */}
            <span
              className={`px-2 py-0.3 text-[10px] rounded-full font-medium shadow-sm
                ${node.status === 'confirmed'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                  : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                }
              `}
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
        <div className="ml-4 pl-2 border-l border-slate-300 dark:border-slate-700">
          {!isLoading && children.length === 0 && (
            <p
              className="text-xs italic text-slate-500 dark:text-slate-400 py-2"
              style={{ paddingLeft: depth * 30 }}
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
