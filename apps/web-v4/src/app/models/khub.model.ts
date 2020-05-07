/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
export type TArtifactType = 'all' | 'documents' | 'projects' | 'videos';
export interface IAuthors {
  id: string;
  mailId: string;
  name: string;
}
export interface ISearchObj {
  searchQuery: string;
  from: number;
  size: number;
}
export interface ISearchObjForSearch {
  searchQuery: string;
  from: number;
  size: number;
  category: string;
  filter: string;
}
export interface ISearchObjForView {
  category: string;
  itemId: string;
  source: string;
}
export interface IProjectRisks {
  description: string;
  exposure: string;
  id: string;
  name: string;
}
export interface IProjectContribution {
  itemId: number;
  title: string;
  url: string;
}
export interface IKhubKshop {
  authors: IAuthors[];
  category: string | null;
  dateCreated: string | null;
  dateLastModified: string | null;
  description: string | null;
  extractedText: string | null;
  isAccessRestricted: string | null;
  itemId: number;
  itemType: string | null;
  keywords: string | null;
  noOfViews: number;
  projectCode: string | null;
  publishedStatus: string | null;
  qualityRating: string | null;
  reviewers: IAuthors[];
  source: string | null;
  sourceId: number | string;
  subsidiary: string | null;
  title: string | null;
  topics: string[];
  url: string | null;
}
export interface IkhubAutoMation {
  assetCode: string | null;
  authors: IAuthors[];
  category: string | null;
  componentVersionID: number;
  cu: string | null;
  dateCreated: string | null;
  dateLastModified: string | null;
  dc: string | null;
  description: string | null;
  domain: string[];
  downloadCount: number;
  du: string | null;
  extractedText: string | null;
  isAccessRestricted: string | null;
  itemId: number;
  itemType: string | null;
  keywords: string[];
  licenseDetails: string | null;
  noOfViews: string | null;
  qualityRating: string | null;
  reviewers: IAuthors[];
  securityDetails: string | null;
  securityLevel: string | null;
  serviceLine: string | null;
  source: string | null;
  sourceId: number;
  subCategory: string | null;
  subUnit: string | null;
  submittedDate: string | null;
  technology: string[];
  title: string | null;
  topics: string[];
  unit: string | null;
  url: string | null;
}
export interface IKhubPMDM {
  id: string;
  mailId: string;
  name: string;
}
export interface IKhubProjectTools {
  actualHoursSaving: string | null;
  indicativeEffortSaving: string | null;
  lcStage: string | null;
  name: string | null;
  projectedEffortSaving: string | null;
  purpose: string | null;
  type: string | null;
}
export interface IKhubProStrategies {
  description: string;
  id: string;
  name: string | null;
}
export interface IKhubProReusable {
  id: string;
  name: string | null;
}
export interface IItemsList {
  data: (IKhubProStrategies | IKhubProjectTools | IProjectRisks | IProjectContribution)[];
  type: string;
  itemsMinShown: number;
  headingText: string;
}
export interface IKhubProject {
  mstProjectCode: string;
  dateStartDate: string;
  dateEndDate: string;
  mstLocation: string;
  pu: string;
  puName: string;
  ibu: string;
  ibuName: string;
  du: string;
  status: string;
  mstProjectName: string;
  mstDomain: string | null;
  mstServiceOffering: string;
  mstContractType: string;
  mstProcessType: string | null;
  mstProjectScope: string | null;
  mstBusinessContext: string | null;
  mstInfosysRole: string | null;
  mstInfyObjectives: string | null;
  projectClassIndicator: string;
  dateLastModified: string;
  dateCreated: string;
  itemId: number;
  serviceLine: string | null;
  projecttype: string | null;
  primaryIndustry: string | null;
  secondayIndustry: string | null;
  tertiaryIndustry: string | null;
  requestType: string | null;
  riskLevel: string | null;
  typeOfApplicationMaintained: string | null;
  technology: string | null;
  natureOfWork: string | null;
  packageOrToolUsed: string | null;
  modeOfTesting: string | null;
  typeOfTesting: string | null;
  isAgile: string | null;
  sizingTechnique: string | null;
  projectLCStage: string | null;
  isAccessRestricted: string;
  extractedText: string;
  qy: string[];
  strategies: IKhubProStrategies[];
  contributions: IProjectContribution[];
  tools: IKhubProjectTools[];
  reuseComponents: IKhubProReusable[];
  risks: IProjectRisks[];
  topics: string[];
  pm: IKhubPMDM[];
  dm: IKhubPMDM[];
}
export interface IKhubFilterObj {
  key: string;
  dic_count: number;
}
export interface IKhubViewResult {
  count: number;
  filters: {
    itemType: IKhubFilterObj[];
    topics: IKhubFilterObj[];
  };
  hits: IKhubKshop[] | IkhubAutoMation[] | IKhubProject[];
}
export interface IKhubResult {
  kshop: IKhubKshop[];
  automationcentral: IkhubAutoMation[];
  project: IKhubProject[];
}
export class ItemTile {
  source: string;
  url: string;
  author: IAuthors[];
  itemType: string;
  description: string;
  topics: string[];
  category: string;
  itemId: number;
  noOfViews: number;
  title: string;
  restricted: string;
  dateCreated: Date;
  projectScope: string | null;
  businessContext: string | null;
  color: string;
  dm: IAuthors[];
  pm: IAuthors[];
  objectives: string | null;
  risks: IProjectRisks[];
  sourceId: number | string;
  contribution: IProjectContribution[];
}
export interface IKnowGraphVis {
  query: string;
}
export interface IKnowledgeGraph {
  nodes: any[];
  edges: any[];
}
export interface IErrorObj {
  show: boolean;
  title: string;
  body: string;
  okText: string;
  cancelText: string;
  modelType: string;
  btnType: string;
}
export type ITopicActionType = 'add' | 'delete';

export interface ITopicTaggerAction {
  item: string;
  topic: string;
  user: string;
  action: string;
}
export interface ITopicTaggerGet {
  added: string[];
  deleted: string[];
  note: string;
}
export interface ITopicTaggerResponse {
  status: string;
  item: string;
  topic: string;
  user: string;
  action: string;
  updatedAt: string;
  createdAt: string;
  id: number;
}
