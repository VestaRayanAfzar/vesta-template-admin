import { IrDate, IrLocale } from "@vesta/culture-ir";
import { UsDate, UsLocale } from "@vesta/culture-us";
import { ClientApp } from "./ClientApp";
import { SourceApp } from "./cmn/models/User";
import { IrVocabs } from "./cmn/vocabs/IrVocabs";
import { UsVocabs } from "./cmn/vocabs/UsVocabs";
import { appConfig } from "./config/appConfig";
import { Culture } from "./medium";
import { Config } from "./service/Config";
import { LogService } from "./service/LogService";

// initial configurations
Config.init(appConfig);
Config.set("sourceApp", SourceApp.Panel);
Config.set("splashTimeout", 2000);

// initiating locale
Culture.register(IrLocale, IrVocabs, IrDate);
Culture.register(UsLocale, UsVocabs, UsDate);
loadLocale();

window.addEventListener("DOMContentLoaded", checkScripts, false);

// checking whether or not the prerequisite scripts are loaded
function checkScripts() {
    const OFFLINE_ASSUMPTION_DURATION = 30000;
    const SCRIPT_CHECK_INTERVAL = 300;
    const scriptsToCheck = [];
    if (appConfig.env !== "production") {
        // do not waste time in development
        scriptsToCheck.splice(0, scriptsToCheck.length);
    }
    let scriptCheckCounter = 0;
    (function check() {
        ++scriptCheckCounter;
        if (scriptCheckCounter * SCRIPT_CHECK_INTERVAL > OFFLINE_ASSUMPTION_DURATION) {
            return document.body.classList.add("app-offline");
        }
        for (let i = scriptsToCheck.length; i--;) {
            if (!(scriptsToCheck[i] in window)) {
                // check every 300ms
                return setTimeout(check, 300);
            }
        }
        startApp();
    })();
}

function startApp() {
    const client = new ClientApp();
    client.init();
    client.run();
}

(window as any).loadLocale = loadLocale;

function loadLocale(code?: string, reload?: boolean) {
    let locale = null;
    let selectedCode = code || localStorage.getItem("culture");
    try {
        locale = Culture.getLocale(selectedCode);
    } catch (e) {
        LogService.error(e.message, "loadLocale", "app.ts");
    }
    if (!locale) {
        locale = Culture.getLocale();
    }
    selectedCode = locale.code;
    localStorage.setItem("culture", selectedCode);
    Culture.setDefault(selectedCode);
    // loading style
    // reloading application
    if (reload) {
        return location.reload();
    }
    setTimeout(() => {
        const style = document.createElement("link");
        style.setAttribute("rel", "stylesheet");
        style.setAttribute("href", `css/app-${locale.dir}.css?v=${Date.now()}`);
        (document.querySelector("head") as HTMLHeadElement).appendChild(style);
    }, 10);
}
