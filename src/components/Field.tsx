import { 
	SyntheticEvent,
	useState,
	createContext, 
	useContext,
	HTMLAttributes,
	useCallback
} from "react";
import * as E from "fp-ts/lib/Either";

import styles from 'styles/field.module.scss';

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
	const validationErrors: E.Either<string[], string> = validators[fieldId]?.(data);
	const shouldShowFeedback = shouldValidateUser && hasInteracted;

	const setNewValue = (e: SyntheticEvent<HTMLInputElement>) => {
		const isCheckbox = e.currentTarget.getAttribute('type') === 'checkbox';
		return setData(isCheckbox ? e.currentTarget.checked : e.currentTarget.value);
	}

	const validateOnBlur = (e: SyntheticEvent<HTMLInputElement>) => {
		if (!hasInteracted) setHasInteracted(true);
		setNewValue(e);
	}


	const formatErrorsString = (errList: E.Either<string[], string>): string => {
		return E.match(
			(errList: string[]) => errList.reduce((acc, err) =>
				acc += ` ${err}; `
				, ''),
			() => '',
		)(errList);
	};


	const RequiredFeedback = () => {
		if (!shouldShowFeedback) return null;
		const hasSomeErrors = E.isLeft(validationErrors);

		return (
			<div
				aria-label={`${fieldId} ${hasSomeErrors ? 'has some issues' : 'OK'}` }
				className={styles.warnSign}
			>
				{hasSomeErrors ? '❌' : '✅'}
			</div>
		)
	}

	const formattedFeedback = useCallback(() => 
		shouldShowFeedback ? formatErrorsString(validationErrors) : ''
	, [validationErrors?.left, validationErrors?._tag]);

	return (
		<div className={styles.field}>
			<label htmlFor={fieldId}>{label}</label>
			<div className={styles.inputWrap}>
				<input
					{...props}
					className={validationErrors ? 'is-passing' : 'is-failing'}
					onBlur={validateOnBlur}
					onChange={(e) => hasInteracted && setNewValue(e)}
					id={fieldId}
					name={fieldId}
					required={isRequired}
				/>
				<RequiredFeedback />
				<div 
					className={styles.warnText}
					aria-live="polite"
				>
					{ formattedFeedback() }
				</div>
			</div>
		</div>
	)
}