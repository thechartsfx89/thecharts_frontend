// ✅ WhatsApp-like "Last Seen"
export function formatLastSeen(timestamp?: string | Date): string {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = diffMs / 1000;
  const diffMin = diffSec / 60;
  const diffHr = diffMin / 60;
  const diffDay = diffHr / 24;

  const timeStr = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (diffMin < 1) return "just now";
  if (diffHr < 1) return `last seen ${Math.floor(diffMin)} min ago`;
  if (diffDay < 1) return `last seen at ${timeStr}`;

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return `last seen yesterday at ${timeStr}`;
  }

  const dateStr = date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
  });

  return `last seen on ${dateStr} at ${timeStr}`;
}

export function formatLastSeenOnList(timestamp?: string | Date): string {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = diffMs / 1000;
  const diffMin = diffSec / 60;
  const diffHr = diffMin / 60;
  const diffDay = diffHr / 24;

  const timeStr = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (diffMin < 1) return "just now";
  if (diffDay < 1) return `${timeStr}`;

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return `yesterday`;
  }

  const dateStr = date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
  });

  return `${dateStr}`;
}

// ✅ Format Date Header (for chat groups)
export function formatDateLabel(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ✅ Group Messages by Date
export function groupMessagesByDate(messages: any[]): Record<string, any[]> {
  const groups: Record<string, any[]> = {};

  messages.forEach((msg) => {
    const date = new Date(msg.publishedAt);
    const dateKey = date.toDateString();
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(msg);
  });

  return groups;
}

// ✅ Format Time (for each message bubble)
export function formatTime(ts: string | number | Date): string {
  return new Date(ts)
    .toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();
}

export function formatDateTime(ts: string | number | Date): string {
  const date = new Date(ts);

  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

 

  return `${formattedDate}`;
}

export function formatDateAndTime(ts: string | number | Date): string {
  const date = new Date(ts);

  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formattedTime = date
    .toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();

  return `${formattedDate} ${formattedTime}`;
}



export function formatCourseLength(seconds:any) {
  const hours = seconds / 3600;
  const minutes = seconds / 60;

  if (hours < 1) {
    return `${Math.round(minutes)} min`;
  } else {
    return `${hours.toFixed(1)} hr`;
  }
}

export function formatPlaylistCourseLength(totalSeconds: number) {
  if (!totalSeconds || isNaN(totalSeconds)) return "0:00";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  // If less than 1 hour → show M:SS
  if (hours === 0) {
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  // If 1 hour or more → show H:MM:SS
  return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

export function formatDateTimeUTC(ts: string | number | Date): string {
  const date = new Date(ts);

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();

  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
export function formatDateUTC(ts: string | number | Date): string {
  const date = new Date(ts);

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();

  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${day}/${month}/${year}`;
}
export function formatDateTimeIST(ts: string | number | Date): string {
  const date = new Date(ts);

  // IST = UTC + 5:30
  const ist = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);

  const day = String(ist.getDate()).padStart(2, '0');
  const month = String(ist.getMonth() + 1).padStart(2, '0');
  const year = ist.getFullYear();

  const hours = String(ist.getHours()).padStart(2, '0');
  const minutes = String(ist.getMinutes()).padStart(2, '0');
  const seconds = String(ist.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} IST`;
}