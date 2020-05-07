/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { LoaderService } from '@ws/author/src/lib/services/loader.service'
import { MyContentService } from '../../services/my-content.service'
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core'
import { FlatTreeControl } from '@angular/cdk/tree'
import { ActivatedRoute, Router } from '@angular/router'
import {
  IAuthoringPagination,
  IMenuFlatNode,
  IFilterMenuNode,
} from '@ws/author/src/lib/interface/authored'
import { MatTreeFlattener, MatTreeFlatDataSource, MatSnackBar, MatDialog } from '@angular/material'
import { Subscription } from 'rxjs'
import { Notify } from '@ws/author/src/lib/constants/notificationMessage'
import { NotificationComponent } from '@ws/author/src/lib/modules/shared/components/notification/notification.component'
import { NOTIFICATION_TIME } from '@ws/author/src/lib/constants/constant'
import { NSContent } from '@ws/author/src/lib/interface/content'
import { CommentsDialogComponent } from '@ws/author/src/lib/modules/shared/components/comments-dialog/comments-dialog.component'
import { FormGroup } from '@angular/forms'
import { NSApiRequest } from '@ws/author/src/lib/interface/apiRequest'
import { ConfirmDialogComponent } from '@ws/author/src/lib/modules/shared/components/confirm-dialog/confirm-dialog.component'
import { AccessControlService } from '@ws/author/src/lib/modules/shared/services/access-control.service'

@Component({
  selector: 'ws-auth-my-content',
  templateUrl: './my-content.component.html',
  styleUrls: ['./my-content.component.scss'],
})
export class MyContentComponent implements OnInit, OnDestroy {
  public sideNavBarOpened = false
  filterMenuTreeControl: FlatTreeControl<IMenuFlatNode>
  filterMenuTreeFlattener: any
  public cardContent!: any[]
  public filters: any[] = []
  public status = 'Draft'
  public fetchError = false
  contentType: string[] = []
  complexityLevel: string[] = []
  unit: string[] = []
  finalFilters: any = []
  allLanguages: any[] = []
  searchLanguage = ''
  public pagination!: IAuthoringPagination
  userId!: string
  totalContent!: number
  showLoadMore!: boolean
  routerSubscription = <Subscription>{}
  queryFilter = ''
  ordinals: any
  isAdmin = false
  @ViewChild('searchInput', { static: false }) searchInputElem: ElementRef<any> = {} as ElementRef<
    any
  >

  public filterMenuItems: any = [
    // {
    //   name: 'Content category',
    //   type: 'contentType',
    //   children: [
    //     { name: 'Learning path', type: 'contentType', checked: false },
    //     { name: 'Course', type: 'contentType', checked: false },
    //     { name: 'Module', type: 'contentType', checked: false },
    //     { name: 'Resource', type: 'contentType', checked: false },
    //   ],
    // },
    // {
    //   name: 'Level',
    //   type: 'complexityLevel',
    //   children: [
    //     { name: 'Beginner', type: 'complexityLevel', checked: false },
    //     { name: 'Intermediate', type: 'complexityLevel', checked: false },
    //     { name: 'Advanced', type: 'complexityLevel', checked: false },
    //   ],
    // },
    // {
    //   name: 'Source',
    //   type: 'sourceName',
    //   children: [
path
    //     { name: 'IAP', type: 'sourceName', checked: false },
    //   ],
    // },
  ]

  dataSource: any
  hasChild = (_: number, node: IMenuFlatNode) => node.expandable

  private _transformer = (node: IFilterMenuNode, level: number) => {
    return {
      expandable: !!node.content && node.content.length > 0,
      displayName: node.displayName,
      checked: node.checked,
      type: node.type,
      count: node.count,
      levels: level,
    }
  }

