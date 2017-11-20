import {Dictionary} from "../cmn/core/Dictionary";
import {Culture} from "../cmn/core/Culture";

export class TranslateService {
    private dictionary: Dictionary = Culture.getDictionary();
    private static instance: TranslateService;

    private constructor() {
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

    public static getInstance(): TranslateService {
        if (!TranslateService.instance) {
            TranslateService.instance = new TranslateService();
        }
        return TranslateService.instance;
    }
}