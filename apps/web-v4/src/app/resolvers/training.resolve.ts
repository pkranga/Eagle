/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TrainingsService } from '../services/trainings.service';

@Injectable({
    providedIn: 'root'
})
export class TrainingResolve implements Resolve<boolean> {
    constructor(private trainingsSvc: TrainingsService) { }

    resolve(): Observable<boolean> {
        return this.trainingsSvc.getUserJL6Status();
    }
}
