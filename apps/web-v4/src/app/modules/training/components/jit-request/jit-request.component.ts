/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  AfterContentInit,
  ViewChild,
  ElementRef,
  TemplateRef,
  Output,
  EventEmitter
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, catchError } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material';

import { IContent } from '../../../../models/content.model';
import { TrainingsApiService } from '../../../../apis/trainings-api.service';
import { TrainingsService } from '../../../../services/trainings.service';
import { IJITForm } from '../../../../models/training.model';

@Component({
  selector: 'app-jit-request',
  templateUrl: './jit-request.component.html',
  styleUrls: ['./jit-request.component.scss']
})
export class JitRequestComponent implements OnInit, AfterViewInit, AfterContentInit {
  @Input() content?: IContent;
  @Input() savedForm?: IJITForm;
  @Output() jitSubmit: EventEmitter<any> = new EventEmitter();

  @ViewChild('btnSubmit', { static: false }) btnSubmit: ElementRef<any>;
  @ViewChild('invalid', { static: true }) formInvalid: TemplateRef<any>;
  @ViewChild('submitted', { static: true }) submitSuccess: TemplateRef<any>;
  @ViewChild('failed', { static: true }) submitError: TemplateRef<any>;

  currentDate = new Date();
  locations$: Observable<any[]>;
  tracks$: Observable<any[]>;
  searchResults$: Observable<IContent[]>;

  jitForm: FormGroup = new FormGroup({
    contentId: new FormControl(this.savedForm ? this.savedForm.contentId : undefined),
    contentName: new FormControl(this.savedForm ? this.savedForm.contentName : undefined),
    trainingDescription: new FormControl(this.savedForm ? this.savedForm.trainingDescription : undefined),
    startDate: new FormControl(this.savedForm ? this.savedForm.startDate : undefined),
    participantCount: new FormControl(this.savedForm ? this.savedForm.participantCount : undefined, [
      Validators.min(5)
    ]),
    track: new FormControl(),
    location: new FormControl(),
    participantProfile: new FormControl(this.savedForm ? this.savedForm.participantProfile : undefined),
    trainingLevel: new FormControl(this.savedForm ? this.savedForm.trainingLevel : undefined),
    additionalInfo: new FormControl(this.savedForm ? this.savedForm.additionalInfo : undefined),
    searchedContent: new FormControl(),
    trainingByVendor: new FormControl(this.savedForm ? this.savedForm.trainingByVendor : false)
  });

  submitStatus: 'none' | 'submitting' | 'done' = 'none';

  constructor(
    private snackbar: MatSnackBar,
    private trainingsApi: TrainingsApiService,
    private trainingSvc: TrainingsService
  ) {}

  ngOnInit() {
    this.locations$ = this.trainingsApi.getTrainingLocations();
    this.tracks$ = this.trainingsApi.getTrainingTracks();
  }

  ngAfterViewInit() {
    this.searchResults$ = this.jitForm.controls.searchedContent.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((query: string) => this.trainingSvc.getJITEligibleContent(query)),
      catchError(() => [])
    );
  }

  ngAfterContentInit() {
    this.jitForm.patchValue({
      contentId: this.content ? this.content.identifier : undefined,
      contentName: this.content ? this.content.name : undefined
    });
  }

  onClickSearchResult(searchResult: IContent) {
    this.jitForm.patchValue({
      contentId: searchResult.identifier
    });
  }

  onSearchUserInput(event: any) {
    this.jitForm.patchValue({
      contentId: undefined
    });
  }

  onSubmitJITRequest() {
    if (this.jitForm.invalid) {
      this.snackbar.openFromTemplate(this.formInvalid);
      return;
    }

    this.submitStatus = 'submitting';

    this.trainingSvc.sendJITRequest(this.jitForm.value as IJITForm).subscribe(
      () => {
        this.submitStatus = 'done';
        this.snackbar.openFromTemplate(this.submitSuccess);
        this.jitSubmit.emit();
      },
      () => {
        this.submitStatus = 'done';
        this.snackbar.openFromTemplate(this.submitError);
      }
    );
  }
}
