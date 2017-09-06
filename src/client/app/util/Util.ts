import {IModelValues, IValidationError} from "../medium";

export interface ModelValidationMessage {
    // {fieldName: {ruleName: error message}}
    [fieldName: string]: { [ruleName: string]: string };
}

export interface FieldValidationMessage {
    [fieldName: string]: string;
}

export class Util {
    /**
     *  This method filters the error messages specified by validationErrors
     *
     */
    static validationMessage(messages: ModelValidationMessage, validationErrors: IValidationError): FieldValidationMessage {
        let appliedMessages = {};
        for (let fieldNames = Object.keys(validationErrors), i = 0, il = fieldNames.length; i < il; ++i) {
            let fieldName = fieldNames[i];
            let failedRule = validationErrors[fieldName];
            appliedMessages[fieldName] = fieldName in messages ? messages[fieldName][failedRule] : null;
        }
        return appliedMessages;
    }

    static getModelValue(target: HTMLFormElement, fieldNames: Array<string>): IModelValues {
        let modelValues: IModelValues = {};
        for (let i = fieldNames.length; i--;) {
            let fieldName = fieldNames[i];
            modelValues[fieldName] = fieldName in target ? target[fieldName].value : null;
        }
        return modelValues;
    }

    static shallowClone<T>(object: T) {
        return <T>(JSON.parse(JSON.stringify(object)));
    }
}