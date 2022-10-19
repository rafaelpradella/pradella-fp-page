import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function';

type ValidationReturn = E.Either<string, string>

const MIN_LENGTH = 6;
const ERROR_MSG = {
    NO_CONTENT: 'Where is the data???',
    LENGTH: 'Need up to 6 characters',
    CAPITAL_LETTER: 'At Least ONE Capital Letter',
    NUMBER: 'At least 1 number',
} as const;

const hasContent = (s: string): ValidationReturn =>
    (s?.length > 0) ? E.right(s) : E.left(ERROR_MSG.NO_CONTENT)

const minLenght = (s: string): ValidationReturn =>
    (s?.length > MIN_LENGTH) ? E.right(s) : E.left(ERROR_MSG.LENGTH)

const oneCapital = (s: string): ValidationReturn =>
    (/[A-Z]/g.test(s)) ? E.right(s) : E.left(ERROR_MSG.CAPITAL_LETTER)

const oneNumber = (s: string): ValidationReturn =>
    (/[0-9]/g.test(s)) ? E.right(s) : E.left(ERROR_MSG.NUMBER)

export const validateName = (s: string): ValidationReturn => hasContent(s);

export const validatePassword = (s: string): ValidationReturn =>
    pipe(s,
        minLenght,
        E.chain(oneCapital),
        E.chain(oneNumber),
    )

