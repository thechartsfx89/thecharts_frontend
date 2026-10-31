
// 'use client';

// import { useEffect, useState } from 'react';
// import IconBell from '@/components/icon/icon-bell';
// import { TreeView } from '@/components/tree-view';
// import type { TreeNodeData } from '@/components/tree-node';
// import { mapReferralTree } from '@/utils/affiliate/mapReferralTree';
// import { TreeViewSkeleton } from './TreeViewSkeleton';
// import { useSession } from 'next-auth/react';

// export default function Home() {
//   const [treeData, setTreeData] = useState<TreeNodeData | null>(null);
//   const [loading, setLoading] = useState(true);

//   const { data: session, status } = useSession();

//   useEffect(() => {
//     if (!session?.user?.id) return;

//     async function fetchTree() {
//       try {
//         setLoading(true);

//         const res = await fetch(
//           `/api/dash/affiliate/geneology/${session.user.id}/1`,
//           {
//             method: 'GET',
//             credentials: 'include',
//           }
//         );

//         const json = await res.json();
//         const mappedTree = mapReferralTree(json.data);
//         setTreeData(mappedTree);
//       } catch (error) {
//         console.error('Failed to load referral tree', error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchTree();
//   }, [session]);

//   return (
//     <main>
//       <div className="panel flex items-center p-3 text-primary">
//         <div className="mr-3 rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30">
//           <IconBell />
//         </div>
//         <span>Genealogy</span>
//       </div>

//       <div className="mx-auto mt-6 max-w-full">
//         {/* ⏳ Session loading */}
//         {status === 'loading' && <TreeViewSkeleton />}

//         {/* ❌ No session */}
//         {status === 'unauthenticated' && (
//           <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-10 text-center">
//             <h3 className="mb-2 text-lg font-semibold text-gray-700">
//               Session Expired
//             </h3>
//             <p className="text-sm text-gray-500">
//               Please login to view your genealogy tree.
//             </p>
//           </div>
//         )}

//         {/* 🌳 Data loading */}
//         {status === 'authenticated' && loading && <TreeViewSkeleton />}

//         {/* ✅ Tree */}
//         {status === 'authenticated' && !loading && treeData && (
//           <TreeView data={treeData} />
//         )}
//       </div>
//     </main>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import IconBell from '@/components/icon/icon-bell';
import { TreeView } from '@/components/tree-view';
import type { TreeNodeData } from '@/components/tree-node';
import { mapReferralTree } from '@/utils/affiliate/mapReferralTree';
import { TreeViewSkeleton } from './TreeViewSkeleton';
import { useSession } from 'next-auth/react';

export default function Home() {
  const [treeData, setTreeData] = useState<TreeNodeData | null>(null);
  const [loading, setLoading] = useState(true);

  const { data: session, status } = useSession();
  const userId = session?.user?.id; // ✅ stable dependency

  useEffect(() => {
    if (!userId) return;

    async function fetchTree() {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/dash/affiliate/genealogy/${userId}/1`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        const json = await res.json();
        const mappedTree = mapReferralTree(json.data);
        setTreeData(mappedTree);
      } catch (error) {
        console.error('Failed to load referral tree', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTree();
  }, [userId]); // ✅ only depends on ID

  return (
    <main>
      <div className="panel flex items-center p-3 text-primary">
        <div className="mr-3 rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30">
          <IconBell />
        </div>
        <span className='font-bold'>Genealogy</span>
      </div>

      <div className="mx-auto mt-6 max-w-full">
        {status === 'loading' && <TreeViewSkeleton />}

        {status === 'unauthenticated' && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-10 text-center">
            <h3 className="mb-2 text-lg font-semibold text-gray-700">
              Session Expired
            </h3>
            <p className="text-sm text-gray-500">
              Please login to view your genealogy tree.
            </p>
          </div>
        )}

        {status === 'authenticated' && loading && <TreeViewSkeleton />}

        {status === 'authenticated' && !loading && treeData && (
          <TreeView data={treeData} />
        )}
      </div>
    </main>
  );
}
