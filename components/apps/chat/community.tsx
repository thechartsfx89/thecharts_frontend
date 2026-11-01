'use client';
import { TheChartsMark } from '@/components/pages/Landing/logo';
import Dropdown from '@/components/dropdown';
import IconBell from '@/components/icon/icon-bell';
import IconCamera from '@/components/icon/icon-camera';
import IconCopy from '@/components/icon/icon-copy';
import IconDownload from '@/components/icon/icon-download';
import IconHelpCircle from '@/components/icon/icon-help-circle';
import IconHorizontalDots from '@/components/icon/icon-horizontal-dots';
import IconLogin from '@/components/icon/icon-login';
import IconMenu from '@/components/icon/icon-menu';
import IconMessage from '@/components/icon/icon-message';
import IconMessagesDot from '@/components/icon/icon-messages-dot';
import IconMicrophoneOff from '@/components/icon/icon-microphone-off';
import IconMoodSmile from '@/components/icon/icon-mood-smile';
import IconPhone from '@/components/icon/icon-phone';
import IconPhoneCall from '@/components/icon/icon-phone-call';
import IconSearch from '@/components/icon/icon-search';
import IconSend from '@/components/icon/icon-send';
import IconSettings from '@/components/icon/icon-settings';
import IconShare from '@/components/icon/icon-share';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import IconUserPlus from '@/components/icon/icon-user-plus';
import IconVideo from '@/components/icon/icon-video';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { IRootState } from '@/store';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { connectWS } from '@/lib/websocket';
import { formatDateLabel, formatLastSeen, formatTime, groupMessagesByDate } from '@/utils/dateFormatter';
import { downloadFile, getImageUrl, getRandomColor, getTextColor } from '@/utils/common/common';
import AppEmojiPicker from '@/utils/common/emojiPicker';
import { Upload as IconUpload } from "lucide-react";
import axios from 'axios';
import IconTxtFile from '@/components/icon/icon-txt-file';
import { capitalizeSubstring } from '@/utils/helpers/capitalize';


