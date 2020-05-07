/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import * as d3 from 'd3';
import { drag } from 'd3-drag';
import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force';
import { zoom } from 'd3-zoom';
import { ISearchRequest } from '../../../../models/searchResponse.model';
import { ConceptGraphService } from '../../services/concept-graph.service';
import { RoutingService } from '../../../../services/routing.service';
import { MiscService } from '../../../../services/misc.service';
import { ContentService } from '../../../../services/content.service';
import { MatMenuTrigger } from '@angular/material';
import { ValuesService } from '../../../../services/values.service';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-concept-graph',
  templateUrl: './concept-graph.component.html',
  styleUrls: ['./concept-graph.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConceptGraphComponent implements OnInit, OnDestroy {
  searchDirector = this.configSvc.instanceConfig.externalLinks.searchValue || 'search';
  panelOpenState = true;
  graphData = {
    loader: false,
    noId: false,
    name: null,
    id: null,
    id2: null,
    children: [],
    nodeDetails: {
      fetching: false,
      fetchedFor: '',
      program: 0,
      course: 0,
      module: 0,
      resource: 0
    }
  };
  public windowWidth = 0;
  searchTab: any = {
    proName: 'programs',
    courseName: 'courses',
    moduleName: 'modules',
    resourceName: 'resources'
  };
  searchV2Tab: any = {
    programs: 'Learning Path',
    modules: 'Collection',
    courses: 'Course',
    resources: 'Resource'
  };
  displayTable: any = {
    show: 'show',
    hide: 'hide'
  };
  data: any;
  rootNode = {
    name: null,
    id: null,
    children: []
  };
  graphV2Data: any = {
    raw: [],
    nodes: [],
    links: []
  };
  public touchDevice = 'ontouchstart' in document.documentElement;
  searchRequestObject: ISearchRequest = {} as ISearchRequest;
  browserName = navigator.appName === 'Netscape' ? 'chrome' : navigator.appName;
  searchResultsSubscription: Subscription;
  routeSubscription: Subscription;
  // @ViewChild(MatMenuTrigger, { static: true }) trigger: MatMenuTrigger;
  private defaultSideNavBarOpenedSubscription;
  isLtMedium$ = this.valueSvc.isLtMedium$;
  screenSizeIsLtMedium: boolean;
  constructor(
    public routingSvc: RoutingService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private miscSvc: MiscService,
    private conceptGraphSvc: ConceptGraphService,
    private valueSvc: ValuesService,
    private contentSvc: ContentService,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {
    this.routeSubscription = this.activatedRoute.params.subscribe(params => {
      this.graphData.id = params.id;
      if (this.graphData.id !== undefined) {
        this.getTopics(this.graphData.id, 'root');
      } else {
        this.graphData.noId = true;
      }
    });
    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(isLtMedium => {
      this.screenSizeIsLtMedium = isLtMedium;
    });
  }
  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
  // someMethod() {
  //   this.trigger.openMenu();
  // }
  initRelationGraph(data, onlyCenter) {
    try {
      d3.select('#conceptGraphV3 g').remove();
      const graphData = Object.assign(data);
      let width = window.innerWidth - 100;
      const height = window.innerHeight - 40;
      const linkedByIndex = {};
      let num: any = -70;
      const R = 8;
      let num2 = 80;
      let heightDiv = 2;
      let widthDiv = 2.2;
      const timer = 0;
      const start = null;
      const end = null;
      const mobile = this.touchDevice;
      if (window.innerWidth <= 650) {
        num2 = 55;
        num = -40;
        heightDiv = 2.2;
        widthDiv = 2.2;
        width = window.innerWidth;
      } else if (window.innerWidth > 650 && window.innerWidth <= 760) {
        num2 = 70;
        num = -40;
        width = window.innerWidth - 50;
        heightDiv = 2.2;
        widthDiv = 2.2;
      } else if (window.innerWidth > 760 && window.innerWidth < 1000) {
        num2 = 80;
        num = -50;
        width = window.innerWidth - 50;
      }

      const svg = d3.select('#conceptGraphV3');
      svg.attr('width', width);
      svg.attr('height', height);
      const g = svg.append('g');
      // g.attr("transform", function() {
      //   // if (data.links.length <= 20) return "translate(0,-150)";
      //   // return "translate(-10,-100)";
      //   return "translate(0,-100)";
      // });

      // is connected
      const isConnected = (a: any, b: any) => {
        return linkedByIndex[a.index + ',' + b.index] || linkedByIndex[b.index + ',' + a.index] || a.index === b.index;
      };
      const node = g
        .selectAll('.node')
        .data(data.nodes)
        .enter()
        .append('g')
        // .attr("class", "node");
        .attr('class', (d: any) => {
          if (d.node === 'secondLevel' && mobile) {
            return 'node1';
          }
          return 'node';
        });

      const link = g
        .selectAll('line')
        .data(data.links)
        .enter()
        .append('line');
      // fade activity
      const fade = opacity => {
        // if (mobile) return;
        return (d: any) => {
          if (d.isRoot && mobile) {
            return;
          }
          node.style('stroke-opacity', (o: any) => {
            const thisOpacity = isConnected(d, o) ? 1 : opacity;
            //   d.setAttribute('fill-opacity', thisOpacity);
            return thisOpacity;
          });
          node.style('fill-opacity', (o: any) => {
            const thisOpacity = isConnected(d, o) ? 1 : opacity;
            //   that.setAttribute('fill-opacity', thisOpacity);
            return thisOpacity;
          });
          link.style('stroke-opacity', (o: any) => {
            return o.source === d || o.target === d ? 1 : opacity;
          });

          link.attr('marker-end', (o: any) => {
            return opacity === 1 || o.source === d || o.target === d ? 'url(#end-arrow)' : 'url(#end-arrow-fade)';
          });
        };
      };
      const fade2 = opacity => {
        if (opacity === 1) {
          {
            node.attr('class', (o: any) => {
              return 'node';
            });
            node.selectAll('circle').attr('class', (o: any) => {
              if (o.isRoot) {
                return 'root-node';
              }
              if (o.node === 'firstLevel') {
                return 'first-level-node';
              }
              if (o.node === 'secondLevel') {
                return 'second-level-node';
              }
            });
            link.attr('class', (o: any) => {
              if (this.browserName === 'Netscape' || this.browserName === 'Microsoft Internet Explorer') {
                return 'IE-links';
              }
              return 'linkss';
            });
            link.attr('marker-end', (o: any) => {
              return 'url(#end-arrow)';
            });
          }
        } else {
          node.attr('class', (o: any) => {
            if (o.node === 'secondLevel' && mobile) {
              return 'node1';
            }
            return 'node';
          });
          node.selectAll('circle').attr('class', (o: any) => {
            if (o.isRoot) {
              return 'root-node';
            }
            if (o.node === 'firstLevel') {
              return 'first-level-node';
            }
            if (o.node === 'secondLevel' && !mobile) {
              return 'second-level-node';
            }
            if (o.node === 'secondLevel' && mobile) {
              return 'second-level-node2';
            }
          });
          link.attr('class', (o: any) => {
            if ((this.browserName === 'Netscape' || this.browserName === 'Microsoft Internet Explorer') && !mobile) {
              return 'IE-links';
            } else if (!mobile) {
              return 'linkss';
            } else if (mobile && o.level !== 'second') {
              return 'linkss';
            }
          });
          link.attr('marker-end', (o: any) => {
            if (o.level !== 'second') {
              return 'url(#end-arrow)';
            }
            return;
          });
        }
      };
      const zoomActions = () => {
        g.attr('transform', (d3.event as any).transform);
      };

      const ticked = () => {
        link
          .attr('x1', (d: any) => {
            return d.source.x;
          })
          .attr('y1', (d: any) => {
            return d.source.y;
          })

          .attr('x2', (d: any) => {
            return d.target.x;
          })

          .attr('y2', (d: any) => {
            return d.target.y;
          });
        node.attr('transform', (d: any) => {
          return 'translate(' + d.x + ',' + d.y + ')';
        });
      };
      // return;

      const simulation: any = forceSimulation()
        .nodes(graphData.nodes)
        .force(
          'link',
          forceLink().id((d: any) => {
            return d.id;
          })
        )
        .force('charge', forceManyBody().strength(num))
        .force('center', forceCenter(width / widthDiv, height / heightDiv))
        // .force("columnX", d3.forceX(n => n.position * 100 + width / 1.8))
        .on('tick', ticked);

      simulation
        .force('link')
        .links(graphData.links)
        .distance([num2]);

      // add defs-marker
      // add defs-markers
      const defs = g
        .append('svg:defs')
        .selectAll('marker')
        .data([{ id: 'end-arrow', opacity: 1 }, { id: 'end-arrow-fade', opacity: 0.1 }])
        .enter()
        .append('marker')
        .attr('id', d => {
          return d.id;
        })
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 10 + R)
        .attr('refY', 5)
        .attr('markerWidth', 8)
        .attr('markerHeight', 8)
        .attr('orient', 'auto')
        .append('g:path')
        .attr('d', 'M0,0 L0,10 L10,5 z')
        .style('opacity', d => {
          return d.opacity;
        });

      link
        .attr('class', (d: any) => {
          if ((this.browserName === 'Netscape' || this.browserName === 'Microsoft Internet Explorer') && !mobile) {
            return 'IE-links';
          } else if (!mobile) {
            return 'linkss';
          } else if (mobile && d.level !== 'second') {
            return 'linkss';
          }
        })
        .attr('marker-end', (d: any) => {
          if (d.level !== 'second') {
            return 'url(#end-arrow)';
          }
          return;
        })
        .attr('data-links', (d: any) => {
          return d.source.name + '--' + d.target.name;
        });

      node
        .append('circle')
        .attr('r', R)
        .attr('class', (d: any) => {
          if (d.isRoot) {
            return 'root-node';
          }
          if (d.node === 'firstLevel') {
            return 'first-level-node';
          }
          if (d.node === 'secondLevel' && !mobile) {
            return 'second-level-node';
          }
          if (d.node === 'secondLevel' && mobile) {
            return 'second-level-node2';
          }
        })
        .on('mouseover', fade(0.1))
        .on('mouseout', fade(1))
        .on('click', (d: any) => {
          if (!this.graphData.loader && !this.touchDevice) {
            if (d.isRoot) {
              const queryParams: any = {};
              queryParams.q = this.searchRequestObject.query;
              this.router.navigate([this.searchDirector], { queryParams });
            } else {
              d3.select('#conceptGraphV3 g').remove();
              // this.getTopics(d.id, 'root');
              this.router.navigate(['concept-graph', d.id]);
            }
          } else {
            if (d.count === 0 && d.isRoot) {
              d.count += 1;
              fade2(1);
            } else if (d.count === 1 && d.isRoot) {
              d.count = 0;
              fade2(0);
            } else {
              d3.select('#conceptGraphV3 g').remove();
              // this.getTopics(d.id, 'root');
              this.router.navigate(['concept-graph', d.id]);
            }
          }
        })
        .call(
          // d3
          drag()
            .on('start', (d: any) => {
              if (!(d3.event as any).active) {
                simulation.alphaTarget(0.8).restart();
              }
              d.fx = d.x;
              d.fy = d.y;
            })
            .on('drag', (d: any) => {
              d.fx = (d3.event as any).x;
              d.fy = (d3.event as any).y;
            })
            .on('end', (d: any) => {
              if (!(d3.event as any).active) {
                simulation.alphaTarget(0.1);
              }
              d.fx = null;
              d.fy = null;
            })
        );
      node.append('title').text((d: any) => {
        // return d.name+" "+d.id;
        return d.name;
      });
      node
        .append('text')
        .attr('x', 0)
        .attr('dy', '-1em')
        .text((d: any) => {
          return d.name;
        })
        .style('fill', (d: any) => {
          if (d.node === 'secondLevel') {
            return '#999';
          }
        })
        .on('mouseover', fade(0.1))
        .on('mouseout', fade(1));

      const zoomHandler = zoom().on('zoom', zoomActions);
      zoomHandler(svg);

      data.links.forEach((d: any) => {
        return (linkedByIndex[d.source.index + ',' + d.target.index] = 1);
      });

      this.graphData.loader = false;
      this.windowWidth = window.innerWidth;
    } catch (e) {
      throw e;
    }
  }

  getTopics(id, type) {
    try {
      // setting loader true.
      this.graphData.nodeDetails.fetching = false;
      this.graphData.loader = true;

      this.miscSvc.fetchConceptGraphTopics(id).subscribe(
        response => {
          if (response.result.response.length > 0) {
            const data = response.result.response;
            // if type is root set the basic data to graph data obj
            if (type === 'root') {
              this.searchRequestObject.query = data[0].name;
              this.searchRequestObject.pageNo = 0;
              this.rootNode.id = data[0].id;
              this.rootNode.name = data[0].name;
              this.rootNode.children = data[0].related;
              // form children ids.
              const temp = this.rootNode.children.map(d => {
                return d.id;
              });
              const temp2: string = temp.join(',');
              // again call the same function with different param. (Children)
              // new graph
              const tempChild = {
                id: data[0].id,
                name: data[0].name,
                children: data[0].related,
                isRoot: true
              };
              this.graphV2Data.raw = tempChild;
              this.initiateSearchRequest(this.searchRequestObject);
              this.graphData.loader = false;
              this.getTopics(temp2, 'children');
            } else {
              const rawGraph = this.graphV2Data.raw.children;
              // create key name as childred, delete related.
              data.map(current => {
                current.children = Object.assign(current.related); // .slice(0, 5); //remove later
                delete current.related;
              });
              // later added
              data.map(current => {
                rawGraph.map(innerCurrent => {
                  // if ids are same then add to children
                  if (innerCurrent.id === current.id) {
                    innerCurrent.children = current.children;
                  }
                });
              });

              const relations = this.conceptGraphSvc.findRelations(this.graphV2Data.raw, 'root');
              this.graphV2Data.nodes = relations.nodes;
              this.graphV2Data.links = relations.links;
              this.data = {
                nodes: relations.nodes,
                links: relations.links
              };
              this.initRelationGraph(this.data, true);
            }
          } else {
            if (type === 'children') {
              // go to top,and show only first level graph
              // (document.documentElement || document.body.parentNode || document.body).scrollTop = 0;
              const relationsx = this.conceptGraphSvc.findRelations(this.graphV2Data.raw, 'child');
              this.graphV2Data.nodes = relationsx.nodes;
              this.graphV2Data.links = relationsx.links;
              this.data = {
                nodes: relationsx.nodes,
                links: relationsx.links
              };
              this.initRelationGraph(this.data, false);
            } else {
              this.graphData.loader = false;
              d3.select('#conceptGraphV3 g').remove();
              this.graphData.noId = true;
            }
          }
        },
        error => {
          // if (type === 'root') {
          this.graphData.noId = true;
          // }
        }
      );
    } catch (e) {
      throw e;
    }
  }

  onResize(event) {
    this.touchDevice = 'ontouchstart' in document.documentElement;
    if (this.data !== undefined) {
      this.initRelationGraph(this.data, false);
    }
  }

  initiateSearchRequest(request: ISearchRequest) {
    this.searchRequestObject = request;
    this.graphData.nodeDetails.fetchedFor = this.searchRequestObject.query;
    this.searchRequestObject.pageNo = 0;
    this.search(false);
  }
  private search(shouldAppend: boolean = false) {
    this.searchResultsSubscription = this.contentSvc.search(this.searchRequestObject).subscribe(
      data => {
        // let result: any = data.filters;
        if (data.totalHits > 0) {
          this.graphData.nodeDetails.fetching = true;
          this.graphData.nodeDetails.program = 0;
          this.graphData.nodeDetails.course = 0;
          this.graphData.nodeDetails.module = 0;
          this.graphData.nodeDetails.resource = 0;
          data.filters.forEach((key: any) => {
            if (key.type === 'contentType') {
              key.content.forEach((value: any) => {
                if (value.type === 'Learning Path') {
                  this.graphData.nodeDetails.program = value.count;
                } else if (value.type === 'Course') {
                  this.graphData.nodeDetails.course = value.count;
                } else if (value.type === 'Collection') {
                  this.graphData.nodeDetails.module = value.count;
                } else if (value.type === 'Resource') {
                  this.graphData.nodeDetails.resource = value.count;
                }
              });
            }
          });
        }
      },
      error => {
        // console.log('search error >', error);
      }
    );
  }

  backToSearch(tab: string) {
    try {
      const queryParams: any = {};
      queryParams.q = this.searchRequestObject.query;
      // queryParams.tab = tab;
      if (this.searchDirector === 'searchv2') {
        queryParams.tab = 'learning';
        queryParams.f = JSON.stringify({
          contentType: [`${this.searchV2Tab[tab]}`]
        });
        this.router.navigate([this.searchDirector], { queryParams });
      } else {
        queryParams.tab = tab;
        this.router.navigate([this.searchDirector], { queryParams });
      }
    } catch (e) {
      throw e;
    }
  }

  back() {
    this.location.back();
  }
}
