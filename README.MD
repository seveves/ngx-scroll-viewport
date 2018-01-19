# ngx-scroll-viewport
Angular component that renders homogeneous children only when visible.

This library was heavily inspired by [preact-scroll-viewport](https://github.com/developit/preact-scroll-viewport)

## Demo
For a demo you can browse [this plunker](https://plnkr.co/edit/XxPjy3CmVxjVhhY46hIE?p=preview)

There you can see a comparison to ```ngFor```

## Installation

To install this library, run:

```bash
$ npm install ngx-scroll-viewport --save
```

## Consuming this library

Import into your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import library
import { ScrollViewportModule } from 'ngx-scroll-viewport';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    // Specify library as an import
    ScrollViewportModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Once your library is imported, you can use the component:

```xml
<!-- You can now use the library component in f.e. app.component.html -->
<scroll-viewport [items]="items" [overscan]="20">
  <ng-template let-item>
    <div>{{item}}</div>
  </ng-template>
</scroll-viewport>
```

## Properties
| Property               | Type     | Description           |
|------------------------|----------|-----------------------|
| **`items`**            | _any[]_  | the item source       |
| **`rowHeight`**        | _number_ | static height of a row (prevents dynamic computation of element height) |
| **`defaultRowHeight`** | _number_ | used as a fallback if **`rowHeight`** wasn't set and dynamic computation is not possible       |
| **`overscan`**         | _number_ | Number of extra rows to render above and below visible list. Defaults to 10.      |



## Development
This library was created using [generator-angular2-library](https://github.com/jvandemo/generator-angular2-library).

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

## License

MIT