interface ChatMessage {
    is_community: boolean;
    sender: string;
    text: string;
}
const Community = () => {
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const [allUserList, setAllUserList] = useState<any>([]);

    const [isShowChatMenu, setIsShowChatMenu] = useState(false);
    const [searchUser, setSearchUser] = useState('');
    const [isShowUserChat, setIsShowUserChat] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [textMessage, setTextMessage] = useState('');
    const [filteredItems, setFilteredItems] = useState<any>(allUserList ?? []);
    const socket = useRef<Socket | null>(null);
    const { data: session } = useSession();
    const activeChatRef = useRef<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    // console.log("Student List:", studentList);
    const [activeCount, setActiveCount] = useState<number | undefined>(0)
    const [userActiveId, setUserActiveId] = useState<any>(null)
    const [userActiveIsOnline, setUserActiveIsOnline] = useState<any>(null)
    const [userActiveIsLastSeen, setUserActiveIsLastSeen] = useState<any>(null)
    const [typers, setTypers] = useState([]);
    const timer = useRef(null);
    const fetchAllUserList = async () => {
        try {
            const response = await fetch(`/api/user/allUserList?excludeId=${session?.user?.id ?? null}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }
            );
            // console.log("Fetching mentor by ID:", response);
            const data = await response.json();
            setAllUserList(data?.data?.data ?? []);
            setActiveCount(
                () => data?.data?.data?.filter((d: any) => d)?.length || 0
            );

            // console.log("Fetched mentor list:", data.data.data);
        } catch (error) {
            console.error('Error fetching mentor list:', error);
        }
    };
    useEffect(() => {
        fetchAllUserList();
    }, []);

    useEffect(() => {
        let list = [...allUserList];

        // Sort by latest join timestamp
        list.sort((a: any, b: any) => {
            const timeA = new Date(a.joinedAt || 0).getTime();
            const timeB = new Date(b.joinedAt || 0).getTime();
            return timeB - timeA; // latest first
        });

        if (searchUser) {
            list = list.filter((d: any) =>
                d.firstName.toLowerCase().includes(searchUser.toLowerCase())
            );
        }

        setFilteredItems(list);
    }, [searchUser, allUserList]);


    const scrollToBottom = () => {

        setTimeout(() => {
            const element: any = document.querySelector('.chat-conversation-box');
            element.behavior = 'smooth';
            element.scrollTop = element.scrollHeight;
        });

    };

    useEffect(() => {
        if (messages?.length > 0) {
            const timeout = setTimeout(() => scrollToBottom(), 100);
            return () => clearTimeout(timeout);
        }
    }, [messages]);

    const fetchMessage = async () => {
        try {
            const response = await fetch("/api/chat/community",
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }
                //     {
                //     method: "GET",
                //     cache: "no-store",
                //     headers: {
                //         "Content-Type": "application/json"
                //     }
                // }
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
        fetchMessage();
    }, []);

    // const sendMessage = () => {
    //     if (textMessage.trim()) {
    //         let list = contactList;
    //         let user: any = list.find((d) => d.userId === selectedUser.userId);
    //         user.messages.push({
    //             fromUserId: selectedUser.userId,
    //             toUserId: 0,
    //             text: textMessage,
    //             time: 'Just now',
    //         });
    //         setFilteredItems(list);
    //         setTextMessage('');
    //         scrollToBottom();
    //     }
    // };


    useEffect(() => {
        // Initialize socket connection only once
        if (!socket.current) {
            socket.current = connectWS();
            console.log("🟢 Socket initialized");
        }

        const socketInstance = socket.current;

        // ✅ Handler for real-time active status
        const handleRoomNotice = ({ senderId, is_online, last_seen, joinedAt }: any) => {
            console.log("📡 roomNotice:", { senderId, is_online, last_seen });

            // Update active user info
            setUserActiveId(senderId);
            setUserActiveIsOnline(is_online);
            setUserActiveIsLastSeen(last_seen ?? "");

            // ✅ Update user list immediately when status changes
            setAllUserList((prev: any[]) =>
                prev.map((u: any) =>
                    u.id === senderId ? { ...u, is_online, joinedAt: joinedAt ?? u.joinedAt } : u
                )
            );
        };

        // 🔥 Listen once for roomNotice
        socketInstance.on("roomNotice", handleRoomNotice);

        // 🧹 Cleanup
        return () => {
            socketInstance.off("roomNotice", handleRoomNotice);
        };
    }, []);




    useEffect(() => {
        if (!socket.current) {
            socket.current = connectWS();
        }
        const socketInstance: any = socket.current;
        const userId = session?.user?.id;
        socketInstance.emit("joinCommunity", { senderId: userId });

        const handleNewMessage = (msg: any) => {
            if (msg?.is_community) {
                console.log("💬 Received:", msg);
                setMessages((prev) => [...prev, msg]);
            }
        };

        socketInstance.on("newMessage", handleNewMessage);

        socketInstance.on('typing', (typingUserId: any) => {
            setTypers((prev: any) => {
                // find the user in allUserList
                const typingUser = allUserList.find((user: any) => user.id === typingUserId);
                if (!typingUser) return prev; // skip if user not found

                const name = typingUser.firstName ?? "";

                // avoid duplicates
                if (prev.includes(name)) return prev;

                return [...prev, name];
            });
        });

        socketInstance.on('stopTyping', (typingUserId: any) => {
            const typingUser = allUserList.find((user: any) => user.id === typingUserId);
            const name = typingUser?.firstName ?? "";

            setTypers((prev) => prev.filter((typer: any) => typer !== name));
        });


        return () => {
            // console.log("🚪 Leaving community:", userId);
            socketInstance.emit("leaveCommunity", { senderId: userId });
            socketInstance.off("newMessage", handleNewMessage);
            socket.current.off('typing');
            socket.current.off('stopTyping');
        };
    }, [session?.user?.id]);

    const typingUserId = session?.user?.id
    useEffect(() => {
        if (textMessage) {
            socket.current.emit('typing', typingUserId);
            clearTimeout(timer.current);
        }

        timer.current = setTimeout(() => {
            socket.current.emit('stopTyping', typingUserId);
        }, 1000);

        return () => {
            clearTimeout(timer.current);
        };
    }, [textMessage, typingUserId]);

    const sendMessage = () => {
        if (!textMessage.trim() || !socket.current) return;

        const newMsg: ChatMessage = {
            sender: session?.user?.id ?? "",
            text: textMessage ?? "",
            is_community: true
        };

        // Emit message to server
        socket.current.emit("sendMessage", newMsg);
        // setMessages((prev) => [newMsg]);
        setTextMessage("");
        setTimeout(() => scrollToBottom(), 300);
    };
    const sendMessageHandle = (event: any) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };
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
                is_community: true
                // receiver: selectedUser?.id,
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
    return (
        <div>
            <div className={`relative flex h-full gap-5 sm:h-[calc(100vh_-_150px)] sm:min-h-0 ${isShowChatMenu ? 'min-h-[999px]' : ''}`}>

                <div className={`absolute z-[5] hidden h-full w-full rounded-md bg-black/60 ${isShowChatMenu ? '!block xl:!hidden' : ''}`} onClick={() => setIsShowChatMenu(!isShowChatMenu)}></div>
                <div className="panel flex-1 p-0">


                    <div className="relative h-full">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <button type="button" className="hover:text-primary xl:hidden" onClick={() => setIsShowChatMenu(!isShowChatMenu)}>
                                    <IconMenu />
                                </button>
                                <div className=" flex items-center">
                                    <TheChartsMark className="h-9 w-9" />

                                </div>

                                <div className="mx-3">
                                    <p className="font-bold text-xl text-dark">Community</p>
                                    <div className="h-4 overflow-hidden">
                                        {typers.length ? (
                                            <p className="text-xs text-green-700">{typers.join(", ")} is typing...</p>
                                        ) : (
                                            <p className="text-xs text-transparent">‎</p> // invisible placeholder
                                        )}
                                    </div>
                                </div>

                            </div>
                            <div className="flex gap-3 sm:gap-5">

                            </div>
                        </div>
                        <div className="h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>

                        <PerfectScrollbar


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

                                                        // ✅ Get sender info from your student list
                                                        const sender = allUserList?.find((u: any) => Number(u?.id) === Number(message?.sender));

                                                        // ✅ Avatar logic
                                                        let avatarSrc = "";

                                                        if (isSender) {
                                                            avatarSrc =
                                                                session?.user?.profileImage
                                                                    ? `${getImageUrl(session?.user?.profileImage)}?t=${Date.now()}`
                                                                    : session?.user?.profile_img_path ? `${process.env.NEXT_PUBLIC_PROFILE_IMG_URL}/uploads/${session?.user?.profile_img_path}` : "/assets/images/fallback-profile.png"
                                                            // session?.user?.profileImage
                                                            //     ? getImageUrl(session?.user?.profileImage)
                                                            //     : "";
                                                        } else {
                                                            avatarSrc =
                                                                sender?.profile_image?.url
                                                                    ? `${getImageUrl(sender?.profile_image?.url)}?t=${Date.now()}`
                                                                    : sender?.profile_img_path ? `${process.env.NEXT_PUBLIC_PROFILE_IMG_URL}/uploads/${sender?.profile_img_path}` : "/assets/images/fallback-profile.png"
                                                            // sender?.profile_image?.url
                                                            //     ? getImageUrl(sender?.profile_image?.url)
                                                            //     : "";
                                                        }
                                                        const bg = getRandomColor(sender?.id);
                                                        return (
                                                            <div
                                                                key={index}
                                                                className={`flex items-start gap-3 ${isSender ? "justify-end" : "justify-start"}`}
                                                            >
                                                                {/* Avatar */}
                                                                <div className={`flex-none ${isSender ? "order-2" : ""}`}>
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
                                                                            {`${(sender?.firstName ?? "A").charAt(0)}${(sender?.lastName ?? "").charAt(0)}`.toUpperCase()}
                                                                        </div>
                                                                    )}

                                                                </div>

                                                                {/* Message container */}
                                                                <div className="max-w-[70%] space-y-1 ">
                                                                    <div
                                                                        className={`relative rounded-xl px-3 py-2 text-sm shadow-sm 
                                                                            ${message.file && (message?.file?.mime?.includes("image") || message?.file[0]?.mime?.includes("image")) ? 'pb-[26px]' : 'pr-[70px]'} 
                                                                            ${isSender
                                                                                ? "bg-primary text-white ltr:rounded-br-none rtl:rounded-bl-none"
                                                                                : "bg-gray-100 dark:bg-gray-800 ltr:rounded-bl-none rtl:rounded-br-none text-gray-900 dark:text-gray-100"
                                                                            }`}
                                                                    >
                                                                        {/* Sender Name */}
                                                                        {!isSender && (
                                                                            <div
                                                                                className="text-[12px] font-bold mb-0.5"
                                                                                style={{ color: getRandomColor(message?.sender) }}
                                                                            >
                                                                                {`${sender?.firstName ?? ""} ${sender?.lastName ?? ""}` || "Anonymous"}
                                                                            </div>
                                                                        )}

                                                                        {/* Message Text */}
                                                                        <div className="flex items-end justify-between gap-2">
                                                                            <div className="whitespace-pre-line break-words leading-snug">
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
                                                                                    <>{message.text} </>

                                                                                )}
                                                                                {/* {message.text} */}
                                                                            </div>

                                                                            {/* ✅ WhatsApp-style time with small gap */}
                                                                            <div
                                                                                className={`text-[10px] absolute right-2  
                                                                            ${message.file && (message?.file?.mime?.includes("image") || message?.file[0]?.mime?.includes("image")) ? 'bottom-1' : 'mb-[-7px]'} 
                                                                                    
                                                                                    ${isSender ? "text-white/80" : "text-gray-500"
                                                                                    }`}
                                                                            >
                                                                                {formatTime(message?.publishedAt) ?? ""}
                                                                            </div>
                                                                        </div>

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
                                            {/* <img
                                                src={session?.user?.profileImage
                                                    ? getImageUrl(session.user.profileImage)
                                                    : ""
                                                }
                                                className="h-10 w-10 rounded-full object-cover"
                                                alt="avatar"
                                            /> */}

                                            {(session?.user?.profileImage || session?.user?.profile_img_path) ? (
                                                <img
                                                    src={
                                                        session?.user?.profileImage
                                                            ? `${getImageUrl(session?.user?.profileImage)}?t=${Date.now()}`
                                                            : session?.user?.profile_img_path ? `${process.env.NEXT_PUBLIC_PROFILE_IMG_URL}/uploads/${session?.user?.profile_img_path}` : "/assets/images/fallback-profile.png"
                                                    }
                                                    className="h-10 w-10 rounded-full object-cover"
                                                    alt=""
                                                />
                                            ) : (
                                                <div
                                                    className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-[12px] uppercase"
                                                    style={{ backgroundColor: getRandomColor(session?.user?.id), color: getTextColor(getRandomColor(session?.user?.id)) }}
                                                >
                                                    {session?.user?.fullName
                                                        ?.split(' ')
                                                        .map((name: any) => name[0])
                                                        .slice(0, 2)
                                                        .join('')}

                                                </div>
                                            )}
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
                                    <button type="button" className="rounded-md bg-[#f4f4f4] p-2 hover:bg-primary-light hover:text-primary dark:bg-[#1b2e4b]">
                                        <IconHorizontalDots className="opacity-70" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                {/* <div className={`panel absolute z-10 hidden h-full w-full max-w-xs flex-none space-y-4 overflow-hidden p-4 xl:relative xl:block ${isShowChatMenu ? '!block' : ''}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="flex-none">
                                {(session?.user?.profileImage || session?.user?.profile_img_path) ? (
                                    <img
                                        src={
                                            session?.user?.profileImage
                                                ? `${getImageUrl(session?.user?.profileImage)}?t=${Date.now()}`
                                                : session?.user?.profile_img_path ? `${process.env.NEXT_PUBLIC_PROFILE_IMG_URL}/uploads/${session?.user?.profile_img_path}` : "/assets/images/fallback-profile.png"
                                        }
                                        className="h-10 w-10 rounded-full object-cover"
                                        alt=""
                                    />
                                ) : (
                                    <div
                                        className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-[12px] uppercase"
                                        style={{ backgroundColor: getRandomColor(session?.user?.id), color: getTextColor(getRandomColor(session?.user?.id)) }}
                                    >
                                        {session?.user?.fullName
                                            ?.split(' ')
                                            .map((name: any) => name[0])
                                            .slice(0, 2)
                                            .join('')}

                                    </div>
                                )}
                            </div>
                            <div className="mx-3">
                                <p className="mb-1 font-semibold">{session?.user?.fullName ?? ""}</p>
                                <p className="text-xs text-white-dark">{session?.user?.role ?? ""}</p>
                            </div>
                        </div>

                    </div>
                    <div className="relative">
                        <input type="text" className="peer form-input ltr:pr-9 rtl:pl-9" placeholder="Searching..." value={searchUser} onChange={(e) => setSearchUser(e.target.value)} />
                        <div className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-2 rtl:left-2">
                            <IconSearch />
                        </div>
                    </div>
                    <div className="mx-3">
                        <p className="mb-1 font-semibold">Members ({activeCount != 0 ? activeCount - 1 : 0})</p>
                    </div>

                    <div className="h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>
                    <div className="!mt-0">
                        <PerfectScrollbar className="chat-users relative h-full min-h-[100px] space-y-0.5 ltr:-mr-3.5 ltr:pr-3.5 rtl:-ml-3.5 rtl:pl-3.5 sm:h-[calc(100vh_-_357px)]">
                            {filteredItems?.filter((e: any) => Number(e?.id) !== Number(session?.user?.id))?.map((person: any) => {
                                const bg = getRandomColor(person?.id);
                                return (
                                    <div key={person?.documentId}>
                                        <button
                                            type="button"
                                            className={`flex w-full items-center justify-between rounded-md p-2 hover:bg-gray-100 hover:text-primary dark:hover:bg-[#050b14] dark:hover:text-primary ${selectedUser && selectedUser.id === person.id ? 'bg-gray-100 text-primary dark:bg-[#050b14] dark:text-primary' : ''
                                                }`}
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center">
                                                    <div className="relative flex-shrink-0">
                                                       
                                                        {(person?.profile_image?.url || person?.profile_img_path) ? (
                                                            <img
                                                                src={
                                                                    person?.profile_image?.url
                                                                        ? `${getImageUrl(person?.profile_image?.url)}?t=${Date.now()}`
                                                                        : person?.profile_img_path ? `${process.env.NEXT_PUBLIC_PROFILE_IMG_URL}/uploads/${person?.profile_img_path}` : "/assets/images/fallback-profile.png"
                                                                }
                                                                className="h-10 w-10 rounded-full object-cover"
                                                                alt=""
                                                            />
                                                        ) : (
                                                            <div
                                                                className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-[12px] uppercase"
                                                                style={{ backgroundColor: bg, color: getTextColor(bg) }}
                                                            >
                                                                {person?.fullName
                                                                    ?.split(' ')
                                                                    .map((name: any) => name[0])
                                                                    .slice(0, 2)
                                                                    .join('')}

                                                            </div>
                                                        )}
                                                        {person?.is_online && (
                                                            <div>
                                                                <div className="absolute bottom-0 ltr:right-0 rtl:left-0">
                                                                    <div className="h-4 w-4 rounded-full bg-success"></div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="mx-3 ltr:text-left rtl:text-right">
                                                        <p className="mb-1 font-semibold">{`${capitalizeSubstring(person?.fullName)}`} <span className='text-xs text-white-dark'>{person?.role?.name == "mentor" ? `(${person?.role?.name})` : ""}</span></p>
                                                        <p className="max-w-[185px] truncate text-xs text-white-dark">{person?.is_online ? 'Active now' : formatLastSeen(person?.last_seen)}</p>

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="whitespace-nowrap text-xs font-semibold">
                                                <p>{person?.time ?? ""}</p>
                                            </div>
                                        </button>
                                    </div>
                                );
                            })}
                        </PerfectScrollbar>
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default Community;
