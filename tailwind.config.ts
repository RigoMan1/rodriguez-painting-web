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
        primary: {
          100: '#FCEDEA',
          200: '#F9DBD5',
          300: '#F4C0B6',
          400: '#F0A496',
          500: '#E0492D',
          600: '#702416',
          700: '#4E1A10',
          800: '#2D0F09',
          900: '#160704',
        },
        secondary: colors.zinc,
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