  constructor(
    private myContSvc: MyContentService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private loadService: LoaderService,
    private accessService: AccessControlService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    this.filterMenuTreeControl = new FlatTreeControl<IMenuFlatNode>(
      node => node.levels,
      node => node.expandable,
    )
    this.filterMenuTreeFlattener = new MatTreeFlattener(
      this._transformer,
      node => node.levels,
      node => node.expandable,
      node => node.content,
    )
    this.dataSource = new MatTreeFlatDataSource(
      this.filterMenuTreeControl,
      this.filterMenuTreeFlattener,
    )
    this.dataSource.data = this.filterMenuItems
    this.activatedRoute.queryParams.subscribe(params => {
      this.status = params.status
    })
    this.userId = this.accessService.userId
    this.isAdmin = this.accessService.hasRole(['admin', 'super-admin', 'content-admin', 'editor'])
  }

  ngOnDestroy() {
    if (this.routerSubscription.unsubscribe) {
      this.routerSubscription.unsubscribe()
    }
  }

  ngOnInit() {
    this.pagination = {
      offset: 0,
      limit: 24,
    }
    this.fetchContent(false)
    this.routerSubscription = this.activatedRoute.data.subscribe(data => {
      this.ordinals = data.ordinals
      this.allLanguages = data.ordinals.subTitles || []
    })
  }

  fetchStatus(status: string) {
    switch (status) {
      case 'draft':
      case 'rejected':
        return ['Draft']
      case 'inreview':
        return ['InReview', 'Reviewed']
      case 'review':
        return ['InReview']
      case 'published':
        return ['Live']
      case 'publish':
        return ['Reviewed']
      case 'processing':
        return ['Processing']
      case 'unpublished':
        return ['Unpublished']
    }
    return ['Draft']
  }

  fetchContent(loadMoreFlag: boolean, changeFilter = true) {
    const contentStatus = this.fetchStatus(this.status)
    const searchLocale = []
    if (this.searchLanguage) {
      searchLocale.push(this.searchLanguage)
    }
    const requestData = {
      request: {
        locale: searchLocale,
        query: this.queryFilter,
        filters: {
          status: contentStatus,
          isRejected: <boolean[]>[],
          creatorContacts: <string[]>[],
          trackContacts: <string[]>[],
          publisherDetails: <string[]>[],
          isMetaEditingDisabled: [false],
          isContentEditingDisabled: [false],
        },
        pageNo: loadMoreFlag ? this.pagination.offset : 0,
        sort: [{ lastUpdatedOn: 'desc' }],
        pageSize: this.pagination.limit,
        uuid: this.userId,
        rootOrg: this.accessService.rootOrg,
      },
    }
    if (this.finalFilters.length) {
      this.finalFilters.forEach((v: any) => {
        requestData.request.filters = { ...requestData.request.filters, [v.key]: v.value }
      })
    }
    if (this.queryFilter) {
      delete requestData.request.sort
    }
    if (this.status === 'rejected') {
      requestData.request.filters.isRejected.push(true)
    }
    if (
      ['draft', 'rejected', 'inreview', 'published', 'processing'].indexOf(this.status) > -1 &&
      !this.isAdmin
    ) {
      requestData.request.filters.creatorContacts.push(this.userId)
    }
    if (this.status === 'review' && !this.isAdmin) {
      requestData.request.filters.trackContacts.push(this.userId)
    }
    if (this.status === 'publish' && !this.isAdmin) {
      requestData.request.filters.publisherDetails.push(this.userId)
    }
    this.loadService.changeLoad.next(true)
    this.myContSvc.fetchContent(requestData).subscribe(
      data => {
        this.loadService.changeLoad.next(false)
        if (changeFilter) {
          this.filterMenuItems = data ? data.result.response.filters : this.filterMenuItems
          this.dataSource.data = this.filterMenuItems
        }
        this.cardContent =
          (loadMoreFlag && !this.queryFilter
            ? (this.cardContent || []).concat(data ? data.result.response.result : data)
            : data
              ? data.result.response.result
              : data) || []
        this.totalContent = data ? data.result.response.totalHits : 0
        this.showLoadMore =
          this.pagination.offset * this.pagination.limit + this.pagination.limit < this.totalContent
            ? true
            : false
        this.fetchError = false
      },
      () => {
        this.fetchError = true
        this.cardContent = []
        this.showLoadMore = false
        this.loadService.changeLoad.next(false)
      },
    )
  }

