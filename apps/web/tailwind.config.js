/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      /* ========== BUTTON SYSTEM ========== */
      /* Toutes les valeurs sont en rem et divisibles par 4px (0.25rem) */

      /* Spacing pour les boutons (padding) */
      spacing: {
        'btn-px-sm': '0.75rem',   /* 12px - padding horizontal small */
        'btn-py-sm': '0.5rem',    /* 8px - padding vertical small */
        'btn-px-md': '1rem',      /* 16px - padding horizontal medium */
        'btn-py-md': '0.5rem',    /* 8px - padding vertical medium */
        'btn-px-lg': '1.5rem',    /* 24px - padding horizontal large */
        'btn-py-lg': '0.75rem',   /* 12px - padding vertical large */
      },

      /* Border radius pour les boutons */
      borderRadius: {
        'btn': '1rem',            /* 16px - border-radius standard */
        'btn-full': '9999px',     /* pill shape */
      },

      /* Font sizes pour les boutons */
      fontSize: {
        'btn-sm': ['0.75rem', { lineHeight: '1rem' }],    /* 12px */
        'btn-md': ['0.875rem', { lineHeight: '1.25rem' }], /* 14px */
        'btn-lg': ['1rem', { lineHeight: '1.5rem' }],     /* 16px */
      },

      /* Gap pour les boutons avec icônes */
      gap: {
        'btn': '0.5rem',          /* 8px */
      },

      /* Transitions */
      transitionDuration: {
        'btn': '300ms',
      },
    },
  },
  plugins: [],
};


