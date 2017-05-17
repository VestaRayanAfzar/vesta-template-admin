import {ClientApp} from "./ClientApp";
import {setting} from "./config/setting";
import {ConfigService} from "./service/ConfigService";

ConfigService.init(setting);

//<cordova>
document.addEventListener('deviceready', startApp, false);
//</cordova>

//<!cordova>
window.addEventListener('DOMContentLoaded', startApp, false);
//</cordova>

function startApp() {
    let client = new ClientApp(setting);
    client.init();
    client.run();
}