/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';

@Directive({
  selector: '[appAutoscroll]'
})
export class AutoscrollDirective {
  @Input() scrollable: ElementRef<any>;
  @Output() draggableAtTop = new EventEmitter<any>();
  @Output() draggableAtBottom = new EventEmitter<any>();
  @Output() draggableInBetween = new EventEmitter<any>();
  counter = 0;
  timer: Observable<any> = interval(100);
  timerSubscription: Subscription;

  constructor() {}

  @HostListener('cdkDragMoved', ['$event'])
  onDrag(event: any) {
    const elementBounds = event.event.target.getBoundingClientRect();

    if (elementBounds.top <= 0) {
      return;
    }

    if (elementBounds.top <= 0.3 * window.innerHeight) {
      this.draggableAtTop.emit(event);
    } else if (elementBounds.top >= 0.7 * window.innerHeight) {
      this.draggableAtBottom.emit(event);
    } else {
      this.draggableInBetween.emit(event);
    }
  }

  @HostListener('cdkDragEnded', ['$event'])
  onDragEnd(event: any) {
    if (this.timerSubscription && !this.timerSubscription.closed) {
      this.timerSubscription.unsubscribe();
      this.counter = 0;
    }
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: any) {
    const touchY = event.touches[0].clientY;
    if (touchY <= 0.3 * window.innerHeight) {
      this.draggableAtTop.emit(event);
    } else if (touchY >= 0.7 * window.innerHeight) {
      this.draggableAtBottom.emit(event);
    } else {
      this.draggableInBetween.emit(event);
    }
  }

  @HostListener('draggableAtTop', ['$event'])
  onDragToTop(event: any) {
    if (!this.timerSubscription || this.timerSubscription.closed) {
      this.timerSubscription = this.timer.subscribe(() => {
        this.scrollable.nativeElement.scrollTop -= 70;
      });
    }
  }

  @HostListener('draggableAtBottom', ['$event'])
  onDragToBottom(event: any) {
    if (!this.timerSubscription || this.timerSubscription.closed) {
      this.timerSubscription = this.timer.subscribe(() => {
        this.scrollable.nativeElement.scrollTop += 70;
      });
    }
  }

  @HostListener('draggableInBetween', ['$event'])
  onDragToBetween() {
    if (this.timerSubscription && !this.timerSubscription.closed) {
      this.timerSubscription.unsubscribe();
      this.counter = 0;
    }
  }
}
