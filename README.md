<p align="center">
  <img height="256px" width="256px" style="text-align: center;" src="https://cdn.rawgit.com/pfbrowning/ng-modal/master/demo/src/assets/logo.svg">
</p>

# ng-modal - A simple, lightweight interface for creating layered modal dialogs in Angular 6

[![npm version](https://badge.fury.io/js/%40browninglogic%2Fng-modal.svg)](https://badge.fury.io/js/%40browninglogic%2Fng-modal),
[![Build Status](https://travis-ci.org/pfbrowning/ng-modal.svg?branch=master)](https://travis-ci.org/pfbrowning/ng-modal)
[![Coverage Status](https://coveralls.io/repos/github/pfbrowning/ng-modal/badge.svg?branch=master)](https://coveralls.io/github/pfbrowning/ng-modal?branch=master)
[![dependency Status](https://david-dm.org/pfbrowning/ng-modal/status.svg)](https://david-dm.org/pfbrowning/ng-modal)
[![devDependency Status](https://david-dm.org/pfbrowning/ng-modal/dev-status.svg?branch=master)](https://david-dm.org/pfbrowning/ng-modal#info=devDependencies)

## Installation

1. Install npm module:
```bash
$ npm install @browninglogic/ng-modal --save
```

2. Import ModalManagerModule
```typescript
import { ModalManagerModule } from '@browninglogic/ng-modal';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ModalManagerModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
```
## Upgrade Notes
* As of version 2.1.0, the `allowClose` property has been removed in favor of 
`closeOnOverlayClick` and `showCloseButton`.  See the usage section for details.
* As of version 2.0.0, Angular 6 is required.  If you need Angular 5 support,
you can use version 1.0.0.

## Usage

Use the following syntax for declaring a modal-window component within your app

```html
<nm-modal-window #layeredExample1>
  <h1 header>You can put stuff in the header</h1>
  <div body>
    <p>Modal body paragraph text</p>
    <input type="button" value="Show Another Modal" (click)="layeredExample2.show()" />
  </div>
  <div footer>You can also put stuff in the footer</div>
</nm-modal-window>

<nm-modal-window #layeredExample2>
  <h1 header>Another Modal</h1>
  <div body>
    <p>I'm layered on top of the first modal!  Wow!</p>
    <input type="button" value="Close Me" (click)="layeredExample2.hide()" />
  </div>
</nm-modal-window>

<nm-modal-window #closeOnOverlayClickExample [closeOnOverlayClick]="true" [showCloseButton]="false">
  <div body>
    <p>This modal doesn't show a close button, but it will close if you click on the grey overlay.</p>
  </div>
</nm-modal-window>

<nm-modal-window #closeButtonExample [closeOnOverlayClick]="false" [showCloseButton]="true">
  <div body>
    <p>This modal shows a close button, but it will not close if you click on the grey overlay.</p>
  </div>
</nm-modal-window>

<nm-modal-window #onlyCloseProgrammaticallyExample [closeOnOverlayClick]="false" [showCloseButton]="false">
  <div body>
    <p>
      This modal doesn't show a close button and it will not close if you click on the grey overlay.
      It will only close if you call modalInstance.hide() on the component instance.  This is useful
      if you want to implement your own close button or lock the screen to prevent the user
      from interacting with the page behind the modal.
    </p>
    <input type="button" value="Close Me" (click)="onlyCloseProgrammaticallyExample.hide()" />
  </div>
</nm-modal-window>

<nm-modal-window #customStylingExample modalClass="customStylingModal" overlayClass="customStylingOverlay">
  <div body>
    <p>This modal uses custom styling to change the border color of the modal window and the opacity of the overlay.</p>
  </div>
</nm-modal-window>
```
* *closeOnOverlayClick* (optional) - Specifies whether the modal will close itself when you
click outside of the modal.  Defaults to true.
* *showCloseButton* (optional) - Specifies whether to show a close button in the top right corner
of the window.  Defaults to false.
* *modalClass* (optional) - Specifies css class(es) to apply to the modal window.  For example, 
if you want to override the border styling, change the background color, or specify a certain 
width, then that css would be applied here.
* *overlayClass* (optional) - Specifies css class(es) to apply to the modal window.  For example,
if you want the background overlay to use a different color or opacity, then that css would 
be applied here.

## Styling
Out of the box, the modal intentionally contains just enough styling to make it presentable
out of the box for demos, but not so much as to make it difficult to style around.  In other 
words, you can style it however you want if you need to conform it to your aesthetics, but you 
don't have to if you don't want to.  It's fairly simple to apply your own styles using the modalClass 
and overlayClass input parameters.

If you want to override the basic existing styles, such as the border or padding on the modal window, 
then use a more specific selector in your stylesheet, as shown in the example.  For the purpose 
of overriding the basic styles, it's helpful to keep in mind that the modal window will always be a 
div with the 'modalWindow' class in addition to any user-specified classes

The following styles apply to the "Usage" sample.  Note the input binding for the
customStylingModal input class.

### Global Styles
```css
/*
In order to set basic styles that aren't already applied, simply
set them in a CSS class and then bind that class to the modalClass
input property on the modal-window component.
*/
.customStylingModal {
    font-size:20px;
}

/*
Use a more specific CSS selector in order to 
override the existing styles such as border, 
background, padding, and text-align.
*/
div.modalWindow.customStylingModal {
    border-color: black;
}

div.modalOverlay.customStylingOverlay {
    background: rgba(0, 0, 0, 0.7);
}
```
### Component Styles
```css
/*
If you're applying styles from a component stylesheet, rather than
from a global stylesheet, then apply the ::ng-deep combinator in order to apply 
your styles within the modal-window component.  The shadow-piercing operators 
were recently removed without replacement in the evolving W3C spec.  This is an 
evolving topic and ng-deep is Angular's answer to this for the time being, although 
it's marked as deprecated and thus should be considered a temporary solution.  
I would suggest using this with caution in case the Angular team removes ng-deep 
before a clear replacement comes around.  See:
https://stackoverflow.com/questions/47024236/what-to-use-in-place-of-ng-deep
https://hackernoon.com/the-new-angular-ng-deep-and-the-shadow-piercing-combinators-deep-and-drop-4b088dbe459
https://angular.io/guide/component-styles#deprecated-deep--and-ng-deep
*/
::ng-deep .customStylingModal {
    color:blue;
}
```

## Demo
View it in action here: https://pfbrowning.github.io/ng-modal

## Documentation
More detailed documentation can be found <a href="https://pfbrowning.github.io/ng-modal/doc/">here</a>.

## License

MIT © [Patrick Browning](mailto:pfbrowning943@yahoo.com)