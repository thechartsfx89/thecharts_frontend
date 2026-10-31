"use client"
import ProviderComponent from '@/components/layouts/provider-component';
import 'react-perfect-scrollbar/dist/css/styles.css';
import '../styles/tailwind.css';
import { Metadata } from 'next';
import { Montserrat, Michroma, Mrs_Saint_Delafield, Nunito } from 'next/font/google';
import './globals.css';
import { CartProvider } from './context/cart-context';
import { SessionProvider } from 'next-auth/react';
import Script from 'next/script';

// export const metadata: Metadata = {
//     title: {
//         template: '%s | EduCandle',
//         default: 'EduCandle',
//     },
//     description: 'EduCandle',
//     icons: {
//         icon: '/favicon.ico', // default
//         shortcut: '/favicon.png', // optional
//         apple: '/favicon.png', // for iOS
//     },
// };

const montserrat = Montserrat({
    weight: ['400', '500', '600', '700', '800'],
    subsets: ['latin'],
    variable: '--font-montserrat',
});

const michroma = Michroma({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-michroma',
});

const mrsSaintDelafield = Mrs_Saint_Delafield({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-mrs-saint-delafield',
});

const nunito = Nunito({
    weight: ['400', '500', '600', '700', '800'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-nunito',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${nunito.variable} ${montserrat.variable} ${michroma.variable} ${mrsSaintDelafield.variable} font-montserrat`}>
                <Script
                    src="https://meeting.zoho.in/meeting-av-sdk/v1.0/zoho-meeting-sdk.js"
                    strategy="beforeInteractive"
                    onError={(e) => console.error('Zoho AV SDK failed to load', e)}
                />
                <SessionProvider refetchInterval={60}>
                    <ProviderComponent>
                        <CartProvider >{children}</CartProvider>
                    </ProviderComponent>
                </SessionProvider>


            </body>
        </html>
    );
}
