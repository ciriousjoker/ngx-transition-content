# NgxTransitionContent <sub>[(changelog)](CHANGELOG.md)</sub>

[![npm](https://img.shields.io/npm/l/ngx-transition-content.svg)](https://github.com/ciriousjoker/ngx-transition-content/blob/main/LICENSE)

Transition content: fade out old content, transition dimensions, fade in new content.

It was built for dialog content where the dialog width stays the same for every page of content.

## Compatibility

| Package version | Angular support    |
| --------------- | ------------------ |
| `2.x`           | `>=20.2.0 <23.0.0` |
| `1.x`           | `>=13.0.0`         |

Version 2 uses native CSS transitions instead of `@angular/animations`.

## Demo

https://user-images.githubusercontent.com/16866223/158490182-56702fef-d034-44f3-a71b-e5ad5bef87d7.mov

## Usage

```ts
import { Component } from "@angular/core";
import { NgxTransitionContentComponent, NgxTransitionContentPage } from "ngx-transition-content";

@Component({
  selector: "app-dialog",
  imports: [NgxTransitionContentComponent, NgxTransitionContentPage],
  templateUrl: "./dialog.html",
  standalone: true,
})
export class DialogComponent {
  slot = 0;
}
```

```html
<!--
  Update slot to the correct index to start the transition.
  Optional attributes:
    [durationFade]="300"
    [durationHeight]="300"
    [keepViewsAlive]="false"
-->
<ngx-transition-content [slot]="slot">
  <ng-template ngx-transition-content-page>
    <p>Content 1</p>
    <p>Content 1</p>
    <p>Content 1</p>
  </ng-template>

  <ng-template ngx-transition-content-page>
    <p>Content 2</p>
    <p>Content 2</p>
    <p>Content 2</p>
    <p>Content 2</p>
    <p>Content 2</p>
  </ng-template>
</ngx-transition-content>
```

By default, inactive pages are destroyed after the transition finishes. This keeps the component lightweight.

Use `keepViewsAlive` when every page should stay mounted while inactive:

```html
<ngx-transition-content [slot]="slot" keepViewsAlive>
  <ng-template ngx-transition-content-page>
    <app-login-form />
  </ng-template>

  <ng-template ngx-transition-content-page>
    <app-register-form />
  </ng-template>
</ngx-transition-content>
```

Use `keepAlive` on a single page when only that page needs to stay mounted while inactive:

```html
<ngx-transition-content [slot]="slot">
  <ng-template ngx-transition-content-page>
    <app-login-form />
  </ng-template>

  <ng-template ngx-transition-content-page keepAlive>
    <app-register-form />
  </ng-template>
</ngx-transition-content>
```

This is useful for content with internal mount animations or stateful controls that should not be recreated when the page becomes visible.

NgModule consumers can still import `NgxTransitionContentModule`.
