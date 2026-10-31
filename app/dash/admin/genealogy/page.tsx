

'use client';

import { Fragment, useEffect, useState } from 'react';
import IconBell from '@/components/icon/icon-bell';
import { TreeView } from '@/components/tree-view';
import type { TreeNodeData } from '@/components/tree-node';
import { mapReferralTree } from '@/utils/affiliate/mapReferralTree';
import { TreeViewSkeleton } from './TreeViewSkeleton';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import IconSearch from '@/components/icon/icon-search';
import { IconRefresh } from '@tabler/icons-react';
import { showToast } from '@/utils/toast';

export default function Home({ _, searchParams }: any) {
  const [treeData, setTreeData] = useState<TreeNodeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [resetSearch, setResetSearch] = useState(false);
const [records, setRecords] = useState<any>(null);
      const [debouncedSearch, setDebouncedSearch] = useState('');
  // const router = useRouter();
  const id = (searchParams as any)?.id as any
  const { data: session, status } = useSession();
  const userId = records?.id ?? id  ?? 980

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


      
       useEffect(() => {
          const handler = setTimeout(() => {
              setDebouncedSearch(search);
          }, 500);
  
          return () => clearTimeout(handler);
      }, [search]);
  
      const fetchStudents = async () => {
          setLoading(true);
          try {
              const res = await fetch(`/api/user/allUserList?page=${1}&pageSize=${1}&search=${debouncedSearch}`);
              const result = await res.json();
  
              const usersArray = result?.data?.data ?? [];
              setRecords(Array.isArray(usersArray) ? usersArray[0] : []);
          } catch (err) {
              showToast("error", "Something went wrong")
          } finally {
              setLoading(false);
          }
      };
  
      useEffect(() => {
       if (!debouncedSearch || debouncedSearch.trim() === "") {
        setRecords([]); // Clear the table
        return;         // Don't hit the API
    }
    fetchStudents();
      }, [ debouncedSearch]);

      const resetSearchHandler = () =>{
        setSearch('');
         setRecords([]);
      }

  return (
    <main>
      <div className="panel flex items-center p-3 text-primary">
        <div className="mr-3 rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30">
          <IconBell />
        </div>
        <span className='font-bold'>Genealogy</span>
      </div>
      <div className="panel flex flex-col lg:flex-row md:flex-row md:items-center justify-between gap-4 my-6">
        <div>
          <h5 className="text-sm lg:text-base font-bold text-dark dark:text-white-light">Search Genealogy</h5>
          <p className="text-white-dark text-xs font-medium">View and manage genealogy across network.</p>
        </div>

        {/* Optimized Search Bar */}
        <div>


          <form
            onSubmit={(e) => { e.preventDefault(); }}
            className="flex items-center gap-2 w-full md:w-auto"
          >
            <div className="relative flex-1 md:w-72">
              <span className="absolute inset-y-0 ltr:left-1 rtl:right-2 ltr:pl-3 flex items-center text-gray-400">
                <IconSearch />
              </span>
              <input
                type="text"
                className="form-input ltr:pl-10  shadow-sm border-gray-200 focus:border-primary"
                placeholder="Search User ID or Name (e.g. EC288073)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {search && (
              <button
                type="button"
                onClick={() => { setResetSearch(!resetSearch); resetSearchHandler()}}
                className="btn btn-outline-danger p-2"
                title="Clear Search"
              >
                <IconRefresh size={18} />
              </button>
            )}
          </form>
        </div>
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
          <Fragment>

            <TreeView data={treeData} />
          </Fragment>
        )}
      </div>
    </main>
  );
}
