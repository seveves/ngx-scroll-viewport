/**
 * This is only for local test
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { ScrollViewportModule } from '../dist';
import { ViewChild } from '@angular/core/src/metadata/di';

@Component({
  selector: 'app',
  template: `
    <div>
      <h2>Angular Scroll Viewport</h2>
      <input type="text" #change value="100000">
      <button (click)="setRowCount(change.value)">Set Rows</button><br/><br/>
      <input type="text" #overscan value="10">
      <button (click)="setOverscan(overscan.value)">Set Overscan</button><br/><br/>
      <button (click)="toggle = !toggle">Toggle View (Current: {{ (!toggle ? 'scroll-viewport' : 'ngFor') }})</button>
      <p>Showing {{rowCount}} rows</p>
      <div *ngIf="!toggle" style="height: 600px; overflow: auto; border: 1px solid black;">
        <scroll-viewport [items]="items" [overscan]="overscanValue">
          <ng-template let-item>
            <div class="row">{{item}}</div>
          </ng-template>
        </scroll-viewport>
      </div>
      <div *ngIf="toggle" style="height: 600px; overflow: auto; border: 1px solid black;">
        <div *ngFor="let item of items" class="row">{{item}}</div>
      </div>
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
  toggle = false;
  overscanValue = 10;

  ngOnInit() {
    this.setRowCount('100000');
  }

  setOverscan(value: string) {
    this.overscanValue = +value;
  }

  setRowCount(value: string) {
    const count = +value;
    const data = [];
    for (let x=count; x--; ) {
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
