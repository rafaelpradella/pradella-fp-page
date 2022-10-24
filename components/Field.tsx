import { SyntheticEvent, useState, createContext, useContext, HTMLAttributes } from "react";
import * as E from "fp-ts/lib/Either";

import styles from '../styles/field.module.scss';

type InputValue = string | boolean | null;
export type ValidatorType = { [key: string]: () => E.Either<string, string> }[];

type Props = {
    fieldId: string,
    label: string,
    isRequired?: boolean,
} & HTMLAttributes<HTMLInputElement>

export const FormContext = createContext<ValidatorType>([]);

export default function Field({ fieldId, label, isRequired = false, ...props }: Props) {
    const validators = useContext<any>(FormContext);
    const [hasInteracted, setHasInteracted] = useState<boolean>(false);
    const [data, setData] = useState<InputValue>(null);

    const shouldValidateUser = isRequired && !!validators[fieldId];
    const validatedInput: E.Either<string[], string> = validators[fieldId]?.(data);
    const shouldShowFeedback = shouldValidateUser && hasInteracted;

    const setNewValue = (e: SyntheticEvent<HTMLInputElement>) => {
        const isCheckbox = e.currentTarget.getAttribute('type') === 'checkbox';
        return setData(isCheckbox ? e.currentTarget.checked : e.currentTarget.value);
    }

    const validateOnBlur = (e: SyntheticEvent<HTMLInputElement>) => {
        if(!hasInteracted) setHasInteracted(true);
        setNewValue(e);
    }

    const displayAllErrors = (errList: E.Either<string[], string>): string => {
        console.log(errList);
        return E.match(
            (errList: string[]) => errList.reduce((acc, err) => 
                acc += ` ${err}; `
            , ''),
            () => '',
        )(errList);
    }
        

    const RequiredFeedback = () => {
        if(!shouldShowFeedback) return null;

        const verifierString = E.isLeft(validatedInput) ? '❌' : '✅';
        return (
            <div className={`${styles.warnSign} ${validatedInput && styles.isPassing}`}>
                {verifierString}
            </div>
        )
    }

    const ErrorMessage = () => {
        if(!shouldShowFeedback) return null;

        return (
            <div className={styles.warnText} aria-live="polite">
                {displayAllErrors(validatedInput)}
            </div>
        )
    }

    return (
        <div className={styles.field}>
            <label htmlFor={fieldId}>{label}</label>
            <div className={styles.inputWrap}>
                <input
                    {...props}
                    className={ validatedInput ? 'is-passing' : 'is-failing'}
                    onBlur={validateOnBlur}
                    onChange={(e) => hasInteracted && setNewValue(e)}
                    id={fieldId}
                    name={fieldId}
                    required={isRequired}
                />
                <RequiredFeedback />
            </div>
            <ErrorMessage />
        </div>
    )
}