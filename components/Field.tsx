import { SyntheticEvent, useState, createContext, useContext } from "react";
import * as E from "fp-ts/lib/Either";

import styles from '../styles/field.module.css';

type InputValue = string | boolean | null;

interface Props extends Partial<HTMLInputElement> {
    fieldId: string,
    label: string,
    isRequired?: boolean,
}

export type ValidatorType = { ['string']: () => E.Either<unknown, string> }[] | [];

export const FormContext = createContext<ValidatorType>([]);

export default function Field({ fieldId, label, isRequired = false, ...props }: Props) {
    const validators = useContext<any>(FormContext);
    const [hasInteracted, setHasInteracted] = useState<boolean>(false);
    const [data, setData] = useState<InputValue>(null);

    const shouldValidateUser = isRequired && !!validators[fieldId];
    const validatedInput: E.Either<string, string> = validators[fieldId]?.(data);
    const shouldShowFeedback = shouldValidateUser && hasInteracted;
    
    console.log(`validatedInput from ${fieldId}`, validatedInput)

    const setNewValue = (e: SyntheticEvent<HTMLInputElement>) => {
        const isCheckbox = e.currentTarget.getAttribute('type') === 'checkbox';
        return setData(isCheckbox ? e.currentTarget.checked : e.currentTarget.value);
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
                {`${ validatedInput?.left } `}
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
                    onBlur={() => !hasInteracted && setHasInteracted(true) }
                    onChange={setNewValue}
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