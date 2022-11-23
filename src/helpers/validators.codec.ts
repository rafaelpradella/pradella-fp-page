import { PathReporter } from 'io-ts/PathReporter';
import * as t from 'io-ts';
import { withMessage } from 'io-ts-types';
import { pipe } from 'fp-ts/function';

type NameBrand = { readonly Name: unique symbol };
type PasswordBrand = { readonly Password: unique symbol };

const Name = t.brand(t.string,
  (name): name is t.Branded<string, NameBrand> => name.length > 1,
  'Name'
);

const Password = t.brand(t.string,
  (pwd): pwd is t.Branded<string, PasswordBrand> => pwd.length > 1 && pwd.endsWith('!'),
  'Password',
);

const FormResponseCodec = t.type({
  name: withMessage(Name, () => 'Please fill your name' ),
  password: Password,
  isSigned: t.boolean
})

export function Tester() {
  console.log('coded reporter',
    PathReporter.report(FormResponseCodec.decode(
      { name: 'All', password: 'asdfg!', isSigned: true }
    ))
  )
};





