# NgxTransitionContent <sub>[(changelog)](CHANGELOG.md)</sub>

[![npm](https://img.shields.io/npm/l/ngx-transition-content.svg)](https://github.com/ciriousjoker/ngx-transition-content/blob/main/LICENSE)

Transition content: Fade out, transition dimensions, fade in.

It was built for dialog content where the dialog width stays the same for every page of content.
Read the caveats before using it.

## Transition

> Fade out old content -> transition dimensions to fit the new content -> fade in new content

### Demo

https://user-images.githubusercontent.com/16866223/158490182-56702fef-d034-44f3-a71b-e5ad5bef87d7.mov

## Usage:

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
