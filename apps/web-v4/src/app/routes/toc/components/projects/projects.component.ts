/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IProjectInfo, IMstInnovation, IMstStrategy } from '../../../../models/project.model';
import { MiscService } from '../../../../services/misc.service';
import { FetchStatus } from '../../../../models/status.model';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  constructor(private miscSvc: MiscService) { }
  @Input() contentId: string;
  @Output() projectVisibility = new EventEmitter<boolean>();
  projects: IProjectInfo[] = [];
  projectFetchStatus: FetchStatus;
  selectedProject: IProjectInfo;
  showSelectedProject = false;
y;

  ngOnInit() {
    this.fetchProjects();
  }

  fetchProjects() {
    this.projectFetchStatus = 'fetching';
    this.miscSvc.fetchCourseProjects(this.contentId).subscribe(
      (data: IProjectInfo[]) => {
        this.projectFetchStatus = 'done';

        if (data) {
          data.forEach(x => {
            this.projects.push({
              ...x,
              MstInnovations: this.filterList(x.MstInnovations),
              MstStrategies: this.filterList(x.MstStrategies)
            });
          });
        } else {
          this.projects = [];
        }
      },
      err => {
        this.projectFetchStatus = 'error';
      }
    );
  }

  toggleProjectDetails(project?: IProjectInfo) {
    this.showSelectedProject = !this.showSelectedProject;
    if (project) {
      this.selectedProject = project;
    }
  }
  filterList(list: any[]) {
    const filteredList: any[] = [];
    const stringSet = new Set();
    list.forEach(x => {
      if (!stringSet.has(x.Name) && x.Name.length > 0) {
        filteredList.push(x);
        stringSet.add(x.Name);
      }
    });
    return filteredList;
  }
}
