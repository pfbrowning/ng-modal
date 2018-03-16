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

<modal-window #myModal [allowClose]="true">
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
if you want to change the background color or specify a certain width, then that css would be 
applied here.
* *overlayClass* (optional) - Specifies css class(es) to apply to the modal window.  For example,
if you want the background overlay to use a different color or opacity, then that css would 
be applied here.

## Styling
Out of the box, the modal intentionally contains a minimal amount of styling: just enough to make the
component presentable for demos.  It's fairly simple to apply your own styles using the modalClass and
overlayClass input parameters.

## Demo

In order to demo the functonality:
1. Instal node.js / npm if you haven't already
2. Clone the repo and navigate to its root folder
3. Run the following:
```bash
npm install
npm run playground
```


## License

MIT © [Patrick Browning](mailto:pfbrowning943@yahoo.com)
