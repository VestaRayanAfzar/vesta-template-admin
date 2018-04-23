import { Culture, Dictionary } from "../medium";

export class TranslateService {

    public static getInstance(): TranslateService {
        if (!TranslateService.instance) {
            TranslateService.instance = new TranslateService();
        }
        return TranslateService.instance;
    }

    private static instance: TranslateService;
    private dictionary: Dictionary = Culture.getDictionary();

    private constructor() {
    }

    public translate = (key: string, ...placeholders: any[]): string => {
        if (!key) { return ""; }
        let tr = this.dictionary.lookup(key);
        if (!tr) { return key; }
        if (!placeholders.length) { return tr; }
        for (let i = 0, il = placeholders.length; i < il; ++i) {
            tr = tr.replace("%", placeholders[i]);
        }
        return tr;
    }
}
