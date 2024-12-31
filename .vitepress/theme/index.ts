import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import './styles/custom.css';
import './styles/vars.css';

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // slots personnalisés si nécessaire
    });
  },
  enhanceApp({ app }) {
    // enregistrer des composants si nécessaire
  },
} satisfies Theme;
