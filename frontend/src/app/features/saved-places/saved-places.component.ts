import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BookmarkService } from '../../core/services/bookmark.service';
import { LocationService } from '../../core/services/location.service';
import { Location } from '../../core/models/models';

@Component({
  selector: 'app-saved-places',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="px-space-lg py-space-lg w-full max-w-[1400px] mx-auto pb-space-2xl flex flex-col gap-space-lg">
      <!-- Header -->
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-[28px]">bookmark</span>
          <h1 class="text-2xl font-bold text-on-surface">Saved Places & Routes</h1>
        </div>
        <p class="text-xs text-slate-500">
          Quickly access your pinned lecture halls, frequently visited campus departments, and recent search history.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        <!-- Left: Bookmarked Locations (8 cols) -->
        <div class="lg:col-span-8 flex flex-col gap-4">
          <div class="flex items-center justify-between">
            <h2 class="text-base font-bold text-on-surface">Bookmarked Locations ({{ bookmarkedLocations.length }})</h2>
          </div>

          @if (bookmarkedLocations.length === 0) {
            <div class="p-8 bg-white rounded-xl border border-dashed border-slate-300 text-center flex flex-col items-center gap-2">
              <span class="material-symbols-outlined text-4xl text-slate-400">bookmark_border</span>
              <p class="text-sm font-semibold text-slate-600">No saved locations yet</p>
              <p class="text-xs text-slate-400">Browse the Campus Explorer or Overview to bookmark your favorite spots.</p>
              <a routerLink="/explore-campus" class="mt-2 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-container">
                Explore Campus
              </a>
            </div>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              @for (loc of bookmarkedLocations; track loc.id) {
                <div class="p-4 bg-white rounded-xl shadow-sm border border-[#E2E8F0] flex flex-col justify-between gap-3 hover:border-primary transition-all">
                  <div class="flex flex-col gap-2">
                    <div class="flex items-center justify-between">
                      <span class="text-[11px] font-semibold px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container">
                        {{ loc.category }}
                      </span>
                      <button
                        (click)="removeBookmark(loc)"
                        class="text-slate-400 hover:text-error transition-colors"
                        title="Remove bookmark"
                        type="button"
                      >
                        <span class="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>

                    <h3 class="font-bold text-sm text-on-surface">{{ loc.name }}</h3>
                    <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed">{{ loc.description }}</p>
                  </div>

                  <div class="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <span class="text-slate-500">{{ loc.campusArea }} • {{ loc.roomNumber || 'Ground' }}</span>
                    <button
                      (click)="goToLocation(loc)"
                      class="px-3 py-1.5 rounded-lg bg-primary text-white font-semibold text-xs flex items-center gap-1 hover:bg-primary-container transition-all"
                      type="button"
                    >
                      <span>Directions</span>
                      <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              }
            </div>
          }
        </div>

        <!-- Right: Recent Searches History (4 cols) -->
        <div class="lg:col-span-4 flex flex-col gap-4">
          <div class="flex items-center justify-between">
            <h2 class="text-base font-bold text-on-surface">Recent Searches</h2>
            @if (bookmarkService.recentSearches().length > 0) {
              <button
                (click)="clearSearches()"
                class="text-xs text-slate-400 hover:text-error transition-colors"
                type="button"
              >
                Clear All
              </button>
            }
          </div>

          <div class="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm flex flex-col gap-2">
            @if (bookmarkService.recentSearches().length === 0) {
              <p class="text-xs text-slate-400 text-center py-4">No recent searches</p>
            } @else {
              @for (term of bookmarkService.recentSearches(); track term) {
                <button
                  (click)="repeatSearch(term)"
                  class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-left text-xs text-slate-700 transition-colors group"
                  type="button"
                >
                  <div class="flex items-center gap-2 truncate">
                    <span class="material-symbols-outlined text-[16px] text-slate-400 group-hover:text-primary">history</span>
                    <span class="truncate font-medium">{{ term }}</span>
                  </div>
                  <span class="material-symbols-outlined text-[14px] text-slate-300 group-hover:text-primary">arrow_forward</span>
                </button>
              }
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class SavedPlacesComponent {
  readonly bookmarkService = inject(BookmarkService);
  private readonly locationService = inject(LocationService);
  private readonly router = inject(Router);

  get bookmarkedLocations(): Location[] {
    const ids = this.bookmarkService.bookmarkedIds();
    return this.locationService.locations().filter(l => ids.has(l.id));
  }

  removeBookmark(loc: Location) {
    this.bookmarkService.toggleBookmark(loc).subscribe();
  }

  goToLocation(loc: Location) {
    this.locationService.selectLocation(loc);
    this.router.navigate(['/explore-campus'], { queryParams: { locId: loc.id } });
  }

  repeatSearch(term: string) {
    this.router.navigate(['/explore-campus'], { queryParams: { q: term } });
  }

  clearSearches() {
    this.bookmarkService.clearRecentSearches();
  }
}
