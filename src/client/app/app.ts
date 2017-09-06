import {ClientApp} from "./ClientApp";
import {ConfigService} from "./service/ConfigService";
import {Config} from "./config/config";

ConfigService.init(Config);

//<cordova>
document.addEventListener('deviceready', startApp, false);
//</cordova>

//<!cordova>
window.addEventListener('DOMContentLoaded', startApp, false);
//</cordova>

function startApp() {
    let client = new ClientApp();
    client.init();
    client.run();
}