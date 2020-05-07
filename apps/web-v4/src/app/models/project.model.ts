/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
export interface IProjectFetchResult {
  _id: string;
  _index: string;
  _score: any;
  _source: ISource;
  _type: string;
}

export interface ISource {
  doc: IProjectInfo;
}

export interface IProjectInfo {
  MstProjectCode: string;
  MstProjectName: string;
  MstServiceOffering: string;
  ChildServiceOffering: IChildServiceOffering[];
  PUName: string;
  Status: string;
  MstProcessType: string;
  MstProjectScope: string;
  MstInfosysRole: string;
  MstTechnologies: null;
  DM: IDm;
  PM: IDm;
  MstContractType: string;
  EmpCount: number;
  CurrentEmpCount: null;
  PastEmpCount: null;
  PU: string;
  HasChildren: boolean;
  IBU: string;
  IBUName: string;
  DoNotCallMap: boolean;
  ChildContractType: string[];
  ChildProcessType: any[];
  ChildProjectScope: any[];
  ChildProjectInfosysRole: any[];
  ChildProjectInfyObjectives: any[];
  MstInnovations: IMstInnovation[];
  MstTools: IMstTool[];
  MstRisks: IMstRisk[];
  MstStrategies: IMstStrategy[];
  MstReuseComponents: IMstReuseComponent[];
  MstInfyObjectives: string;
  MstLocation: IMstLocation;
  Contributions: IContribution[];
  bHasContribution: boolean;
  MstBusinessContext: string;
  ChildProjectBusinessContext: string;
  CustomerName: string;
  courseDetails: any;
}

export interface IChildServiceOffering {
  ServiceOffering: string;
  ChildProjects: any[];
  ChildProjectsPast: any[];
  ChildProjectCount: number;
  EmpCount: number;
  ChildProjectCountPast: number;
  EmpCountPast: number;
}

export interface IContribution {
  KMSource: string;
  ItemId: string;
  KMTitle: string;
  ItemType: string;
  KMID: string;
  Category: string;
}

export interface IDm {
  EmpNo: string;
  EmpName: string;
  EmpMailId: string;
}

export interface IMstInnovation {
  Id: string;
  Name: string;
  Description: string;
  ItemId: string;
  IsAccessRestricted: IIsAccessRestricted;
}

export enum IIsAccessRestricted {
  N = 'N'
}

export interface IMstLocation {
  Location: string;
  Lat: string;
  Long: string;
  ServiceOffering: null;
}

export interface IMstReuseComponent {
  Id: string;
  Name: string;
}

export interface IMstRisk {
  Id: string;
  Name: string;
  Description: string;
  Exposure?: string;
}

export interface IMstStrategy {
  Id: string;
  Name: string;
  Description: string;
  Exposure?: string;
}

export interface IMstTool {
  Name: string;
  Type: string;
  LCStage: string;
  Purpose: string;
  ProjectedEffortSaving: string;
  IndicativeEffortSaving: string;
  ActualHoursSaving: string;
}

export interface IProject {
  AdditionalDescription: string;
  Author: string;
  Category: string;
  ContractType: any | string | string[];
  DateClosed: string;
  DateCreated: string;
  IBUCode: string;
  IBUName: string;
  ISTeamHeadCount: string | number;
  ISteamSize: string;
  Innovation: string;
  InnovationCount: string | number;
  IsAccessRestricted: string;
  IsAgile: any;
  ItemId: string;
  ItemType: string;
  KMAccountName: string;
  KMDescription: string;
  KMID: string;
  KMLocation: string;
  KMSource: string;
  KMTitle: string;
  KMURL: string;
  MasterCustomerCode: string;
  MasterCustomerName: string;
  ModeOfTesting: string;
  OMSPM: string;
  PUCode: string;
  PUName: string;
  PrimaryIndustry: string;
  ProjectSkillName: string;
  ProjectSkills: string;
  Projecttype: string;
  RequestType: string;
  Reviewer: string;
  Risk: string;
  RiskCount: string | number;
  RiskLevel: string;
  SecondayIndustry: string;
  ServiceCode: string;
  ServiceLine: string;
  SizingTechnique: string;
  SkillId: string;
  SkillLevel1: string;
  SkillLevel2: string;
  SkillLevel3: string;
  SkillType: string;
  Status: string;
  Strategy: string;
  StrategyCount: string | number;
  TeamSize: string | number;
  TertiaryIndustry: string;
  Topics: string;
  TypeOfTesting: string;
}
