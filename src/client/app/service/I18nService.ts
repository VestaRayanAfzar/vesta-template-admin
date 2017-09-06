import {DateTimeFactory, Dictionary, GregorianDate, I18N, ILocale, IR, PersianDate, US} from "../medium";

export class I18nService {
    private i18nLocale: ILocale;
    private dictionary: Dictionary;
    private static instance;

    constructor(private locale: string) {
        this.initLocales();
    }

    private initLocales() {
        I18N.registerLocale(IR);
        I18N.registerLocale(US);
        I18N.registerDictionary(IR.code);
        I18N.registerDictionary(US.code);
        DateTimeFactory.register(IR.code, PersianDate);
        DateTimeFactory.register(US.code, GregorianDate);
        //
        this.i18nLocale = I18N.getLocale(this.locale);
        this.dictionary = I18N.getDictionary(this.locale);
        //
        // this.apiService.get<any, IVocabs>(`vocabs/${this.locale}`)
        //     .then(vocabs=>this.dictionary.inject(vocabs));
    }

    public get(property?: string) {
        if (!property) return this.i18nLocale;
        return this.i18nLocale[property];
    }

    public getDictionary(): Dictionary {
        return this.dictionary;
    }

    public static getInstance(locale: string): I18nService {
        if (!I18nService.instance) {
            I18nService.instance = new I18nService(locale);
        }
        return I18nService.instance;
    }
}