  search() {
    if (this.searchInputElem.nativeElement) {
      this.queryFilter = this.searchInputElem.nativeElement.value.trim()
    }
    this.fetchContent(false, false)
  }

  filterApplyEvent(node: any) {
    this.pagination.offset = 0
    this.sideNavBarOpened = false
    const filterIndex = this.filters.findIndex(v => v.displayName === node.displayName)
    const filterMenuItemsIndex = this.filterMenuItems.findIndex((obj: any) =>
      obj.content.some((val: any) => val.type === node.type),
    )
    const ind = this.finalFilters.indexOf(this.filterMenuItems[filterMenuItemsIndex].type)
    if (filterIndex === -1 && node.checked) {
      this.filters.push(node)
      this.filterMenuItems[filterMenuItemsIndex].content.find(
        (v: any) => v.displayName === node.displayName,
      ).checked = true

      if (ind === -1) {
        this.finalFilters.push({
          key: this.filterMenuItems[filterMenuItemsIndex].type,
          value: [node.type],
        })
      } else {
        this.finalFilters[ind].value.push(node.type)
      }
    } else {
      this.filterMenuItems[filterMenuItemsIndex].content.find(
        (v: any) => v.displayName === node.displayName,
      ).checked = false
      this.filters.splice(filterIndex, 1)
      this.finalFilters.splice(ind, 1)
    }
    this.dataSource.data = this.filterMenuItems
    this.fetchContent(false, false)
  }

  deleteContent(request: NSContent.IContentMeta) {
    this.loadService.changeLoad.next(true)
    this.myContSvc.deleteContent(request.identifier, request.contentType === 'Knowledge Board').subscribe(
      () => {
        this.loadService.changeLoad.next(false)
        this.snackBar.openFromComponent(NotificationComponent, {
          data: {
            type: Notify.SUCCESS,
          },
          duration: NOTIFICATION_TIME * 1000,
        })
        this.cardContent = (this.cardContent || []).filter(v => v.identifier !== request.identifier)
      },
      () => {
        this.loadService.changeLoad.next(false)
        this.snackBar.openFromComponent(NotificationComponent, {
          data: {
            type: Notify.CONTENT_FAIL,
          },
          duration: NOTIFICATION_TIME * 1000,
        })
      },
    )
  }

  createContent(request: NSContent.IContentMeta) {
    this.loadService.changeLoad.next(true)
    this.myContSvc.createInAnotherLanguage(request.identifier, request.locale).subscribe(
      (id: string) => {
        this.loadService.changeLoad.next(false)
        this.snackBar.openFromComponent(NotificationComponent, {
          data: {
            type: Notify.CONTENT_CREATE_SUCCESS,
          },
          duration: NOTIFICATION_TIME * 1000,
        })
        this.router.navigateByUrl(`/author/editor/${id}`)
      },
      () => {
        this.loadService.changeLoad.next(false)
        this.snackBar.openFromComponent(NotificationComponent, {
          data: {
            type: Notify.CONTENT_FAIL,
          },
          duration: NOTIFICATION_TIME * 1000,
        })
      },
    )
  }

  clearAllFilters() {
    this.finalFilters = []
    this.searchInputElem.nativeElement.value = ''
    this.queryFilter = ''
    this.filterMenuItems.map((val: any) => val.content.map((v: any) => (v.checked = false)))
    this.dataSource.data = this.filterMenuItems
    this.filters = []
    this.fetchContent(false)
  }

  loadMore() {
    this.pagination.offset += 1
    this.fetchContent(true, false)
  }

