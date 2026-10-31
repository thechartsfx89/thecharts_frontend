'use client';
import IconDownload from '@/components/icon/icon-download';
import IconMenu from '@/components/icon/icon-menu';
import IconMessage from '@/components/icon/icon-message';
import IconMoodSmile from '@/components/icon/icon-mood-smile';
import IconSearch from '@/components/icon/icon-search';
import IconSend from '@/components/icon/icon-send';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { IRootState } from '@/store';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Upload as IconUpload } from "lucide-react";
import { useSelector } from 'react-redux';

import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { connectWS } from '@/lib/websocket';
// const socket = io('http://localhost:1337');
import { Socket } from "socket.io-client";
import { useSession } from 'next-auth/react';
import AppEmojiPicker from '@/utils/common/emojiPicker';
import { formatDateLabel, formatLastSeen, formatLastSeenOnList, formatTime, groupMessagesByDate } from '@/utils/dateFormatter';
import { downloadFile, getImageUrl, getRandomColor, getTextColor } from '@/utils/common/common';
import IconTxtFile from '@/components/icon/icon-txt-file';
import { m } from 'framer-motion';
import { showToast } from '@/utils/toast';
import { DataTableSortStatus } from 'mantine-datatable';

interface ChatMessage {
    //   id: number;
    //   room: string;
    sender: string;
    receiver: string;
    text: string;
    //   ts: number;
}

