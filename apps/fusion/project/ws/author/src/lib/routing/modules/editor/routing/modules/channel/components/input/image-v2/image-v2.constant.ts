/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export const TEMPLATE_TYPES = {
  set1: '<img style="width: 100%; height: 100%" class="h-full" src="{{imageSrc}}" />',
  set2:
    '<a href={{link}}><img style="width: 100%; height: 100%" class="h-full" src="{{imageSrc}}" /></a>',
  set3:
    // tslint:disable-next-line: max-line-length
    '<div style="height: 85%; background : url({{imageSrc}});  background-repeat: no-repeat; background-position: center center; background-size: 100% 100% !important; width: 100%" class="flex flex-col justify-end h-full"></div><div style="background:#005f87cc;color:white;opacity:0.8;height: 15%" class="flex items-center text-xl leading-tight font-normal"><span class="p-4">{{title}}</span></div>',
  set4:
    // tslint:disable-next-line: max-line-length
    '<a target="_blank" href="{{link}}"><div style="height: 85%; background : url({{imageSrc}});  background-repeat: no-repeat; background-position: center center; background-size: 100% 100% !important; width: 100%" class="flex flex-col justify-end h-full"></div><div style="background:#005f87cc;color:white;opacity:0.8;height: 15%" class="flex items-center text-xl leading-tight font-normal"><span class="p-4">{{title}}</span></div></a>',
  set5:
    // tslint:disable-next-line: max-line-length
    '<div class= "relative" style= "background-size: 100% 100%;background-repeat: no-repeat;background-image:url({{imageSrc}});height: 100%;width: 100%;"><div style= "background-color: #297595;opacity:0.9" class= "mb-10 h-20 w-full flex flex-col items-center justify-center absolute bottom-0 text-white text-xl font-semibold text-center leading-tight"><div class="p-2">{{title}}</div></div></div>',
  set6:
    // tslint:disable-next-line: max-line-length
    '<a href={{link}}><div class= "relative" style= "background-size: 100% 100%;background-repeat: no-repeat;background-image:url({{imageSrc}});height: 100%;width: 100%;"><div style= "background-color: #297595;opacity:0.9" class= "mb-10 h-20 w-full flex flex-col items-center justify-center absolute bottom-0 text-white text-xl font-semibold text-center leading-tight"><div class="p-2">{{title}}</div></div></div></a>',
  set7:
    // tslint:disable-next-line: max-line-length
    '<div style="width:100%;height: 100%;" class="h-full mat-app-background"><img style="width:100%;height: 45%;" src="{{imageSrc}}"/><div style="height: 55%;" class="justify-start m-3"><div class="ws-mat-primary-text leading-tight mat-title" style="line-height: 1.25">{{title}}</div><p class="m-2 mt-6">{{description}}</p></div></div>',
  set8:
    // tslint:disable-next-line: max-line-length
    '<a href="{{link}}"><div style="width:100%;height: 100%;" class="h-full mat-app-background"><img style="width:100%;height: 45%;" src="{{imageSrc}}"/><div style="height: 55%;" class="justify-start m-3"><div class="ws-mat-primary-text leading-tight mat-title" style="line-height: 1.25">{{title}}</div><p class="m-2 mt-6">{{description}}</p></div></div></a>',
  set9:
    // tslint:disable-next-line: max-line-length
    '<div class= "relative" style= "background-size: 100% 100%;background-repeat: no-repeat;background-image:url({{imageSrc}});height:100%;width:100%"><div style= "height:auto;background-color: #297595;opacity:0.9" class= "w-full flex flex-col items-center justify-center absolute bottom-0 text-white text-xl font-semibold text-center leading-tight"><div class="text-2xl p-2">{{title}}</div><div class="p-2">{{description}}</div></div></div>',
  set10:
    // tslint:disable-next-line: max-line-length
    '<a href={{link}}><div class= "relative" style= "background-size: 100% 100%;background-repeat: no-repeat;background-image:url({{imageSrc}});height:100%;width:100%"><div style= "height:auto;background-color: #297595;opacity:0.9" class= "w-full flex flex-col items-center justify-center absolute bottom-0 text-white text-xl font-semibold text-center leading-tight"><div class="text-2xl p-2">{{title}}</div><div class="p-2">{{description}}</div></div></div></a>',
  set11:
    // tslint:disable-next-line: max-line-length
    '<div class="mat-app-background"><div style="height: 100%; display: contents" class="h-full ml-1 mr-4"><img style="height: 45%; width:100%;" src="{{imageSrc}}"/><div  style="height: 55%;" class="justify-start m-3"><div class="leading-tight " style="line-height: 1.25">{{category}}</div><p class="m-2 ws-mat-primary-text mat-title mt-6">{{title}}</p> <div><p>{{description}}</p></div></div></div></div>',
  set12:
    // tslint:disable-next-line: max-line-length
    '<div class="mat-app-background"><div style="height: 100%; display: contents" class= "h-full ml-1 mr-4"><a target="{{target}}" href = "{{link}}"><img style="height: 45%; width:100%;" src = "{{imageSrc}}" /><div class="justify-start m-3" style = "height: 55%;" ><div class="leading-tight " style = "line-height: 1.25">{{ category }}</div><p class="m-2 ws-mat-primary-text mat-title mt-6">{{ title }}</p><div ><p>{{ description }}</p></div></div></a></div></div>',
  title: '<h1 class="mat-h1 inline-block">{{title}}</h1>',
  // tslint:disable-next-line: max-line-length
  text: '<div style="width:100%;" class="h-full"><a href={{link}} target={{target}}><div class="justify-start"><div class="text-gray-600">{{date}}</div><div class="ws-mat-primary-text leading-tight mat-title" style="line-height: 1.25">{{title}}</div><p class="m-2 mt-6">{{description}}</p></div></a></div>',
}

export const COLUMN_WIDTH = {
  1: 265,
  2: 627,
  3: 968,
  4: 1270,
}
