/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// material
import { MatIconModule, MatTooltipModule, MatButtonModule } from '@angular/material';

// pipes
import { CountTransformPipe } from './pipes/count-transform.pipe';
import { DurationTransformPipe } from './pipes/duration-transform.pipe';
import { RoutePipe } from './pipes/route.pipe';
import { LimitToPipe } from './pipes/limit-to.pipe';
import { SliceIpPipe } from './pipes/slice-ip.pipe';
import { SafeHtmlPipe } from './pipes/safehtml.pipe';
import { TimeConverterPipe } from './pipes/time-converter.pipe';
import { NameTransformPipe } from './pipes/name-transform.pipe';

// components
import { ContentTypeComponent } from './components/content-type/content-type.component';
import { ContentIconComponent } from './components/content-icon/content-icon.component';
import { ConciseDateRangePipe } from './pipes/concise-date-range.pipe';
import { UserImageComponent } from './components/user-image/user-image.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';

@NgModule({
  declarations: [
    CountTransformPipe,
    DurationTransformPipe,
    RoutePipe,
    LimitToPipe,
    SliceIpPipe,
    SafeHtmlPipe,
    TimeConverterPipe,
    NameTransformPipe,
    ContentIconComponent,
    NameTransformPipe,
    ConciseDateRangePipe,
    ContentTypeComponent,
    UserImageComponent,
    FileUploadComponent,
  ],
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  exports: [
    DurationTransformPipe,
    CountTransformPipe,
    RoutePipe,
    LimitToPipe,
    SliceIpPipe,
    NameTransformPipe,
    SafeHtmlPipe,
    TimeConverterPipe,
    ContentTypeComponent,
    ContentIconComponent,
    NameTransformPipe,
    ConciseDateRangePipe,
    UserImageComponent,
    FileUploadComponent,
  ]
})
export class UtilityModule {}
