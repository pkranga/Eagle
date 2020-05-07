/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Inject } from '@angular/core'
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { NSContent } from '@ws/author/src/lib/interface/content'

@Component({
  selector: 'ws-auth-root-comments-dialog',
  templateUrl: './comments-dialog.component.html',
  styleUrls: ['./comments-dialog.component.scss'],
})
export class CommentsDialogComponent implements OnInit {

  commentsForm!: FormGroup
  contentMeta!: NSContent.IContentMeta
  isSubmitPressed = false
  constructor(private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<CommentsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: NSContent.IContentMeta) { }

  ngOnInit() {
    this.contentMeta = this.data
    this.commentsForm = this.formBuilder.group({
      comments: ['', [Validators.required]],
      action: ['accept', [Validators.required]],
    })
  }

  showError(formControl: AbstractControl) {
    if (formControl.invalid) {
      if (this.isSubmitPressed) {
        return true
      }
      if (formControl && formControl.touched) {
        return true
      }
      return false
    }
    return false
  }

  submitData() {
    if (this.commentsForm.controls.comments.value) {
      this.dialogRef.close(this.commentsForm)
    } else {
      this.commentsForm.controls['comments'].markAsTouched()
    }
  }

}
