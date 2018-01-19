import {
  Component,
  ElementRef,
  OnInit,
  Input,
  OnDestroy,
  Inject,
  ChangeDetectorRef,
  ContentChild,
  TemplateRef,
  HostBinding,
  OnChanges,
  AfterViewInit } from '@angular/core';
import { NgForOfContext } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

const EVENT_OPTS = {
  passive: true,
  capture: true
};

@Component({
  selector: 'scroll-viewport',
  templateUrl: './scroll-viewport.component.html',
  styleUrls: ['./scroll-viewport.component.css'],
})
export class ScrollViewportComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  @Input() items: any[] = [];
  @Input() rowHeight: number;
  @Input() defaultRowHeight: number;
  @Input() overscan = 10;

  @ContentChild(TemplateRef) itemTemplate: TemplateRef<NgForOfContext<any>>;

  @HostBinding('style.height') hostHeight: string;

  top = '0px';
  visibleItems: any[];

  private _height: number;
  private height: number;
  private offset = 0;

  private resizeSub: Subscription;
  private scrollSub: Subscription;

  constructor(
    private elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject('WINDOW') private windowRef: any,
    @Inject('DOCUMENT') private documentRef: any,
  ) {}

  ngOnInit() {
    // we have to render at leat one element to properly compute the row height
    if (!this.visibleItems) {
      this.visibleItems = this.items.slice(0, 1);
    }

    // subscribe to resize and scroll events
    this.resizeSub = Observable.fromEvent(this.windowRef, 'resize', EVENT_OPTS)
      .subscribe(event => {
        this.resized();
      });
    this.scrollSub = Observable.fromEvent(this.windowRef, 'scroll', EVENT_OPTS)
      .subscribe(event => {
        this.scrolled();
      });
  }

  ngOnChanges() {
    if (this.visibleItems) {
      console.log('ngOnChanges');
      this.update({ height: this.height, offset: this.offset });
    }
  }

  ngAfterViewInit() {
    // initially at least one element has been rendered
    // so we trigger another change detection with the computed height
    setTimeout(() => {
      this.resized();
      this.scrolled();
      this.changeDetectorRef.markForCheck();
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
    const rowHeight = this.rowHeight || this.computeRowHeight() || this.defaultRowHeight || 100;
    const estimatedHeight = rowHeight * this.items.length;

    let start = 0;
    let visibleRowCount = 1;

    if (rowHeight) {
      start = (changes.offset / rowHeight) | 0;
      visibleRowCount = (changes.height / rowHeight) | 0;

      if (this.overscan) {
        start = Math.max(0, start - (start % this.overscan));
        visibleRowCount += this.overscan;
      }
    }

    const end = start + 1 + visibleRowCount;
    const top = start * rowHeight;
    this.height = changes.height;

    this.visibleItems = this.items.slice(start, end);
    this.top = top + 'px';
    this.hostHeight = estimatedHeight + 'px';
  }

  private resized() {
    const height = this.windowRef.innerHeight || this.documentRef.documentElement.offsetHeight;
    if (height !== this.height) {
      this.update({ height, offset: this.offset });
    }
  }

  private scrolled() {
    const base = this.elementRef.nativeElement;
    const offset = Math.max(0, base && -base.getBoundingClientRect().top || 0);
    this.update({ offset, height: this.height });
  }

  private computeRowHeight() {
    if (this._height) {
      return this._height;
    }
    const base = this.elementRef.nativeElement;
    const first = base && base.firstElementChild && base.firstElementChild.firstElementChild;
    this._height = (first && first.offsetHeight || 0);
    return this._height;
  }
}
