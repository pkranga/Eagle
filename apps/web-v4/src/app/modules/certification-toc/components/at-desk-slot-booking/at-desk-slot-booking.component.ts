/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Observable, of, timer, throwError, BehaviorSubject, noop } from 'rxjs';
import { finalize, startWith, map, switchMap, catchError } from 'rxjs/operators';

import {
  ICertificationMeta,
  ICertificationCountry,
  IAtDeskLocation,
  IAtDeskSlotItem,
  IAtDeskBooking,
  TCertificationView
} from '../../../../models/certification.model';
import { IContent } from '../../../../models/content.model';
import { FetchStatus, SendStatus } from '../../../../models/status.model';
import { IUserJLData } from '../../../../models/training.model';
import { GoBackDialogComponent } from '../go-back-dialog/go-back-dialog.component';
import { CertificationService } from '../../../../services/certification.service';
import { CertificationApiService } from '../../../../apis/certification-api.service';
import { TrainingsApiService } from '../../../../apis/trainings-api.service';
import { TrainingsService } from '../../../../services/trainings.service';
import { CertificationTocSnackbarComponent } from '../certification-toc-snackbar/certification-toc-snackbar.component';

@Component({
  selector: 'ws-at-desk-slot-booking',
  templateUrl: './at-desk-slot-booking.component.html',
  styleUrls: ['./at-desk-slot-booking.component.scss']
})
export class AtDeskSlotBookingComponent implements OnInit {
  @Input() content: IContent;
  @Input() certification: ICertificationMeta;
  @Input() fetchSubject: BehaviorSubject<boolean>;
  @Output() changeView: EventEmitter<TCertificationView> = new EventEmitter();
  @ViewChild('countryInput', { static: true }) countryInput: ElementRef<HTMLInputElement>;

  atDeskSlotItems: IAtDeskSlotItem[];
  countries: ICertificationCountry[];
  locations: IAtDeskLocation[];
  filteredCountries$: Observable<ICertificationCountry[]>;
  countriesChipList: ICertificationCountry[] = [];
  countryCtrl: FormControl = new FormControl();
  dateSlotMap: Map<string, IAtDeskSlotItem> = new Map();
  selectedDateSlotItem: IAtDeskSlotItem;
  userJLData: IUserJLData;

  managerFetchStatus: FetchStatus = 'fetching';
  requestSendStatus: SendStatus;

  atDeskForm: FormGroup = new FormGroup({
    date: new FormControl(null, [Validators.required]),
    country: new FormControl(null, [Validators.required]),
    location: new FormControl(null, [Validators.required]),
    slot: new FormControl(null, [Validators.required]),
    userContact: new FormControl(null, [Validators.required]),
    proctorContact: new FormControl(null, [Validators.required]),
    proctorEmail: new FormControl('', [], [this._validateProctorEmail.bind(this)])
  });

  constructor(
    private certificationSvc: CertificationService,
    private certificationApi: CertificationApiService,
    private trainingSvc: TrainingsService,
    private trainingApi: TrainingsApiService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.certificationApi.getAtDeskSlots().subscribe(slotData => {
      this.atDeskSlotItems = slotData;

      slotData.forEach(slotObj => {
        const date = new Date(slotObj.date);
        date.setHours(0, 0, 0);
        this.dateSlotMap.set(date.toString(), slotObj);
      });
    });

    this.certificationApi
      .getCountries()
      .pipe(
        finalize(() => {
          this.filteredCountries$ = this.countryCtrl.valueChanges.pipe(
            startWith(''),
            map(countryName => this._filterCountries(countryName))
          );
        })
      )
      .subscribe(countries => {
        this.countries = countries;
      });

    this._getUserManager();
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

  displayCountryNameAutocomplete(country?: ICertificationCountry) {
    return country ? country.country_name : undefined;
  }

  countrySelected(country: ICertificationCountry) {
    if (this.countriesChipList.length) {
      return;
    }

    this.countriesChipList.push(country);
    this.countryInput.nativeElement.value = '';
    this.countryInput.nativeElement.readOnly = true;
    this.atDeskForm.patchValue({
      country: country.country_code
    });
    this.locations = null;

    this.certificationSvc.getAtDeskLocations(country.country_code).subscribe(atDeskLocations => {
      this.locations = atDeskLocations;
    });
  }

  countryRemoved() {
    this.countriesChipList = [];
    this.atDeskForm.patchValue({
      country: null,
      location: null
    });
    this.countryInput.nativeElement.value = '';
    this.countryInput.nativeElement.readOnly = false;
    this.locations = null;
  }

  filterDates = (date: Date): boolean => {
    try {
      return this.dateSlotMap.has(date.toString());
    } catch (e) {
      return false;
    }
  }

  onDateChange(date: Date) {
    this.selectedDateSlotItem = this.dateSlotMap.get(date.toString());
  }

  onSubmit() {
    if (this.atDeskForm.invalid) {
      this.snackbar.openFromComponent(CertificationTocSnackbarComponent, {
        data: {
          action: 'cert_at_desk_send',
          code: 'form_invalid'
        }
      });
      return;
    }

    this.requestSendStatus = 'sending';
    this.certificationSvc.bookAtDeskSlot(this.content.identifier, this.atDeskForm).subscribe(
      res => {
        if (res.res_code === 1) {
          this.requestSendStatus = 'done';
          this.fetchSubject.next(true);
          this.changeView.emit('default');
          return;
        }
      },
      () => {
        this.requestSendStatus = 'error';
      }
    );
  }

  private _validateProctorEmail(control: AbstractControl): Observable<ValidationErrors | null> {
    return timer(500).pipe(
      map(() => control.value),
      switchMap((value: string) => {
        if (!value) {
          return throwError({ invalidEmail: true });
        }

        const trimmedEmail = value.split('@')[0];

        if (this.userJLData && trimmedEmail.toLowerCase() === this.userJLData.manager.toLowerCase()) {
          return of(null);
        }

        return this.trainingApi.getUserJL6Status(trimmedEmail);
      }),
      map(result => (result === null ? null : result.isJL6AndAbove ? null : { invalidEmail: true })),
      catchError(() => of({ invalidEmail: true }))
    );
  }

  private _getUserManager() {
    this.managerFetchStatus = 'fetching';
    this.trainingSvc.getUserJLData().subscribe(
      result => {
        this.userJLData = result;
        this.atDeskForm.patchValue({
          proctorEmail: this.userJLData.manager
        });
        this.managerFetchStatus = 'done';
      },
      () => {
        this.userJLData = {
          isJL6AndAbove: false,
          isJL7AndAbove: false,
          manager: ''
        };
        this.managerFetchStatus = 'error';
      }
    );
  }

  private _filterCountries(value: string): ICertificationCountry[] {
    if (typeof value !== 'string') {
      return;
    }

    const filterValue = value.toLowerCase();
    return this.countries.filter(country => country.country_name.toLowerCase().includes(filterValue));
  }
}
