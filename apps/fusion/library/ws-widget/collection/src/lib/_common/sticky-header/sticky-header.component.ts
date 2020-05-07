/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
// import {
//   animate,
//   state,
//   style,
//   transition,
//   trigger,
// } from '@angular/animations'
import {
  AfterViewInit, Component,
  //  HostBinding
} from '@angular/core'
// import { fromEvent } from 'rxjs'
// import {
//   distinctUntilChanged,
//   filter,
//   map,
//   pairwise,
//   share,
//   throttleTime,
// } from 'rxjs/operators'

// enum VisibilityState {
//   Visible = 'visible',
//   Hidden = 'hidden',
// }

// enum Direction {
//   Up = 'Up',
//   Down = 'Down',
// }

@Component({
  selector: 'ws-widget-sticky-header',
  templateUrl: './sticky-header.component.html',
  styleUrls: ['./sticky-header.component.scss'],
  // animations: [
  //   trigger('toggle', [
  //     state(
  //       VisibilityState.Hidden,
  //       style({ opacity: 0, transform: 'translateY(-100%)' }),
  //     ),
  //     state(
  //       VisibilityState.Visible,
  //       style({ opacity: 1, transform: 'translateY(0)' }),
  //     ),
  //     transition('* => *', animate('200ms ease-in')),
  //   ]),
  // ],
})
export class StickyHeaderComponent implements AfterViewInit {

  // private isVisible = true

  // @HostBinding('@toggle')
  // get toggle(): VisibilityState {
  //   return this.isVisible ? VisibilityState.Visible : VisibilityState.Hidden
  // }

  ngAfterViewInit() {
    // const scroll$ = fromEvent(window, 'scroll').pipe(
    //   throttleTime(10),
    //   map(() => window.pageYOffset),
    //   pairwise(),
    //   map(([y1, y2]): Direction => (y2 < y1 ? Direction.Up : Direction.Down)),
    //   distinctUntilChanged(),
    //   share(),
    // )

    // const goingUp$ = scroll$.pipe(
    //   filter(direction => direction === Direction.Up),
    // )

    // const goingDown$ = scroll$.pipe(
    //   filter(direction => direction === Direction.Down),
    // )

    // goingUp$.subscribe(() => (this.isVisible = true))
    // goingDown$.subscribe(() => (this.isVisible = false))
  }

}
