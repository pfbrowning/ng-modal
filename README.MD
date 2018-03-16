# ng-modal

A simple, lightweight interface for creating layered modal dialogs in Angular 5.

## Installation

1. Install npm module:
```bash
$ npm install @browninglogic/ng-modal --save
```

2. Import ModalManagerModule
```typescript
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

## Usage

Use the following syntax for declaring a modal-window component within your app

```html
<input type="button" (click)="myModal.show()" value="Show Modal" />

<modal-window #myModal [allowClose]="true" modalClass="sampleModal">
  <h1 header>Header Text Goes Here</h1>
  <div body>
    <p>Body content goes here</p>
    <input type="button" (click)="myModal.hide()" value="Hide Modal" />
  </div>
  <div footer>Footer content goes here</div>
</modal-window>
```
* *allowClose* (optional) - Specifies whether the modal can be closed.  When set to true, an X
is shown in the top-right corner, and the modal will close itself if you click on the X
or click outside of the modal.  When set to false, no X is shown and the modal can only
be closed programmatically.  Defaults to true.
* *modalClass* (optional) - Specifies css class(es) to apply to the modal window.  For example, 
if you want to override the border styling, change the background color, or specify a certain 
width, then that css would be applied here.
* *overlayClass* (optional) - Specifies css class(es) to apply to the modal window.  For example,
if you want the background overlay to use a different color or opacity, then that css would 
be applied here.

## Styling
Out of the box, the modal intentionally contains just enough styling to make it presentable
out of the box for demos, but not so much as to make it a pain to style around.  In other words, you can style it however you want if you need to conform it to your aesthetics, but you don't have to if you don't want to.  It's fairly simple to apply your own styles using the modalClass and overlayClass input parameters.

If you want to override the basic existing styles, such as the border or padding on the modal window, then use a more specific selector in your stylesheet, as shown in 
the usage example.  For the purpose of overriding the basic styles, it's helpful to
keep in mind that the modal window will always be a div with the 'modalWindow' class in addition
to any user-specified classes

The following styles apply to the "Usage" sample.  Note the input binding for the
sampleModal input class.

```css
/*
In order to set basic styles that aren't already applied, simply
set them in a CSS class and then bind that class to the modalClass
input property on the modal-window component.
*/
.sampleModal {
  font-size:20px;
}
/*
Use a more specific CSS selector in order to 
override the existing styles such as border, 
background, padding, and text-align.
*/
div.modalWindow.sampleModal {
    border-color: black;
}

/*
If you're applying styles from a component stylesheet, rather than
from a global stylesheet, then apply the ::ng-deep combinator in order
to apply your styles within the modal-window component.  This is deprecated
and should be considered a temporary solution until we get updated marching 
orders from the Angular overlords.  See:
https://stackoverflow.com/questions/47024236/what-to-use-in-place-of-ng-deep
https://hackernoon.com/the-new-angular-ng-deep-and-the-shadow-piercing-combinators-deep-and-drop-4b088dbe459
https://angular.io/guide/component-styles#deprecated-deep--and-ng-deep
*/
::ng-deep .sampleModal {
  color:blue;
}
```

## Demo

In order to demo the functonality:
1. Instal node.js / npm if you haven't already
2. Clone the repo and navigate to its root folder
3. Run the following:
```bash
npm install
npm run build
npm run playground
```


## License

MIT © [Patrick Browning](mailto:pfbrowning943@yahoo.com)
