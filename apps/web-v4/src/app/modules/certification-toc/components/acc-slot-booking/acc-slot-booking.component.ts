/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, noop, BehaviorSubject } from 'rxjs';
import { finalize, startWith, map, takeWhile, switchMap, tap } from 'rxjs/operators';

import {
  IAccLocation,
  ITestCenterSlotList,
  ITestCenterSlot,
  ICertificationMeta,
  TCertificationView
} from '../../../../models/certification.model';
import { CertificationService } from '../../../../services/certification.service';
import { IContent } from '../../../../models/content.model';
import { MatDialog, MatButtonToggleChange, MatSnackBar } from '@angular/material';
import { GoBackDialogComponent } from '../go-back-dialog/go-back-dialog.component';
import { FetchStatus, SendStatus } from '../../../../models/status.model';
import { CertificationTocSnackbarComponent } from '../certification-toc-snackbar/certification-toc-snackbar.component';

@Component({
  selector: 'ws-acc-slot-booking',
  templateUrl: './acc-slot-booking.component.html',
  styleUrls: ['./acc-slot-booking.component.scss']
})
export class AccSlotBookingComponent implements OnInit {
  @Input() content: IContent;
  @Input() certification: ICertificationMeta;
  @Input() fetchSubject: BehaviorSubject<boolean>;
  @Output() changeView: EventEmitter<TCertificationView>;
  @ViewChild('locationInput', { static: true }) locationInput: ElementRef<HTMLInputElement>;

  accForm: FormGroup;
  locations: IAccLocation[];
  locationChipList: IAccLocation[];
  filteredLocations$: Observable<IAccLocation[]>;
  locationCtrl: FormControl;
  slots: ITestCenterSlotList;
  dateSlotMap: Map<number, ITestCenterSlot[]>;
  locationFetchStatus: FetchStatus = 'fetching';
  bookingSendStatus: SendStatus;

  constructor(
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private certificationSvc: CertificationService
  ) {
    this.locationChipList = [];
    this.changeView = new EventEmitter();
    this.locationCtrl = new FormControl();
    this.dateSlotMap = new Map<number, ITestCenterSlot[]>();

    this.accForm = new FormGroup({
      dc: new FormControl(null, [Validators.required]),
      testCenter: new FormControl(null, [Validators.required]),
      dateSlot: new FormControl(null, [Validators.required]),
      slot: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit() {
    this.certificationSvc
      .getTestCenters(this.content.identifier)
      .pipe(
        finalize(() => {
          this.filteredLocations$ = this.locationCtrl.valueChanges.pipe(
            startWith(''),
            map(location => this._filterLocations(location))
          );
        })
      )
      .subscribe(
        locations => {
          this.locations = locations;
          this.locationFetchStatus = 'done';
        },
        () => {
          this.locations = [];
          this.locationFetchStatus = 'error';
        }
      );

    // this.accForm.controls.testCenter.valueChanges
    //   .pipe(
    //     tap(() => {
    //       this.slots = null;
    //       this.dateSlotMap.clear();
    //     }),
    //     takeWhile((value: string) => {
    //       if (value) {
    //         return true;
    //       }
    //       return false;
    //     }),
    //     switchMap((value: string) => this.certificationSvc.getTestCenterSlots(this.accForm.value.dc, value))
    //   )
    //   .subscribe(slotData => {
    //     this.slots = slotData;
    //     this.slots.slotdata.forEach(slotItem => {
    //       this.dateSlotMap.set(slotItem.date, slotItem.slots);
    //     });
    //   });
  }

  openGoBackDialog() {
    this.dialog
      .open<GoBackDialogComponent>(GoBackDialogComponent)
      .afterClosed()
      .subscribe((shouldClose: string) => {
        if (shouldClose === 'true') {
          this.changeView.emit('default');
        }
      });
  }

  displayLocationNameAutocomplete(location?: IAccLocation) {
    return location ? location.dc : undefined;
  }

  locationSelected(location: IAccLocation) {
    if (this.locationChipList.length) {
      return;
    }

    this.locationChipList.push(location);
    this.locationInput.nativeElement.value = '';
    this.locationInput.nativeElement.readOnly = true;
    this.accForm.patchValue({
      dc: location.dc
    });
  }

  locationRemoved() {
    this.locationChipList = [];
    this.accForm.patchValue({
      dc: null,
      testCenter: null,
      dateSlot: null,
      slot: null
    });
    this.locationInput.nativeElement.value = '';
    this.locationInput.nativeElement.readOnly = false;
    this.locationCtrl.patchValue(null);
  }

  getTestCenterSlots() {
    this.accForm.patchValue({
      dateSlot: null,
      slot: null
    });

    this.certificationSvc
      .getTestCenterSlots(this.content.identifier, this.accForm.value.dc, this.accForm.value.testCenter)
      .subscribe(slotData => {
        this.slots = slotData;
      });
  }

  onDateChange() {
    this.accForm.patchValue({
      slot: null
    });
  }

  // onSelectSlot(event: MatButtonToggleChange) {
  //   this.accForm.patchValue({
  //     slot: event.value
  //   });
  // }

  onSubmit() {
    this.bookingSendStatus = 'sending';

    if (this.accForm.invalid) {
      this.snackbar.openFromComponent(CertificationTocSnackbarComponent, {
        data: {
          action: 'cert_acc_send',
          code: 'form_invalid'
        }
      });

      return;
    }

    this.certificationSvc.bookAccSlot(this.content.identifier, this.accForm.value.slot).subscribe(
      res => {
        this.snackbar.openFromComponent(CertificationTocSnackbarComponent, {
          data: {
            action: 'cert_at_desk_send',
            code: res.res_code
          }
        });

        if (res.res_code === 1) {
          this.fetchSubject.next(true);
          this.changeView.emit('default');
          return;
        }
        this.bookingSendStatus = 'done';
      },
      () => {
        this.bookingSendStatus = 'error';
      }
    );
  }

  filterDates = (date: Date): boolean => {
    try {
      return this.dateSlotMap.has(date.getTime());
    } catch (e) {
      return false;
    }
  }

  private _filterLocations(value: string): IAccLocation[] {
    try {
      const filterValue = value.toLowerCase();
      return this.locations.filter(location => location.dc.toLowerCase().includes(filterValue));
    } catch (e) {
      return [];
    }
  }
}
