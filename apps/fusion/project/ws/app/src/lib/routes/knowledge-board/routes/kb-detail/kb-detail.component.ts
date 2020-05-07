/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router, Data } from '@angular/router'
import {
  NsContent,
  NsContentStripMultiple,
  NsDiscussionForum,
  ROOT_WIDGET_CONFIG,
  NsError,
  IPickerContentData,
  BtnKbService,
} from '@ws-widget/collection'
import { NsPage, ConfigurationsService, EventService, WsEvents } from '@ws-widget/utils'
import { NsWidgetResolver } from '@ws-widget/resolver'
import { MatCheckboxChange, MatSnackBar } from '@angular/material'
import {
  CdkDragDrop,
  moveItemInArray,
} from '@angular/cdk/drag-drop'
import { MatDialog } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { DeleteContentDialogComponent } from './components/delete-content-dialog/delete-content-dialog.component'
@Component({
  selector: 'ws-app-kb-detail',
  templateUrl: './kb-detail.component.html',
  styleUrls: ['./kb-detail.component.scss'],
})
export class KbDetailComponent implements OnInit, OnDestroy {
  discussionForumWidget: NsWidgetResolver.IRenderConfigWithTypedData<
    NsDiscussionForum.IDiscussionForumInput
  > | null = null

  content: NsContent.IContent | null = null
  contentWidgets: any[] = []
  error = this.route.snapshot.data.content.error

  pageNavbar: Partial<NsPage.INavBackground> = this.configSvc.pageNavBar

  contentCategory: { [reasonAdded: string]: NsContent.IContent[] } = {}
  multipleStripWidget: any
  widgetData: NsContentStripMultiple.IContentStripMultiple | null = null
  copyWidgetData: NsContentStripMultiple.IContentStripMultiple | null = null
  copyWidgetDataEdit: NsContentStripMultiple.IContentStripMultiple | null = null

  errorWidget: NsWidgetResolver.IRenderConfigWithTypedData<NsError.IWidgetErrorResolver> = {
    widgetType: ROOT_WIDGET_CONFIG.errorResolver._type,
    widgetSubType: ROOT_WIDGET_CONFIG.errorResolver.errorResolver,
    widgetData: {
      errorType: 'internalServer',
    },
  }
  pickerContentData: IPickerContentData = {
    availableFilters: ['contentType'],
  }
  selectedContentIds: Set<string> = new Set()
  reasonForAdd = ''
  selectedClassifier: string | null = null
  contentClassifiers: string[] = []
  createEnablerButtonEnabled = false
  rearrangeEnablerButtonEnabled = false
  userId = ''
  createEnabled = false
  editEnabled = false
  reOrderEnabled = false
  selectedDeleteIds: string[] = []
  isDeleting = false
  isAddingContent = false
  routeSubscription: Subscription | null = null
  followCount = 0

  constructor(
    private configSvc: ConfigurationsService,
    private eventSvc: EventService,
    private route: ActivatedRoute,
    private btnKbSvc: BtnKbService,
    private router: Router,
    private snackBar: MatSnackBar,
    public deleteDialog: MatDialog,
  ) { }

  ngOnInit() {
    if (this.configSvc.userProfile) {
      this.userId = this.configSvc.userProfile.userId
    }
    if (this.route) {
      this.routeSubscription = this.route.data.subscribe((data: Data) => {
        this.initData(data)
      })
    }

    this.raiseEvent(WsEvents.EnumTelemetrySubType.Loaded)
  }