  confirmAction(content: any) {
    let message = ''
    if (content.type === 'delete') {
      message = 'delete'
    } else if (content.type === 'unpublish') {
      message = 'unpublish'
    } else if (content.type === 'moveToDraft' || content.type === 'moveToInReview') {
      if (content.data.mimeType.indexOf('collection') >= 0) {
        message = 'retrieveParent'
      } else {
        message = 'retrieveChild'
      }
    } else {
      this.forwardBackward(content)
      return
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      height: '175px',
      data: message,
    })

    dialogRef.afterClosed().subscribe((confirm: any) => {
      if (confirm) {
        if (content.type === 'delete') {
          this.deleteContent(content.data)
        } else if (content.type === 'unpublish' ||
          (content.type === 'moveToDraft' && content.data.status === 'Unpublished')) {
          this.unPublishOrDraft(content.data)
        } else {
          this.forwardBackward(content)
        }
      }
    })
  }

  unPublishOrDraft(request: NSContent.IContentMeta) {
    this.loadService.changeLoad.next(true)
    this.myContSvc.upPublishOrDraft(request.identifier, request.status !== 'Unpublished').subscribe(
      () => {
        this.loadService.changeLoad.next(false)
        this.snackBar.openFromComponent(NotificationComponent, {
          data: {
            type: Notify.SUCCESS,
          },
          duration: NOTIFICATION_TIME * 1000,
        })
        this.cardContent = (this.cardContent || []).filter(v => v.identifier !== request.identifier)
      },
      (_ex: any) => {
        this.loadService.changeLoad.next(false)
        this.snackBar.openFromComponent(NotificationComponent, {
          data: {
            type: Notify.CONTENT_FAIL,
          },
          duration: NOTIFICATION_TIME * 1000,
        })
      },
    )
  }

  forwardBackward(content: any) {
    const dialogRef = this.dialog.open(CommentsDialogComponent, {
      width: '750px',
      height: '450px',
      data: { ...content.data, status: 'Draft' },
    })

    dialogRef.afterClosed().subscribe((commentsForm: FormGroup) => {
      if (commentsForm) {
        this.finalCall(commentsForm, content)
      }
    })
  }

  finalCall(commentsForm: FormGroup, content: any) {
    if (commentsForm) {
      let operationValue: any
      switch (content.type) {
        case 'moveToDraft':
          operationValue = 0
          break
        case 'moveToInReview':
          operationValue = -1
          break
      }
      const body: NSApiRequest.IForwadBackwardActionGeneral = {
        comment: commentsForm.controls.comments.value,
        operation: operationValue,
      }
      this.loadService.changeLoad.next(true)
      this.myContSvc.forwardBackward(body, content.data.identifier).subscribe(
        () => {
          this.loadService.changeLoad.next(false)
          this.snackBar.openFromComponent(NotificationComponent, {
            data: {
              type: Notify.SUCCESS,
            },
            duration: NOTIFICATION_TIME * 1000,
          })
          this.cardContent = (this.cardContent || []).filter(
            v => v.identifier !== content.data.identifier,
          )
        },
        () => {
          this.loadService.changeLoad.next(false)
          this.snackBar.openFromComponent(NotificationComponent, {
            data: {
              type: Notify.CONTENT_FAIL,
            },
            duration: NOTIFICATION_TIME * 1000,
          })
        },
      )
    }
  }

  action(event: any) {
    switch (event.type) {
      case 'create':
        this.createContent(event.data)
        break

      // case 'comments':
      //   this.deleteContent(event.data)
      //   break

      case 'review':
      case 'publish':
      case 'edit':
        this.router.navigateByUrl(`/author/editor/${event.data.identifier}`)
        break

      case 'moveToInReview':
      case 'moveToDraft':
      case 'delete':
      case 'unpublish':
        this.confirmAction(event)
        break
    }
  }

  setCurrentLanguage(lang: string) {
    this.searchLanguage = lang
  }
}
