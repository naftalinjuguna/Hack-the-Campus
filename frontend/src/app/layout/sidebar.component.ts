import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="fixed left-0 top-0 h-screen w-[250px] bg-surface-container-lowest z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-[#E2E8F0]">
      <div class="flex flex-col">
        <!-- Logo Header -->
        <div class="h-16 px-space-md flex items-center justify-between gap-space-xs border-b border-[#F1F5F9]">
          <div class="flex items-center gap-space-sm min-w-0">
            <img
              alt="CampusDinga Logo"
              class="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYF59IM7oOOSO0rV_6Q7u1VOTLndy2gT3-waDH93UVa7ostwpEsrrKS1llBR_KMOGodQUbJ66W6W-Kzp7vJNdLfLn8xsLwDLhSBP_6hb2mvIqjVSzSHyRT63cV9iRUao0-gYeA-7AFWBSe2ek7xaytcotlzyhLHmzM7nfhHPzIRIdx4FgvGKkyjaWLarB6VKhlhXy9AaqUZq5LCXc2861uo48Ax-qqAoOr8Z8tkShYtRf6BW_SnpSLqw"
            />
            <div class="flex flex-col min-w-0">
              <span class="font-headline-sm text-headline-sm text-primary tracking-tight font-bold truncate">CampusDinga</span>
            </div>
          </div>
          <span class="bg-secondary-container text-on-secondary-container font-caption text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap font-medium">Maseno Univ</span>
        </div>

        <!-- Navigation Links -->
        <nav class="flex flex-col gap-1 px-space-sm pt-space-md">
          <a
            routerLink="/overview"
            routerLinkActive="bg-secondary-container text-primary font-semibold"
            [routerLinkActiveOptions]="{ exact: true }"
            class="flex items-center gap-space-sm px-space-sm py-2 rounded-lg text-on-surface-variant font-label-md text-label-md hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <span class="material-symbols-outlined text-[20px]">grid_view</span>
            <span>Overview</span>
          </a>

          <a
            routerLink="/explore-campus"
            routerLinkActive="bg-secondary-container text-primary font-semibold"
            class="flex items-center gap-space-sm px-space-sm py-2 rounded-lg text-on-surface-variant font-label-md text-label-md hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <span class="material-symbols-outlined text-[20px]">map</span>
            <span>Explore Campus</span>
          </a>

          <a
            routerLink="/find-a-lecture-hall"
            routerLinkActive="bg-secondary-container text-primary font-semibold"
            class="flex items-center gap-space-sm px-space-sm py-2 rounded-lg text-on-surface-variant font-label-md text-label-md hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <span class="material-symbols-outlined text-[20px]">meeting_room</span>
            <span>Find a Lecture Hall</span>
          </a>

          <a
            routerLink="/campus-services"
            routerLinkActive="bg-secondary-container text-primary font-semibold"
            class="flex items-center gap-space-sm px-space-sm py-2 rounded-lg text-on-surface-variant font-label-md text-label-md hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <span class="material-symbols-outlined text-[20px]">account_balance</span>
            <span>Campus Services</span>
          </a>

          <a
            routerLink="/ai-campus-assistant"
            routerLinkActive="bg-secondary-container text-primary font-semibold"
            class="flex items-center gap-space-sm px-space-sm py-2 rounded-lg text-on-surface-variant font-label-md text-label-md hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <span class="material-symbols-outlined text-[20px]">auto_awesome</span>
            <span>AI Campus Assistant</span>
          </a>

          <a
            routerLink="/saved-places-and-routes"
            routerLinkActive="bg-secondary-container text-primary font-semibold"
            class="flex items-center gap-space-sm px-space-sm py-2 rounded-lg text-on-surface-variant font-label-md text-label-md hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <span class="material-symbols-outlined text-[20px]">bookmark</span>
            <span>Saved Places & Routes</span>
          </a>

          <a
            routerLink="/admin-portal"
            routerLinkActive="bg-secondary-container text-primary font-semibold"
            class="flex items-center gap-space-sm px-space-sm py-2 rounded-lg text-on-surface-variant font-label-md text-label-md hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <span class="material-symbols-outlined text-[20px]">verified</span>
            <span>Admin Portal</span>
          </a>
        </nav>
      </div>

      <!-- Bottom Profile & Switcher Cards -->
      <div class="flex flex-col gap-space-sm p-space-sm bg-surface-container-low border-t border-[#E2E8F0]">
        <!-- Campus Location Switcher -->
        <div class="p-space-sm rounded-lg bg-surface-container-lowest flex flex-col gap-1 border border-[#E2E8F0] shadow-sm">
          <div class="flex items-center justify-between">
            <span class="font-caption text-caption text-on-surface-variant">Campus Location</span>
            <button
              (click)="toggleCampus()"
              type="button"
              class="font-caption text-caption bg-surface-container text-on-surface px-2 py-0.5 rounded-full cursor-pointer hover:bg-surface-container-high transition-colors font-medium"
            >
              Switch
            </button>
          </div>
          <div class="flex items-center gap-1.5 pt-0.5">
            <span class="material-symbols-outlined text-primary text-[16px]">location_on</span>
            <span class="font-label-sm text-label-sm text-on-surface font-medium truncate">{{ currentCampus }}</span>
          </div>
        </div>

        <!-- User Profile Card -->
        <div class="p-space-sm rounded-lg bg-surface-container-lowest flex items-center justify-between gap-space-xs border border-[#E2E8F0] shadow-sm">
          <div class="flex items-center gap-space-sm min-w-0">
            <img
              alt="Profile"
              class="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-primary/20"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQ2O5I4affMITbJWwe0SlNBqXM2fJU-wHstpBdyiOTgDVK0RYV1bGGUY1CN24-XCU0LugZ-GNozSFovMvgT2L7pM4QGRbQzYJtF0_KkZKlu1MQJve9XHSegvhgU-biJ_b6rGem0f_vQDDEOHs3h9GNoxH81pEnRl30Uo24rVrpXEr_jPMfXNF4hcvK19t_hzHYdTjomGzI0Y8xq3a4Y3f663Zxr4O69Ciu6VDAc9ArD17zMip3WsaG8A"
            />
            <div class="flex flex-col min-w-0">
              <span class="font-label-sm text-label-sm text-on-surface font-semibold truncate">{{ auth.currentUser().fullName }}</span>
              <span class="font-caption text-caption text-on-surface-variant truncate">{{ auth.currentUser().course || 'Student' }}</span>
            </div>
          </div>
          <button
            (click)="switchUserRole()"
            aria-label="Settings"
            title="Toggle between Student and Admin"
            class="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors shrink-0"
            type="button"
          >
            <span class="material-symbols-outlined text-[18px]">settings</span>
          </button>
        </div>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  readonly auth: AuthService = inject(AuthService);
  currentCampus = 'Maseno Univ (Main)';

  toggleCampus() {
    this.currentCampus = this.currentCampus.includes('Main')
      ? 'Siriba Campus (East Wing)'
      : 'Maseno Univ (Main)';
  }

  switchUserRole() {
    const isCurrentlyAdmin = this.auth.isAdmin();
    this.auth.switchRole(isCurrentlyAdmin ? 'ROLE_STUDENT' : 'ROLE_ADMIN');
  }
}
