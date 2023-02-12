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
<br><br>

## 2: Using SASS with SvelteKit
Installing a preprocessor and SASS
```bash	
npm install svelte-preprocess sass --save-dev
```

Edit the `svelte.config.js`
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
<br><br>

## 3: Setting up global styles
To start with, I created a global.sass file in `/static/global.css`, and import it within `src/app.html`
```html
<link rel="stylesheet" href="%sveltekit.assets%/global.css" />
```
Note that I imported a .css file, so there is no need to add the SASS package to the (non-dev-)dependencies.
Instead I use the SASS compiler plugin for VSCode and set it up to watch only this global.css file in the .code-workspace
file.
```json
{
  "settings": {
		"liveSassCompile.settings.includeItems": [
        "/static/global.sass"
    ]
  }
}
```
<br><br>

## 4: Auto importing sass helpers
I have set up a `_colors.sass` file that contains variables with all colors I want to use within this project.
In order to auto import it into all svelte files, you have to add it to the svelte-preprocessor in `svelte.config.js`
```javascript
const config = {
  preprocess: preprocess({
    sass: {
      prependData: `@use 'src/sass/colors' as colors`,
    },
  }),
  // . . .
};
```
Now every file can use those colors with, for example:
```css
h1
  color: colors.$text-color

```

<br><br>
## 5: Configuring formatting on save in VSCode
Add the following lines to user settings.json
( `ctrl+shift+p -> Preferences: Open User Settings (JSON)` ) to automatically format and prettify all .svelte files on save:
```json
"[svelte]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "svelte.svelte-vscode"
}
```
