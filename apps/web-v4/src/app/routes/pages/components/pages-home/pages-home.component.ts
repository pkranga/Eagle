/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ws-pages-home',
  templateUrl: './pages-home.component.html',
  styleUrls: ['./pages-home.component.scss']
})
export class PagesHomeComponent implements OnInit {

  config = {
    type: 'Grid',
    data: [
      [
        {
          width: "100%",
          widget: {
            widgetType: 'Banner',
            data: {}
          }
        }
      ],
      [
        {
          width: "50%",
          widget: {
            widgetType: 'SearchStrip',
            data: {
              "title": "What is Sentient Infosys - The Vision",
              "searchQuery": {
                "sortBy": "lastUpdatedOn",
                "sortOrder": "desc",
                "filters": {
                  "tags": [
                    "Navigate The Change/Sentient Infosys"
                  ]
                },
                "pageNo": 0,
                "pageSize": 100
              }
            }
          }
        },
        {
          width: "50%",
          widget: {
            widgetType: 'SearchStrip',
            data: {
              "title": "Leading the Change",
              "searchQuery": {
                "sortBy": "lastUpdatedOn",
                "sortOrder": "desc",
                "filters": {
                  "tags": [
                    "Navigate The Change/Lead Change"
                  ]
                },
                "pageNo": 0,
                "pageSize": 100
              }
            }
          }
        }
      ],
      [
        {
          width: "65%",
          widget: {
            widgetType: 'SentientInfosys',
            data: {
              "title": "The Sentient Programs",
              "programsList": [
                {
                  "title": "Apps",
                  "iconName": "apps",
                  "searchQuery": {
                    "sortBy": "lastUpdatedOn",
                    "sortOrder": "DESC",
                    "filters": {
                      "tags": [
                        "Navigate The Change/Sentient Programs/Apps"
                      ]
                    },
                    "pageNo": 0,
                    "pageSize": 100
                  }
                },
                {
                  "title": "Experience",
                  "iconName": "computer",
                  "searchQuery": {
                    "sortBy": "lastUpdatedOn",
                    "sortOrder": "DESC",
                    "filters": {
                      "tags": [
                        "Navigate The Change/Sentient Programs/Experience"
                      ]
                    },
                    "pageNo": 0,
                    "pageSize": 100
                  }
                },
                {
                  "title": "Process",
                  "iconName": "developer_board",
                  "searchQuery": {
                    "sortBy": "lastUpdatedOn",
                    "sortOrder": "DESC",
                    "filters": {
                      "tags": [
                        "Navigate The Change/Sentient Programs/Process"
                      ]
                    },
                    "pageNo": 0,
                    "pageSize": 100
                  }
                },
                {
                  "title": "Infosys Digital Platform",
                  "iconName": "highlight",
                  "searchQuery": {
                    "sortBy": "lastUpdatedOn",
                    "sortOrder": "DESC",
                    "filters": {
                      "tags": [
                        "Navigate The Change/Sentient Programs/Infosys Digital Platform"
                      ]
                    },
                    "pageNo": 0,
                    "pageSize": 100
                  }
                }
              ]
            }
          }
        },
        {
          width: "35%",
          widget: {
            widgetType: 'ToDo',
            data: {
              "title": "Your TO-DO List",
              "list": [
                {
                  "title": "Communicate: Unit Level AHM",
                  "identifier": "lex_9259021480089600",
                  "role": "",
                  "type": "content"
                },
                {
                  "title": "Deliver a session on Employee Experience",
                  "identifier": "lex_9259021480089600",
                  "role": "",
                  "type": "content"
                },
                {
                  "title": "Take the Sentient Quiz",
                  "identifier": "lex_9259021480089600",
                  "role": "",
                  "type": "user defined"
                },
                {
                  "title": "Attend some seminar",
                  "identifier": "",
                  "role": "sales",
                  "type": "user defined"
                }
              ]
            }
          }
        }
      ],
      [
        {
          width: "100%",
          widget: {
            widgetType: 'SearchStrip',
            data: {
              "title": "How do I Embrace this Change?",
              "searchQuery": {
                "sortBy": "lastUpdatedOn",
                "sortOrder": "desc",
                "filters": {
                  "tags": [
                    "Navigate The Change/Embrace Change"
                  ]
                },
                "pageNo": 0,
                "pageSize": 100
              }
            }
          }
        }
      ],
      [
        {
          width: "100%",
          widget: {
            widgetType: 'InfluenceChange',
            data: {}
          }
        }
      ],
      [
        {
          width: "100%",
          widget: {
            widgetType: 'CalenderEvents',
            data: {
              "title": "What's coming your way?",
              "eventsList": [
                {
                  "timestamp": 1555957800000,
                  "eventTitle": "Learning Channels and Knowledge Boards",
                  "eventDesc": "Follow feature and Tech Communities of Practices",
                  "eventTime": "16:00-17:00",
                  "category": "contests",
                  "priority": 1
                },
                {
                  "timestamp": 1555957800000,
                  "eventTitle": "Ideas / Solutions",
                  "eventDesc": "(search and guided access to  ideas, solutions, BTN)",
                  "eventTime": "11:00-12:00",
                  "category": "contests",
                  "priority": ""
                },
                {
                  "timestamp": 1555957800000,
                  "eventTitle": "Learning Channels and Knowledge Boards",
                  "eventDesc": "Follow feature and Tech Communities of Practices",
                  "eventTime": "16:00-17:00",
                  "category": "releases",
                  "priority": 1
                },
                {
                  "timestamp": 1555957800000,
                  "eventTitle": "Ideas / Solutions",
                  "eventDesc": "(search and guided access to  ideas, solutions, BTN)",
                  "eventTime": "11:00-12:00",
                  "category": "sessions",
                  "priority": 1
                },
                {
                  "timestamp": 1556044200000,
                  "eventTitle": "Release 1",
                  "eventDesc": "",
                  "eventTime": "13:00-14:00",
                  "category": "releases",
                  "priority": "",
                  "items": [
                    "Knowledge Hub Migration to Lex and Pilot",
                    "Learning Hub End-user Migration to Lex",
                    "Kshop Migration to Lex",
                    "Social Blogging",
                    "Playground Updates - Business - Enterprise",
                    "My Skills - Skill Quotient - Compass Integration",
                    "Sunbird Upgrade - Telemetry and Content Service",
                    "Knowledge Graph and Graph Based Recommendations",
                    "Content Hosting on S3",
                    "Video Transcripts with Closed Captions",
                    "Pilot for Adaptive Learning - Angular Course",
                    "InfyTQ Updates and integrations",
                    "External Content Integration with Vendors",
                    "Access Restrictions on Content and Features",
                    "Multitenancy for Analytics"
                  ]
                },
                {
                  "timestamp": 1556044200000,
                  "eventTitle": "Skill Trends",
                  "eventDesc": "In demand skills, emerging skills",
                  "eventTime": "10:00-11:00",
                  "category": "releases",
                  "priority": 2
                },
                {
                  "timestamp": 1556044200000,
                  "eventTitle": "Deal Approvals",
                  "eventDesc": "(deal creation, reviews and approvals anytime anywhere)",
                  "eventTime": "16:00-17:00",
                  "category": "releases",
                  "priority": ""
                },
                {
                  "timestamp": 1556044200000,
                  "eventTitle": "Learning Channels and Knowledge Boards",
                  "eventDesc": "Follow feature and Tech Communities of Practices",
                  "eventTime": "08:00-09:00",
                  "category": "contests",
                  "priority": 1
                },
                {
                  "timestamp": 1556044200000,
                  "eventTitle": "Communications",
                  "eventDesc": "Personalized News, Events, Blogs, BTN",
                  "eventTime": "11:00-12:00",
                  "category": "sessions",
                  "priority": 2
                },
                {
                  "timestamp": 1556476200000,
                  "eventTitle": "Deal Approvals",
                  "eventDesc": "(deal creation, reviews and approvals anytime anywhere)",
                  "eventTime": "08:00-09:00",
                  "category": "releases",
                  "priority": ""
                },
                {
                  "timestamp": 1556476200000,
                  "eventTitle": "Industry Insights/ Big Bets for Verticals",
                  "eventDesc": "",
                  "eventTime": "17:00-18:00",
                  "category": "sessions",
                  "priority": 1
                },
                {
                  "timestamp": 1557513000000,
                  "eventTitle": "Personal & official profile",
                  "eventDesc": "Comprehensive employee profile and eDocket",
                  "eventTime": "08:00-09:00",
                  "category": "sessions",
                  "priority": 1
                },
                {
                  "timestamp": 1557513000000,
                  "eventTitle": "Learning Channels and Knowledge Boards",
                  "eventDesc": "Follow feature and Tech Communities of Practices",
                  "eventTime": "17:00-18:00",
                  "category": "contests",
                  "priority": ""
                },
                {
                  "timestamp": 1557513000000,
                  "eventTitle": "Communications",
                  "eventDesc": "Personalized News, Events, Blogs, BTN",
                  "eventTime": "11:00-12:00",
                  "category": "sessions",
                  "priority": ""
                },
                {
                  "timestamp": 1558895400000,
                  "eventTitle": "Personal & official profile",
                  "eventDesc": "Comprehensive employee profile and eDocket",
                  "eventTime": "17:00-18:00",
                  "category": "sessions",
                  "priority": ""
                },
                {
                  "timestamp": 1560537000000,
                  "eventTitle": "Ideas / Solutions",
                  "eventDesc": "(search and guided access to  ideas, solutions, BTN)",
                  "eventTime": "08:00-09:00",
                  "category": "contests",
                  "priority": 1
                },
                {
                  "timestamp": 1560537000000,
                  "eventTitle": "Deal Approvals",
                  "eventDesc": "(deal creation, reviews and approvals anytime anywhere)",
                  "eventTime": "17:00-18:00",
                  "category": "releases",
                  "priority": 2
                },
                {
                  "timestamp": 1560537000000,
                  "eventTitle": "Learning Channels and Knowledge Boards",
                  "eventDesc": "Follow feature and Tech Communities of Practices",
                  "eventTime": "17:00-18:00",
                  "category": "contests",
                  "priority": 1
                },
                {
                  "timestamp": 1560537000000,
                  "eventTitle": "Communications",
                  "eventDesc": "Personalized News, Events, Blogs, BTN",
                  "eventTime": "11:00-12:00",
                  "category": "sessions",
                  "priority": 1
                },
                {
                  "timestamp": 1560537000000,
                  "eventTitle": "Ideas / Solutions",
                  "eventDesc": "(search and guided access to  ideas, solutions, BTN)",
                  "eventTime": "17:00-20:00",
                  "category": "contests",
                  "priority": 1
                },
                {
                  "timestamp": 1560537000000,
                  "eventTitle": "Skill Trends",
                  "eventDesc": "In demand skills, emerging skills",
                  "eventTime": "11:00-12:00",
                  "category": "releases",
                  "priority": 2
                },
                {
                  "timestamp": 1560537000000,
                  "eventTitle": "Communications",
                  "eventDesc": "Personalized News, Events, Blogs, BTN",
                  "eventTime": "08:00-09:00",
                  "category": "sessions",
                  "priority": 2
                },
                {
                  "timestamp": 1561055400000,
                  "eventTitle": "Learning Channels and Knowledge Boards",
                  "eventDesc": "Follow feature and Tech Communities of Practices",
                  "eventTime": "11:00-12:00",
                  "category": "contests",
                  "priority": 2
                },
                {
                  "timestamp": 1561055400000,
                  "eventTitle": "Skill Trends",
                  "eventDesc": "In demand skills, emerging skills",
                  "eventTime": "17:00-20:00",
                  "category": "other events",
                  "priority": ""
                },
                {
                  "timestamp": 1561055400000,
                  "eventTitle": "Ideas / Solutions",
                  "eventDesc": "(search and guided access to  ideas, solutions, BTN)",
                  "eventTime": "15:00-17:00",
                  "category": "contests",
                  "priority": 1
                },
                {
                  "timestamp": 1561055400000,
                  "eventTitle": "Learning Channels and Knowledge Boards",
                  "eventDesc": "Follow feature and Tech Communities of Practices",
                  "eventTime": "17:00-20:00",
                  "category": "contests",
                  "priority": 2
                },
                {
                  "timestamp": 1566325800000,
                  "eventTitle": "Communications",
                  "eventDesc": "Personalized News, Events, Blogs, BTN",
                  "eventTime": "13:00-15:00",
                  "category": "sessions",
                  "priority": 1
                },
                {
                  "timestamp": 1566325800000,
                  "eventTitle": "Industry Insights/ Big Bets for Verticals",
                  "eventDesc": "",
                  "eventTime": "17:00-20:00",
                  "category": "sessions",
                  "priority": 2
                },
                {
                  "timestamp": 1566325800000,
                  "eventTitle": "Skill Trends",
                  "eventDesc": "In demand skills, emerging skills",
                  "eventTime": "17:00-20:00",
                  "category": "other events",
                  "priority": ""
                },
                {
                  "timestamp": 1567362600000,
                  "eventTitle": "Communications",
                  "eventDesc": "Personalized News, Events, Blogs, BTN",
                  "eventTime": "17:00-20:00",
                  "category": "sessions",
                  "priority": 2
                },
                {
                  "timestamp": 1567362600000,
                  "eventTitle": "Industry Insights/ Big Bets for Verticals",
                  "eventTime": "17:00-18:00",
                  "eventDesc": "",
                  "category": "sessions",
                  "priority": ""
                }
              ]
            }
          }
        }
      ],
      [
        {
          width: "50%",
          widget: {
            widgetType: 'Champions',
            data: {
              "title": "Meet the change champions",
              "champions": [
                {
                  "title": "Change Leaders",
                  "championsList": [
                    {
                      "firstName": "Narendra",
                      "lastName": "Sonawane",
                      "emailId": "EMAIL",
                      "desc": "Change Leader"
                    },
                    {
                      "firstName": "Nabarun",
                      "lastName": "Nabarun",
                      "emailId": "EMAIL",
                      "desc": "Change Leader"
                    },
                    {
                      "firstName": "Mohammed Rafee",
                      "lastName": "Tarafdar",
                      "emailId": "EMAIL",
                      "desc": "Change Leader"
                    },
                    {
                      "firstName": "Harish",
                      "lastName": "Gudi",
                      "emailId": "EMAIL",
                      "desc": "Change Leader"
                    },
                    {
                      "firstName": "Thirumalaa",
                      "lastName": "Thirumalaa",
                      "emailId": "EMAIL",
                      "desc": "Change Leader"
                    }
                  ]
                },
                {
                  "title": "Change Adopters",
                  "championsList": [
                    {
                      "firstName": "Padma",
                      "lastName": "Bhamidipati",
                      "emailId": "EMAIL",
                      "desc": "Change Adopters"
                    },
                    {
                      "firstName": "SHYAMPRASADKR",
                      "lastName": "SHYAMPRASADKR",
                      "emailId": "EMAIL",
                      "desc": "Change Adopters"
                    },
                    {
                      "firstName": "Harini",
                      "lastName": "Venkatesh",
                      "emailId": "EMAIL",
                      "desc": "Change Adopters"
                    },
                    {
                      "firstName": "vikramp",
                      "lastName": "vikramp",
                      "emailId": "EMAIL",
                      "desc": "Change Adopters"
                    },
                    {
                      "firstName": "Thirumalaa",
                      "lastName": "Thirumalaa",
                      "emailId": "EMAIL",
                      "desc": "Change Adopters"
                    }
                  ]
                }
              ]
            }
          }
        },
        {
          width: "50%",
          widget: {
            widgetType: 'SearchStrip',
            data: {
              "title": "Change Collectibles",
              "searchQuery": {
                "sortBy": "lastUpdatedOn",
                "sortOrder": "desc",
                "filters": {
                  "tags": [
                    "Navigate The Change/Change Collaterals"
                  ]
                },
                "pageNo": 0,
                "pageSize": 100
              }
            }
          }
        }
      ],
      [
        {
          width: "100%",
          widget: {
            widgetType: 'AdoptionDashboard',
            data: {
              "title": "Adoption Dashboard",
              "dashboardsList": [
                {
                  "title": "Lex",
                  "url": "/learning-analytics"
                },
                {
                  "title": "Infy Me"
                },
                {
                  "title": "Process"
                }
              ]
            }
          }
        }
      ],
      [
        {
          width: "100%",
          widget: {
            widgetType: 'ChangeStories',
            data: {}
          }
        }
      ],
    ]
  }
  constructor() { }

  ngOnInit() {
  }

}
