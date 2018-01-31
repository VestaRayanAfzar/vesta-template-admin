import {ClientApp} from "./ClientApp";
import {ConfigService} from "./service/ConfigService";
import {Config} from "./config/config";
import {Culture} from "./cmn/core/Culture";
import {IrLocale} from "./cmn/culture/ir/IrLocale";
import {IrVocabs} from "./cmn/culture/ir/IrVocabs";
import {IrDate} from "./cmn/culture/ir/IrDate";
import {SourceApp} from "./cmn/models/User";

// initial configurations
ConfigService.init(Config);
ConfigService.set('sourceApp', SourceApp.Panel);

// initiating locale
Culture.register(IrLocale, IrVocabs, IrDate);

window.addEventListener('DOMContentLoaded', checkScripts, false);

function checkScripts() {
    const OFFLINE_ASSUMPTION_DURATION = 30000;
    const SCRIPT_CHECK_INTERVAL = 300;
    const scriptsToCheck = [];
    let scriptCheckCounter = 0;
    (function check() {
        ++scriptCheckCounter;
        if (scriptCheckCounter * SCRIPT_CHECK_INTERVAL > OFFLINE_ASSUMPTION_DURATION) {
            return document.body.classList.add('app-offline');
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
    let client = new ClientApp();
    client.init();
    client.run();
}