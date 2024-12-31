import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Design Patterns TypeScript',
  description: 'Design Patterns implementations in TypeScript',
  srcDir: './src',
  base: '/',
  lang: 'fr-FR',
  lastUpdated: true,

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.png',
    nav: [
      { text: 'Accueil', link: '/' },
      { text: 'SOLID', link: '/SOLID/SOLID_principles' },
    ],

    sidebar: [
      {
        text: 'Principes SOLID',
        items: [{ text: 'Introduction', link: '/SOLID/SOLID_principles' }],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/your-username/design-patterns-typescript' }],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present',
    },

    // Fonctionnalités avancées
    outline: {
      level: [2, 3],
      label: 'Sur cette page',
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: 'Rechercher',
            buttonAriaLabel: 'Rechercher',
          },
          modal: {
            noResultsText: 'Aucun résultat pour',
            resetButtonTitle: 'Réinitialiser',
            footer: {
              selectText: 'pour sélectionner',
              navigateText: 'pour naviguer',
            },
          },
        },
      },
    },

    docFooter: {
      prev: 'Page précédente',
      next: 'Page suivante',
    },
  },
  markdown: {
    theme: 'material-theme-palenight',
    lineNumbers: false,
    anchor: {
      level: [1, 2, 3, 4],
    },
    toc: { level: [2, 3] },
    config: (md) => {
      // Personnalisation supplémentaire du markdown si nécessaire
    },
  },
});
