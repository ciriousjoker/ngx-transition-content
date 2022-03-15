# NgxTransitionContent <sub>[(changelog)](CHANGELOG.md)</sub>

[![npm](https://img.shields.io/npm/l/ngx-transition-content.svg)](https://github.com/ciriousjoker/ngx-transition-content/blob/main/LICENSE)

Switch between content: Fade out, transition height, fade in.

It was built for dialog content where the dialog width stays the same for every page of content.
Read the caveats before using it.

### Transition

> Fade out old content -> transition height to fit the new content -> fade in new content

### Usage:

```html
<!--
  Update slot to the correct index to start the transition.
  Optional attributes:
    [durationFade]="300"
    [durationHeight]="300"
-->
<ngx-transition-content [slot]="0">
  <ng-template ngx-transition-content-page>
    <p>Content1</p>
    <p>Content1</p>
    <p>Content1</p>
  </ng-template>
  <ng-template ngx-transition-content-page>
    <p>Content2</p>
    <p>Content2</p>
    <p>Content2</p>
    <p>Content2</p>
    <p>Content2</p>
  </ng-template>
</ngx-transition-content>
```

- Content pages need to be `ng-template`s amd have `ngx-transition-content-page`

### Caveats:

- Code to make the transition work reliably isn't pretty, if you have a better solution, feel free to make a PR!
- It only transitions height, not width! I couldn't figure out how to make it work and it wasn't necessary for our use case. Feel free to make a PR!

---

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.2.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
