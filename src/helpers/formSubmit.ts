import { SyntheticEvent } from "react";
import { pipe } from "fp-ts/function";
import { filter } from "fp-ts/Array";
import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";

import type { ValidatorType } from '~/components/Field';

type FormEvent = SyntheticEvent<HTMLFormElement>;
export type FormDataItem = [string, FormDataEntryValue];
export type FormDataMatrix = Array<FormDataItem>;
export type ErrorsList = Array<{ fieldId: string, message: string }>;

const getFormData = (e: FormEvent): [string, FormDataEntryValue][] => pipe(e,
	O.fromNullable,
	O.chain((ev) => O.fromNullable(ev.currentTarget)),
	O.map(target => new FormData(target)),
	O.map((formData) => [...formData.entries()]),
	O.fold(() => [], (res) => res),
);

const getValidatorKeys = (validators: ValidatorType): string[] => pipe(validators,
	O.fromNullable,
	O.chain(v => O.fromNullable(Object.keys(v))),
	O.fold(() => [], (res) => res),
);

const hasAllRequiredBeenFilled = (formData: FormDataMatrix) =>
	(keys: Array<string>) =>
		keys.every(key =>
			formData.some((matrix: FormDataItem) => matrix[0] === key && !!matrix[1]));

const isFieldRequired = (requiredKeys: Array<string>) =>
	(field: FormDataItem) =>
		requiredKeys.some((key) => key === field[0]);

const getValidationErrorsList = (validators: ValidatorType) =>
	(fieldList: FormDataItem) =>
		fieldList.reduce((acc: ErrorsList, item) => {
			const [fieldId, fieldValue] = item;
			const validationRes = validators[fieldId]?.(fieldValue);

			return E.isLeft(validationRes)
				? acc.concat(validationRes.left)
				: acc
		}, []);

const errorsOnRequiredFields = (validators: ValidatorType, formData: FormDataMatrix): ErrorsList => {
	const validatorKeys = getValidatorKeys(validators);
	console.log('errors2 parameters', { validators, formData });

	return pipe(formData,
		filter(isFieldRequired(validatorKeys)),
		O.fromNullable,
		O.fold(
			() => [],
			getValidationErrorsList(validators),
		),
	)
}

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

export const handleSubmit = (e: FormEvent, requiredValidators: ValidatorType): void => {
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