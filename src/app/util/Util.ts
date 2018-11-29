import { IValidationError } from "@vesta/core";
import { Config } from "../service/Config";

export interface IModelValidationMessage {
    // {fieldName: {ruleName: error message}}
    [fieldName: string]: { [ruleName: string]: string };
}

export interface IFieldValidationMessage {
    [fieldName: string]: string;
}

/**
 *  This method filters the error messages specified by validationErrors
 *
 */
// tslint:disable-next-line:max-line-length
export function validationMessage(messages: IModelValidationMessage, validationErrors: IValidationError): IFieldValidationMessage {
    const appliedMessages = {};
    for (let fieldNames = Object.keys(validationErrors), i = 0, il = fieldNames.length; i < il; ++i) {
        const fieldName = fieldNames[i];
        const failedRule = validationErrors[fieldName];
        appliedMessages[fieldName] = fieldName in messages ? messages[fieldName][failedRule] : null;
    }
    return appliedMessages;
}

export function shallowClone<T>(object: T): T {
    if (!object) { return object; }
    // return (JSON.parse(JSON.stringify(object))) as T;
    const clone: T = {} as T;
    for (let keys = Object.keys(object), i = keys.length; i--;) {
        clone[keys[i]] = object[keys[i]];
    }
    return clone;
}

export function launchLink(link: string, target: string = "_blank") {
    const a = document.createElement("a");
    a.setAttribute("href", link);
    a.setAttribute("target", target);
    // let dispatch = document.createEvent("HTMLEvents");
    // dispatch.initEvent("click", true, true);
    const ev = new MouseEvent("click");
    a.dispatchEvent(ev);
}

export function getFileUrl(address: string) {
    const api = Config.getConfig().api;
    return `${api}/upl/${address || ""}`;
}
