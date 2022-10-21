import { pipe } from "fp-ts/lib/function";
import * as E from 'fp-ts/Either'
import * as RE from 'fp-ts/ReaderEither'
import * as A from 'fp-ts/Array';
import { SyntheticEvent } from "react";
import { isRight } from "fp-ts/lib/Either";

import type { ValidatorType } from '../components/Field';

type FormEvent = SyntheticEvent<HTMLFormElement>;
type ErrorsList = Array<{ fieldId: string, message: string }>;

// IMPERATIVE VERSION USING FUNCTIONAL HELPERS
const getFormData = (e: FormEvent): any => {
    if(!e?.currentTarget) return null;
    const formData = new FormData(e?.currentTarget);
    return [...formData.entries()];
};

const getValidatorKeys = (validators: ValidatorType): string[] => {
    return Object.keys(validators);
};

const hasAllRequiredBeenFilled = (keys: string[], formData: any) => keys.every(key => 
    formData.some((matrix) => matrix[0] === key && !!matrix[1]));

const isFieldRequired = (fieldId: string, keys: string[]) => 
    keys.some(key => key === fieldId);

const errorsOnRequiredFields = (validators: ValidatorType, formData: any): ErrorsList => formData.reduce(
    (acc: ErrorsList, field: any) => {
        const [ fieldId, fieldValue ] = field;
        const validatorKeys = getValidatorKeys(validators);

        if(!isFieldRequired(fieldId, validatorKeys)) return acc;

        const checkValidity = validators[fieldId]?.(fieldValue);
        if(isRight(checkValidity)) return acc;
        
        acc.push({ fieldId, message: checkValidity.left });
        return acc;
}, []);

const showUserFeedback = (errorsList: ErrorsList) => {
    if(!errorsList?.length) {
        alert('Everything is fine, everything is cool 😎');
        return location.pathname = '';
    }

    return errorsList.forEach(err => alert(`${err.fieldId}: ${err.message}`))
}

export const handleSubmit = (e: FormEvent, requiredValidators: any): void => {
    e.preventDefault();
    
    const validatorKeys = getValidatorKeys(requiredValidators);
    const formMatrix: Array<string> = getFormData(e);

    if(!hasAllRequiredBeenFilled(validatorKeys, formMatrix))
        return alert('Please fill all required fields');

    const errorsList: ErrorsList = errorsOnRequiredFields(requiredValidators, formMatrix);
    return showUserFeedback(errorsList);
}

// FUNCTIONAL VERSION USING SEPARATED FN

/*export const handleSubmit = (e: FormEvent, requiredValidators: ValidatorType) => {
    e.preventDefault();
}*/