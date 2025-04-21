import type { Config } from 'tailwindcss';
import { iconsPlugin, getIconCollections } from '@egoist/tailwindcss-icons';
import colors from 'tailwindcss/colors';

export default {
	content: [],
	theme: {
		container: {
			center: true,
		},
		extend: {
			colors: {
				primary: colors.blue,
				secondary: colors.violet,
				surface: colors.gray,
			},
		},
	},
	plugins: [
		iconsPlugin({
			collections: getIconCollections(['mdi']),
		}),
	],
} satisfies Config;
