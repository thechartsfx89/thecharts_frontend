// utils/device.js
export const getHardwareId = () => {
    if (typeof window === 'undefined') return null;
    
    // Combining hardware traits that don't change between browsers
    const hardwareTraits = [
        navigator.platform,
        window.screen.width + 'x' + window.screen.height,
        navigator.hardwareConcurrency, // CPU Cores
        // We avoid UserAgent here because it changes per browser
    ];
    
    return btoa(hardwareTraits.join('|')); 
};