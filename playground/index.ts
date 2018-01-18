/**
 * This is only for local test
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { ScrollViewportModule } from '../dist';

@Component({
  selector: 'app',
  template: `
    <div>
      <h2>Angular Scroll Viewport</h2>
      <p>Showing {{rowCount}} rows</p>
      <scroll-viewport [items]="items" [overscan]="20" [rowHeight]="30">
        <ng-template let-item>
          <div class="row">{{item}}</div>
        </ng-template>
      </scroll-viewport>
    </div>
  `,
  styles: [`
    .row {
      position: relative;
      display: block;
      height: 30px;
      line-height: 30px;
      padding: 0 20px;
      box-shadow: inset 0 -1px 0 #DDD;
      overflow: hidden;
    }
    `
  ]
})
class AppComponent implements OnInit {
  items: any[] = [];
  rowCount: string = '';

  ngOnInit() {
    const data = [];
    for (let x=1e5; x--; ) {
      data[x] = `Item #${x+1}`;
    };

    this.rowCount = data.length.toLocaleString();
    this.items = data;
  }
}

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ],
  imports: [ BrowserModule, ScrollViewportModule ]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
