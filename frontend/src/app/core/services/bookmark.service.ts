import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Location } from '../models/models';
import { Observable, tap, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {
  readonly bookmarkedIds = signal<Set<number>>(new Set([2, 3, 4, 5]));
  readonly recentSearches = signal<string[]>([
    'Computer Lab 5',
    'Main Library quiet floor',
    'Siriba Mess lunch menu',
    'School of Computing Dean office'
  ]);

  constructor(private http: HttpClient, private api: ApiService) {
    this.loadLocal();
  }

  private loadLocal() {
    const savedBookmarks = localStorage.getItem('campusdinga_bookmarks');
    if (savedBookmarks) {
      try {
        const ids: number[] = JSON.parse(savedBookmarks);
        this.bookmarkedIds.set(new Set(ids));
      } catch (e) {}
    }
    const savedSearches = localStorage.getItem('campusdinga_recent_searches');
    if (savedSearches) {
      try {
        this.recentSearches.set(JSON.parse(savedSearches));
      } catch (e) {}
    }
  }

  isBookmarked(locationId: number): boolean {
    return this.bookmarkedIds().has(locationId);
  }

  toggleBookmark(location: Location): Observable<boolean> {
    const isSaved = this.isBookmarked(location.id);
    if (isSaved) {
      this.bookmarkedIds.update(set => {
        const next = new Set(set);
        next.delete(location.id);
        localStorage.setItem('campusdinga_bookmarks', JSON.stringify(Array.from(next)));
        return next;
      });
      return this.http.delete<void>(`${this.api.baseUrl}/bookmarks/${location.id}`).pipe(
        tap(() => {}),
        catchError(() => of(false as any))
      );
    } else {
      this.bookmarkedIds.update(set => {
        const next = new Set(set);
        next.add(location.id);
        localStorage.setItem('campusdinga_bookmarks', JSON.stringify(Array.from(next)));
        return next;
      });
      return this.http.post<any>(`${this.api.baseUrl}/bookmarks/${location.id}`, {}).pipe(
        tap(() => {}),
        catchError(() => of(true as any))
      );
    }
  }

  addRecentSearch(term: string) {
    if (!term || term.trim() === '') return;
    const clean = term.trim();
    this.recentSearches.update(list => {
      const filtered = list.filter(item => item.toLowerCase() !== clean.toLowerCase());
      const next = [clean, ...filtered].slice(0, 8);
      localStorage.setItem('campusdinga_recent_searches', JSON.stringify(next));
      return next;
    });
  }

  clearRecentSearches() {
    this.recentSearches.set([]);
    localStorage.removeItem('campusdinga_recent_searches');
  }
}
