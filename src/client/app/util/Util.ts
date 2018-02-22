import { IValidationError } from "../medium";
import { ConfigService } from "../service/ConfigService";

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
export function validationMessage(messages: IModelValidationMessage, validationErrors: IValidationError): IFieldValidationMessage {
    const appliedMessages = {};
    for (let fieldNames = Object.keys(validationErrors), i = 0, il = fieldNames.length; i < il; ++i) {
        const fieldName = fieldNames[i];
        const failedRule = validationErrors[fieldName];
        appliedMessages[fieldName] = fieldName in messages ? messages[fieldName][failedRule] : null;
    }
    return appliedMessages;
}

export function shallowClone<T>(object: T) {
    return (JSON.parse(JSON.stringify(object))) as T;
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
    const basePath = ConfigService.getConfig().version.api;
    return `${basePath}/upl/${address || ""}`;
}
