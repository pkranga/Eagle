/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit } from '@angular/core'
import { NavigatorService } from '../../services/navigator.service'
import { Router } from '@angular/router'

@Component({
  selector: 'ws-app-learning-path',
  templateUrl: './learning-path.component.html',
  styleUrls: ['./learning-path.component.scss'],
})
export class LearningPathComponent implements OnInit {
  technologyLearningPathHash: { [technology: string]: any[] } = {}
  technologies: string[]
  selectedTechChips = new Set<string>()
  searchInProgress: boolean

  constructor(private navSvc: NavigatorService, private router: Router) {
    this.searchInProgress = true
    this.technologies = []
    this.navSvc.fetchNavigatorTopics().subscribe((data: string[]) => {
      this.technologies = data
    })
  }

  ngOnInit() {}

  navigateToSuggestions() {
    const selectionList: string[] = []
    // console.log('this chips', this.selectedTechChips)
    this.selectedTechChips.forEach((elem: string) => {
      if (elem) {
        selectionList.push(elem)
      }
    })
    this.router.navigate(['/app/infy/navigator/tech/learning-path/result'], {
      queryParams: { selection: selectionList.join(',') },
    })
  }

  toggleChipSelection(tech: string) {
    if (this.isSelected(tech)) {
      this.selectedTechChips.delete(tech)
    } else {
      this.selectedTechChips.add(tech)
    }
  }

  isSelected(tech: string) {
    return this.selectedTechChips.has(tech)
  }

  // searchSkill(event) {
  //   this.technologies = Object.keys(this.technologyLearningPathHash).filter(tech =>
  //     tech.toLowerCase().includes(event.toLowerCase()),
  //   )
  // }
}
