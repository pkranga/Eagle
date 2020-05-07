/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core'
import { NsContent } from '../../_services/widget-content.model'
import { MatListOption, MAT_DIALOG_DATA, MatSnackBar, MatDialogRef } from '@angular/material'
import { TFetchStatus } from '../../../../../utils/src/public-api'
import { BtnKbService } from '../btn-kb.service'
import { Router } from '@angular/router'

@Component({
  selector: 'ws-widget-btn-kb-dialog',
  templateUrl: './btn-kb-dialog.component.html',
  styleUrls: ['./btn-kb-dialog.component.scss'],
})
export class BtnKbDialogComponent implements OnInit {
  @ViewChild('contentUpdated', { static: true }) contentUpdatedMessage!: ElementRef<any>
  @ViewChild('contentNotUpdated', { static: true }) contentNotUpdatedMessage!: ElementRef<any>

  inProgress: TFetchStatus = 'none'
  selectedBoards = new Set<string>()
  changedBoards = new Set<string>()
  postSelectedBoards = new Set<string>()
  reason = ''
  fetchKbs: TFetchStatus = 'none'
  knowledgeBoards: NsContent.IContent[] | null | any[] = null
  constructor(
    private dialog: MatDialogRef<BtnKbDialogComponent>,
    private snackbar: MatSnackBar,
    private kbSvc: BtnKbService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public contentId: string,
  ) { }

  redirectToCreateKb() {
    this.dialog.close()
    this.router.navigateByUrl('/author/create')
  }

  ngOnInit() {
    this.fetchKbs = 'fetching'
    this.kbSvc.getMyKnowledgeBoards().subscribe(response => {
      this.fetchKbs = 'done'
      this.knowledgeBoards = response.result
      this.knowledgeBoards.forEach(board => {
        if (board.children.map((content: { identifier: any; }) => content.identifier).includes(this.contentId)) {
          this.selectedBoards.add(board.identifier)
          this.postSelectedBoards.add(board.identifier)
        }
      })
      this.knowledgeBoards.forEach(board => {
        const sections = new Set<string>()
        board.sections = []
        board.selectedSection = []
        board.newSelectedSection = ''
        board.children.forEach((child: any) => {
          if (child.identifier === this.contentId) {
            if (child.childrenClassifiers.length) {
              child.childrenClassifiers.forEach((childClassifier: any) => {
                if (board.selectedSection.indexOf(childClassifier) < 0) {
                  board.selectedSection.push(childClassifier)
                }
              })
            } else {
              board.selectedSection.push('Default')
            }
          }
          child.childrenClassifiers.forEach((childClassifier: string) => {
            if (!sections.has(childClassifier)) {
              sections.add(childClassifier)
              board.sections.push(childClassifier)
            }
          })
        })
      })
    })
  }

  selectionChange(kbId: string, checked: boolean) {
    if (this.knowledgeBoards) {
      const board = this.knowledgeBoards.find(b => b.identifier === kbId)
      if (board) {
        this.changedBoards.add(board.identifier)
        let children: any = board.children.map((child: any) => ({
          ...child,
        }))
        if (checked) {
          this.postSelectedBoards.add(board.identifier)
        } else {
          this.postSelectedBoards.delete(board.identifier)
          children = children.filter((child: any) => child.identifier !== this.contentId)
          board.children = children
        }
      }
    }
  }

  addContentToKb(options: MatListOption[]) {
    options.forEach((option: MatListOption) => {
      if (this.knowledgeBoards) {
        const board = this.knowledgeBoards.find(b => b.identifier === option.value)
        if (board) {
          this.changedBoards.add(board.identifier)
          let children: any = board.children.map((child: any) => ({
            ...child,
          }))
          if (option.selected) {
            let newChildrenClassifier = [...board.selectedSection]
            newChildrenClassifier = newChildrenClassifier.filter(u => u !== 'NewNewNew')
            if (board.newSelectedSection.length) {
              newChildrenClassifier.push(board.newSelectedSection)
            }
            children.push({
              identifier: this.contentId,
              childrenClassifiers: newChildrenClassifier,
              reason: this.reason,
            })
          } else {
            children = children.filter((child: any) => child.identifier !== this.contentId)
          }
          board.children = children
        }

      }
    })
    if (this.knowledgeBoards) {
      this.knowledgeBoards.forEach(board => {
        if (this.changedBoards.has(board.identifier)) {
          this.inProgress = 'fetching'
          this.kbSvc.addContentToKb(board.identifier, board.children).subscribe(
            _ => {
              this.inProgress = 'done'
              this.snackbar.open(this.contentUpdatedMessage.nativeElement.value)
              this.dialog.close()
            },
            _ => {
              this.inProgress = 'error'
              this.snackbar.open(this.contentNotUpdatedMessage.nativeElement.value)
            },
          )
        }
      })
    }
  }
}
