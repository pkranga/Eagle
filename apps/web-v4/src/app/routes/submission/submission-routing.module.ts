/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExerciseSubmissionContentResolve } from '../../resolvers/exercise-submission-content.resolve';
import { ExerciseSubmissionResolve } from '../../resolvers/exercise-submission.resolve';
import { EducatorGuard } from '../../guards/educator.guard';
import { ContentAccessGuard } from '../../guards/content-access.guard';
import { EducatorHomeComponent } from './components/educator-home/educator-home.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { SubmissionComponent } from './components/submission/submission.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    resolve: {
      tocContent: ExerciseSubmissionContentResolve
    },
    redirectTo: 'learner/:contentId'
  },
  {
    path: 'educator/:contentId',
    pathMatch: 'full',
    resolve: {
      tocContent: ExerciseSubmissionContentResolve
    },
    data: {
      contentAccessKeys: ['contentId']
    },
    component: EducatorHomeComponent,
    // canActivate: [EducatorGuard]
    canActivate: [EducatorGuard, ContentAccessGuard]
  },
  {
    path: 'learner/:contentId',
    pathMatch: 'full',
    resolve: {
      tocContent: ExerciseSubmissionContentResolve
    },
    data: {
      contentAccessKeys: ['contentId']
    },
    component: SubmissionComponent,
    canActivate: [ContentAccessGuard]
  },
  {
    path: 'feedback',
    pathMatch: 'full',
    resolve: {
      exerciseContent: ExerciseSubmissionResolve,
      tocContent: ExerciseSubmissionContentResolve
    },
    component: FeedbackComponent,
    canActivate: [ContentAccessGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ExerciseSubmissionContentResolve, ExerciseSubmissionResolve]
})
export class SubmissionRoutingModule {}