  ngOnDestroy() {
    this.raiseEvent(WsEvents.EnumTelemetrySubType.Unloaded)
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe()
    }
  }

  follow(_id: string) {
    this.followCount += 1
  }

  unfollow(_id: string) {
    this.followCount -= 1
  }

  initData(data: Data) {
    this.content = data.content.data || null

    if (this.content) {
      this.btnKbSvc.getFollowers(this.content.identifier).subscribe((followData: any) => {
        this.followCount = followData[0].count
      })
      if (
        this.configSvc.restrictedFeatures && (!this.configSvc.restrictedFeatures.has('kb_editor')
          || (!this.configSvc.restrictedFeatures.has('knowledgeBoard') && this.content.creatorContacts.some(u => u.id === this.userId)))
      ) {
        this.createEnablerButtonEnabled = true
        this.rearrangeEnablerButtonEnabled = true
      }
      const contentClassifiers = new Set<string>()
      this.content.children = this.content.children.filter(child => child.status === 'Live' || child.status === 'MarkedForDeletion')
      this.content.children.forEach(child => {
        if (child.childrenClassifiers) {
          child.childrenClassifiers.forEach(u => contentClassifiers.add(u))
        }
        if (child.childrenClassifiers && child.childrenClassifiers.length === 0) {
          contentClassifiers.add('Default')
          child.childrenClassifiers.push('Default')
        }
        if (!child.childrenClassifiers) {
          contentClassifiers.add('Default')
          child.childrenClassifiers = ['Default']
        }
      })
      this.contentClassifiers = [...contentClassifiers.values()]
      const children = this.content.children
      const classifiedStrips = [...contentClassifiers.values()]
        .map(classifier => ({
          classifier,
          contents: JSON.parse(JSON.stringify(children.filter(
            child => child.childrenClassifiers && child.childrenClassifiers.includes(classifier),
          ))),
        }))
        .map(({ contents, classifier }) => {
          contents.map(
            (v: any) => { v.childrenClassifiers = [classifier]; return v }); return { contents, classifier }
        })
        .map(({ contents, classifier }) => ({
          key: `kb-strip-${classifier}`,
          title: classifier,
          preWidgets: contents.map((content: any) => ({
            widgetType: 'card',
            widgetSubType: 'cardContent',
            widgetData: {
              content:
                { ...content, mode: NsContent.ETagType.NEWLY_ADDED }, cardSubType: 'standard', intranetMode: 'greyOut', deletedMode: 'hide',
            },
          })),
        }))

      this.widgetData = {
        loader: true,
        strips: [
          // defaultStrip,
          ...classifiedStrips,
        ],
      }
      this.copyWidgetData = JSON.parse(JSON.stringify(this.widgetData))
      this.copyWidgetDataEdit = JSON.parse(JSON.stringify(this.widgetData))
      this.multipleStripWidget = {
        widgetType: 'contentStrip',
        widgetSubType: 'contentStripMultiple',
        widgetData: this.widgetData,
      }

      this.discussionForumWidget = {
        widgetData: {
          description: this.content.description,
          id: this.content.identifier,
          name: NsDiscussionForum.EDiscussionType.LEARNING,
          title: this.content.name,
          initialPostCount: 2,
        },
        widgetSubType: 'discussionForum',
        widgetType: 'discussionForum',
      }
    }
  }

  onContentSelectionChanged(content: Partial<NsContent.IContent>, checked: boolean) {
    if (content && content.identifier) {
      checked
        ? this.selectedContentIds.add(content.identifier)
        : this.selectedContentIds.delete(content.identifier)
    }
  }

  enableCreate() {
    if (!this.reOrderEnabled) {
      this.copyWidgetData = JSON.parse(JSON.stringify(this.widgetData))
    }
    if (!this.editEnabled) {
      this.copyWidgetDataEdit = JSON.parse(JSON.stringify(this.widgetData))
    }
    this.createEnabled = !this.createEnabled
    if (this.createEnabled) {
      const elem = document.getElementById('id-for-create-kb')
      if (elem) {
        elem.scrollIntoView()
      }
    }
    this.editEnabled = false
    this.reOrderEnabled = false
    this.revertReorder()
    this.revertEdit()
  }

  reOrder(successMsg: string, failedMsg: string) {
    if (!this.reOrderEnabled) {
      this.copyWidgetData = JSON.parse(JSON.stringify(this.widgetData))
    }
    if (!this.editEnabled) {
      this.copyWidgetDataEdit = JSON.parse(JSON.stringify(this.widgetData))
    }
    this.createEnabled = false
    this.editEnabled = false
    this.reOrderEnabled = !this.reOrderEnabled
    this.revertEdit()
    if (!this.reOrderEnabled) {
      this.saveReorder(successMsg, failedMsg)
    }
  }

  startDelete() {
    // console.log(this.widgetData)
    if (!this.reOrderEnabled) {
      this.copyWidgetData = JSON.parse(JSON.stringify(this.widgetData))
    }
    if (!this.editEnabled) {
      this.copyWidgetDataEdit = JSON.parse(JSON.stringify(this.widgetData))
    }
    this.createEnabled = false
    this.editEnabled = !this.editEnabled
    this.reOrderEnabled = false
    this.revertReorder()
    const elem = document.getElementById('delete-kb-content')
    if (elem && this.editEnabled) {
      elem.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      })
    }
  }

  revertEdit() {
    // console.log(this.widgetData)
    // console.log(this.copyWidgetDataEdit)
    this.widgetData = this.copyWidgetDataEdit
    this.copyWidgetData = JSON.parse(JSON.stringify(this.widgetData))
    this.multipleStripWidget = {}
    this.multipleStripWidget = {
      widgetType: 'contentStrip',
      widgetSubType: 'contentStripMultiple',
      widgetData: this.widgetData,
    }
    this.editEnabled = false
    // console.log(this.widgetData)
  }

  revertReorder() {
    this.widgetData = this.copyWidgetData
    this.copyWidgetDataEdit = JSON.parse(JSON.stringify(this.widgetData))
    this.multipleStripWidget = {}
    this.multipleStripWidget = {
      widgetType: 'contentStrip',
      widgetSubType: 'contentStripMultiple',
      widgetData: this.widgetData,
    }
    this.reOrderEnabled = false
  }

  saveReorder(successMsg: string, failedMsg: string) {
    if (this.content) {
      const newChildren: any[] = []
      if (this.widgetData) {
        if (this.widgetData.strips && this.widgetData.strips.length > 0) {
          this.widgetData.strips.forEach(strip => {
            if (strip.preWidgets && strip.preWidgets.length > 0) {
              strip.preWidgets.forEach(preWidget => {
                if (preWidget.widgetData && preWidget.widgetData.content) {
                  newChildren.push(preWidget.widgetData.content)
                }
              })
            }
          })
        }
      }
      const req = {
        nodesModified: {},
        hierarchy: {
          [this.content.identifier]: {
            root: true,
            children: [...newChildren],
          },
        },
      }
      const reqChildren = req.hierarchy[this.content.identifier].children
      const tempReqChildren: any[] = []
      const tempMap = new Map()
      reqChildren.forEach(u => {
        if (tempMap.has(u.identifier) && u.childrenClassifiers) {
          u.childrenClassifiers.forEach((v: any) => {
            tempReqChildren.filter(w => w.identifier === u.identifier)[0].childrenClassifiers.push(v)
          })
        } else {
          tempReqChildren.push(u)
          tempMap.set(u.identifier, u)
        }
      })
      req.hierarchy[this.content.identifier].children = tempReqChildren
      this.btnKbSvc.addContentsToKb(req).subscribe(
        () => {
          this.snackBar.open(successMsg, undefined, {
            duration: 10000,
          })
          // this.snackBar.open(successMsg)
          // tslint:disable-next-line
          // console.log('API Success', req);
        },
        () => {
          this.snackBar.open(failedMsg, undefined, {
            duration: 10000,
          })
          // this.snackBar.open(failedMsg)
          // tslint:disable-next-line
          // console.error('API FAILED', req);
        },
        () => { },
      )
      this.reOrderEnabled = false
    }
  }

  onChangeDelete(event: MatCheckboxChange, deleteId: string) {
    if (event.checked) {
      this.selectedDeleteIds.push(deleteId)
    } else {
      const index = this.selectedDeleteIds.findIndex(id => id === deleteId)
      if (index > -1) {
        this.selectedDeleteIds.splice(index, 1)
      }
    }
  }

  openDeleteDialog(ids: string[], successMsg: string, failedMsg: string, updateMsg: string) {
    // if (ids.length) {
    const dialogRef = this.deleteDialog.open(DeleteContentDialogComponent, {
      width: '250px',
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'delete') {
        this.deleteIds(ids, successMsg, failedMsg, updateMsg)
      }
    })
    // } else {
    //   const msg = 'Please select at least one content'
    //   this.snackBar.open(msg)
    // }
  }

  deleteIds(ids: string[], successMsg: string, failedMsg: string, updateMsg: string) {
    if (this.content) {
      this.isDeleting = true
      const removalIDs = new Set(ids)
      const newChildren: any[] = []
      if (this.widgetData) {
        if (this.widgetData.strips && this.widgetData.strips.length > 0) {
          this.widgetData.strips.forEach(strip => {
            if (strip.preWidgets && strip.preWidgets.length > 0) {
              strip.preWidgets.forEach(preWidget => {
                if (preWidget.widgetData && preWidget.widgetData.content && !removalIDs.has(preWidget.widgetData.content.identifier)) {
                  preWidget.widgetData.content.childrenClassifiers = [strip.title]
                  newChildren.push(preWidget.widgetData.content)
                }
              })
            }
          })
        }
      }
      const req = {
        nodesModified: {},
        hierarchy: {
          [this.content.identifier]: {
            children: [...newChildren],
            root: true,
          },
        },
      }

      this.btnKbSvc.addContentsToKb(req).subscribe(
        () => {
          this.deleteId(ids, successMsg, failedMsg, updateMsg)
          // this.snackBar.open(successMsg)
        },
        _ => {
          this.deleteId(ids, successMsg, failedMsg, updateMsg)
          // this.snackBar.open(failedMsg)
        },
      )
    }
  }

  deleteId(ids: string[] = [], successMsg: string, failedMsg: string, updateMsg: string) {
    if (this.content && ids.length) {
      this.isDeleting = true
      const removalIDs = new Set(ids)

      const req = {
        identifier: this.content.identifier,
        children: Array.from(removalIDs),
      }

      this.btnKbSvc.editKBBoards(req, 'delete').subscribe(
        () => {
          this.router.navigate([], { queryParams: { ts: Date.now() } })
          this.isDeleting = false
          this.editEnabled = false
          this.snackBar.open(ids.length ? successMsg : updateMsg, undefined, {
            duration: 10000,
          })
          // this.snackBar.open(successMsg)
        },
        _ => {
          this.isDeleting = false
          this.snackBar.open(failedMsg, undefined, {
            duration: 10000,
          })
          // this.snackBar.open(failedMsg)
        },
      )
    } else {
      this.router.navigate([], { queryParams: { ts: Date.now() } })
      this.isDeleting = false
      this.editEnabled = false
      this.snackBar.open(ids.length ? successMsg : updateMsg, undefined, {
        duration: 10000,
      })
    }
  }

  addContent(successMsg: string, failedMsg: string) {
    if (!this.selectedClassifier) {
      this.snackBar.open('Please select a classifier')
      return
    }
    if (this.content) {
      this.isAddingContent = true

      const newChildren = [...this.selectedContentIds.values()].map(identifier => ({
        identifier,
        reason: this.reasonForAdd,
        childrenClassifiers: this.selectedClassifier ? [this.selectedClassifier] : [],
      }))
      const req = {
        identifier: this.content.identifier,
        children: newChildren,
      }
      this.btnKbSvc.editKBBoards(req, 'add').subscribe(
        () => {
          this.selectedClassifier = null
          this.reasonForAdd = ''
          this.selectedContentIds.clear()
          this.createEnabled = false
          this.router.navigate([], { queryParams: { ts: Date.now() } })
          this.isAddingContent = false
          // this.snackBar.open(successMsg)
          this.snackBar.open(successMsg, undefined, {
            duration: 10000,
          })
        },
        () => {
          this.isAddingContent = false
          // this.snackBar.open(failedMsg)
          this.snackBar.open(failedMsg, undefined, {
            duration: 10000,
          })
          // tslint:disable-next-line
          console.error('API FAILED', req)
        },
        () => { },
      )
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.widgetData ? this.widgetData.strips : [], event.previousIndex, event.currentIndex)
  }

  drop2(event: CdkDragDrop<string[]>, strips: any[]) {
    moveItemInArray(strips ? strips : [], event.previousIndex, event.currentIndex)
  }

  getRatingIcon(ratingIndex: number): 'star' | 'star_border' | 'star_half' {
    if (this.content && this.content.averageRating) {
      const avgRating = this.content.averageRating
      const ratingFloor = Math.floor(avgRating)
      if (ratingIndex <= ratingFloor) {
        return 'star'
      }
      if (ratingFloor === ratingIndex - 1 && avgRating % 1 > 0) {
        return 'star_half'
      }
    }
    return 'star_border'
  }
  raiseEvent(state: WsEvents.EnumTelemetrySubType) {
    const path = window.location.pathname.replace('/', '')
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      from: 'knowledge-board',
      to: '',
      data: {
        state,
        type: WsEvents.WsTimeSpentType.Page,
        mode: WsEvents.WsTimeSpentMode.View,
        pageId: path,
      },
    }
    this.eventSvc.dispatchEvent(event)
  }
}
