import { SyntheticEvent } from "react";
import * as E from "fp-ts/lib/Either";
import * as A from "fp-ts/Array";

import type { ValidatorType } from '../components/Field';

type FormEvent = SyntheticEvent<HTMLFormElement>;
export type FormDataMatrix = [string, string | boolean][];
export type ErrorsList = Array<{ fieldId: string, message: string }>;

const getFormData = (e: FormEvent): any => {
    if (!e?.currentTarget) return null;
    const formData = new FormData(e?.currentTarget);
    return [...formData.entries()];
};

const getValidatorKeys = (validators: ValidatorType): Array<string> => {
    return Object.keys(validators);
};

const hasAllRequiredBeenFilled = (formData: FormDataMatrix) =>
    (keys: Array<string>) =>
        keys.every(key =>
            formData.some((matrix: FormDataMatrix[0]) => matrix[0] === key && !!matrix[1]));


const isFieldRequired = (fieldId: string) =>
    (keys: Array<string>) =>
        keys.some(key => key === fieldId);

const errorsOnRequiredFields = (validators: ValidatorType, formData: FormDataMatrix): ErrorsList => formData.reduce(
    (acc: ErrorsList, field: FormDataMatrix[0]) => {
        const [fieldId, fieldValue] = field;
        const validatorKeys = getValidatorKeys(validators);

        if (!isFieldRequired(fieldId)(validatorKeys)) return acc;

        const checkValidity = validators[fieldId](fieldValue);

        if (E.isRight(checkValidity)) return acc;

        acc.push({ fieldId, message: checkValidity.left });
        return acc;
    }, []);

const generateErrorStrings = (errorsList: ErrorsList): string => {
    const ERROR_TITLE = 'Fix those issues before submitting: \n\n';

    return errorsList.reduce((acc, err) =>
        acc += `${err.fieldId}: ${err.message} \n`
        , ERROR_TITLE)
}

const getFeedbackString = (errorsList: ErrorsList): string => {
    const SUCCESS_MSG = 'Everything is fine, everything is cool 😎';

    return errorsList?.length
        ? generateErrorStrings(errorsList)
        : SUCCESS_MSG;
}

export const handleSubmit = (e: FormEvent, requiredValidators: any): void => {
    e.preventDefault();

    const validatorKeys = getValidatorKeys(requiredValidators);
    const formMatrix: FormDataMatrix = getFormData(e);

    if (!hasAllRequiredBeenFilled(formMatrix)(validatorKeys))
        return alert('Please fill all required fields');

    const errorsList: ErrorsList = errorsOnRequiredFields(requiredValidators, formMatrix);

    return !errorsList.length
        ? e.currentTarget.submit()
        : alert(getFeedbackString(errorsList));
}