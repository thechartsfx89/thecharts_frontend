'use client';
import { useEffect, useRef } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    ZohoMeeting?: {
      init: (options: {
        container: HTMLElement;
        startLink: string;
        orgId: string;
        width?: string;
        height?: string;
        showChat?: boolean;
        showParticipants?: boolean;
        showToolbar?: boolean;
      }) => void;
    };
  }
}

interface ZohoMeetingEmbedProps {
  startLink: string;
  orgId: string;
}

export default function ZohoMeetingEmbed({ startLink, orgId }: ZohoMeetingEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.ZohoMeeting || !containerRef.current) return;

    window.ZohoMeeting.init({
      container: containerRef.current,
      startLink,
      orgId,
      width: '100%',
      height: '100%',
      showChat: true,
      showParticipants: true,
      showToolbar: true,
    });
  }, [startLink, orgId]);

  return (
    <>
      {/* Load Zoho SDK safely */}
      <Script
        src="https://meeting.zoho.in/meeting-av-sdk/v1.0/zoho-meeting-sdk.js"
        strategy="beforeInteractive"
        onError={(e) => console.error('Zoho AV SDK failed to load', e)}
      />
      <div
        ref={containerRef}
        className="w-full h-[80vh] rounded-2xl panel bg-gray-100"
      >
        {!window.ZohoMeeting && <p className="text-center mt-4">Loading Zoho Meeting...</p>}
      </div>
    </>
  );
}
