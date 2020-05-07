/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { GoalsService } from '../../../services/goals.service';
import { IGoalAddUpdateRequest } from '../../../models/goal.model';
import { IEmailRequest } from '../../../models/email.model';
import { ShareService } from '../../../services/share.service';
@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  constructor(private authSvc: AuthService, private goalSvc: GoalsService, private shareSvc: ShareService) {}

  createGoal(goalData: any[], goalType?: string) {
    const shareGoalItems: IGoalAddUpdateRequest = { goal_data: [] } as IGoalAddUpdateRequest;
    shareGoalItems.goal_data = goalData;
    return this.goalSvc.addUpdateGoal(shareGoalItems, goalType);
  }

  sendCertificationEmail(certificationType, title, description, certificationUrl) {
    const name = this.authSvc.userEmail.replace('EMAIL', '').replace('infosys.com', '');
    const email = this.authSvc.userEmail;

    const req: IEmailRequest = {
      emailTo: [{ name, email }],
      emailType: certificationType,
      appURL: 'https://lex.infosysapps.com',
      sharedBy: [{ name, email }],
      body: { text: '', isHTML: false },
      timestamp: new Date().getTime(),
      artifacts: [
        {
          identifier: '',
          thumbnailUrl: '',
          downloadUrl: '',
          size: 0,
          title,
          description,
          artifactUrl: certificationUrl,
          url: certificationUrl,
          track: '',
          authors: [{ id: '', name: '', email: '' }],
          duration: ''
        }
      ]
    };

    return this.shareSvc.addShare(req);
  }
}
