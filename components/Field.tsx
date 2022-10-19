import { SyntheticEvent, useState, createContext, useContext } from "react";

import styles from '../styles/field.module.css';

type InputValue = string | boolean | null;

interface Props extends Partial<HTMLInputElement> {
    fieldId: string,
    label: string,
    isRequired?: boolean,
}

type ValidatorType = { ['string']: Function }[] | [];

export const FormContext = createContext<ValidatorType>([]);

export default function Field({ fieldId, label, isRequired = false, ...props }: Props) {
    const validators = useContext<any>(FormContext);
    const [data, setData] = useState<InputValue>(null);

    const shouldValidateUser = isRequired && validators[fieldId];
    const isDataValid = validators[fieldId]?.(data);
    

    console.log(`isDataValid from ${fieldId}`, isDataValid)

    const setNewValue = (e: SyntheticEvent<HTMLInputElement>) => {
        const isCheckbox = e.currentTarget.getAttribute('type') === 'checkbox';
        return setData(isCheckbox ? e.currentTarget.checked : e.currentTarget.value);
    }

    const RequiredFeedback = () => {
        const verifierString = isDataValid?.right ? '✅' : '❌';
        return (
            <div className={`${styles.warnSign} ${isDataValid && styles.isPassing}`}>
                {shouldValidateUser ? verifierString : '⚫️'}
            </div>
        )
    }

    return (
        <div className={styles.field}>
            <label htmlFor={fieldId}>{label}</label>
            <div className={styles.inputWrap}>
                <input
                    {...props}
                    className={ isDataValid ? 'is-passing' : 'is-failing'}
                    onChange={setNewValue}
                    id={fieldId}
                    name={fieldId}
                    required={isRequired}
                />
                <RequiredFeedback />
            </div>
            <div className={styles.warnText} aria-live="polite">{shouldValidateUser && JSON.stringify(isDataValid)}</div>
        </div>
    )
}