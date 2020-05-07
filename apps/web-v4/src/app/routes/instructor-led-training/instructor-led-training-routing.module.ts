/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InstructorLedTrainingComponent } from './components/instructor-led-training/instructor-led-training.component';
import { TrainingFeedbackComponent } from './components/training-feedback/training-feedback.component';

const routes: Routes = [
  {
    path: 'instructor-led',
    component: InstructorLedTrainingComponent
  },
  {
    path: 'offerings/:offering_id/feedback/:feedback_type',
    component: TrainingFeedbackComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/training/instructor-led'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstructorLedTrainingRoutingModule {}
