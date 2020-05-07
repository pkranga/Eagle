/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
export interface IInstanceConfig {
  externalLinks: IInstanceConfigExternalLinks;
  features: IInstanceConfigFeatures;
  platform: IInstanceConfigPlatform;
}

export interface IInstanceConfigPlatform {
  appName: string;
  mobilePlatformCode?: string;
  companyLogo: string;
  contactUsMail: string;
  defaultFont: TValidFonts;
  defaultLanguage: string;
  defaultTheme: string;
  enableTelemetrySdkEvents: boolean;
  exerciseSubmission: {
    fileSizeUnit: 'MB';
    maxFileSize: number;
  };
  indexHtmlMeta: {
    openSearchUrl: string;
    themeColorMeta: string;
    appleTouchIcon57: string;
    appleTouchIcon180: string;
    icon32: string;
    icon16: string;
    webmanifest: string;
    maskIcon: string;
    xIcon: string;
  };
  genericMailId: string;
  loginBackground: string;
  showIconBackground: boolean;
  logo: string;
  navBottomFeatures: string[];
  org: string;
  platform: string;
  platformBanner: string;
  productLogo: string;
  productLogoWidth?: string;
  rootOrg: string;
  telemetryConfig: ITelemetryConfig;
  thumbnailMissingLogo: string;
  toastTime: number;
  updateRealTimeProgress: boolean;
  validDomainMail: { [key: string]: string };
  validMailExtForMailMe: string[];
}

export interface IInstanceConfigExternalLinks {
  analytics?: string;
  appsAndroid?: string;
  appsAndroidMirror?: string;
  appsIos?: string;
  authoringHome?: IExternalUrl;
  authoringPublish?: IExternalUrl;
  authoringReview?: IExternalUrl;
  authoringCurate?: IExternalUrl;
  chatbot?: string;
  courseAnalytics?: string;
  iapAuthoring?: string;
  iapBehavioral?: string;
  iapDashboard?: string;
  iapHandsOn?: string;
  iapHome?: string;
  iapObjective?: string;
  iapSubjective?: string;
  searchValue: string;
}
export interface IDowntimeConfig {
  from: number;
  to: number;
  localStorageKey: string;
  enableLocalStorage: boolean;
}

export interface IExternalUrl {
  url: string;
  isIntranetOnly: boolean;
}

export interface IInstanceConfigFeatures {
  analytics: IFeatureStatus;
  badges: IFeatureStatus;
  blogPost: IFeatureStatus;
  btnAnalytics: IFeatureStatus;
  btnCall: IFeatureStatus;
  btnCohorts: IFeatureStatus;
  btnContentFeedback: IFeatureStatus;
  btnDownload: IFeatureStatus;
  btnGoals: IFeatureStatus;
  btnLaunchedOrInterested: IFeatureStatus;
  btnLike: IFeatureStatus;
  btnMailMe: IFeatureStatus;
  btnMailUsers: IFeatureStatus;
  btnPlaylist: IFeatureStatus;
  btnShare: IFeatureStatus;
  catalog: IFeatureStatusWithConfigAndSubFeature<ICatalogConfig, ICatalogSubFeature>;
  certifications: IFeatureStatusWithConfig<IFeatureBanner>;
  certificationsLHub: IFeatureStatusWithConfig<ICertificationLHubConfig>;
  channels: IFeatureStatusWithSubFeature<IFeatureChannelSubFeatures>;
  chatbot: IFeatureStatus;
  client: IFeatureStatus;
  clientAnalytics: IFeatureStatus;
  clientLogin: IFeatureStatus;
  // companyLogo: IFeatureStatus;
  conceptGraph: IFeatureStatus;
  contactUs: IFeatureStatus;
  counter: IFeatureStatus;
  downloads: IFeatureStatus;
  downtime: IFeatureStatusWithConfig<IDowntimeConfig>;
  events: IFeatureStatusWithConfig<IFeatureEventsConfig>;
  faq: IFeatureStatus;
  feedback: IFeatureStatus;
  follow: IFeatureStatus;
  fromLeaders: IFeatureStatusWithConfig<IFeatureMinContentMeta>;
  goals: IFeatureStatus;
  home: IFeatureStatusWithConfigAndSubFeature<IFeatureHomeConfig, IFeatureHomeSubFeatures>;
  iki: IFeatureStatusWithConfig<IFeatureIKIConfig>;
  cmt: IFeatureStatusWithConfig<IFeatureIKIConfig>;
  industryAnalytics: IFeatureStatus;
  infyRadio: IFeatureStatusWithConfig<IFeatureInfyRadioConfig>;
  infyTv: IFeatureStatusWithConfig<IFeatureInfyTvConfig>;
  interest: IFeatureStatus;
  khub: IFeatureStatusWithConfig<IKhubConfigInterface>;
  lab42: IFeatureStatusWithConfig<IFeatureLab42Config>;
  leaderboard: IFeatureStatus;
  leadershipMessage: IFeatureStatus;
  learningHistory: IFeatureStatus;
  learningHub: IFeatureStatusWithConfig<IFeatureTrainingConfig>;
  learningTime: IFeatureStatusWithConfig<IFeatureLearningTimeConfig>;
  livingLabs: IFeatureStatusWithConfig<IFeatureBanner>;
  login: IFeatureStatusWithConfig<IFeatureLoginConfig>;
  marketing: IFeatureStatusWithConfigAndSubFeature<IFeatureMarketingConfig, IFeatureMarketingSubFeatures>;
  mobileApps: IFeatureStatus;
  myAnalytics: IFeatureStatus;
  navigateChange: IFeatureStatusWithConfigAndSubFeature<
    IFeatureNavigateChangeConfig,
    IFeatureNavigateChangeSubFeatures
  >;
  navigator: IFeatureStatusWithConfigAndSubFeature<IFeatureNavigatorConfig, IFeatureNavigatorSubFeatures>;
  onboarding: IFeatureStatusWithConfig<IFeatureBanner>;
  pathfinders: IFeatureStatusWithConfig<IFeaturePathfindersConfig>;
  playground: IFeatureStatusWithConfig<IBannerWithContentStripsData>;
  playlist: IFeatureStatus;
  practice: IFeatureStatus;
  practiceAuthoring: IFeatureStatus;
  practiceBehavioral: IFeatureStatus;
  practiceDashboard: IFeatureStatus;
  practiceHandsOn: IFeatureStatus;
  practiceHome: IFeatureStatus;
  practiceObjective: IFeatureStatus;
  practiceSubjective: IFeatureStatus;
  privacy: IFeatureStatus;
  profile: IFeatureStatus;
  qna: IFeatureStatus;
  quickTour: IFeatureStatusWithConfig<IFeatureMinContentMeta>;
  search: IFeatureStatusWithConfig<IFeatureSearchConfig>;
  searchv2: IFeatureStatusWithConfig<IFeatureSearchConfig>;
  settings: IFeatureStatusWithConfigAndSubFeature<IFeatureSettingsConfig, IFeatureSettingsSubFeature>;
  skillQuotient: IFeatureStatusWithConfig<ISkillQuotientConfigInterface>;
  tnc: IFeatureStatus;
  toc: IFeatureStatusWithConfigAndSubFeature<IFeatureTocConfig, IFeatureTocSubFeatures>;
  siemens: IFeatureStatus;
}
// Features Interface with Generics

export interface IFeatureSettingsSubFeature {
  privacy: boolean;
  fonts: boolean;
  themes: boolean;
  languages: boolean;
  domains: boolean;
}

export interface IFeatureTocSubFeatures {
  about: boolean;
  contents: boolean;
  cohorts: IFeatureStatusWithSubFeature<IFeatureCohortsSubFeatures>;
  projects: boolean;
  postLearn: boolean;
  partOf: boolean;
  discussionForum: IFeatureStatusWithConfig<IDiscussionForumConfig>;
  courseAnalytics: boolean;
  training: boolean;
  instructions: boolean;
  authors: IFeatureStatusWithConfig<IAuthorConfig>;
  materials: boolean;
}

export interface IAuthorConfig {
  title: string;
}

export interface IFeatureStatus {
  available: boolean;
  enabled: boolean;
  onClickAction?: string;
}

export interface IFeatureStatusWithConfig<C> extends IFeatureStatus {
  config: C;
}
export interface IFeatureStatusWithSubFeature<F> extends IFeatureStatus {
  subFeatures: F;
}
export interface IFeatureStatusWithConfigAndSubFeature<C, F> extends IFeatureStatus {
  config: C;
  subFeatures: F;
}

// Common Configurations

export interface IDiscussionForumConfig {
  yammer: boolean;
}
export interface IKhubConfigInterface {
  khubImages: {
    kshop: string;
    project: string;
    automation: string;
    marketing: string;
    banner_background: string;
    loaderGif: string;
  };
}
export interface ISkillQuotientConfigInterface {
  skillImages: {
    skill: string;
  };
}
export interface IInstanceConfigBannerUnit {
  titleKey?: string;
  title?: string;
  url?: string;
  img: {
    xs: string;
    s: string;
    m: string;
    l: string;
    xl: string;
  };
  openInNewTab?: boolean;
}

export interface IInstanceConfigBanner {
  bannerKey?: string;
  bannersList: IInstanceConfigBannerUnit[];
}

export interface IFeatureBanner {
  banner: IInstanceConfigBanner;
}

export interface IInstanceSearchObj {
  filters: {
    contentType?: string[];
    resourceCategory?: string[];
    tags?: string[];
  };
  query?: string;
  isStandAlone?: boolean;
  siemensCatalog?: boolean;
  pageNo?: number;
  pageSize?: number;
  sortBy?: 'lastUpdatedOn';
  sortOrder?: 'ASC' | 'DESC';
}

export interface IInstanceSearchRedirection {
  f?: {
    [index: string]: string[];
  };
  q?: string;
  tab?: string;
}

export interface IInstanceConfigContentStrip {
  titleKey?: string;
  title?: string;
  reqRoles?: string[];
  reqFeatures?: string[];
  searchRedirection?: IInstanceSearchRedirection;
  searchQuery?: IInstanceSearchObj;
  contentIds?: string[];
}

// Feature Wise Configurations & SubFeature

export interface ICatalogConfig {
  customUrls: { [index: string]: string };
  disableStrips: {
    overview: string[];
  };
  ignoreChildren: string[];
  ignoreNodes: string[];
}

export interface ICatalogSubFeature {
  explore: boolean;
  fullstack: boolean;
  industries: boolean;
  pentagon: boolean;
  role: boolean;
  skills: boolean;
}

export interface ICertificationLHubConfig {
  internal: any;
  external: {
    proofUpload: boolean;
    budgetApproval: boolean;
    maxFileSizeBytes: number;
    supportedFileFormats: string[];
    supportedGrades: string[];
  };
}

export interface IFeatureNavigateChangeConfig {
  pageTitle: string;
  boxTitle: string;
  banner: IInstanceConfigBanner;
  emailTo: string;
  jsonPaths: {
    eventJsonPath: string;
    infyDiariesPath: string;
    ocmJsonPath: string;
  };
}
export interface IFeatureNavigateChangeSubFeatures {
  about: boolean;
  sentientInfosys: boolean;
  leadChange: boolean;
  changeChampions: boolean;
  sentientPrograms: boolean;
  whatNext: boolean;
  toDoList: boolean;
  adoptionDashboard: boolean;
  changeCollectibles: boolean;
  feedback: boolean;
  coCreate: boolean;
  influenceChange: boolean;
  changeStories: boolean;
}
export interface IFeatureMinContentMeta {
  identifier: string;
  mimeType: string;
  posterImage: string;
  url: string;
}

export interface IFeatureCohortsSubFeatures {
  activeLearners: boolean;
  batchCohorts: boolean;
  expertAndTutors: boolean;
  isProfileSupported: boolean;
}

export interface IFeatureChannelSubFeatures {
  contentTab: boolean;
  leadershipTab: boolean;
  unconsciousBias: IFeatureStatus;
  experienceWow: IFeatureStatus;
  digitalizationLearningChannel: IFeatureStatus;
  raviProfile: IFeatureStatus;
  mohitProfile: IFeatureStatus;
  ashishProfile: IFeatureStatus;
}

export interface IFeatureLearningTimeConfig {
  chartColor: {
    orgAvgPerDay: string;
    userAvgOverPeriod: string;
    userAvgPerDay: string;
  };
}

export interface IFeatureTrainingConfig {
  contentTypes: {
    [type: string]: {
      boolProps: {
        propName: string;
        shouldBeTrue: boolean;
      }[];
    };
  };
  watchlist: boolean;
  trainingShare: boolean;
}

export interface IFeatureLab42Config {
  url: string;
}

export interface IFeatureLoginConfig {
  bodyBackgroundImageUrl: string;
  footer: {
    contactUs: boolean;
    copyright: boolean;
    faq: boolean;
    hasLogo: boolean;
    isVisible: boolean;
    logoUrl: string;
    tnc: boolean;
    descriptiveFooter: {
      available: boolean;
      welcomeMessage: string;
      welcomeTagline: string;
    };
  };
  topbar: {
    about: boolean;
    apps: boolean;
    hasLogo: boolean;
    isVisible: boolean;
    logoUrl: string;
  };
}
export interface IPersonalizedFilterRecommendations {
  org?: string;
  unit?: string;
  account?: string;
  jl?: string;
  role?: string;
}
export interface IFeatureHomeSubFeatures {
  pathfinders?: boolean;
  continueLearning: boolean;
  coursesForYou: boolean;
  filtersInLatest: {
    enabled: boolean;
    available: boolean;
    personalizedFilterRecommendations: IPersonalizedFilterRecommendations;
  };
  filtersInPersonalizedRecommendations: {
    enabled: boolean;
    available: boolean;
    personalizedFilterRecommendations: IPersonalizedFilterRecommendations;
  };
  filtersInTrending: {
    enabled: boolean;
    available: boolean;
    personalizedFilterRecommendations: IPersonalizedFilterRecommendations;
  };
  interestBasedRecommendation: boolean;
  latest: boolean;
  personalizedRecommendation: boolean;
  playlist: boolean;
  trending: boolean;
  usageBasedRecommendation: boolean;
}

