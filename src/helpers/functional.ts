import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';

export const logPipe = <V>(id?: string) => (value: V): V => {
	console.log(id ?? 'pipe', value);
	return value;
};

export const lift = <E, A>(check: (a: A) => E.Either<E, A>) => 
	(a: A): E.Either<NonEmptyArray<E>, A> =>  
			pipe(a,
				check,
				E.mapLeft(a => [a])
			)