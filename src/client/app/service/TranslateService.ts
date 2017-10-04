import {I18nService} from "./I18nService";
import {Dictionary} from "../medium";
import {ConfigService} from "./ConfigService";

export class TranslateService {
    private dictionary: Dictionary;
    private static instance: TranslateService;

    constructor(i18nService: I18nService) {
        this.dictionary = i18nService.getDictionary();
    }

    public translate = (key: string, ...placeholders: Array<any>): string => {
        if (!key) return '';
        let tr = this.dictionary.lookup(key);
        if (!tr) return key;
        if (!placeholders.length) return tr;
        for (let i = 0, il = placeholders.length; i < il; ++i) {
            tr = tr.replace('%', placeholders[i]);
        }
        return tr;
    }

    public static getInstance(i18n: I18nService = I18nService.getInstance(ConfigService.getConfig().locale)): TranslateService {
        if (!TranslateService.instance) {
            TranslateService.instance = new TranslateService(i18n);
        }
        return TranslateService.instance;
    }
}