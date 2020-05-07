/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Directive, OnInit, Output, EventEmitter, ElementRef, OnDestroy } from '@angular/core'
import { fromEvent } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

@Directive({
  selector: '[wsUtilsInViewPort]',
})
export class InViewPortDirective implements OnInit, OnDestroy {

  private scroll: any
  private resize: any

  @Output() inViewport: EventEmitter<boolean> = new EventEmitter<boolean>()

  constructor(private _el: ElementRef) { }

  ngOnInit() {
    this.check()

    this.scroll =
      fromEvent(window, 'scroll').pipe(debounceTime(100)).subscribe(() => {
        this.check()
      })

    this.resize =
      fromEvent(window, 'resize').pipe(debounceTime(100)).subscribe(() => {
        this.check()
      })
  }

  ngOnDestroy() {
    this.scroll.unsubscribe()
    this.resize.unsubscribe()
  }

  check(partial: boolean = true, direction: string = 'both') {
    const el = this._el.nativeElement

    const elSize = (el.offsetWidth * el.offsetHeight)

    const rec = el.getBoundingClientRect()

    const vp = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    const tViz = rec.top >= 0 && rec.top < vp.height
    const bViz = rec.bottom > 0 && rec.bottom <= vp.height

    const lViz = rec.left >= 0 && rec.left < vp.width
    const rViz = rec.right > 0 && rec.right <= vp.width

    const vVisible = partial ? tViz || bViz : tViz && bViz
    const hVisible = partial ? lViz || rViz : lViz && rViz

    let event = false

    if (direction === 'both') {
      event = (elSize && vVisible && hVisible) ? true : false
    } else if (direction === 'vertical') {
      event = (elSize && vVisible) ? true : false
    } else if (direction === 'horizontal') {
      event = (elSize && hVisible) ? true : false
    }

    this.inViewport.emit(event)
  }

}
