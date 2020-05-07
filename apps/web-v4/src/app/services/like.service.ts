/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { UserApiService } from '../apis/user-api.service';
import { tap, map, take, filter } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  private likes: BehaviorSubject<Set<string>> = null;
  fetchingLikes = true;
  constructor(private userApiSvc: UserApiService) {}
  get liked() {
    if (!this.likes) {
      this.likes = new BehaviorSubject<Set<string>>(null);
      this.fetchLikes();
    }
    return this.likes.pipe(filter(value => value !== null));
  }
  likedWithUuid(uuid: string) {
    return this.userApiSvc.fetchLikes(uuid);
  }
  isLiked(contentId: string): Observable<boolean> {
    return this.liked.pipe(map(likedIds => likedIds.has(contentId)));
  }

  like(contentId: string) {
    return this.userApiSvc.addLike(contentId).pipe(
      tap(liked => {
        this.likes
          .pipe(
            filter(set => set !== null),
            take(1)
          )
          .subscribe(set => {
            if (set === null) {
              set = new Set();
            }
            set.add(contentId);
            this.likes.next(set);
          });
      })
    );
  }

  unlike(contentId: string) {
    return this.userApiSvc.deleteLike(contentId).pipe(
      tap(liked => {
        this.likes.pipe(take(1)).subscribe(set => {
          if (set === null) {
            set = new Set();
          }
          set.delete(contentId);
          this.likes.next(set);
        });
      })
    );
  }

  private fetchLikes() {
    this.userApiSvc.fetchLikes().subscribe(likedIds => {
      this.fetchingLikes = false;
      this.likes.next(new Set(likedIds));
    });
  }
}
