'use client'
export const getImageUrl = (url: string) => {
  if (!url) return "/assets/images/fallback-profile.png";
  if (url.startsWith("https")) return url;
  return `${process.env.NEXT_PUBLIC_URL}${url}`;
};

export const getCourseUrl = (url: string) => {
  if (!url) return "/no-thumbnail.jpg";
  if (url.startsWith("https")) return url;
  return `${process.env.NEXT_PUBLIC_URL}${url}`;
};

export const downloadFile = async (
    url: string,
    fileName: string
) => {
    const response = await fetch(url);
    const blob = await response.blob();

    const blobUrl = window.URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = blobUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();

    anchor.remove();
    window.URL.revokeObjectURL(blobUrl);
};

 export const getRandomColor = (id: any) => {
    const colors = [
        "#0F766E", // Soft Teal
        "#2563EB", // Medium Indigo Blue
        "#6D28D9", // Soft Purple
        "#B91C1C", // Soft Red
        "#C2410C", // Soft Orange
        "#15803D", // Soft Green
        "#1E40AF", // Muted Royal Blue
        "#7C3AED", // Vibrant Purple (not too dark)
        "#0E7490", // Light Cyan Teal
        "#D97706", // Amber
        "#1D4ED8", // Softer Navy Blue
        "#9333EA", // Medium Lavender
    ];
    return colors[id % colors.length];
};


   export const getTextColor = (bg: any) => {
        const c = bg?.substring(1); // remove #
        const rgb = parseInt(c, 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = rgb & 0xff;

        // luminance formula
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b);

        return luminance > 150 ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.85)";
    };
  export const getInitials = (name = "") => {
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
};