const ComponentsMentorChat = () => {
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const scrollRef = useRef<any>(null);
    const [isShowChatMenu, setIsShowChatMenu] = useState(false);
    const [searchUser, setSearchUser] = useState('');
    const [isShowUserChat, setIsShowUserChat] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [textMessage, setTextMessage] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [typers, setTypers] = useState([]);
    const timer = useRef(null);
    const profileBg = getRandomColor(selectedUser?.id || 0);
    // const socket = useRef<Socket | null>(null);
    const activeChatRef = useRef<string | null>(null);


    const scrollToBottom = () => {
        if (isShowUserChat) {
            setTimeout(() => {
                const element: any = document.querySelector('.chat-conversation-box');
                element.behavior = 'smooth';
                element.scrollTop = element.scrollHeight;
            });
        }
    };

    useEffect(() => {
        if (messages.length > 0) {
            const timeout = setTimeout(() => scrollToBottom(), 100);
            return () => clearTimeout(timeout);
        }
    }, [messages]);
    // const scrollToBottom = () => {
    //   if (scrollRef.current) {
    //     const container = scrollRef.current._container || scrollRef.current.container; 
    //     // Different depending on version
    //     if (container) container.scrollTop = container.scrollHeight;
    //   }
    // };



    // console.log("Messages:", messages);
    // const [studentList, setStudentList] = useState<any>([]);
    // // console.log("Student List:", studentList);


    // const fetchStudentList = async () => {
    //     try {
    //         const response = await fetch(`/api/student/list`, {
    //             method: "GET",
    //             headers: { "Content-Type": "application/json" },
    //         }
    //         );
    //         // console.log("Fetching mentor by ID:", response);
    //         const data = await response.json();
    //         setStudentList(data?.data ?? []);
    //         // console.log("Fetched mentor list:", data.data.data);
    //     } catch (error) {
    //         console.error('Error fetching mentor list:', error);
    //     }
    // };
    // useEffect(() => {
    //     fetchStudentList();
    // }, []);
    // const [filteredItems, setFilteredItems] = useState<any>(studentList || []);

    // useEffect(() => {
    //     if (!searchUser) {
    //         // if search box empty — show all students
    //         setFilteredItems(studentList);
    //         return;
    //     }

    //     // Only filter when user types
    //     const filtered = studentList.filter((d: any) =>
    //         d.firstName.toLowerCase().includes(searchUser.toLowerCase())
    //     );
    //     setFilteredItems(filtered);
    // }, [searchUser, studentList]);
    const PAGE_SIZES = [25, 20, 30, 50, 100];

    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [totalRecords, setTotalRecords] = useState(0);

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'createdAt',
        direction: 'desc',
    });
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);

        return () => clearTimeout(handler);
    }, [search]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            // const res = await fetch(`/api/user/allUserList?page=${page}&pageSize=${pageSize}&sort=${sortStatus.columnAccessor}:${sortStatus.direction}&search=${debouncedSearch}`);
            const res = await fetch(`/api/chat/personal/active-chat-user`);

            const result = await res.json();

            const users = result?.data || [];
            setRecords(users || []);
            setTotalRecords(users?.meta?.pagination?.total || 0);
        } catch (err) {
            showToast("error", "Something went wrong")
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(!debouncedSearch){
        fetchStudents();

        }
    }, [page, pageSize, sortStatus, debouncedSearch]);

     const filterStudents = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/user/allUserList?page=${page}&pageSize=${pageSize}&sort=${sortStatus.columnAccessor}:${sortStatus.direction}&search=${debouncedSearch}`);
            // const res = await fetch(`/api/chat/personal/active-chat-user`);

            const result = await res.json();

            const users = result?.data || [];
            setRecords(users.data || []);
            setTotalRecords(users?.meta?.pagination?.total || 0);
        } catch (err) {
            showToast("error", "Something went wrong")
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(debouncedSearch){
        filterStudents();

        }
    }, [page, pageSize, sortStatus, debouncedSearch]);

    const { data: session } = useSession();
    const socket = useRef<Socket | null>(null);
    const searchParams = useSearchParams();

    //   const studentId = session?.user?.id?.toString() || "";
    const mentorId = session?.user?.id?.toString() || "";
    const mentorName = searchParams.get("mentorName") || "";
    const [userActiveId, setUserActiveId] = useState<any>(null)
    const [userActiveIsOnline, setUserActiveIsOnline] = useState<any>(null)
    const [userActiveIsLastSeen, setUserActiveIsLastSeen] = useState<any>(null)


    useEffect(() => {
        // if (!socket.current) return;
        if (!socket.current) {
            socket.current = connectWS();
            console.log("🟢 Socket initialized");
        }
        const socketInstance = socket.current;

        // 🔥 Listen to real-time active status
        socketInstance.on("userActive", ({ userId, is_online, last_seen }) => {
            setUserActiveId(userId)
            setUserActiveIsOnline(is_online)
            setUserActiveIsLastSeen(last_seen ?? "")
            console.log({ userId, is_online, last_seen })

        });

        return () => {
            socketInstance.off("userActive");
        };
    }, []);

    useEffect(() => {
        if (userActiveId) {
            setRecords((prevList: any) =>
                prevList.map((user: any) =>
                    user?.id === Number(userActiveId) ? { ...user, is_online: userActiveIsOnline } : user
                )
            );

        }

        setSelectedUser((prev: any) => {
            if (!prev) return prev; // handle null
            if (prev.id === Number(userActiveId)) {
                return { ...prev, is_online: userActiveIsOnline, last_seen: userActiveIsLastSeen }; // ✅ correct merge order
            }
            return prev;
        });

    }, [userActiveId, userActiveIsOnline])
    // console.log({studentList})
    const fetchMessage = async (userId: any) => {
        if (!userId || !session?.user?.id) return;

        try {
            const senderId = session.user.id;
            const receiverId = userId;

            const response = await fetch(
                `/api/chat/personal?sender=${senderId}&receiver=${receiverId}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }
            );

            const data = await response.json();
            // console.log("Fetched messages:", data);

            if (data?.data) {
                await setMessages(data.data); // 👈 set previous messages in state
                await setTimeout(() => scrollToBottom(), 300);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };
    useEffect(() => {
        if (selectedUser?.id) {
            fetchMessage(selectedUser?.id);
        }
    }, [selectedUser?.id]);


    const joinChatHandler = async (id: any) => {
        const studentId = id ?? selectedUser?.id;
        if (!studentId || !mentorId) return;

        // Initialize socket if not already
        if (!socket.current) {
            socket.current = connectWS();
            console.log("🟢 Socket initialized");
        }

        const socketInstance = socket.current;

        // 🚪 Leave the old chat if switching
        if (activeChatRef.current && activeChatRef.current !== studentId) {
            console.log("🚪 Leaving chat:", activeChatRef.current);
            socketInstance.emit("leaveChat", {
                senderId: mentorId,
                receiverId: activeChatRef.current,
            });
            await new Promise((res) => setTimeout(res, 300)); // ensure clean leave
        }

        // 👥 Join new chat
        console.log("👥 Joining chat:", studentId);
        socketInstance.emit("joinChat", { senderId: mentorId, receiverId: studentId });
        activeChatRef.current = studentId;

        // 🧠 Register listeners only once
        if (!socketInstance.hasListeners("newMessage")) {
            socketInstance.on("newMessage", (msg: ChatMessage) => {
                const currentChat = activeChatRef.current;
                const isRelevant =
                    (msg.sender === mentorId && msg.receiver === currentChat) ||
                    (msg.sender === currentChat && msg.receiver === mentorId);

                if (isRelevant) {
                    console.log("💬 Incoming:", msg.text);
                    setMessages((prev) => [...prev, msg]);
                }
            });
        }

        // 🔌 Connection logs (optional)
        if (!socketInstance.hasListeners("connect")) {
            socketInstance.on("connect", () =>
                console.log("✅ Socket connected:", socketInstance.id)
            );
        }

        if (!socketInstance.hasListeners("disconnect")) {
            socketInstance.on("disconnect", () => console.log("🔴 Socket disconnected"));
        }

        // ✅ Clean up on unmount or leave
        return () => {
            socketInstance.emit("leaveChat", {
                senderId: mentorId,
                receiverId: studentId,
            });
            socketInstance.off("newMessage");
        };
    };
    useEffect(() => {
        if (!socket.current) return;
        const socketInstance = socket.current;

        // 🟢 When a student is typing
        socketInstance.on("typingMentor", ({ senderId, receiverId }) => {
            console.log("Typing event received:", { senderId, receiverId });

            // ensure event is for this mentor
            if (Number(receiverId) !== Number(mentorId)) return;

            const typingUser = records?.find(
                (user: any) => Number(user?.id) === Number(senderId)
            );
            if (!typingUser) return;

            const name = typingUser?.firstName ?? `User ${senderId}`;
            setTypers((prev: any) => (prev.includes(name) ? prev : [...prev, name]));
        });

        // 🔴 When student stops typing
        socketInstance.on("stopTypingMentor", ({ senderId, receiverId }) => {
            if (Number(receiverId) !== Number(mentorId)) return;

            const typingUser = records?.find(
                (user: any) => Number(user?.id) === Number(senderId)
            );
            if (!typingUser) return;

            const name = typingUser?.firstName ?? `User ${senderId}`;
            setTypers((prev) => prev.filter((typer: any) => typer !== name));
        });

        return () => {
            socketInstance.off("typingMentor");
            socketInstance.off("stopTypingMentor");
        };
    }, [records, mentorId]);
    useEffect(() => {
        if (!socket.current || !mentorId || !selectedUser?.id) return;
        console.log("Emitting typing event for mentor chat:", { textMessage, mentorId, selectedUserId: selectedUser?.id });
        const socketInstance = socket.current;

        if (textMessage) {
            socket.current.emit("typingMentor", {
                senderId: Number(mentorId),
                receiverId: Number(selectedUser?.id),
            });
            clearTimeout(timer.current);
        }

        timer.current = setTimeout(() => {
            socket.current.emit("stopTypingMentor", {
                senderId: Number(mentorId),
                receiverId: Number(selectedUser?.id),
            });
        }, 1000);

        return () => clearTimeout(timer.current);
    }, [textMessage, mentorId, selectedUser?.id]);


    const selectUser = (user: any) => {
        setSelectedUser(user);
        setIsShowUserChat(true);
    };

    // 📨 SEND MESSAGE
    const sendMessage = () => {
        if (!textMessage.trim() || !socket.current) return;

        const newMsg: ChatMessage = {
            sender: mentorId ?? "",
            receiver: selectedUser?.id ?? "",
            text: textMessage ?? "",
            //   time: "Just now",
        };

        // Emit message to server
        socket.current.emit("sendMessage", newMsg);
        // setMessages((prev) => [newMsg]);
        setTextMessage("");
        setTimeout(() => scrollToBottom(), 300);
    };

    const sendMessageHandle = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    }






    // console.log("Messages State:", messages, session);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const handleEmojiClick = (emoji: any) => {
        setTextMessage((prev: any) => prev + emoji.emoji);
    };
    const emojiPickerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target as Node)
            ) {
                setShowEmojiPicker(false);
            }
        };

        if (showEmojiPicker) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showEmojiPicker]);
    //   console.log(session?.user?.profileImage, "PROFILE IMAGE");
    // console.log({ typers })
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadingFile, setUploadingFile] = useState<File | null>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // START UI immediately
        setUploadingFile(file);
        setUploadProgress(1);
        await scrollToBottom()
        try {
            const formData = new FormData();
            formData.append("files", file);

            const uploadRes = await axios.post(
                `/api/upload`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: async (p: any) => {
                        if (!p.total) return;

                        const percent = Math.round((p.loaded / p.total) * 100);
                        console.log("Progress:", percent);
                        // Update UI
                        setUploadProgress(percent);
                    },
                }
            );

            const uploadedFile = uploadRes.data?.[0];
            if (!uploadedFile) throw new Error("Upload failed");
            // Upload finished → remove bubble


            const messageContent = {
                text: file.type.includes("image")
                    ? "📷 Sent an image"
                    : "📄 Sent a document",
                file: uploadedFile,
                sender: session?.user?.id,
                receiver: selectedUser?.id,
            };

            socket.current.emit("sendMessage", messageContent);
            // await scrollToBottom()

        } catch (err) {
            console.error("Upload error:", err);
            setUploadProgress(0);
            setUploadingFile(null);
        } finally {
            e.target.value = "";
        }
    };


    const [prevMsgCount, setPrevMsgCount] = useState(messages?.length);


    const messageCountChanged = useMemo(() => {
        return messages.length !== prevMsgCount;
    }, [messages.length, prevMsgCount]);

    // Hide loader when messages increase
    useEffect(() => {
        const run = async () => {
            if (messageCountChanged) {
                // await delay(100); // slight delay for smoothness
                setUploadProgress(0);
                setUploadingFile(null);
                setPrevMsgCount(messages.length);
            }
        }
        run();
    }, [messageCountChanged, messages.length]);

    // console.log({ messages })
    const ChatListSkeleton = () => {
    return (
        <div className="space-y-0.5">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="flex w-full items-start p-3 animate-pulse">
                    {/* Avatar Skeleton */}
                    <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    
                    {/* Content Skeleton */}
                    <div className="flex flex-1 flex-col min-w-0 ltr:ml-3 rtl:mr-3">
                        <div className="flex items-center justify-between mb-2">
                            {/* Name Skeleton */}
                            <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
                            {/* Time Skeleton */}
                            <div className="h-3 w-10 rounded bg-gray-100 dark:bg-gray-800"></div>
                        </div>
                        {/* Message Skeleton */}
                        <div className="h-3 w-3/4 rounded bg-gray-100 dark:bg-gray-800"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};
    return (
        <div>
            <div className={`relative flex h-full gap-5 sm:h-[calc(100vh_-_150px)] sm:min-h-0 ${isShowChatMenu ? 'min-h-[999px]' : ''}`}>
                <div className={`panel absolute z-10 hidden h-full w-full max-w-xs flex-none space-y-4 overflow-hidden p-4 xl:relative xl:block ${isShowChatMenu ? '!block' : ''}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="flex-none">
                                <img src={getImageUrl(session?.user?.profileImage)} className="h-12 w-12 rounded-full object-cover" alt="" />
                            </div>
                            <div className="mx-3">
                                <p className="mb-1 font-semibold">{`${session?.user?.username ?? ""} (You)`}</p>
                                {/* <p className="text-xs text-dark">Total Student: {totalRecords ?? ""}</p> */}
                            </div>
                        </div>

                    </div>
                    <div className="relative">
                        <input type="text" className="peer form-input ltr:pr-9 rtl:pl-9" placeholder="Search by name & id.." value={search} onChange={(e) => setSearch(e.target.value)} />
                        <div className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-2 rtl:left-2">
                            <IconSearch />
                        </div>

                    </div>
                    <div className="text-xs text-white-dark ">Recent 25 Student</div>

                    {/* <div className="flex items-center justify-between text-xs">
                        <button type="button" className="hover:text-primary">
                            <IconMessagesDot className="mx-auto mb-1" />
                            Chats
                        </button>

                        <button type="button" className="hover:text-primary">
                            <IconPhone className="mx-auto mb-1" />
                            Calls
                        </button>

                        <button type="button" className="hover:text-primary">
                            <IconUserPlus className="mx-auto mb-1" />
                            Contacts
                        </button>

                        <button type="button" className="group hover:text-primary">
                            <IconBell className="mx-auto mb-1 h-5 w-5" />
                            Notification
                        </button>
                    </div> */}
                    <div className="h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>
                    <div className="!mt-0">
                        <PerfectScrollbar className="chat-users relative h-full min-h-[100px] space-y-0.5 ltr:-mr-3.5 ltr:pr-3.5 rtl:-ml-3.5 rtl:pl-3.5 sm:h-[calc(100vh_-_357px)]">
                            {loading ? (
        <ChatListSkeleton />
    ) : records && records.length > 0 ? (
                            (records?.map((data: any) => {
                                const person = data?.senderDetails ?? data;
                                const bg = getRandomColor(person?.id);
                                const isSelected = selectedUser?.id === person?.id;

                                return (
                                    <div key={person?.id}>
                                        <button
                                            type="button"
                                            className={`flex w-full rounded-md p-3 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-[#050b14] 
                        ${isSelected ? 'bg-gray-100 dark:bg-[#050b14]' : ''}`}
                                            onClick={() => { selectUser(person); joinChatHandler(person?.id?.toString() || ""); }}
                                        >
                                            {/* 1. Avatar Section */}
                                            <div className="relative flex-shrink-0">
                                                {person?.profile_image?.url ? (
                                                    <img
                                                        src={getImageUrl(person?.profile_image?.url)}
                                                        className="h-12 w-12 rounded-full object-cover"
                                                        alt=""
                                                    />
                                                ) : (
                                                    <div
                                                        className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg uppercase"
                                                        style={{ backgroundColor: bg, color: getTextColor(bg) }}
                                                    >
                                                        {`${person?.firstName?.[0] || ""}${person?.lastName?.[0] || ""}`}
                                                    </div>
                                                )}
                                                {person?.is_online && (
                                                    <div className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-success dark:border-[#0e1726]"></div>
                                                )}
                                            </div>

                                            {/* 2. Content & Time Section */}
                                            <div className="flex flex-1 flex-col min-w-0 ltr:ml-3 rtl:mr-3">
                                                <div className="flex items-center justify-between mb-1">
                                                    {/* Name - Truncates if too long */}
                                                    <h5 className={`font-semibold truncate text-sm flex-1 ltr:text-left rtl:text-right ${isSelected ? 'text-primary' : 'text-gray-800 dark:text-gray-200'}`}>
                                                        {`${person?.firstName ?? ""} ${person?.lastName ?? ""}`}
                                                    </h5>

                                                    {/* Time - Fixed at top right */}
                                                    <span className="text-[11px] font-medium text-white-dark whitespace-nowrap ltr:ml-2 rtl:mr-2">
                                                        {person?.last_seen ? formatLastSeenOnList(person?.last_seen) : ""}
                                                    </span>
                                                </div>

                                                {/* Last Message - Truncates properly now */}
                                                <div className="flex items-center justify-between">
                                                    <p className="truncate text-xs text-white-dark ltr:text-left rtl:text-right flex-1">
                                                        {data?.text ?? ""}
                                                    </p>

                                                    {/* Optional: Add unread count badge here if you have it later */}
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                );
                            }))
                            ) : (
        <div className="flex h-full items-center justify-center p-5 text-white-dark">
            No users found
        </div>
    )}
                        </PerfectScrollbar>
                    </div>
                </div>
                <div className={`absolute z-[5] hidden h-full w-full rounded-md bg-black/60 ${isShowChatMenu ? '!block xl:!hidden' : ''}`} onClick={() => setIsShowChatMenu(!isShowChatMenu)}></div>
                <div className="panel flex-1 p-0">
                    {!isShowUserChat && (
                        <div className="relative flex h-full items-center justify-center p-4">
                            <button type="button" onClick={() => setIsShowChatMenu(!isShowChatMenu)} className="absolute top-4 hover:text-primary ltr:left-4 rtl:right-4 xl:hidden">
                                <IconMenu />
                            </button>

                            <div className="flex flex-col items-center justify-center py-8">
                                <div className="mb-8 h-[calc(100vh_-_320px)] min-h-[120px] w-[280px] text-white dark:text-black md:w-[430px]">
                                    <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" className="h-full w-full" viewBox="0 0 891.29496 745.19434" xmlns-xlink="http://www.w3.org/1999/xlink">
                                        <ellipse cx="418.64354" cy="727.19434" rx="352" ry="18" fill={isDark ? '#888ea8' : '#e6e6e6'} />
                                        <path
                                            d="M778.64963,250.35008h-3.99878V140.80476a63.40187,63.40187,0,0,0-63.4018-63.40193H479.16232a63.40188,63.40188,0,0,0-63.402,63.4017v600.9744a63.40189,63.40189,0,0,0,63.4018,63.40192H711.24875a63.40187,63.40187,0,0,0,63.402-63.40168V328.32632h3.99878Z"
                                            transform="translate(-154.35252 -77.40283)"
                                            fill="#3f3d56"
                                        />
                                        <path
                                            d="M761.156,141.24713v600.09a47.35072,47.35072,0,0,1-47.35,47.35h-233.2a47.35084,47.35084,0,0,1-47.35-47.35v-600.09a47.3509,47.3509,0,0,1,47.35-47.35h28.29a22.50659,22.50659,0,0,0,20.83,30.99h132.96a22.50672,22.50672,0,0,0,20.83-30.99h30.29A47.35088,47.35088,0,0,1,761.156,141.24713Z"
                                            transform="translate(-154.35252 -77.40283)"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M686.03027,400.0032q-2.32543,1.215-4.73047,2.3-2.18994.99-4.4497,1.86c-.5503.21-1.10987.42-1.66992.63a89.52811,89.52811,0,0,1-13.6001,3.75q-3.43506.675-6.96,1.06-2.90991.33-5.87989.47c-1.41015.07-2.82031.1-4.24023.1a89.84124,89.84124,0,0,1-16.75977-1.57c-1.44043-.26-2.85009-.57-4.26025-.91a88.77786,88.77786,0,0,1-19.66992-7.26c-.56006-.28-1.12012-.58-1.68018-.87-.83008-.44-1.63965-.9-2.4497-1.38.38964-.54.81005-1.07,1.23974-1.59a53.03414,53.03414,0,0,1,78.87012-4.1,54.27663,54.27663,0,0,1,5.06006,5.86C685.25977,398.89316,685.6499,399.44321,686.03027,400.0032Z"
                                            transform="translate(-154.35252 -77.40283)"
                                            fill="#6c63ff"
                                        />
                                        <circle cx="492.14325" cy="234.76352" r="43.90974" fill="#2f2e41" />
                                        <circle cx="642.49883" cy="327.46205" r="32.68086" transform="translate(-232.6876 270.90663) rotate(-28.66315)" fill="#a0616a" />
                                        <path
                                            d="M676.8388,306.90589a44.44844,44.44844,0,0,1-25.402,7.85033,27.23846,27.23846,0,0,0,10.796,4.44154,89.62764,89.62764,0,0,1-36.61.20571,23.69448,23.69448,0,0,1-7.66395-2.63224,9.699,9.699,0,0,1-4.73055-6.3266c-.80322-4.58859,2.77227-8.75743,6.488-11.567a47.85811,47.85811,0,0,1,40.21662-8.03639c4.49246,1.16124,8.99288,3.12327,11.91085,6.731s3.78232,9.16981,1.00224,12.88488Z"
                                            transform="translate(-154.35252 -77.40283)"
                                            fill="#2f2e41"
                                        />
                                        <path
                                            d="M644.5,230.17319a89.98675,89.98675,0,0,0-46.83984,166.83l.58007.34q.72.43506,1.43995.84c.81005.48,1.61962.94,2.4497,1.38.56006.29,1.12012.59,1.68018.87a88.77786,88.77786,0,0,0,19.66992,7.26c1.41016.34,2.81982.65,4.26025.91a89.84124,89.84124,0,0,0,16.75977,1.57c1.41992,0,2.83008-.03,4.24023-.1q2.97-.135,5.87989-.47,3.52513-.39,6.96-1.06a89.52811,89.52811,0,0,0,13.6001-3.75c.56005-.21,1.11962-.42,1.66992-.63q2.26464-.87,4.4497-1.86,2.40015-1.08,4.73047-2.3a90.7919,90.7919,0,0,0,37.03955-35.97c.04-.07995.09034-.16.13038-.24a89.30592,89.30592,0,0,0,9.6499-26.41,90.051,90.051,0,0,0-88.3501-107.21Zm77.06006,132.45c-.08008.14-.1499.28-.23.41a88.17195,88.17195,0,0,1-36.48,35.32q-2.29542,1.2-4.66992,2.25c-1.31006.59-2.64991,1.15-4,1.67-.57032.22-1.14991.44-1.73.64a85.72126,85.72126,0,0,1-11.73,3.36,84.69473,84.69473,0,0,1-8.95019,1.41c-1.8501.2-3.73.34-5.62012.41-1.21.05-2.42969.08-3.6499.08a86.762,86.762,0,0,1-16.21973-1.51,85.62478,85.62478,0,0,1-9.63037-2.36,88.46592,88.46592,0,0,1-13.98974-5.67c-.52-.27-1.04-.54-1.5503-.82-.73-.39-1.46972-.79-2.18994-1.22-.54-.3-1.08008-.62-1.60986-.94-.31006-.18-.62012-.37-.93018-.56a88.06851,88.06851,0,1,1,123.18018-32.47Z"
                                            transform="translate(-154.35252 -77.40283)"
                                            fill="#3f3d56"
                                        />
                                        <path
                                            d="M624.2595,268.86254c-.47244-4.968-6.55849-8.02647-11.3179-6.52583s-7.88411,6.2929-8.82863,11.19308a16.0571,16.0571,0,0,0,2.16528,12.12236c2.40572,3.46228,6.82664,5.623,10.95,4.74406,4.70707-1.00334,7.96817-5.59956,8.90127-10.32105s.00667-9.58929-.91854-14.31234Z"
                                            transform="translate(-154.35252 -77.40283)"
                                            fill="#2f2e41"
                                        />
                                        <path
                                            d="M691.24187,275.95964c-.47245-4.968-6.5585-8.02646-11.3179-6.52582s-7.88412,6.29289-8.82864,11.19307a16.05711,16.05711,0,0,0,2.16529,12.12236c2.40571,3.46228,6.82663,5.623,10.95,4.74406,4.70707-1.00334,7.96817-5.59955,8.90127-10.32105s.00667-9.58929-.91853-14.31234Z"
                                            transform="translate(-154.35252 -77.40283)"
                                            fill="#2f2e41"
                                        />
                                        <path
                                            d="M488.93638,356.14169a4.47525,4.47525,0,0,1-3.30664-1.46436L436.00767,300.544a6.02039,6.02039,0,0,0-4.42627-1.94727H169.3618a15.02615,15.02615,0,0,1-15.00928-15.00927V189.025a15.02615,15.02615,0,0,1,15.00928-15.00928H509.087A15.02615,15.02615,0,0,1,524.0963,189.025v94.5625A15.02615,15.02615,0,0,1,509.087,298.59676h-9.63135a6.01157,6.01157,0,0,0-6.00464,6.00489v47.0332a4.474,4.474,0,0,1-2.87011,4.1958A4.52563,4.52563,0,0,1,488.93638,356.14169Z"
                                            transform="translate(-154.35252 -77.40283)"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M488.93638,356.14169a4.47525,4.47525,0,0,1-3.30664-1.46436L436.00767,300.544a6.02039,6.02039,0,0,0-4.42627-1.94727H169.3618a15.02615,15.02615,0,0,1-15.00928-15.00927V189.025a15.02615,15.02615,0,0,1,15.00928-15.00928H509.087A15.02615,15.02615,0,0,1,524.0963,189.025v94.5625A15.02615,15.02615,0,0,1,509.087,298.59676h-9.63135a6.01157,6.01157,0,0,0-6.00464,6.00489v47.0332a4.474,4.474,0,0,1-2.87011,4.1958A4.52563,4.52563,0,0,1,488.93638,356.14169ZM169.3618,176.01571A13.024,13.024,0,0,0,156.35252,189.025v94.5625a13.024,13.024,0,0,0,13.00928,13.00927H431.5814a8.02436,8.02436,0,0,1,5.90039,2.59571l49.62208,54.1333a2.50253,2.50253,0,0,0,4.34716-1.69092v-47.0332a8.0137,8.0137,0,0,1,8.00464-8.00489H509.087a13.024,13.024,0,0,0,13.00928-13.00927V189.025A13.024,13.024,0,0,0,509.087,176.01571Z"
                                            transform="translate(-154.35252 -77.40283)"
                                            fill="#3f3d56"
                                        />
                                        <circle cx="36.81601" cy="125.19345" r="13.13371" fill="#6c63ff" />
                                        <path
                                            d="M493.76439,275.26947H184.68447a7.00465,7.00465,0,1,1,0-14.00929H493.76439a7.00465,7.00465,0,0,1,0,14.00929Z"
                                            transform="translate(-154.35252 -77.40283)"
                                            fill={isDark ? '#888ea8' : '#e6e6e6'}
                                        />
                                        <path
                                            d="M393.07263,245.49973H184.68447a7.00465,7.00465,0,1,1,0-14.00929H393.07263a7.00464,7.00464,0,0,1,0,14.00929Z"
                                            transform="translate(-154.35252 -77.40283)"
                                            fill={isDark ? '#888ea8' : '#e6e6e6'}
                                        />
                                        <path
                                            d="M709.41908,676.83065a4.474,4.474,0,0,1-2.87011-4.1958v-47.0332a6.01157,6.01157,0,0,0-6.00464-6.00489H690.913a15.02615,15.02615,0,0,1-15.00928-15.00927V510.025A15.02615,15.02615,0,0,1,690.913,495.01571H1030.6382a15.02615,15.02615,0,0,1,15.00928,15.00928v94.5625a15.02615,15.02615,0,0,1-15.00928,15.00927H768.4186a6.02039,6.02039,0,0,0-4.42627,1.94727l-49.62207,54.1333a4.47525,4.47525,0,0,1-3.30664,1.46436A4.52563,4.52563,0,0,1,709.41908,676.83065Z"
                                            transform="translate(-154.35252 -77.40283)"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M709.41908,676.83065a4.474,4.474,0,0,1-2.87011-4.1958v-47.0332a6.01157,6.01157,0,0,0-6.00464-6.00489H690.913a15.02615,15.02615,0,0,1-15.00928-15.00927V510.025A15.02615,15.02615,0,0,1,690.913,495.01571H1030.6382a15.02615,15.02615,0,0,1,15.00928,15.00928v94.5625a15.02615,15.02615,0,0,1-15.00928,15.00927H768.4186a6.02039,6.02039,0,0,0-4.42627,1.94727l-49.62207,54.1333a4.47525,4.47525,0,0,1-3.30664,1.46436A4.52563,4.52563,0,0,1,709.41908,676.83065ZM690.913,497.01571A13.024,13.024,0,0,0,677.9037,510.025v94.5625A13.024,13.024,0,0,0,690.913,617.59676h9.63135a8.0137,8.0137,0,0,1,8.00464,8.00489v47.0332a2.50253,2.50253,0,0,0,4.34716,1.69092l49.62208-54.1333a8.02436,8.02436,0,0,1,5.90039-2.59571h262.2196a13.024,13.024,0,0,0,13.00928-13.00927V510.025a13.024,13.024,0,0,0-13.00928-13.00928Z"
                                            transform="translate(-154.35252 -77.40283)"
                                            fill="#3f3d56"
                                        />
                                        <path
                                            d="M603.53027,706.11319a89.06853,89.06853,0,0,1-93.65039,1.49,54.12885,54.12885,0,0,1,9.40039-12.65,53.43288,53.43288,0,0,1,83.90967,10.56994C603.2998,705.71316,603.41992,705.91318,603.53027,706.11319Z"
                                            transform="translate(-154.35252 -77.40283)"
                                            fill="#6c63ff"
                                        />
                                        <circle cx="398.44256" cy="536.68841" r="44.20157" fill="#2f2e41" />
                                        <circle cx="556.81859" cy="629.4886" r="32.89806" transform="translate(-416.96496 738.72884) rotate(-61.33685)" fill="#ffb8b8" />
                                        <path
                                            d="M522.25039,608.79582a44.74387,44.74387,0,0,0,25.57085,7.9025,27.41946,27.41946,0,0,1-10.8677,4.47107,90.22316,90.22316,0,0,0,36.85334.20707,23.852,23.852,0,0,0,7.71488-2.64973,9.76352,9.76352,0,0,0,4.762-6.36865c.80855-4.61909-2.7907-8.81563-6.53113-11.64387a48.17616,48.17616,0,0,0-40.4839-8.08981c-4.52231,1.169-9.05265,3.144-11.99,6.77579s-3.80746,9.23076-1.0089,12.97052Z"
                                            transform="translate(-154.35252 -77.40283)"
                                            fill="#2f2e41"
                                        />
                                        <path
                                            d="M555.5,721.17319a89.97205,89.97205,0,1,1,48.5708-14.21875A89.87958,89.87958,0,0,1,555.5,721.17319Zm0-178a88.00832,88.00832,0,1,0,88,88A88.09957,88.09957,0,0,0,555.5,543.17319Z"
                                            transform="translate(-154.35252 -77.40283)"
                                            fill="#3f3d56"
                                        />
                                        <circle cx="563.81601" cy="445.19345" r="13.13371" fill="#6c63ff" />
                                        <path
                                            d="M1020.76439,595.26947H711.68447a7.00465,7.00465,0,1,1,0-14.00929h309.07992a7.00464,7.00464,0,0,1,0,14.00929Z"
                                            transform="translate(-154.35252 -77.40283)"
                                            fill={isDark ? '#888ea8' : '#e6e6e6'}
                                        />
                                        <path
                                            d="M920.07263,565.49973H711.68447a7.00465,7.00465,0,1,1,0-14.00929H920.07263a7.00465,7.00465,0,0,1,0,14.00929Z"
                                            transform="translate(-154.35252 -77.40283)"
                                            fill={isDark ? '#888ea8' : '#e6e6e6'}
                                        />
                                        <ellipse cx="554.64354" cy="605.66091" rx="24.50394" ry="2.71961" fill={isDark ? '#888ea8' : '#e6e6e6'} />
                                        <ellipse cx="335.64354" cy="285.66091" rx="24.50394" ry="2.71961" fill={isDark ? '#888ea8' : '#e6e6e6'} />
                                    </svg>
                                </div>
                                <p className="mx-auto flex max-w-[190px] justify-center rounded-md bg-white-dark/20 p-2 font-semibold">
                                    <IconMessage className="ltr:mr-2 rtl:ml-2" />
                                    Click User To Chat
                                </p>
                            </div>
                        </div>
                    )}
                    {isShowUserChat && selectedUser ? (
                        <div className="relative h-full">
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                    <button type="button" className="hover:text-primary xl:hidden" onClick={() => setIsShowChatMenu(!isShowChatMenu)}>
                                        <IconMenu />
                                    </button>
                                    <div className="relative flex-none">
                                        {/* <img src={selectedUser?.profile_image ? getImageUrl(selectedUser?.profile_image?.url) : ``} className="h-10 w-10 rounded-full object-cover sm:h-12 sm:w-12" alt="" /> */}
                                        {selectedUser?.profile_image ? (
                                            <img
                                                src={getImageUrl(selectedUser?.profile_image?.url)}
                                                className="h-10 w-10 rounded-full object-cover"
                                                alt=""
                                            />
                                        ) : (
                                            <div
                                                className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-md uppercase"
                                                style={{ backgroundColor: profileBg, color: getTextColor(profileBg) }}
                                            >
                                                {`${selectedUser?.firstName?.[0] || ""}${selectedUser?.lastName?.[0] || ""}`}
                                            </div>
                                        )}
                                        {selectedUser?.is_online && <div className="absolute bottom-0 ltr:right-0 rtl:left-0">
                                            <div className="h-4 w-4 rounded-full bg-success"></div>
                                        </div>}
                                    </div>
                                    <div className="mx-3">
                                        <p className="font-semibold">{`${selectedUser?.firstName} ${selectedUser?.lastName}`}</p>
                                        <div className="h-4 overflow-hidden">
                                            {typers?.length ? (
                                                <p className="text-xs text-green-700">Typing...</p>
                                            ) : (
                                                <p className="text-xs text-white-dark">{selectedUser?.is_online ? 'Active now' : formatLastSeen(selectedUser?.last_seen)}</p>

                                            )}
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>

                            <PerfectScrollbar
                                // containerRef={(ref) => (scrollRef.current = ref)}
                                className="chat-conversation-box relative h-full sm:h-[calc(100vh_-_300px)]"
                            >
                                <div className="min-h-[400px] space-y-5 p-4 pb-[68px] sm:min-h-[300px] sm:pb-0">
                                    {messages && messages.length ? (
                                        <>
                                            {Object.entries(groupMessagesByDate(messages)).map(([dateKey, msgs]) => (
                                                <div key={dateKey}>
                                                    {/* 🗓️ Date Divider (same UI as before) */}
                                                    <div className="m-6 mt-0 block">
                                                        <h4 className="relative border-b border-[#f4f4f4] text-center text-xs dark:border-gray-800">
                                                            <span className="relative top-2 bg-white px-3 dark:bg-black">
                                                                {formatDateLabel(dateKey)}
                                                            </span>
                                                        </h4>
                                                    </div>
                                                    <div className="space-y-5">
                                                        {/* 💬 Messages for that date */}
                                                        {msgs.map((message: any, index: number) => {
                                                            const isSender = Number(message.sender) === Number(session?.user?.id);
                                                            const isMentor = session?.user?.role === "mentor";
                                                            const isStudent = session?.user?.role === "student";

                                                            // ✅ Avatar logic (no UI change)
                                                            let avatarSrc = "";

                                                            if (isMentor) {
                                                                avatarSrc = !isSender
                                                                    ? selectedUser?.profile_image
                                                                        ? getImageUrl(selectedUser.profile_image.url)
                                                                        : ""
                                                                    : session?.user?.profileImage
                                                                        ? `${getImageUrl(session?.user?.profileImage)}`
                                                                        : "";
                                                            }
                                                            //   console.log('avatarSrc', {avatarSrc});
                                                            let bg: any;
                                                            if (isMentor) {
                                                                bg = getRandomColor(session?.user?.id);
                                                            } else {
                                                                bg = getRandomColor(selectedUser?.id);
                                                            }
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className={`flex items-start gap-3 ${isSender ? "justify-end" : "justify-start"
                                                                        }`}
                                                                >
                                                                    {/* Avatar */}
                                                                    <div className={`flex-none ${isSender ? "order-2" : ""}`}>
                                                                        {/* <img
                                                                            src={avatarSrc}
                                                                            className="h-10 w-10 rounded-full object-cover"
                                                                            alt="avatar"
                                                                        /> */}
                                                                        {avatarSrc ? (
                                                                            <img
                                                                                src={avatarSrc}
                                                                                className="h-8 w-8 rounded-full object-cover"
                                                                                alt="avatar"
                                                                            />
                                                                        ) : (
                                                                            <div
                                                                                className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                                                                                style={{ backgroundColor: bg, color: getTextColor(bg) }}
                                                                            >
                                                                                {isSender ?
                                                                                    `${(session?.user?.username ?? "A").charAt(0)}`.toUpperCase()
                                                                                    : `${(selectedUser?.firstName ?? "A").charAt(0)}${(selectedUser?.lastName ?? "").charAt(0)}`.toUpperCase()}
                                                                            </div>
                                                                        )}


                                                                    </div>

                                                                    {/* Message bubble */}
                                                                    <div className="space-y-2 max-w-[70%]">
                                                                        <div
                                                                            className={`rounded-md px-4 py-2 text-sm ${isSender
                                                                                ? "bg-primary text-white ltr:rounded-br-none rtl:rounded-bl-none"
                                                                                : "bg-black/10 dark:bg-gray-800 ltr:rounded-bl-none rtl:rounded-br-none text-gray-900 dark:text-gray-100"
                                                                                }`}
                                                                        >
                                                                            {message.file ? (
                                                                                (message?.file?.mime?.includes("image") || message?.file[0]?.mime?.includes("image")) ? (
                                                                                    <img
                                                                                        src={getImageUrl((message?.file?.url || message?.file[0]?.url) ?? "")}
                                                                                        alt="uploaded"
                                                                                        className="max-w-[200px] rounded-md cursor-pointer"
                                                                                        onClick={() => window.open(getImageUrl((message?.file?.url || message?.file[0]?.url) ?? ""), "_blank")}
                                                                                    />
                                                                                ) : (
                                                                                    <div className='flex items-center justify-between gap-3'>
                                                                                        <a
                                                                                            href={getImageUrl((message?.file?.url || message?.file[0]?.url) ?? "")}
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                            className="underline flex items-center gap-2"
                                                                                        >
                                                                                            <IconTxtFile /> {(message?.file?.name || message?.file[0]?.name) ?? "Download File"}

                                                                                        </a>
                                                                                        <button
                                                                                            onClick={() => downloadFile(getImageUrl((message?.file?.url || message?.file[0]?.url) ?? ""), (message?.file?.name || message?.file[0]?.name) ?? "Download File")}
                                                                                            // download
                                                                                            className="hover:opacity-80 transition bg-black/20 hover:bg-black/30 transition px-2 py-1 text-white rounded"
                                                                                            title="Download File"
                                                                                        >
                                                                                            <IconDownload className={`w-5 h-5 ${isSender ? 'text-white' : 'text-black'}`} />
                                                                                        </button>
                                                                                    </div>
                                                                                )
                                                                            ) : (
                                                                                <>{message.text}</>
                                                                            )}

                                                                            {/* {message.text} */}
                                                                        </div>

                                                                        {/* Time */}
                                                                        <div
                                                                            className={`text-xs text-gray-500 ${isSender ? "text-right" : "text-left"
                                                                                }`}
                                                                        >
                                                                            {formatTime(message?.publishedAt) ?? ""}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        ""
                                    )}
                                    {uploadProgress > 0 && uploadProgress <= 100 && (
                                        <div className="flex items-start justify-end gap-3">
                                            {/* Avatar (same as sender avatar) */}
                                            <div className="flex-none order-2">
                                                <img
                                                    src={session?.user?.profileImage
                                                        ? getImageUrl(session.user.profileImage)
                                                        : ""
                                                    }
                                                    className="h-10 w-10 rounded-full object-cover"
                                                    alt="avatar"
                                                />
                                            </div>

                                            <div className="space-y-2 max-w-[70%] order-1">
                                                <div className="rounded-md bg-primary text-white px-4 py-3 text-sm ltr:rounded-br-none rtl:rounded-bl-none shadow">

                                                    {uploadingFile?.type?.includes("image") && (
                                                        <div className="w-[180px] h-[120px] bg-gray-300 animate-pulse rounded-md mb-2" />
                                                    )}

                                                    <div className="text-xs opacity-90">
                                                        Uploading {uploadingFile?.name || "file"}…
                                                    </div>

                                                    <div className="w-full bg-white/20 h-1 rounded-full mt-2">
                                                        <div
                                                            className="bg-white h-1 rounded-full transition-all"
                                                            style={{ width: `${uploadProgress}%` }}
                                                        />
                                                    </div>

                                                    <div className="text-right text-[10px] opacity-80 mt-1">
                                                        {uploadProgress}%
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </PerfectScrollbar>

                            <div className="absolute bottom-0 left-0 w-full p-4">
                                <div className="w-full items-center space-x-3 rtl:space-x-reverse sm:flex">
                                    <div className="relative flex-1">
                                        <input
                                            className="form-input rounded-full border-0 bg-[#f4f4f4] px-12 py-2 focus:outline-none"
                                            placeholder="Type a message"
                                            value={textMessage}
                                            onChange={(e: any) => setTextMessage(e.target.value)}
                                            onKeyUp={sendMessageHandle}
                                        />
                                        {showEmojiPicker && (
                                            <div ref={emojiPickerRef} className="absolute bottom-12 left-0">
                                                <AppEmojiPicker onSelect={handleEmojiClick} />
                                            </div>
                                        )}
                                        <button onClick={() => setShowEmojiPicker((prev) => !prev)} type="button" className="absolute top-1/2 -translate-y-1/2 hover:text-primary ltr:left-4 rtl:right-4">
                                            <IconMoodSmile />
                                        </button>
                                        <button type="button" className="absolute top-1/2 -translate-y-1/2 hover:text-primary ltr:right-4 rtl:left-4" onClick={() => sendMessage()}>
                                            <IconSend />
                                        </button>
                                    </div>
                                    <div className="hidden items-center space-x-3 py-3 rtl:space-x-reverse sm:block sm:py-0">
                                        {/* <button type="button" disabled className="rounded-md bg-[#f4f4f4] p-2 hover:bg-primary-light hover:text-primary dark:bg-[#1b2e4b]">
                                            <IconMicrophoneOff />
                                        </button> */}

                                        {/* <button type="button" className="rounded-md bg-[#f4f4f4] p-2 hover:bg-primary-light hover:text-primary dark:bg-[#1b2e4b]">
                                          <input type="file" />  <IconUpload className='text-black'/>
                                        </button> */}
                                        <label
                                            htmlFor="file-upload"
                                            className="cursor-pointer rounded-md bg-[#f4f4f4] p-2 hover:bg-primary-light hover:text-primary dark:bg-[#1b2e4b] inline-flex items-center justify-center"
                                        >
                                            <IconUpload className="text-gray-500 w-4.5 h-4.5" />

                                            <input
                                                id="file-upload"
                                                type="file"
                                                accept="image/*,.pdf"
                                                className="hidden"
                                                onChange={handleFileUpload}
                                            />
                                        </label>



                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        ''
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComponentsMentorChat;
