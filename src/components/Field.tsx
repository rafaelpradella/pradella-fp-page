import { 
	SyntheticEvent,
	useState,
	createContext, 
	useContext,
	HTMLAttributes,
} from "react";
import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";
import * as A from "fp-ts/lib/Array";

import styles from 'styles/field.module.scss';
import { ErrorsList } from "helpers/validators";
import { logPipe } from "helpers/functional";

type InputValue = string | boolean | null;
type ValidatorProps = { errors: E.Either<string[], string> };
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

	const formatErrorString = (acc: string, value: ErrorsList[0]) => acc += ` ${value.message}; `;
	
	const validateOnBlur = (e: SyntheticEvent<HTMLInputElement>) => {
		if (!hasInteracted) setHasInteracted(true);
		setNewValue(e);
	}
	
	const ErrorStringAnnouncer = ({ errors }: { errors: E.Either<ErrorsList, string> }) =>
		pipe(errors,
			E.fold(
				A.reduce('', formatErrorString),
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
				aria-label={`${fieldId} ${hasSomeErrors ? 'has some issues' : 'OK'}` }
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
				{ shouldShowFeedback && (<RequiredFeedback errors={validationErrors} />)}
				<div aria-live="polite">
					{ shouldShowFeedback && (<ErrorStringAnnouncer errors={validationErrors} />)}
				</div>
			</div>
		</div>
	)
}