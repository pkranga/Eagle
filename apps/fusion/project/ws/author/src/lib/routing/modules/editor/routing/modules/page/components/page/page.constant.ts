/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export const WIDGET_LIBRARY = [{
  icon: 'audiotrack',
  name: 'Audio',
  data: {
    widgetType: 'player',
    widgetSubType: 'playerAudio',
    widgetData: {
      url: '',
      posterImage: '',
      subtitles: [],
      autoplay: false,
      markers: [],
      resumePoint: 0,
      setCookie: false,
      disableTelemetry: false,
    },
  },
}, {
  icon: 'video_call',
  name: 'Video',
  data: {
    widgetType: 'player',
    widgetSubType: 'playerVideo',
    widgetData: {
      url: '',
      posterImage: '',
      subtitles: [],
      autoplay: false,
      markers: [],
      resumePoint: 0,
      setCookie: false,
      disableTelemetry: false,
    },
    widgetHostClass: '',
    widgetHostStyle: {},
  },
}, {
  icon: 'text_fields',
  name: 'Text',
  data: {
    widgetData: {
      html: '',
      template: '',
      templateUrl: '',
      templateData: undefined,
      templateDataUrl: '',
      containerStyle: {},
      containerClass: '',
    },
    widgetSubType: 'elementHtml',
    widgetType: 'element',
    widgetHostClass: '',
    widgetHostStyle: {},
  },
}, {
  icon: 'collections',
  name: 'Carosuel',
  data: {
    widgetType: 'slider',
    widgetSubType: 'sliderBanners',
    widgetData: [
      {
        banners: {
          l: '',
          m: '',
          s: '',
          xl: '',
          xs: '',
        },
        redirectUrl: '',
        title: '',
        openInNewTab: true,
      },
    ],
  },
}, {
  icon: 'filter_frames',
  name: 'Embed',
  data: {
    widgetData: {
path
      Title: 'Learning Analytics',
    },
    widgetSubType: 'pageEmbedded',
    widgetType: 'page',
  },
}, {
  icon: 'menu_open',
  name: 'BreadCrum',
  data: {
    widgetData: {
      path: [
        {
          clickUrl: '/page/home',
          text: 'Home',
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
}]
