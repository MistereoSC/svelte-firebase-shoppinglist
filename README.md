A simple shared shopping list using Svelte and Firestore to learn those frameworks.



# Run and Deploy
```bash
npm run dev
```

# Notes for future projects
## 1: Setting up SvelteKit
Installing a skeleton Svelte project
```bash
npm create svelte@latest <app-name>
cd <app-name>
npm install
```

## 2: Using SASS with SvelteKit
Installing a preprocessor and SASS
```bash	
npm install svelte-preprocess sass --save-dev
```

Edit the svelte.config.js
```javascript	
import adapter from "@sveltejs/adapter-auto";
import preprocess from "svelte-preprocess"; //<--

const config = {
  preprocess: preprocess(), //<--
  kit: {
    adapter: adapter(),
  },
};

export default config;
```
In your svelte components, add `lang="sass"` to the style tag
```html
<style lang="sass">
  /** */
</style>
```
## 3: Setting up global styles
To start with, I created a styles.sass file in `/src/sass`, and import it within `src/app.html`
```html
<link rel="stylesheet" href="/src/sass/styles.sass" />
```

## 4: Configuring formatting on save in VSCode
Add the following lines to user settings.json
( `ctrl+shift+p -> Preferences: Open User Settings (JSON)` )
```json
"[svelte]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "svelte.svelte-vscode"
}
```
