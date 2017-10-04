import {DateTimeFactory, Dictionary, GregorianDate, I18N, IDateTime, ILocale, IR, PersianDate, US} from "../medium";
import {Dictionary as persian} from "../cmn/locale/fa-IR/Dictionary";
import {Dictionary as english} from "../cmn/locale/en-US/Dictionary";

export class I18nService {
    private i18nLocale: ILocale;
    private dictionary: Dictionary;
    private static instance;

    constructor(private locale: string) {
        this.initLocales();
    }

    private initLocales() {
        this.i18nLocale = this.locale == IR.code ? IR : US;
        const dateTime: IDateTime = this.locale == IR.code ? PersianDate : GregorianDate;
        I18N.registerLocale(this.i18nLocale);
        I18N.registerDictionary(this.i18nLocale.code);
        DateTimeFactory.register(this.i18nLocale.code, dateTime);
        this.dictionary = I18N.getDictionary(this.locale);
        this.dictionary.inject(this.locale == IR.code ? persian : english);
        //
        // this.apiService.get<any, IVocabs>(`lang/${this.locale}`)
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