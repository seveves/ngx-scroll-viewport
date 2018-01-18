import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';

export declare const WINDOW: InjectionToken<Window>;

import { ScrollViewportComponent } from './scroll-viewport.component';

export * from './scroll-viewport.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ScrollViewportComponent
  ],
  exports: [
    ScrollViewportComponent
  ],
  providers: [
    { provide: 'DOCUMENT', useFactory: getDocument },
    { provide: 'WINDOW', useFactory: getWindow }
  ]
})
export class ScrollViewportModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ScrollViewportModule,
      providers: []
    };
  }
}

export function getWindow(): any {
  return (typeof window !== 'undefined') ? window : null;
}

export function getDocument(): any {
  return (typeof document !== 'undefined') ? document : null;
}
