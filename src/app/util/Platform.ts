export enum OperatingSystem { window = 1, Linux, Macintosh, Android, iOS, BlackBerry }

export function isAndroid(): boolean {
    const { os } = getInfo();
    return os === OperatingSystem.Android;
}

export function isIOS(): boolean {
    const { os } = getInfo();
    return os === OperatingSystem.iOS;
}

export function isDevice() {
    const { isMobile } = getInfo();
    return isMobile;
}

export function isPWA(): boolean {
    return (window.navigator as any).standalone;
}

export function isCordova() {
    return typeof window !== "undefined" && "cordova" in window;
}

function getInfo() {
    let isMobile = false;
    let os: OperatingSystem = null;

    const userAgent = window.navigator.userAgent;
    if (userAgent.match(/Android/i)) {
        isMobile = true;
        os = OperatingSystem.Android;
    } else if (userAgent.match(/BlackBerry/i)) {
        isMobile = true;
        os = OperatingSystem.BlackBerry;
    } else if (userAgent.match(/iPhone|iPad|iPod/i)) {
        isMobile = true;
        os = OperatingSystem.iOS;
    } else if (userAgent.match(/Opera Mini/i)) {
        isMobile = true;
        //os = OS.IOS;
    } else if (userAgent.match(/IEMobile/i)) {
        isMobile = true;
        //os = OS.IOS;
    }

    return { isMobile, os };
}
