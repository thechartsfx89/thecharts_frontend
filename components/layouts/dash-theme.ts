import { Inter, Merriweather } from 'next/font/google';
import '@/components/pages/Landing/landing.css';
import './dash-panel.css';

const serif = Merriweather({ weight: ['700', '900'], subsets: ['latin'], variable: '--font-tc-serif' });
const sans = Inter({ subsets: ['latin'], variable: '--font-tc-sans' });

// Apply to a panel layout's root element to scope the shared dashboard theme to that panel
export const dashThemeClass = `tc-dash ${serif.variable} ${sans.variable}`;
