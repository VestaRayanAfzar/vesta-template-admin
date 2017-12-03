import {IValidationError} from "../cmn/core/Validator";
import {ConfigService} from "../service/ConfigService";

export interface ModelValidationMessage {
    // {fieldName: {ruleName: error message}}
    [fieldName: string]: { [ruleName: string]: string };
}

export interface FieldValidationMessage {
    [fieldName: string]: string;
}


/**
 *  This method filters the error messages specified by validationErrors
 *
 */
export function validationMessage(messages: ModelValidationMessage, validationErrors: IValidationError): FieldValidationMessage {
    let appliedMessages = {};
    for (let fieldNames = Object.keys(validationErrors), i = 0, il = fieldNames.length; i < il; ++i) {
        let fieldName = fieldNames[i];
        let failedRule = validationErrors[fieldName];
        appliedMessages[fieldName] = fieldName in messages ? messages[fieldName][failedRule] : null;
    }
    return appliedMessages;
}

export function unicodeDigit<T>(number: string): T {
    if (!number) return number as any as T;
    const enChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const uniChars = [
        // persian
        ['\u06F0', '\u06F1', '\u06F2', '\u06F3', '\u06F4', '\u06F5', '\u06F6', '\u06F7', '\u06F8', '\u06F9'],
        // arabic
        ['\u06F0', '\u0661', '\u0662', '\u0663', '\u0664', '\u0665', '\u0666', '\u0667', '\u0668', '\u0669']
    ];
    let validNumber = number;
    for (let i = uniChars.length; i--;) {
        for (let j = uniChars[i].length; j--;) {
            validNumber = validNumber.replace(new RegExp(uniChars[i][j], 'g'), enChars[j]);
        }
    }
    return validNumber as any as T;
}

export function shallowClone<T>(object: T) {
    return <T>(JSON.parse(JSON.stringify(object)));
}

export function launchLink(link: string, target: string = '_blank') {
    let a = document.createElement('a');
    a.setAttribute("href", link);
    a.setAttribute("target", target);
    // let dispatch = document.createEvent("HTMLEvents");
    // dispatch.initEvent("click", true, true);
    let ev = new MouseEvent("click");
    a.dispatchEvent(ev);
}

export function getFileUrl(address: string) {
    const basePath = ConfigService.getConfig().api
    return `${basePath}/upl/${address || ''}`;
}