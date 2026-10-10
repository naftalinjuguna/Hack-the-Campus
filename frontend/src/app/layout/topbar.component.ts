import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { LocationService } from '../core/services/location.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <header class="fixed top-0 left-[250px] right-0 h-16 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#E2E8F0] z-40">
      <div class="h-16 w-full px-space-lg flex items-center justify-between gap-space-md">
        <!-- Global Search Bar -->
        <div class="flex-1 max-w-xl">
          <div class="relative flex items-center">
            <span class="material-symbols-outlined absolute left-space-sm text-on-surface-variant text-[20px]">search</span>
            <input
              [(ngModel)]="searchQuery"
              (keydown.enter)="onSearch()"
              class="w-full bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant font-body-sm text-body-sm pl-9 pr-14 py-2 rounded-lg shadow-[0_1px_3px_0_rgba(15,23,42,0.05)] border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              placeholder="Search buildings, lecture halls, offices, hostels..."
              type="text"
            />
            <kbd class="absolute right-space-sm bg-surface-container text-on-surface-variant font-caption text-caption px-1.5 py-0.5 rounded border border-[#CBD5E1]">⌘K</kbd>
          </div>
        </div>

        <!-- Right Utilities & Profile Actions -->
        <div class="flex items-center gap-space-md shrink-0">
          <div class="hidden md:flex items-center gap-space-xs">
            <button
              routerLink="/ai-campus-assistant"
              class="flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm hover:bg-surface-container-highest transition-colors font-medium"
              type="button"
            >
              <span class="material-symbols-outlined text-secondary text-[16px]">auto_awesome</span>
              <span>Ask AI ✦</span>
            </button>
            <button
              routerLink="/explore-campus"
              class="flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm hover:bg-surface-container-highest transition-colors font-medium"
              type="button"
            >
              <span class="material-symbols-outlined text-primary text-[16px]">map</span>
              <span>Campus Map</span>
            </button>
          </div>

          <div class="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-medium">
            <span class="w-2 h-2 rounded-full bg-surface-tint animate-pulse"></span>
            <span>Campus Net: Connected</span>
          </div>

          <button
            aria-label="Notifications"
            (click)="showNotifications = !showNotifications"
            class="relative p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            type="button"
          >
            <span class="material-symbols-outlined text-[22px]">notifications</span>
            <span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-error"></span>
          </button>

          <!-- Notifications popover -->
          @if (showNotifications) {
            <div class="absolute right-16 top-14 w-80 bg-white rounded-xl shadow-xl border border-[#E2E8F0] p-3 flex flex-col gap-2 z-50">
              <div class="flex items-center justify-between border-b pb-2">
                <span class="font-label-md text-sm font-bold text-on-surface">Campus Advisories</span>
                <span class="text-xs text-primary font-medium">2 new</span>
              </div>
              <div class="flex flex-col gap-2 text-xs">
                <div class="p-2 bg-surface-container-low rounded-lg">
                  <span class="font-semibold text-primary block">Pathway Detour in Effect</span>
                  <span class="text-on-surface-variant">Graduation Square maintenance. Paved route open via Science Complex.</span>
                </div>
                <div class="p-2 bg-surface-container-low rounded-lg">
                  <span class="font-semibold text-on-surface block">End-of-Semester Venues Sync</span>
                  <span class="text-on-surface-variant">Timetables now synced for Semester 2 examination venues.</span>
                </div>
              </div>
            </div>
          }

          <!-- Profile Badge -->
          <div
            (click)="showProfileMenu = !showProfileMenu"
            class="relative flex items-center gap-1 pl-1 cursor-pointer"
          >
            <img
              alt="Profile"
              class="w-8 h-8 rounded-full object-cover ring-2 ring-transparent hover:ring-primary transition-all"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQ2O5I4affMITbJWwe0SlNBqXM2fJU-wHstpBdyiOTgDVK0RYV1bGGUY1CN24-XCU0LugZ-GNozSFovMvgT2L7pM4QGRbQzYJtF0_KkZKlu1MQJve9XHSegvhgU-biJ_b6rGem0f_vQDDEOHs3h9GNoxH81pEnRl30Uo24rVrpXEr_jPMfXNF4hcvK19t_hzHYdTjomGzI0Y8xq3a4Y3f663Zxr4O69Ciu6VDAc9ArD17zMip3WsaG8A"
            />
            <span class="material-symbols-outlined text-on-surface-variant text-[18px]">arrow_drop_down</span>

            @if (showProfileMenu) {
              <div class="absolute right-0 top-10 w-52 bg-white rounded-xl shadow-xl border border-[#E2E8F0] p-2 flex flex-col gap-1 z-50">
                <div class="px-2 py-1.5 border-b border-gray-100">
                  <p class="text-sm font-bold text-on-surface truncate">{{ auth.currentUser().fullName }}</p>
                  <p class="text-xs text-on-surface-variant truncate">{{ auth.currentUser().email }}</p>
                  <span class="inline-block mt-1 text-[10px] bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded font-mono font-medium">
                    {{ auth.currentUser().role }}
                  </span>
                </div>
                <button
                  (click)="toggleRole()"
                  class="text-left px-2 py-1.5 text-xs text-on-surface hover:bg-surface-container rounded-lg flex items-center justify-between"
                >
                  <span>Switch Role</span>
                  <span class="font-semibold text-primary">{{ auth.isAdmin() ? 'To Student' : 'To Admin' }}</span>
                </button>
                <a
                  routerLink="/admin-portal"
                  class="px-2 py-1.5 text-xs text-on-surface hover:bg-surface-container rounded-lg flex items-center gap-1.5"
                >
                  <span class="material-symbols-outlined text-[16px] text-primary">verified</span>
                  <span>Admin Portal</span>
                </a>
              </div>
            }
          </div>
        </div>
      </div>
    </header>
  `
})
export class TopbarComponent {
  readonly auth: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);
  private readonly locationService: LocationService = inject(LocationService);

  searchQuery = '';
  showNotifications = false;
  showProfileMenu = false;

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      const input = document.querySelector('header input') as HTMLInputElement;
      input?.focus();
    }
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/explore-campus'], { queryParams: { q: this.searchQuery.trim() } });
    }
  }

  toggleRole() {
    this.auth.switchRole(this.auth.isAdmin() ? 'ROLE_STUDENT' : 'ROLE_ADMIN');
    this.showProfileMenu = false;
  }
}
