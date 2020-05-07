/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NsPage } from '@ws-widget/utils'
import { IGridLayoutData } from '@ws-widget/collection/src/public-api'

export interface IRenderPage {
  id: string,
  contentType: string,
  navigationBar: NsPage.INavBar,
  widgetSubType: string,
  widgetType: string,
  gutter: number,
  gridList: IGridData[]
}

export interface IGridData {
  id: string,
  children: IGridChildData[],
}

export interface IGridChildData {
  id: string,
  data: IGridLayoutData
}

export const modelJson = {
  contentType: 'Page',
  pageLayout: {
    widgetData: {
      gutter: 2,
      widgets: [
        [
          {
            dimensions: {},
            widget: {
              widgetData: {
                path: [
                  {
                    clickUrl: '/page/home',
                    text: 'Home',
                  },
                  {
                    text: 'Channels',
                  },
                  {
                    text: `The Learning World 'How to' page`,
                  },
                ],
              },
              widgetSubType: 'cardBreadcrumb',
              widgetType: 'card',
              widgetHostClass: 'block',
              widgetHostStyle: {
                'box-sizing': 'border-box',
              },
            },
          },
        ],
        [
          {
            dimensions: {
              small: 12,
              medium: 5,
              large: 3,
            },
            widget: {
              widgetData: {
                // tslint:disable-next-line:max-line-length
path
                containerClass: 'mat-elevation-z4 h-full',
              },
              widgetSubType: 'elementHtml',
              widgetType: 'element',
              widgetHostClass: 'block pl-4 h-full pr-4 md:pr-0',
              widgetHostStyle: {
                'box-sizing': 'border-box',
              },
            },
          },
          {
            dimensions: {
              small: 12,
              medium: 7,
              large: 6,
            },
            widget: {
              widgetData: {
                url: '/mobile-apps/videos/V2/Lex_New_AppTour_Final.mp4',
path
              },
              widgetSubType: 'playerVideo',
              widgetType: 'player',
              widgetInstanceId: 'video',
              widgetHostClass: 'block h-full video-full px-4 md:pr-4 lg:pr-0 md:pl-0',
              widgetHostStyle: {
                'box-sizing': 'border-box',
                'min-height': '350px',
              },
            },
          },
          {
            dimensions: {
              small: 12,
              medium: 12,
              large: 3,
            },
            widget: {
              widgetData: {
                // tslint:disable-next-line:max-line-length
                html: `<div class=\'rounded overflow-hidden h-full shadow-lg flex flex-col\'><h2 class=\'text-2xl p-6 font-normal text-blue-700 leading-tight \'>Want to know more?</h2><span class=\'text-base px-6 pb-6 leading-snug font-normal\'>Please get in touch with us via \'Contact\'</span></div>`,
                containerClass: 'mat-elevation-z4 h-full',
              },
              widgetSubType: 'elementHtml',
              widgetType: 'element',
              widgetHostClass: 'block pr-4 pl-4 h-full lg:pl-0',
              widgetHostStyle: {
                'box-sizing': 'border-box',
              },
            },
          },
        ],
        [
          {
            dimensions: {},
            widget: {
              widgetData: {
                strips: [
                  {
                    key: 'new_on_learning_world',
                    title: 'New on Learning World',
                    preWidgets: [
                      {
                        widgetData: {
path
                          containerClass: 'h-full',
                        },
                        widgetSubType: 'elementHtml',
                        widgetType: 'element',
                        widgetHostClass: 'sticky-m mat-elevation-z4',
                        widgetInstanceId: 'new_on_learning_world',
                      },
                    ],
                    request: {
                      search: {
                        pageNo: 0,
                        query: 'react',
                        sortBy: 'lastUpdatedOn',
                        sortOrder: 'DESC',
                      },
                    },
                  },
                  {
                    key: 'how_to_curate_for_Learning_World',
                    title: 'How to curate for Learning World',
                    preWidgets: [
                      {
                        widgetData: {
path
                          containerClass: 'h-full',
                        },
                        widgetSubType: 'elementHtml',
                        widgetType: 'element',
                        widgetHostClass: 'sticky-m mat-elevation-z4',
                      },
                      {
                        widgetData: {
                          // tslint:disable-next-line:max-line-length
                          template: `<div style='{{ cardStyle }}' class='flex flex - col justify - end relative h - full'>\n <div class='w - full' style='margin - bottom: 50px'>\n <span style='{{ overlayStyle }}' class='flex items- center p- 6 text - 2xl leading - tight font - semibold'>{{overlayText}}</span>\n </div>\n</div>`,
                          templateData: {
                            // tslint:disable-next-line:max-line-length
path
                            overlayText: 'What to consider when creating entries',
                            overlayStyle: 'background:#024f70;color:white',
                          },
                          containerClass: 'h-full',
                        },
                        widgetSubType: 'elementHtml',
                        widgetType: 'element',
                        widgetHostClass: 'sticky-m mat-elevation-z4',
                      },
                    ],
                    request: {
                      search: {
                        pageNo: 0,
                        pageSize: 20,
                        query: 'machine learning',
                      },
                    },
                  },
                ],
              },
              widgetSubType: 'contentStripMultiple',
              widgetType: 'contentStrip',
            },
          },
        ],
        [
          {
            dimensions: {},
            widget: {
              widgetData: {
                template: `<h1 class='mat- h1 margin- remove inline- block'>{{title}}</h1>`,
                templateData: {
                  title: `Discover the 'How to' video tutorial`,
                },
                containerClass: 'h-full',
              },
              widgetSubType: 'elementHtml',
              widgetType: 'element',
              widgetInstanceId: 'how_to_video_gallery',
              widgetHostClass: 'block px-4',
            },
          },
        ],
        [
          {
            dimensions: {},
            widget: {
              widgetData: {
                template: `<h1 class='mat- h1 margin- remove inline- block'>{{title}}</h1>`,
                templateData: {
                  title: `Discover the 'How to' video tutorial`,
                },
                containerClass: 'h-full',
              },
              widgetSubType: 'elementHtml',
              widgetType: 'element',
              widgetInstanceId: 'how_to_video_gallery',
              widgetHostClass: 'block px-4',
            },
          },
        ],
        [
          {
            dimensions: {},
            widget: {
              widgetSubType: 'galleryView',
              widgetType: 'gallery',
              widgetHostStyle: {
                'max-width': '100%',
                overflow: 'hidden',
                'box-sizing': 'border-box',
              },
              widgetHostClass: 'block p-4',
              widgetData: {
                designVal: 'set1',
                widgetPlayer: {
                  style: {
                    height: '400px',
                  },
                },
                cardMenu: [
                  {
                    cardData: {
                      title: 'Follow SingleTags and LearningTags',
                      description: `Discover 'My Learning World'`,
path
                    },
                    widget: {
                      widgetType: 'player',
                      widgetSubType: 'playerVideo',
                      widgetData: {
                        url: '/mobile-apps/videos/V2/Lex_New_AppTour_Final.mp4',
path
                      },
                      widgetHostClass: 'video-full block',
                      widgetHostStyle: {
                        height: '400px',
                      },
                    },
                  },
                  {
                    cardData: {
                      title: 'My Collections',
                      description: 'Create your own learning list',
path
                    },
                    widget: {
                      widgetType: 'player',
                      widgetSubType: 'playerVideo',
                      widgetData: {
                        url: '/mobile-apps/videos/V1/Lex_Launch_Mohit_Joshi.mp4',
path
                      },
                      widgetHostClass: 'video-full block',
                      widgetHostStyle: {
                        height: '400px',
                      },
                    },
                  },
                  {
                    cardData: {
                      title: 'Accessing content',
                      description: 'How to access learning content',
path
                    },
                    widget: {
                      widgetType: 'player',
                      widgetSubType: 'playerVideo',
                      widgetData: {
                        url: '/mobile-apps/videos/V2/Lex_New_AppTour_Final.mp4',
path
                      },
                      widgetHostClass: 'video-full block',
                      widgetHostStyle: {
                        height: '400px',
                      },
                    },
                  },
                  {
                    cardData: {
                      title: 'Search options',
                      description: 'How to search in the learning world',
path
                    },
                    widget: {
                      widgetType: 'player',
                      widgetSubType: 'playerVideo',
                      widgetData: {
                        url: '/mobile-apps/videos/V1/Lex_Launch_Mohit_Joshi.mp4',
path
                      },
                      widgetHostClass: 'video-full block',
                      widgetHostStyle: {
                        height: '400px',
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      ],
    },
    widgetSubType: 'gridLayout',
    widgetType: 'layout',
  },
}
