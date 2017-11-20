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

window.addEventListener('DOMContentLoaded', startApp, false);

function startApp() {
    document.body.classList.remove('has-splash');
    let client = new ClientApp();
    client.init();
    client.run();
}