export interface IFeatureHomeConfig {
  continueLearning: { pageSize: number; pageState: string; status: string };
  homePlayground: IInstanceSearchObj;
  pathfinders?: IPathfinderReq[];
  bannerConfig: IHomeBannerConfig;
}

export interface IHomeBannerConfig {
  showBannerNavigation?: boolean;
  homeBannerJsonPath: string;
  hhomeBannerJsonPath?: string;
  shomeBannerJsonPath?: string;
}

export interface IPathfinderReq {
  name: string;
  searchRequest: IInstanceSearchObj;
}

export interface IFeatureIKIConfig {
  banner: IInstanceConfigBanner;
  defaultTab: string;
  tabs: Array<{
    title: string;
    strips: IInstanceConfigContentStrip[];
    urlKey?: string;
    imageSrc?: string;
  }>;
}
export interface IFeaturePathfindersConfig {
  loginImage: string;
}
export interface IFeatureEventsConfig {
  [eventName: string]: IFeatureEventsConfigUnit;
}
export interface IFeatureEventsConfigUnit {
  banner: IInstanceConfigBanner;
  title: string;
  strips: IInstanceConfigContentStrip[];
}
export interface IFeatureMarketingConfig {
  defaultTab: string;
  brandAssets: IInstanceSearchObj[];
  clientStories: IInstanceSearchObj[];
  hubs: IInstanceSearchObj[];
  industries: IInstanceSearchObj;
  experience: IInstanceSearchObj[];
}
export interface IFeatureMarketingSubFeatures {
  brandAssets: boolean;
  clientStories: boolean;
  hubs: boolean;
  industries: boolean;
  experience: boolean;
  productSubsidiary: boolean;
  services: boolean;
}
export interface IFeatureNavigatorSubFeatures {
  candidateDevPlan: IFeatureStatus;
  explore: IFeatureStatus;
  fullstack: IFeatureStatus;
  industries: IFeatureStatus;
  navigatorGoals: IFeatureStatus;
  navigatorInterested: IFeatureStatus;
  navigatorLaunch: IFeatureStatus;
  pentagon: IFeatureStatus;
  role: IFeatureStatus;
  skills: IFeatureStatus;
}
export interface IFeatureNavigatorConfig {
  deliveryPartnerNavigatorBanner: IInstanceConfigBanner;
  salesCompetenciesBanner: IInstanceConfigBanner;
  salesNavigatorBanner: IInstanceConfigBanner;
  salesOnboardingBanner: IInstanceConfigBanner;
  techNavigatorBanner: IInstanceConfigBanner;
}

export interface IBannerWithContentStripsData {
  banner?: IInstanceConfigBanner;
  strips?: IInstanceConfigContentStrip[];
  title?: string;
}
export interface IFeatureInfyRadioConfig {
  banner: IInstanceConfigBanner;
  stripsName: string[];
}
export interface IFeatureInfyTvConfig {
  strips: IInstanceConfigContentStrip[];
}
export interface IFeatureSearchConfig {
  tabs: IInstanceConfigContentStrip[];
}
export interface IFeatureTocConfig {
  bannerUrl: string;
  materials?: ITocMaterials[];
}

export interface ITocMaterials {
  title: string;
  downloadUrl: string;
  date: string;
  author: string;
}

export type IFeatureSettingsPrivacyStatus = 'Everyone' | 'Just You';

export interface IInstanceTheme {
  className: string;
  colors: IThemeColor;
  name: string;
}
export interface IThemeColor {
  accent: string;
  background: string;
  primary: string;
  text: string;
  warn: string;
}
export interface IFeatureSettingsConfig {
  defaultPrivacy: {
    shareGoals: IFeatureSettingsPrivacyStatus;
    sharePlaylist: IFeatureSettingsPrivacyStatus;
    viewBadges: IFeatureSettingsPrivacyStatus;
    viewGoals: IFeatureSettingsPrivacyStatus;
    viewLearningHistory: IFeatureSettingsPrivacyStatus;
    viewLikes: IFeatureSettingsPrivacyStatus;
    viewPlaylist: IFeatureSettingsPrivacyStatus;
  };
  fonts: Array<TValidFonts>;
  language: Array<ILanguageEntity>;
  themes: IInstanceTheme[];
  domains: string[];
}

export interface ILanguageEntity {
  code: string;
  name: string;
  isSupported: boolean;
}

export interface ITelemetryConfig {
  pdata: {
    id: string;
    ver: string;
    pid: string;
  };
  uid?: string;
  env: string;
  channel: string;
  batchsize: number;
  host: string;
  endpoint: string;
  apislug: string;
}

export type TValidFonts = 'typography-small' | 'typography-normal' | 'typography-large';
