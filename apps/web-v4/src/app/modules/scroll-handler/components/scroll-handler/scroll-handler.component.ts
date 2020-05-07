/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import {
  Component,
  OnInit,
  OnChanges,
  OnDestroy,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
} from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { debounceTime, throttleTime } from 'rxjs/operators';
import { FetchStatus } from '../../../../models/status.model';

@Component({
  selector: 'app-scroll-handler',
  templateUrl: './scroll-handler.component.html',
  styleUrls: ['./scroll-handler.component.scss']
})
export class ScrollHandlerComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  contentStatus: FetchStatus;

  @ViewChild('horizontalScrollElem', { static: true })
  horizontalScrollElem: ElementRef;
  @Input()
  random: any; // only for initiating ngOnChanges
  @Output()
  loadNext = new EventEmitter();
  enablePrev = false;
  enableNext = false;
  private scrollObserver: Subscription;

  constructor() { }

  ngOnInit() {
    this.scrollObserver = fromEvent(
      this.horizontalScrollElem.nativeElement,
      'scroll'
    )
      .pipe(debounceTime(200))
      .pipe(throttleTime(200))
      .subscribe((event: Event) => {
        this.updateNavigationBtnStatus(event.srcElement as HTMLElement);
      });
  }
  ngOnChanges() {
    setTimeout(() => {
      this.updateNavigationBtnStatus((
        this.horizontalScrollElem.nativeElement
      ) as HTMLElement);
    }, 100);
  }
  ngOnDestroy() {
    if (this.scrollObserver) {
      this.scrollObserver.unsubscribe();
    }
  }
  showPrev() {
    const elem = this.horizontalScrollElem.nativeElement;
    elem.scrollLeft -= 0.95 * elem.clientWidth;
  }
  showNext() {
    const elem = this.horizontalScrollElem.nativeElement;
    elem.scrollLeft += 0.95 * elem.clientWidth;
  }
  private updateNavigationBtnStatus(elem: HTMLElement) {
    this.enablePrev = true;
    this.enableNext = true;
    if (elem.scrollLeft === 0) {
      this.enablePrev = false;
    }
    if (elem.scrollWidth === elem.clientWidth + elem.scrollLeft) {
      if (this.contentStatus === 'hasMore') {
        this.loadNext.emit();
      } else {
        this.enableNext = false;
      }
    }
  }
}
