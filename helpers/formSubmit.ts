import { pipe } from "fp-ts/lib/function";
import * as E from 'fp-ts/Either'
import * as RE from 'fp-ts/ReaderEither'
import * as A from 'fp-ts/Array';
import { SyntheticEvent } from "react";
import { isRight } from "fp-ts/lib/Either";

type FormEvent = SyntheticEvent<HTMLFormElement>;

const getFormData = (e: FormEvent): any => {
    if(!e?.currentTarget) return null;
    const formData = new FormData(e?.currentTarget);
    return [...formData.entries()];
};

// IMPERATIVE VERSION USING FUNCTIONAL HELPERS

export const handleSubmit = (e: FormEvent, requiredValidators: any) => {
    e.preventDefault();
    
    const validatorKeys = Object.keys(requiredValidators);
    const formMatrix: Array<string> = getFormData(e);
    const defaultError = 'Please fill all required fields'; 

    const checkIfFilledAllRequired = validatorKeys.every(key => {
        return formMatrix.some(matrix => {
            return matrix[0] === key && !!matrix[1]
        })
    });

    if(!checkIfFilledAllRequired) return alert(defaultError);

    const errorsOnRequiredFields: { fieldId: string, message: string }[] = formMatrix.reduce((acc, field) => {
        const [ fieldId, fieldValue ] = field;
        if(!validatorKeys.some(key => key === fieldId)) return acc;

        const checkValidity = requiredValidators[fieldId]?.(fieldValue);
        console.log(checkValidity);
        if(isRight(checkValidity)) return acc;
        
        acc.push({ fieldId, message: checkValidity.left });
        return acc;
    }, []);

    console.log('errorsOnRequiredFields', errorsOnRequiredFields);

    if(errorsOnRequiredFields?.length < 1) return alert('Everything is fine, everything is cool! 😎');
    errorsOnRequiredFields.forEach(err => alert(`${err.fieldId}: ${err.message}`));
}