# Generator de Conținut AI 🤖

O aplicație web modernă pentru generarea automată de conținut pentru multiple platforme sociale folosind inteligența artificială. Construită cu React, Vite, și Supabase.

## Caracteristici 🌟

- Generare de conținut pentru multiple platforme sociale
- Autentificare securizată prin Supabase
- Interfață intuitivă și responsivă
- Suport pentru teme light/dark
- Editor de conținut cu previzualizare în timp real
- Istoric al conținutului generat
- Formatare automată pentru fiecare platformă socială

## Tehnologii Utilizate 💻

- React 18
- Vite
- TypeScript
- Tailwind CSS
- Supabase (Autentificare & Bază de date)
- Zustand (Management stare)
- React Markdown
- Lucide React (Iconițe)
- React Hot Toast (Notificări)
- Date-fns (Formatare date)

## Instalare și Rulare 🚀

1. Clonează repository-ul:
```bash
git clone [url-repository]
cd generator-continut-ai
```

2. Instalează dependențele:
```bash
npm install
```

3. Configurează variabilele de mediu:
Creează un fișier `.env` în directorul rădăcină și adaugă:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Pornește serverul de dezvoltare:
```bash
npm run dev
```

## Structura Proiectului 📁

```
src/
├── components/     # Componente React
├── hooks/         # Hook-uri personalizate
├── lib/           # Configurări biblioteci
├── services/      # Servicii API
├── store/         # Management stare (Zustand)
├── types/         # Definiții TypeScript
└── utils/         # Utilități și helper-uri
```

## Contribuție 🤝

Contribuțiile sunt binevenite! Pentru modificări majore, vă rugăm să deschideți mai întâi o problemă pentru a discuta ce doriți să schimbați.

## Licență 📄

[MIT](https://choosealicense.com/licenses/mit/)

## Contact 📧

Pentru întrebări și suport, vă rugăm să deschideți o problemă în repository.