/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigatorService } from '../../../../services/navigator.service';
import { RoutingService } from '../../../../services/routing.service';
import { ValuesService } from '../../../../services/values.service';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss']
})
export class SuggestionsComponent implements OnInit {
  technologyLearningPathHash: { [technology: string]: any[] } = {};
  technologies: string[];
  selectedTechChips = new Set();
  searchInput: string;
  searchInProgress: boolean;

  isMobile: boolean;

  constructor(
    private router: Router,
    public routingSvc: RoutingService,
    private valuesSvc: ValuesService,
    private navSvc: NavigatorService
  ) {}

  ngOnInit() {
    this.valuesSvc.isXSmall$.subscribe(value => {
      this.isMobile = value;
    });
    this.searchInProgress = true;
    this.navSvc.lp.subscribe(lpdata => {
      for (const lpid in lpdata) {
        if (lpdata.hasOwnProperty(lpid)) {
          this.searchInProgress = false;
          lpdata[lpid].profiles.forEach(profile => {
            profile.technology.forEach(technology => {
              if (this.technologyLearningPathHash[technology]) {
                this.technologyLearningPathHash[technology].push(lpdata[lpid]);
              } else {
                this.technologyLearningPathHash[technology] = [lpdata[lpid]];
              }
            });
          });
          this.technologies = Object.keys(this.technologyLearningPathHash);
        }
      }
      // console.log(this.technologyLearningPathHash);
    });
  }

  navigateToSuggestions() {
    const selectionList = [];
    this.selectedTechChips.forEach(elem => selectionList.push(elem));
    this.router.navigate(['/navigator/suggestions/lp'], {
      queryParams: { selection: selectionList.join(',') }
    });
  }

  toggleChipSelection(tech) {
    if (this.isSelected(tech)) {
      this.selectedTechChips.delete(tech);
    } else {
      this.selectedTechChips.add(tech);
    }
  }

  isSelected(tech) {
    return this.selectedTechChips.has(tech);
  }

  searchSkill(event) {
    this.technologies = Object.keys(this.technologyLearningPathHash).filter(tech =>
      tech.toLowerCase().includes(event.toLowerCase())
    );
  }
}
