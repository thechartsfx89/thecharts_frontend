'use client';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Dropdown from '@/components/dropdown';
import IconEye from '@/components/icon/icon-eye';
import IconHorizontalDots from '@/components/icon/icon-horizontal-dots';
import IconMenu from '@/components/icon/icon-menu';
import IconNotes from '@/components/icon/icon-notes';
import IconNotesEdit from '@/components/icon/icon-notes-edit';
import IconPencil from '@/components/icon/icon-pencil';
import IconPlus from '@/components/icon/icon-plus';
import IconSquareRotated from '@/components/icon/icon-square-rotated';
import IconStar from '@/components/icon/icon-star';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import IconUser from '@/components/icon/icon-user';
import IconX from '@/components/icon/icon-x';
import { IRootState } from '@/store';
import { Transition, Dialog, DialogPanel, TransitionChild } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import IconBell from '@/components/icon/icon-bell';
import Link from 'next/link';
import { array } from 'yup';

export default function Page() {
    const [webinarList, setWebinarList] = useState<any>([]);
    // console.log(webinarList, '>>>>>>>> courses');
    const[loading, setLoading] = useState(false)
   useEffect(() => {
    const fetchAllWebinars = async () => {
        setLoading(true); // Recommended to handle a loading state
        try {
            // 1. Run both API calls in parallel
            const [standardRes, advancedRes] = await Promise.all([
                fetch('/api/webinar', { method: 'GET' }),
                fetch('/api/webinar/advanced-webinar', { method: 'GET' })
            ]);

            // 2. Parse both JSON responses
            const standardJson = await standardRes.json();
            const advancedJson = await advancedRes.json();

            // 3. Extract arrays (default to empty arrays if data is null)
            const standardData = standardJson?.data || [];
            const advancedData = advancedJson?.data || [];

            // 4. Spread both into a single array
            setWebinarList([...standardData, ...advancedData]);

        } catch (err) {
            console.error("Failed to merge webinars:", err);
        } finally {
            setLoading(false);
        }
    };

    fetchAllWebinars();
}, []);
    const [notesList, setNoteList] = useState([
        {
            id: 1,
            user: 'Gaurav Singh',
            designation: "Mentor",
            thumb: 'profile-16.jpeg',
            title: 'Forex Trading',
            description: 'Curabitur facilisis vel elit sed dapibus sodales purus rhoncus.',
            date: 'Dec 12, 2025 7:00 PM IST',
            isFav: false,
            tag: 'personal',
        },
        {
            id: 2,
            user: 'Gaurav Singh',
            designation: "Mentor",
            thumb: 'profile-14.jpeg',
            title: 'Pyschology bootcamp',
            description: 'Facilisis curabitur facilisis vel elit sed dapibus sodales purus.',
            date: 'Dec 10, 2025 12:00 PM IST',
            isFav: true,
            tag: '',
        },
        {
            id: 3,
            user: 'Gaurav Singh',
            designation: "Mentor",
            thumb: 'profile-15.jpeg',
            title: 'fibonacci Webinar',
            description: 'Proin a dui malesuada, laoreet mi vel, imperdiet diam quam laoreet.',
            date: 'Nov 24, 2025 8:00 PM IST',
            isFav: false,
            tag: 'work',
        },
        {
            id: 4,
            user: 'Gaurav Singh',
            designation: "Mentor",
            thumb: 'profile-16.jpeg',
            title: 'Trading Webinar',
            description: 'Excepteur sint occaecat cupidatat non proident, anim id est laborum.',
            date: 'Dec 16, 2025 7:00 PM IST',
            isFav: false,
            tag: '',
        },
        {
            id: 5,
            user: 'Gaurav Singh',
            designation: "Mentor",
            thumb: 'profile-17.jpeg',
            title: 'Bootcamp webinar',
            description: 'Maecenas condimentum neque mollis, egestas leo ut, gravida.',
            date: 'Dec 20, 2025 7:00 PM IST',
            isFav: false,
            tag: '',
        },
        {
            id: 6,
            user: 'Gaurav Singh',
            designation: "Mentor",
            thumb: 'profile-16.jpeg',
            title: 'Download Server Logs',
            description: 'Suspendisse efficitur diam quis gravida. Nunc molestie est eros.',
            date: 'Dec 4, 2025 7:00 PM IST',
            isFav: false,
            tag: 'social',
        },
        {
            id: 8,
            user: 'Max Smith',
            thumb: 'profile-16.jpeg',
            title: 'Create new users Profile',
            description: 'Duis aute irure in nulla pariatur. Etiam a odio eget enim aliquet.',
            date: 'Dec 12, 2025 6:00 PM IST',
            isFav: false,
            tag: 'important',
        }
    ]);

    const defaultParams = {
        id: null,
        title: '',
        description: '',
        tag: '',
        user: '',
        thumb: '',
    };
    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));
    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [isDeleteNoteModal, setIsDeleteNoteModal] = useState<any>(false);
    const [isShowNoteMenu, setIsShowNoteMenu] = useState<any>(false);
    const [isViewNoteModal, setIsViewNoteModal] = useState<any>(false);
    const [filterdNotesList, setFilterdNotesList] = useState<any>([]);
    const [selectedTab, setSelectedTab] = useState<any>('all');
    const [deletedNote, setDeletedNote] = useState<any>(null);

    const searchNotes = () => {
        if (selectedTab !== 'fav') {
            if (selectedTab !== 'all' || selectedTab === 'delete') {
                setFilterdNotesList(notesList.filter((d) => d.tag === selectedTab));
            } else {
                setFilterdNotesList(notesList);
            }
        } else {
            setFilterdNotesList(notesList.filter((d) => d.isFav));
        }
    };

    const saveNote = () => {
        if (!params.title) {
            showMessage('Title is required.', 'error');
            return false;
        }
        if (params.id) {
            //update task
            let note: any = notesList.find((d: any) => d.id === params.id);
            note.title = params.title;
            note.user = params.user;
            note.description = params.description;
            note.tag = params.tag;
        } else {
            //add note
            let maxNoteId = notesList.reduce((max: any, character: any) => (character.id > max ? character.id : max), notesList[0].id);
            if (!maxNoteId) {
                maxNoteId = 0;
            }
            let dt = new Date();
            let note = {
                id: maxNoteId + 1,
                title: params.title,
                user: params.user,
                thumb: 'profile-21.jpeg',
                description: params.description,
                date: dt.getDate() + '/' + Number(dt.getMonth()) + 1 + '/' + dt.getFullYear(),
                isFav: false,
                tag: params.tag,
            };

            notesList.splice(0, 0, note);
            searchNotes();
        }
        showMessage('Note has been saved successfully.');
        setAddContactModal(false);
        searchNotes();
    };

    const tabChanged = (type: string) => {
        setSelectedTab(type);
        setIsShowNoteMenu(false);
        searchNotes();
    };

    const setFav = (note: any) => {
        let list = filterdNotesList;
        let item = list.find((d: any) => d.id === note.id);
        item.isFav = !item.isFav;

        setFilterdNotesList([...list]);
        if (selectedTab !== 'all' || selectedTab === 'delete') {
            searchNotes();
        }
    };

    const setTag = (note: any, name: string = '') => {
        let list = filterdNotesList;
        let item = filterdNotesList.find((d: any) => d.id === note.id);
        item.tag = name;
        setFilterdNotesList([...list]);
        if (selectedTab !== 'all' || selectedTab === 'delete') {
            searchNotes();
        }
    };

    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };

    const deleteNoteConfirm = (note: any) => {
        setDeletedNote(note);
        setIsDeleteNoteModal(true);
    };

    const viewNote = (note: any) => {
        setParams(note);
        setIsViewNoteModal(true);
    };

    const editNote = (note: any = null) => {
        setIsShowNoteMenu(false);
        const json = JSON.parse(JSON.stringify(defaultParams));
        setParams(json);
        if (note) {
            let json1 = JSON.parse(JSON.stringify(note));
            setParams(json1);
        }
        setAddContactModal(true);
    };

    const deleteNote = () => {
        setNoteList(notesList.filter((d: any) => d.id !== deletedNote.id));
        searchNotes();
        showMessage('Note has been deleted successfully.');
        setIsDeleteNoteModal(false);
    };
    // console.log(CourseData, '>>>>>>>> courses');
    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    useEffect(() => {
        searchNotes();
    }, [selectedTab, notesList]);

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
 const formatWebinarDate = (dateString: string | null | undefined) => {
  // 1. Check for null, undefined, or empty string
  if (!dateString) {
    return "Date TBD"; // Or "Not Scheduled"
  }

  try {
    const date = new Date(dateString);

    // 2. Check if the date object is "Invalid Date"
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).replace(/,([^,]*)$/, ' at$1');

  } catch (error) {
    console.error("Formatting error:", error);
    return "Format Error";
  }
};

