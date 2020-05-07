/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatChipInputEvent } from '@angular/material';
import { IContent } from '../../../../models/content.model';
import { PlaylistService } from '../../../../services/playlist.service';
import { IUserPlayList } from '../../../../models/playlist.model';
import { MiscService } from '../../../../services/misc.service';
import { ConfigService } from '../../../../services/config.service';
interface IUserShareId {
  email: string;
  color: string;
  suffix: string;
}

@Component({
  selector: 'app-share-playlist',
  templateUrl: './share-playlist.component.html',
  styleUrls: ['./share-playlist.component.scss']
})
export class SharePlaylistComponent implements OnInit {
  @ViewChild('successToast', { static: true }) successToast: ElementRef;
  @ViewChild('invalidIds', { static: true }) invalidIdsToast: ElementRef;
  @ViewChild('allInvalidIds', { static: true }) allInvalidIdsToast: ElementRef;
  @ViewChild('sendMailSuccess', { static: true }) sendMailSuccessToast: ElementRef;
  @ViewChild('playlistSharingSuccessful', { static: true }) playlistSharingSuccessfulToast: ElementRef;
  @ViewChild('mailSendFail', { static: true }) mailSendFailToast: ElementRef;
  @ViewChild('playlistSendError', { static: true }) playlistSendError: ElementRef;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SEMICOLON];
  userEmailIds: IUserShareId[] = [];
  validSuffix = this.configSvc.instanceConfig.platform.validDomainMail;
  errorType: 'NoDomain' | 'InvalidDomain' | 'None' = 'None';
  sendInProgress = false;
  sendStatus: 'INVALID_IDS_ALL' | 'SUCCESS' | 'INVALID_ID_SOME' | 'ANY' | 'NONE' = 'NONE';
  constructor(
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SharePlaylistComponent>,
    @Inject(MAT_DIALOG_DATA) public playlist: IUserPlayList,
    private playlistSvc: PlaylistService,
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
    if (this.userEmailIds.length === 0) {
      return;
    }
    let mailIds = this.userEmailIds.map(u => {
      if (u.color === 'accent') {
        return u.email;
      }
      return u.email + '@' + this.validSuffix[u.suffix];
    });
    this.sendInProgress = true;
    this.playlistSvc
      .sharePlaylist({
        playlist_id: this.playlist.playlist_id,
        playlist_title: this.playlist.playlist_title,
        resource_ids: this.playlist.resource_ids,
        shared_with: mailIds
      })
      .subscribe(
        data => {
          this.sendInProgress = false;
          const invalidIds = data.response.InvalidUsers;
          const playlist = {
            id: this.playlist.playlist_id,
            title: this.playlist.playlist_title,
            desc: undefined,
            contentIds: this.playlist.resource_ids,
            event: 'CP_SHARE_PLAYLIST'
          };

          if (invalidIds && invalidIds.length) {
            // console.log('invalids ids', invalidIds, data);
            const mailList = invalidIds.join(', ');

            data.response.result !== 'failed'
              ? this.snackBar.open(this.invalidIdsToast.nativeElement.value + mailList)
              : this.snackBar.open(this.allInvalidIdsToast.nativeElement.value);

            invalidIds.forEach(userEmail => {
              const userEmailName = userEmail.replace('EMAIL', '').replace('EMAIL', '');
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

          const mailsIdsWithoutDomain = mailIds.map(email => email.split('@')[0].trim());
          this.userEmailIds = this.userEmailIds.filter(
            user => mailsIdsWithoutDomain.indexOf(user.email.split('@')[0].trim()) < 0
          );
          if (data.response.result !== 'failed') {
            this.snackBar.open(this.playlistSharingSuccessfulToast.nativeElement.value + mailIds);
            if (mailIds.join(';')) {
              // const invalidIdsNoDomain = invalidIds.map(email => email.split('@')[0].trim());
              this.miscSvc
                .shareMail(
                  this.playlist.playlist_id,
                  mailIds.join(';'),
                  'sharePlaylist',
                  txtBody,
                  playlist,
                  '/playlist'
                )
                .subscribe(
                  response => {
                    this.sendInProgress = false;
                    if (response.response !== 'No valid Ids') {
                      this.sendStatus = 'INVALID_ID_SOME';
                      this.snackBar.open(this.sendMailSuccessToast.nativeElement.value + mailIds.join(';'));
                    } else if (response.response === 'No valid Ids') {
                      this.sendStatus = 'INVALID_IDS_ALL';
                      this.snackBar.open(this.allInvalidIdsToast.nativeElement.value);
                    }
                    if (!this.userEmailIds.length) {
                      this.dialogRef.close();
                    }
                  },
                  err => {
                    this.snackBar.open(this.mailSendFailToast.nativeElement.value);
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
          this.snackBar.open(this.playlistSendError.nativeElement.value);
          // this.dialogRef.close();
        }
      );
  }
}
