import * as t from 'io-ts';

const isValidHex = (hex: string) => {
	const hexRegex = new RegExp('^#+([a-fA-F0-9]{8}|[a-fA-F0-9]{6}|[a-fA-F0-9]{3})$', 'g');
	return typeof hex === 'string' && hexRegex.test(hex);
}

type ColorHexBrand = { readonly ColorHex: unique symbol };

export const ColorHexCodec = t.brand(t.string,
	(hex): hex is t.Branded<string, ColorHexBrand> => isValidHex(hex),
	'ColorHex',
);

export type ColorHex = t.TypeOf<typeof ColorHexCodec>;