// Example Usage:
// Input: "2026-03-08T18:30:00.000Z"
// Output: "09 Mar, 2026 at 12:00 am"
    return (
        <React.Fragment>
            <div className="panel flex items-center overflow-x-auto whitespace-nowrap p-3 text-primary mb-3">
                <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">
                    <IconBell />
                </div>
                <span className="ltr:mr-3 rtl:ml-3 font-bold">Your Webinar</span>
            </div>
            {loading ? (
    <div className="min-h-[400px] sm:min-h-[300px] animate-pulse">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="panel pb-12 bg-gray-100 dark:bg-gray-800 border-none shadow-none">
                    <div className="min-h-[142px]">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                            <div className="space-y-2">
                                <div className="h-4 w-24 rounded bg-gray-300 dark:bg-gray-700"></div>
                                <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-600"></div>
                            </div>
                        </div>
                        <div className="mt-6 space-y-3">
                            <div className="h-5 w-3/4 rounded bg-gray-300 dark:bg-gray-700"></div>
                            <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-600"></div>
                            <div className="h-3 w-5/6 rounded bg-gray-200 dark:bg-gray-600"></div>
                        </div>
                    </div>
                    <div className="absolute bottom-5 left-5 right-5 flex justify-between">
                        <div className="h-6 w-12 rounded bg-gray-300 dark:bg-gray-700"></div>
                        <div className="h-8 w-24 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
) : webinarList?.length > 0 ? (<>
            {Array.isArray(webinarList) && webinarList?.length > 0 ? (
                <div className="min-h-[400px] sm:min-h-[300px]">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                        {webinarList?.map((note: any, index:any) => {
                            
                            return (
                                <div
                                    className={`panel pb-12 ${"personal" === 'personal'
                                        ? 'bg-primary-light shadow-primary'
                                        : note.tag === 'work'
                                            ? 'bg-warning-light shadow-warning'
                                            : note.tag === 'social'
                                                ? 'bg-info-light shadow-info'
                                                : note.tag === 'important'
                                                    ? 'bg-danger-light shadow-danger'
                                                    : 'dark:shadow-dark'
                                        }`}
                                    key={note.id}
                                >
                                    <div className="min-h-[142px]">
                                        <div className="flex justify-between">
                                            <div className="flex w-max items-center">
                                                <div className="flex-none">
                                                    {note.thumb && (
                                                        <div className="rounded-full bg-gray-300 p-0.5 dark:bg-gray-700">
                                                            <img className="h-8 w-8 rounded-full object-cover" alt="img" src={`/assets/images/${note.thumb}`} />
                                                        </div>
                                                    )}

                                                    {!note.thumb && note.user && (
                                                        <div className="grid h-8 w-8 place-content-center rounded-full bg-gray-300 text-sm font-semibold dark:bg-gray-700">
                                                            {note.webinar_by.name?.charAt(0) + '' + note.user.charAt(note.user.indexOf('') + 1)}
                                                        </div>
                                                    )}
                                                    {!note.thumb && !note.user && (
                                                        <div className="rounded-full bg-gray-300 p-2 dark:bg-gray-700">
                                                            <IconUser className="h-4.5 w-4.5" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ltr:ml-2 rtl:mr-2">
                                                    <div className="font-semibold">{note?.webinar_by?.name}</div>
                                                    <div className="text-xs text-white-dark">{note.designation ?? "Mentor"}</div>
                                                </div>
                                            </div>
                                            <div className="dropdown">
                                                <Dropdown
                                                    offset={[0, 5]}
                                                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                                    btnClassName="text-primary"
                                                    button={<IconHorizontalDots className="rotate-90 opacity-70 hover:opacity-100" />}
                                                >
                                                    <ul className="text-sm font-medium">
                                                        <li>
                                                            <button type="button" onClick={() => viewNote(note)}>
                                                                <IconEye className="h-4.5 w-4.5 shrink-0 ltr:mr-3 rtl:ml-3" />
                                                                View
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button type="button" >
                                                                <IconPencil className="h-4 w-4 shrink-0 ltr:mr-3 rtl:ml-3" />
                                                                Details
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </Dropdown>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="mt-4 font-semibold text-base">{note.title}</h4>
                                            <p className="mt-2 text-white-dark text-xs">{note.description}</p>
                                            <h5 className="mt-4 mb-2 font-semibold "><span className='font-normal'>Date: </span>{formatWebinarDate(note?.start_time)}</h5>
                                            <h5 className="mt-2 mb-6 font-semibold "><span className='font-normal'>Duration: </span>{note?.duration ? `${note?.duration} Min` : "Unknown"}</h5>

                                        </div>
                                    </div>
                                    <div className="absolute bottom-5 left-0 w-full px-5">
                                        <div className="mt-2 flex items-center justify-between">
                                            <div className="dropdown">
                                                <div className="dropdown">
                                                    <span>
                                                        {/* <IconSquareRotated
                                                            className={
                                                                note.tag === 'personal'
                                                                    ? 'fill-primary'
                                                                    : note.tag === 'work'
                                                                        ? 'fill-warning'
                                                                        : note.tag === 'social'
                                                                            ? 'fill-info'
                                                                            : note.tag === 'important'
                                                                                ? 'fill-danger'
                                                                                : ''
                                                            }
                                                        /> */}
                                                        <div className="relative flex items-center gap-2">

                                                           {( index == 0  || index == 6) &&<span className="text-xs font-bold badge bg-danger">Live
                                                                {/* <span className="absolute top-0 flex h-3 w-3 ltr:right-0 rtl:left-0">
                                                                        <span className="absolute -top-[3px] inline-flex h-full w-full animate-ping rounded-full bg-danger/50 opacity-75 ltr:-left-[3px] rtl:-right-[3px]"></span>
                                                                        <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-white"></span>
                                                                    </span> */}
                                                            </span>}


                                                        </div>
                                                    </span>
                                                </div>
                                            </div>
                                            {/* <Link href="/dash/student/live-webinar"> */}
                                            <Link href={note?.url ?? "/dash/student/live-webinar"}>

                                            <div className="flex items-center relative">
                                                 {( index == 0  || index == 6) && <span
                                                    className={`badge rounded-full capitalize hover:top-0 hover:text-white 
                                                         font-bold   badge-outline-success hover:bg-success px-6 py-2 cursor-pointer
                                                        }`}
                                                >Join Now
                                                  <span className="absolute top-0 flex h-3 w-3 ltr:right-0 rtl:left-0">
                                                        <span className="absolute -top-[3px] inline-flex h-full w-full animate-ping rounded-full bg-danger/50 opacity-75 ltr:-left-[3px] rtl:-right-[3px]"></span>
                                                        <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-danger"></span>
                                                    </span>
                                                    </span>}
                                                {/* <button type="button" className="text-danger" onClick={() => deleteNoteConfirm(note)}>
                                                    <IconTrashLines />
                                                </button>
                                                <button type="button" className="group text-warning ltr:ml-2 rtl:mr-2" onClick={() => setFav(note)}>
                                                    <IconStar className={`h-4.5 w-4.5 group-hover:fill-warning ${note.isFav && 'fill-warning'}`} />
                                                </button> */}
                                            </div>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="flex h-full min-h-[400px] items-center justify-center text-base font-semibold sm:min-h-[300px]">No data available</div>
            )}
                                          </>          ): null}

            <Transition appear show={addContactModal} as={Fragment}>
                <Dialog as="div" open={addContactModal} onClose={() => setAddContactModal(false)} className="relative z-50">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-[black]/60" />
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        onClick={() => setAddContactModal(false)}
                                        className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]">
                                        {params.id ? 'Edit Note' : 'Add Note'}
                                    </div>
                                    <div className="p-5">
                                        <form>
                                            <div className="mb-5">
                                                <label htmlFor="title">Title</label>
                                                <input id="title" type="text" placeholder="Enter Title" className="form-input" value={params.title} onChange={(e) => changeValue(e)} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="name">User Name</label>
                                                <select id="user" className="form-select" value={params.user} onChange={(e) => changeValue(e)}>
                                                    <option value="">Select User</option>
                                                    <option value="Max Smith">Max Smith</option>
                                                    <option value="John Doe">John Doe</option>
                                                    <option value="Kia Jain">Kia Jain</option>
                                                    <option value="Karena Courtliff">Karena Courtliff</option>
                                                    <option value="Vladamir Koschek">Vladamir Koschek</option>
                                                    <option value="Robert Garcia">Robert Garcia</option>
                                                    <option value="Marie Hamilton">Marie Hamilton</option>
                                                    <option value="Megan Meyers">Megan Meyers</option>
                                                    <option value="Angela Hull">Angela Hull</option>
                                                    <option value="Karen Wolf">Karen Wolf</option>
                                                    <option value="Jasmine Barnes">Jasmine Barnes</option>
                                                    <option value="Thomas Cox">Thomas Cox</option>
                                                    <option value="Marcus Jones">Marcus Jones</option>
                                                    <option value="Matthew Gray">Matthew Gray</option>
                                                    <option value="Chad Davis">Chad Davis</option>
                                                    <option value="Linda Drake">Linda Drake</option>
                                                    <option value="Kathleen Flores">Kathleen Flores</option>
                                                </select>
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="tag">Tag</label>
                                                <select id="tag" className="form-select" value={params.tag} onChange={(e) => changeValue(e)}>
                                                    <option value="">None</option>
                                                    <option value="personal">Personal</option>
                                                    <option value="work">Work</option>
                                                    <option value="social">Social</option>
                                                    <option value="important">Important</option>
                                                </select>
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="desc">Description</label>
                                                <textarea
                                                    id="description"
                                                    rows={3}
                                                    className="form-textarea min-h-[130px] resize-none"
                                                    placeholder="Enter Description"
                                                    value={params.description}
                                                    onChange={(e) => changeValue(e)}
                                                ></textarea>
                                            </div>
                                            <div className="mt-8 flex items-center justify-end">
                                                <button type="button" className="btn btn-outline-danger gap-2" onClick={() => setAddContactModal(false)}>
                                                    Cancel
                                                </button>
                                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={saveNote}>
                                                    {params.id ? 'Update Note' : 'Add Note'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <Transition appear show={isDeleteNoteModal} as={Fragment}>
                <Dialog as="div" open={isDeleteNoteModal} onClose={() => setIsDeleteNoteModal(false)} className="relative z-50">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-[black]/60" />
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        onClick={() => setIsDeleteNoteModal(false)}
                                        className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]">Delete Notes</div>
                                    <div className="p-5 text-center">
                                        <div className="mx-auto w-fit rounded-full bg-danger p-4 text-white ring-4 ring-danger/30">
                                            <IconTrashLines className="mx-auto h-7 w-7" />
                                        </div>
                                        <div className="mx-auto mt-5 sm:w-3/4">Are you sure you want to delete Notes?</div>

                                        <div className="mt-8 flex items-center justify-center">
                                            <button type="button" className="btn btn-outline-danger" onClick={() => setIsDeleteNoteModal(false)}>
                                                Cancel
                                            </button>
                                            <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={deleteNote}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <Transition appear show={isViewNoteModal} as={Fragment}>
                <Dialog as="div" open={isViewNoteModal} onClose={() => setIsViewNoteModal(false)} className="relative z-50">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-[black]/60" />
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        onClick={() => setIsViewNoteModal(false)}
                                        className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="flex flex-wrap items-center gap-2 bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]">
                                        <div className="ltr:mr-3 rtl:ml-3">{params.title}</div>
                                        {params.tag && (
                                            <button
                                                type="button"
                                                className={`badge badge-outline-primary rounded-3xl capitalize ltr:mr-3 rtl:ml-3 ${(params.tag === 'personal' && 'shadow-primary',
                                                    params.tag === 'work' && 'shadow-warning',
                                                    params.tag === 'social' && 'shadow-info',
                                                    params.tag === 'important' && 'shadow-danger')
                                                    }`}
                                            >
                                                {params.tag}
                                            </button>
                                        )}
                                        {params.isFav && (
                                            <button type="button" className="text-warning">
                                                <IconStar className="fill-warning" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <div className="text-base">{params.description}</div>

                                        <div className="mt-8 ltr:text-right rtl:text-left">
                                            <button type="button" className="btn btn-outline-danger" onClick={() => setIsViewNoteModal(false)}>
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </React.Fragment>
    )
}
