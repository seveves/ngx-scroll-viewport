import { Component, ElementRef, OnInit, Input, OnDestroy, Inject, ChangeDetectorRef, ContentChild, TemplateRef, HostBinding, AfterViewInit } from '@angular/core';
import { NgForOfContext } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

export interface ScrollViewportState {
  top: string;
  height: number;
  visibleItems: any[];
}

const EVENT_OPTS = {
	passive: true,
	capture: true
};

@Component({
  selector: 'scroll-viewport',
  templateUrl: './scroll-viewport.component.html',
  styleUrls: ['./scroll-viewport.component.css'],
})
export class ScrollViewportComponent implements AfterViewInit, OnDestroy {
  
  @Input() items: any[] = [];
  @Input() rowHeight: number;
  @Input() defaultRowHeight: number;
  @Input() overscan: number = 10;
  @Input() sync: boolean = false;

  @ContentChild(TemplateRef) itemTemplate: TemplateRef<NgForOfContext<any>>;

  @HostBinding('style.height') hostHeight: string;

  state: ScrollViewportState = {
    top: '0px',
    height: 0,
    visibleItems: []
  };

  private _height: number;
  private offset: number = 0;

  private resizeSub: Subscription;
  private scrollSub: Subscription;
  
  constructor(
    private elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject('WINDOW') private windowRef: any,
    @Inject('DOCUMENT') private documentRef: any,
  ) {}

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
    this.resized();
    console.log('ngAfterViewInit 2 ');    
    this.scrolled();
    console.log('ngAfterViewInit 3');

    this.resizeSub = Observable.fromEvent(this.windowRef, 'resize', EVENT_OPTS)
      .subscribe(event => {
        this.resized();
      });
    this.scrollSub = Observable.fromEvent(this.windowRef, 'scroll', EVENT_OPTS)
      .subscribe(event => {
        this.scrolled();
      });
  }
  
  ngOnDestroy() {
    if (this.resizeSub) {
      this.resizeSub.unsubscribe();
    }
    if (this.scrollSub) {
      this.scrollSub.unsubscribe();
    }
  }

  private update(changes: { height: number; offset: number; }) {
    this.rowHeight = this.rowHeight || this.computeRowHeight() || this.defaultRowHeight || 100;
    const estimatedHeight = this.rowHeight * this.items.length;
  
    let start = 0;
    let visibleRowCount = 1;
    
    if (this.rowHeight) {
      start = (changes.offset / this.rowHeight) | 0;
      visibleRowCount = (changes.height / this.rowHeight) | 0;

      if (this.overscan) {
        start = Math.max(0, start - (start % this.overscan));
        visibleRowCount += this.overscan;
      }
    }

    const end = start + 1 + visibleRowCount;
    const visibleItems = this.items.slice(start, end);
    const top = start * this.rowHeight;

    this.hostHeight = estimatedHeight + 'px';
    this.state = {
      top: top + 'px',
      height: changes.height,
      visibleItems
    };
  }

  private resized() {
    const height = this.windowRef.innerHeight || this.documentRef.documentElement.offsetHeight;
    if (height !== this.state.height) {
      this.update({ height, offset: this.offset });
    }
  }

  private scrolled() {
    const base = this.elementRef.nativeElement;
    const offset = Math.max(0, base && -base.getBoundingClientRect().top || 0);
    this.update({ offset, height: this.state.height });
    if (this.sync) {
      this.changeDetectorRef.detectChanges();
    }
  }

  private computeRowHeight() {
    if (this._height) {
      return this._height;
    }
    const base = this.elementRef.nativeElement;
    const first = base && base.firstElementChild && base.firstElementChild.firstElementChild;
    // TODO: cross browser way for offsetHeight
    this._height = (first && first.offsetHeight || 0);
    console.log('_height: ' + this._height);
    return this._height;
  }
}
