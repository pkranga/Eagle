/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef
} from '@angular/core';
import { ENTER, COMMA, SEMICOLON } from '@angular/cdk/keycodes';
import {
  MatSnackBar,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatChipInputEvent
} from '@angular/material';
import {
  IUserGoal,
  IGoalAddUpdateRequest,
  IUserGoalAddUpdateRequest
} from '../../../../models/goal.model';

import { SharePlaylistComponent } from '../../../playlist/components/share-playlist/share-playlist.component';

import { AuthService } from '../../../../services/auth.service';
import { GoalsService } from '../../../../services/goals.service';
import { MiscService } from '../../../../services/misc.service';
import { ConfigService } from '../../../../services/config.service';

interface IUserShareId {
  email: string;
  color: string;
  suffix: string;
}

@Component({
  selector: 'app-share-goal',
  templateUrl: './share-goal.component.html',
  styleUrls: ['./share-goal.component.scss']
})
export class ShareGoalComponent implements OnInit {
  @ViewChild('selfShare', { static: true }) selfShareToast: ElementRef;
  @ViewChild('alreadyShared', { static: true }) alreadySharedToast: ElementRef;
  @ViewChild('invalidIds', { static: true }) invalidIdsToast: ElementRef;
  @ViewChild('allInvalidIds', { static: true }) allInvalidIdsToast: ElementRef;
  @ViewChild('sendMailSuccess', { static: true }) sendMailSuccessToast: ElementRef;
  @ViewChild('goalSharingSuccessful', { static: true }) goalSharingSuccessfulToast: ElementRef;
  @ViewChild('mailSendFail', { static: true }) mailSendFailToast: ElementRef;
  @ViewChild('goalAddedError', { static: true }) goalAddedToast: ElementRef;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SEMICOLON];
  userEmailIds: IUserShareId[] = [];
  errorType: 'NoDomain' | 'InvalidDomain' | 'SelfShare' | 'None' = 'None';
  sendInProgress = false;
  validSuffix = this.configSvc.instanceConfig.platform.validDomainMail;
  sendStatus:
    | 'INVALID_IDS_ALL'
    | 'SUCCESS'
    | 'INVALID_ID_SOME'
    | 'ANY'
    | 'NONE' = 'NONE';
  constructor(
    private snackBar: MatSnackBar,
    private auth: AuthService,
    public dialogRef: MatDialogRef<SharePlaylistComponent>,
    @Inject(MAT_DIALOG_DATA) public goal: IUserGoal,
    private goalsSvc: GoalsService,
    private miscSvc: MiscService,
    private configSvc: ConfigService
  ) { }

  ngOnInit() { }

  addAll(event: MatChipInputEvent) {
    const input = event.input
    event.value.split(/[,;]+/).map((val: string) => val.trim()).forEach((value: string) => this.add(value))
    input.value = ''
  }

  add(value: string) {
    if (value) {
      const indexOfAt = value.indexOf('@');
      let suffix = '';
      let email = value;
      if (indexOfAt > -1) {
        suffix = value.substring(indexOfAt + 1);
        email = value.substring(0, indexOfAt);
      }
      if (this.validSuffix[suffix]) {
        this.errorType = 'None';
        this.userEmailIds.push({
          color: 'primary',
          email,
          suffix
        });
      } else if (suffix === '') {
        this.errorType = 'NoDomain';
      } else {
        this.errorType = 'InvalidDomain';
      }
    }
  }

  remove(fruit: IUserShareId): void {
    const index = this.userEmailIds.indexOf(fruit);
    if (index >= 0) {
      this.userEmailIds.splice(index, 1);
    }
  }

  share(txtBody, successToast) {
    this.errorType = 'None';
    this.sendStatus = 'NONE';
    if (this.userEmailIds.length === 0) {
      return;
    }

    const myEmail = this.auth.userEmail;
    if (
      this.userEmailIds
        .map(user =>
          user.email.indexOf('@') > -1 ? user.email : user.email + 'EMAIL'
        )
        .indexOf(myEmail.split('@')[0].trim()) > -1
    ) {
      this.errorType = 'SelfShare';
      return;
    }
    this.sendInProgress = true;
    let mailIds = this.userEmailIds.map(u => {
      if (u.color === 'accent') {
        return u.email;
      }
      return u.email + '@' + this.validSuffix[u.suffix];
    });

    const shareGoalItems: IGoalAddUpdateRequest = {
      goal_data: []
    } as IGoalAddUpdateRequest;
    shareGoalItems.goal_data[0] = {} as IUserGoalAddUpdateRequest;
    shareGoalItems.goal_data[0].goal_id = this.goal.goal_id;
    shareGoalItems.goal_data[0].goal_title = this.goal.goal_title;
    shareGoalItems.goal_data[0].goal_content_id = this.goal.goal_content_id;
    shareGoalItems.goal_data[0].goal_type = 'share_with';
    shareGoalItems.goal_data[0].goal_desc = this.goal.goal_desc || '';
    shareGoalItems.goal_data[0].goal_duration = this.goal.goal_duration || 0;
    if (this.goal.goal_type) {
      shareGoalItems.goal_data[0].shared_goal_type = this.goal.goal_type;
    }
    if (
      this.goal.goal_type === 'tobeshared' ||
      this.goal.goal_type === 'commonshared'
    ) {
      shareGoalItems.goal_data[0].is_delete = 1;
      shareGoalItems.goal_data[0].old_goal_type = this.goal.goal_type;
      if (this.goal.goal_type === 'tobeshared') {
        shareGoalItems.goal_data[0].shared_goal_type = 'custom_shared';
      } else if (this.goal.goal_type === 'commonshared') {
        shareGoalItems.goal_data[0].shared_goal_type = 'common_shared';
      }
    }

    shareGoalItems.goal_data[0].user_list = mailIds;
    this.goalsSvc.addUpdateGoal(shareGoalItems).subscribe(
      success => {
        if (success.response[0].self_shared === 1) {
          this.snackBar.open(this.selfShareToast.nativeElement.value);
        }

        if (
          success.response[0].already_shared &&
          success.response[0].already_shared.length
        ) {
          const mailList = success.response[0].already_shared.join(', ');
          this.snackBar.open(
            this.alreadySharedToast.nativeElement.value + mailList
          );
          success.response[0].already_shared.forEach(userEmail => {
            const userEmailName = userEmail
              .replace('EMAIL', '')
              .replace('EMAIL', '');
            const emailIdsReplaced = mailIds.map(email =>
              email.replace('EMAIL', '').replace('EMAIL', '')
            );
            const itemIndex = emailIdsReplaced.indexOf(userEmailName.trim());
            if (itemIndex !== -1) {
              mailIds.splice(itemIndex, 1);
            }
          });
          mailIds = mailIds.filter(mail => mail && mail !== '');
        }

        if (
          success.response[0].invalid_users &&
          success.response[0].invalid_users.length
        ) {
          const mailList = success.response[0].invalid_users.join(', ');
          success.response[0].result !== 'failed'
            ? this.snackBar.open(
              this.invalidIdsToast.nativeElement.value + mailList
            )
            : this.snackBar.open(this.allInvalidIdsToast.nativeElement.value);

          success.response[0].invalid_users.forEach(userEmail => {
            const userEmailName = userEmail
              .replace('EMAIL', '')
              .replace('EMAIL', '');
            const emailIdsReplaced = mailIds.map(email =>
              email.replace('EMAIL', '').replace('EMAIL', '')
            );
            const itemIndex = emailIdsReplaced.indexOf(userEmailName.trim());
            if (itemIndex !== -1) {
              mailIds.splice(itemIndex, 1);
            }
          });
          mailIds = mailIds.filter(mail => mail && mail !== '');
        }

        const mailsIdsWithoutDomain = mailIds.map(email =>
          email.split('@')[0].trim()
        );
        this.userEmailIds = this.userEmailIds.filter(
          user =>
            mailsIdsWithoutDomain.indexOf(user.email.split('@')[0].trim()) < 0
        );
        if (success.response[0].result !== 'failed') {
          this.snackBar.open(
            this.goalSharingSuccessfulToast.nativeElement.value + mailIds
          );
          if (mailIds.join(';')) {
            const goal = {
              id: this.goal.goal_id,
              title: this.goal.goal_title,
              desc: this.goal.goal_desc,
              contentIds: this.goal.goal_content_id,
              event: 'CP_SHARE_GOAL'
            };
            this.miscSvc
              .shareMail(
                goal.id,
                mailIds.join(';'),
                'shareGoal',
                txtBody,
                goal,
                '/goals'
              )
              .subscribe(
                response => {
                  this.sendInProgress = false;
                  if (response.response !== 'No valid Ids') {
                    this.sendStatus = 'INVALID_ID_SOME';
                    this.snackBar.open(
                      this.sendMailSuccessToast.nativeElement.value +
                      mailIds.join(';')
                    );
                  } else if (response.response === 'No valid Ids') {
                    this.sendStatus = 'INVALID_IDS_ALL';
                    this.snackBar.open(
                      this.allInvalidIdsToast.nativeElement.value
                    );
                  }
                  if (!this.userEmailIds.length) {
                    this.dialogRef.close();
                  }
                },
                err => {
                  this.snackBar.open(
                    this.mailSendFailToast.nativeElement.value
                  );
                  // this.dialogRef.close();
                }
              );
          }
        } else {
          this.sendStatus = 'INVALID_IDS_ALL';
          this.sendInProgress = false;
        }
      },
      error => {
        this.sendInProgress = false;
        this.snackBar.open(this.goalAddedToast.nativeElement.value);
      }
    );
  }
}
