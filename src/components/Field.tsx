import { reduce } from "fp-ts/Array";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { fromPredicate, map, getOrElse } from "fp-ts/Option";
import {
	createContext, SyntheticEvent, useContext, useState
} from "react";

import { ErrorsList, ERROR_MSG } from '~/helpers/validators';
import styles from '~/styles/field.module.scss';

type InputValue = string | boolean | null;
type ValidationEither = E.Either<ErrorsList, string[]>;
type ValidatorProps = { errors: ValidationEither };
export type ValidatorType = { [key: string]: () => E.Either<string, string> }[];

interface Props extends Partial<HTMLInputElement> {
	fieldId: string,
	label: string,
	isRequired?: boolean,
}

export const FormContext = createContext<ValidatorType>([]);

export const Field: React.FC<Props> = ({ fieldId, label, isRequired = false, ...props }) => {
	const validators = useContext<any>(FormContext);
	const [hasInteracted, setHasInteracted] = useState<boolean>(false);
	const [data, setData] = useState<InputValue>(null);

	const shouldValidateUser = isRequired && !!validators[fieldId];
	const shouldShowFeedback = shouldValidateUser && hasInteracted;
	
	const validationErrors: ValidationEither = pipe(data,
		fromPredicate((d) => !!d),
		map(d => validators[fieldId]?.(d)),
		getOrElse(() => E.left([{ fieldId, message: ERROR_MSG.NO_CONTENT }])),
	)

	const setNewValue = (e: SyntheticEvent<HTMLInputElement>) => {
		const isCheckbox = e.currentTarget.getAttribute('type') === 'checkbox';
		return setData(isCheckbox ? e.currentTarget.checked : e.currentTarget.value);
	}

	const formatErrorString = (acc: string, value: ErrorsList[0]) => acc += ` ${value.message}; `;

	const validateOnBlur = (e: SyntheticEvent<HTMLInputElement>) => {
		hasInteracted || setHasInteracted(true);
		setNewValue(e);
	}

	const ErrorStringAnnouncer = ({ errors }: { errors: ValidationEither }) =>
		pipe(errors,
			E.fold(
				reduce('', formatErrorString),
				() => '',
			),
			(str) => {
				return (
					<span className={styles.warnText}>{str}</span>
				)
			}
		)

	const RequiredFeedback = ({ errors }: ValidatorProps) => {
		const hasSomeErrors = E.isLeft(errors);

		return (
			<div
				aria-label={`${fieldId} ${hasSomeErrors ? 'has some issues' : 'OK'}`}
				className={styles.warnSign}
			>
				{hasSomeErrors ? '❌' : '✅'}
			</div>
		)
	}

	return (
		<div className={styles.field}>
			<label htmlFor={fieldId}>{label}</label>
			<div className={styles.inputWrap}>
				<input
					{...props}
					className={validationErrors && styles.fieldFailing}
					onBlur={validateOnBlur}
					onChange={(e) => hasInteracted && setNewValue(e)}
					id={fieldId}
					name={fieldId}
					required={isRequired}
				/>
				{shouldShowFeedback && (<RequiredFeedback errors={validationErrors} />)}
				<div aria-live="polite">
					{shouldShowFeedback && (<ErrorStringAnnouncer errors={validationErrors} />)}
				</div>
			</div>
		</div>
	)
}