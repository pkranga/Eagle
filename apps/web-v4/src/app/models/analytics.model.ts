/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
export interface IAnalyticsResponse {
  activityType:ICount[];
  devices:IValue[];
  indexedOn: Date;
  lex_collection: IResult;
  lex_course: IResult;
  lex_program: IResult;
  lex_resource: IResult;
  participants:Iparticipants;
  refiners:IValue[];
  searchResult:ISearchResult;
  total:number;
  trainingHours:number;
  uniqueParticipants:ICount[];
  uniqueParticipantsStaging:ICount[];
  updatedOn:Date;
}

export interface IChartData {
  key: string;
  count: number;
  value:IValue[];
}

export interface IResult {
  result: {
    participants: number;
    title: string;
  }
}

export interface IValue{
  key: string;
  value: number;
}

export interface Iparticipants{
  account:IChartData[];
  country:IChartData[];
  cu:IChartData[];
  cuType:IChartData[];
  du:IChartData[];
  ibu:IChartData[];
  jl:IChartData[];
  location:IChartData[];
  onsiteOffshoreIndicator:[{
    count:number;
    key:string;
    trainingHours:number;
    value:IValue[];
  }];
  overallParticipants:IValue[];
  pu:IChartData[];
  puSALS:IChartData[];
}

export interface ISearchResult{
  result:[{
    courseCode:string;
    instructors:Array< any>;
    lex_collection:string;
    lex_course:string;
    lex_program:string;
    lex_resource:string;
    offeringsMode:Array<string>;
    offerings:number;
    participants:number;
    source:Array<string>;
    status:string;
    title:string;
  }];
}

export interface ICount{
  key: string;
  othersCounts:[{
    key: string;
    count: number;
  }];
  uniqueCount: number;
}

