import { Component, OnInit, OnDestroy, AfterViewInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LocationService } from '../../core/services/location.service';
import { NavigationService } from '../../core/services/navigation.service';
import { BookmarkService } from '../../core/services/bookmark.service';
import { ReportService } from '../../core/services/report.service';
import { Location, LocationCategory } from '../../core/models/models';
import * as L from 'leaflet';

@Component({
  selector: 'app-campus-explorer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="px-space-lg py-space-lg w-full min-h-screen bg-surface flex flex-col gap-space-sm pb-space-2xl">
      <!-- Control Header & Filters -->
      <div class="flex flex-col gap-space-sm mb-1">
        <!-- Meta Notice & Quick Toggles -->
        <div class="flex flex-wrap items-center justify-between gap-space-sm">
          <div class="flex items-center gap-1.5 bg-surface-container px-3 py-1 rounded-full text-on-surface-variant font-label-sm text-xs shadow-sm border border-[#E2E8F0]">
            <span class="material-symbols-outlined text-[16px] text-primary">map</span>
            <span class="font-semibold text-on-surface">Maseno University Main & Siriba Campus</span>
            <span class="text-slate-400 font-normal">/ Vector Wayfinding Engine</span>
          </div>

          <div class="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg shadow-sm border border-[#E2E8F0]">
            <button
              (click)="setViewMode('map-list')"
              [class.bg-surface-container-lowest]="viewMode === 'map-list'"
              [class.text-primary]="viewMode === 'map-list'"
              [class.font-semibold]="viewMode === 'map-list'"
              [class.shadow-sm]="viewMode === 'map-list'"
              class="flex items-center gap-1 px-3 py-1 rounded-md text-on-surface-variant font-label-sm text-xs transition-all"
              type="button"
            >
              <span class="material-symbols-outlined text-[16px]">view_agenda</span>
              <span>Map & Details</span>
            </button>
            <button
              (click)="setViewMode('full-map')"
              [class.bg-surface-container-lowest]="viewMode === 'full-map'"
              [class.text-primary]="viewMode === 'full-map'"
              [class.font-semibold]="viewMode === 'full-map'"
              [class.shadow-sm]="viewMode === 'full-map'"
              class="flex items-center gap-1 px-3 py-1 rounded-md text-on-surface-variant font-label-sm text-xs transition-all"
              type="button"
            >
              <span class="material-symbols-outlined text-[16px]">fullscreen</span>
              <span>Full Map</span>
            </button>
            <button
              (click)="setViewMode('directory')"
              [class.bg-surface-container-lowest]="viewMode === 'directory'"
              [class.text-primary]="viewMode === 'directory'"
              [class.font-semibold]="viewMode === 'directory'"
              [class.shadow-sm]="viewMode === 'directory'"
              class="flex items-center gap-1 px-3 py-1 rounded-md text-on-surface-variant font-label-sm text-xs transition-all"
              type="button"
            >
              <span class="material-symbols-outlined text-[16px]">list_alt</span>
              <span>Directory</span>
            </button>
          </div>
        </div>

        <!-- Live Search & Filtering Badges -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-sm items-center">
          <div class="lg:col-span-5 relative flex items-center">
            <span class="material-symbols-outlined absolute left-space-sm text-on-surface-variant text-[20px]">search</span>
            <input
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearchChange()"
              class="w-full bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant font-body-sm text-xs pl-9 pr-16 py-2 rounded-lg shadow-sm border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              placeholder="Search buildings, halls, departments (e.g. Lab 5, Dean's Office)..."
              type="text"
            />
            @if (searchQuery) {
              <button
                (click)="clearSearch()"
                class="absolute right-space-sm bg-surface-container text-primary font-caption text-[11px] px-2 py-0.5 rounded hover:bg-surface-container-high transition-colors font-medium"
              >
                Clear
              </button>
            }
          </div>

          <div class="lg:col-span-7 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              (click)="filterCategory(null)"
              [class.bg-primary]="selectedCategory === null"
              [class.text-on-primary]="selectedCategory === null"
              [class.bg-surface-container-lowest]="selectedCategory !== null"
              [class.text-on-surface-variant]="selectedCategory !== null"
              class="px-3 py-1 rounded-full font-label-sm text-xs shrink-0 shadow-sm border border-[#E2E8F0] transition-all font-medium"
            >
              All
            </button>
            <button
              (click)="filterCategory('LECTURE_HALL')"
              [class.bg-primary]="selectedCategory === 'LECTURE_HALL'"
              [class.text-on-primary]="selectedCategory === 'LECTURE_HALL'"
              [class.bg-surface-container-lowest]="selectedCategory !== 'LECTURE_HALL'"
              [class.text-on-surface-variant]="selectedCategory !== 'LECTURE_HALL'"
              class="px-3 py-1 rounded-full font-label-sm text-xs shrink-0 shadow-sm border border-[#E2E8F0] transition-all font-medium"
            >
              Lecture Halls
            </button>
            <button
              (click)="filterCategory('ACADEMIC_DEPARTMENT')"
              [class.bg-primary]="selectedCategory === 'ACADEMIC_DEPARTMENT'"
              [class.text-on-primary]="selectedCategory === 'ACADEMIC_DEPARTMENT'"
              [class.bg-surface-container-lowest]="selectedCategory !== 'ACADEMIC_DEPARTMENT'"
              [class.text-on-surface-variant]="selectedCategory !== 'ACADEMIC_DEPARTMENT'"
              class="px-3 py-1 rounded-full font-label-sm text-xs shrink-0 shadow-sm border border-[#E2E8F0] transition-all font-medium"
            >
              Academic Depts
            </button>
            <button
              (click)="filterCategory('LIBRARY')"
              [class.bg-primary]="selectedCategory === 'LIBRARY'"
              [class.text-on-primary]="selectedCategory === 'LIBRARY'"
              [class.bg-surface-container-lowest]="selectedCategory !== 'LIBRARY'"
              [class.text-on-surface-variant]="selectedCategory !== 'LIBRARY'"
              class="px-3 py-1 rounded-full font-label-sm text-xs shrink-0 shadow-sm border border-[#E2E8F0] transition-all font-medium"
            >
              Libraries
            </button>
            <button
              (click)="filterCategory('ADMINISTRATIVE_OFFICE')"
              [class.bg-primary]="selectedCategory === 'ADMINISTRATIVE_OFFICE'"
              [class.text-on-primary]="selectedCategory === 'ADMINISTRATIVE_OFFICE'"
              [class.bg-surface-container-lowest]="selectedCategory !== 'ADMINISTRATIVE_OFFICE'"
              [class.text-on-surface-variant]="selectedCategory !== 'ADMINISTRATIVE_OFFICE'"
              class="px-3 py-1 rounded-full font-label-sm text-xs shrink-0 shadow-sm border border-[#E2E8F0] transition-all font-medium"
            >
              Administration
            </button>
            <button
              (click)="filterCategory('FOOD_AND_MESS')"
              [class.bg-primary]="selectedCategory === 'FOOD_AND_MESS'"
              [class.text-on-primary]="selectedCategory === 'FOOD_AND_MESS'"
              [class.bg-surface-container-lowest]="selectedCategory !== 'FOOD_AND_MESS'"
              [class.text-on-surface-variant]="selectedCategory !== 'FOOD_AND_MESS'"
              class="px-3 py-1 rounded-full font-label-sm text-xs shrink-0 shadow-sm border border-[#E2E8F0] transition-all font-medium"
            >
              Student Mess
            </button>
            <button
              (click)="filterCategory('HEALTH_FACILITY')"
              [class.bg-primary]="selectedCategory === 'HEALTH_FACILITY'"
              [class.text-on-primary]="selectedCategory === 'HEALTH_FACILITY'"
              [class.bg-surface-container-lowest]="selectedCategory !== 'HEALTH_FACILITY'"
              [class.text-on-surface-variant]="selectedCategory !== 'HEALTH_FACILITY'"
              class="px-3 py-1 rounded-full font-label-sm text-xs shrink-0 shadow-sm border border-[#E2E8F0] transition-all font-medium"
            >
              Health Services
            </button>
            <button
              (click)="filterCategory('HOSTEL')"
              [class.bg-primary]="selectedCategory === 'HOSTEL'"
              [class.text-on-primary]="selectedCategory === 'HOSTEL'"
              [class.bg-surface-container-lowest]="selectedCategory !== 'HOSTEL'"
              [class.text-on-surface-variant]="selectedCategory !== 'HOSTEL'"
              class="px-3 py-1 rounded-full font-label-sm text-xs shrink-0 shadow-sm border border-[#E2E8F0] transition-all font-medium"
            >
              Hostels
            </button>
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT: Directory View OR Interactive Map + Inspector Grid -->
      @if (viewMode === 'directory') {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          @for (loc of filteredLocations; track loc.id) {
            <div
              (click)="selectAndSwitchToMap(loc)"
              class="p-4 bg-white rounded-xl shadow-sm border border-[#E2E8F0] hover:border-primary cursor-pointer transition-all flex flex-col justify-between gap-3 group"
            >
              <div class="flex flex-col gap-2">
                <div class="flex items-center justify-between">
                  <span class="text-[11px] font-semibold px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container">
                    {{ loc.category }}
                  </span>
                  <span class="text-[11px] font-mono text-slate-500">{{ loc.roomNumber || 'Ground' }}</span>
                </div>
                <h3 class="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">{{ loc.name }}</h3>
                <p class="text-xs text-slate-600 line-clamp-2">{{ loc.description }}</p>
              </div>
              <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span class="text-slate-500">{{ loc.buildingBlock || loc.campusArea }}</span>
                <span class="text-primary font-semibold flex items-center gap-1">
                  <span>View on Map</span>
                  <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
              </div>
            </div>
          }
        </div>
      } @else {
        <!-- Map Canvas (65% / 100%) and Inspector (35% / 0%) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
          <!-- LEFT PANE: Interactive Vector Map Canvas -->
          <div
            [class.lg:col-span-8]="viewMode === 'map-list'"
            [class.lg:col-span-12]="viewMode === 'full-map'"
            class="relative w-full h-[730px] rounded-xl overflow-hidden bg-surface-container-low shadow-md border border-[#E2E8F0] select-none group"
          >
            <!-- Leaflet Map Container -->
            <div id="leafletMap" class="w-full h-full"></div>

            <!-- Floating Dynamic Route Status Pill (Over Map) -->
            @if (navigationService.isNavigating()) {
              <div class="absolute top-4 left-4 bg-surface-container-lowest/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-md border border-[#E2E8F0] flex items-center gap-3 z-[1000]">
                <div class="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-primary shrink-0">
                  <span class="material-symbols-outlined text-[18px]">directions_walk</span>
                </div>
                <div class="flex flex-col">
                  <div class="flex items-center gap-1.5">
                    <span class="font-label-md text-xs font-bold text-on-surface">
                      {{ navigationService.activeRoute().totalDistanceMeters }}m • {{ navigationService.activeRoute().estimatedMinutes }} mins
                    </span>
                    <span class="bg-secondary-container text-on-secondary-container font-caption text-[10px] px-2 py-0.5 rounded-full font-semibold">
                      Step-free route
                    </span>
                  </div>
                  <span class="font-caption text-[11px] text-slate-500 truncate max-w-[280px]">
                    {{ navigationService.activeRoute().summaryVia }}
                  </span>
                </div>
              </div>
            }

            <!-- Floating Map Utilities Toolbar (Right Side of Map) -->
            <div class="absolute right-4 top-4 flex flex-col gap-2 z-[1000]">
              <!-- Floor Selector Stack -->
              <div class="bg-surface-container-lowest/95 backdrop-blur-md rounded-xl p-1 shadow-md border border-[#E2E8F0] flex flex-col items-center">
                <span class="font-caption text-[10px] text-slate-400 mb-1 uppercase tracking-wider font-bold">Flr</span>
                <button
                  (click)="selectedFloor = '2'"
                  [class.bg-primary]="selectedFloor === '2'"
                  [class.text-on-primary]="selectedFloor === '2'"
                  [class.font-bold]="selectedFloor === '2'"
                  class="w-7 h-7 rounded text-on-surface-variant hover:text-on-surface text-xs flex items-center justify-center transition-colors"
                  type="button"
                >
                  2
                </button>
                <button
                  (click)="selectedFloor = '1'"
                  [class.bg-primary]="selectedFloor === '1'"
                  [class.text-on-primary]="selectedFloor === '1'"
                  [class.font-bold]="selectedFloor === '1'"
                  class="w-7 h-7 rounded text-on-surface-variant hover:text-on-surface text-xs flex items-center justify-center transition-colors"
                  type="button"
                >
                  1
                </button>
                <button
                  (click)="selectedFloor = 'G'"
                  [class.bg-primary]="selectedFloor === 'G'"
                  [class.text-on-primary]="selectedFloor === 'G'"
                  [class.font-bold]="selectedFloor === 'G'"
                  class="w-7 h-7 rounded text-on-surface-variant hover:text-on-surface text-xs flex items-center justify-center transition-colors"
                  type="button"
                >
                  G
                </button>
              </div>

              <!-- Zoom & Nav Controls -->
              <div class="bg-surface-container-lowest/95 backdrop-blur-md rounded-xl p-1 shadow-md border border-[#E2E8F0] flex flex-col items-center">
                <button
                  (click)="zoomIn()"
                  class="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors"
                  title="Zoom in"
                  type="button"
                >
                  <span class="material-symbols-outlined text-[18px]">add</span>
                </button>
                <div class="w-4 h-[1px] bg-slate-200 my-1"></div>
                <button
                  (click)="zoomOut()"
                  class="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors"
                  title="Zoom out"
                  type="button"
                >
                  <span class="material-symbols-outlined text-[18px]">remove</span>
                </button>
                <div class="w-4 h-[1px] bg-slate-200 my-1"></div>
                <button
                  (click)="centerMyGps()"
                  class="w-8 h-8 rounded-lg hover:bg-surface-container text-primary flex items-center justify-center transition-colors"
                  title="My GPS Location"
                  type="button"
                >
                  <span class="material-symbols-outlined text-[18px]">my_location</span>
                </button>
                <div class="w-4 h-[1px] bg-slate-200 my-1"></div>
                <button
                  (click)="alignNorth()"
                  class="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors"
                  title="Align to North"
                  type="button"
                >
                  <span class="material-symbols-outlined text-[18px]">explore</span>
                </button>
              </div>
            </div>

            <!-- Floating Layer Toggle (Bottom Left of Map) -->
            <div class="absolute bottom-4 left-4 z-[1000]">
              <div class="bg-surface-container-lowest/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-[#E2E8F0] flex items-center gap-1">
                <button
                  (click)="setTileLayer('vector')"
                  [class.bg-surface-container]="activeTileType === 'vector'"
                  [class.text-primary]="activeTileType === 'vector'"
                  [class.font-semibold]="activeTileType === 'vector'"
                  class="px-3 py-1 rounded-lg text-on-surface-variant font-label-sm text-xs flex items-center gap-1.5 transition-colors"
                  type="button"
                >
                  <span class="material-symbols-outlined text-[16px]">layers</span>
                  <span>Vector 2D</span>
                </button>
                <button
                  (click)="setTileLayer('satellite')"
                  [class.bg-surface-container]="activeTileType === 'satellite'"
                  [class.text-primary]="activeTileType === 'satellite'"
                  [class.font-semibold]="activeTileType === 'satellite'"
                  class="px-3 py-1 rounded-lg text-on-surface-variant hover:text-on-surface font-label-sm text-xs transition-colors flex items-center gap-1.5"
                  type="button"
                >
                  <span class="material-symbols-outlined text-[16px]">satellite_alt</span>
                  <span>Satellite</span>
                </button>
                <button
                  (click)="toggleShuttleLayer()"
                  [class.bg-surface-container]="showShuttle"
                  [class.text-primary]="showShuttle"
                  class="px-3 py-1 rounded-lg text-on-surface-variant hover:text-on-surface font-label-sm text-xs transition-colors flex items-center gap-1.5"
                  type="button"
                >
                  <span class="material-symbols-outlined text-[16px]">directions_bus</span>
                  <span>Campus Shuttle</span>
                </button>
              </div>
            </div>

            <!-- Mini Compass / Coordinates readout (Bottom Right of Map) -->
            <div class="absolute bottom-4 right-4 z-[1000] pointer-events-none hidden sm:flex items-center gap-1.5 bg-surface-container-lowest/80 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] text-slate-500 font-mono border border-slate-200">
              <span>0°00'15"S 34°36'05"E</span>
              <span>•</span>
              <span>1,503m ALT</span>
            </div>
          </div>

          <!-- RIGHT PANE: 35% Location Details & Inspector Card -->
          @if (viewMode === 'map-list') {
            <div class="lg:col-span-4 flex flex-col gap-space-md">
              <!-- Selected Campus Venue Card -->
              <div class="bg-surface-container-lowest rounded-xl shadow-md border border-[#E2E8F0] overflow-hidden flex flex-col">
                <!-- Architectural Visual Header -->
                <div class="relative h-44 w-full bg-surface-container-high overflow-hidden">
                  <img
                    class="w-full h-full object-cover"
                    [src]="locationService.selectedLocation().imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDL3OBTLK7wJprMZTARLlPZjwSVrAlXOGi1k_92DKdZUDYk0PDXFfHO7CzBdOopCDOzrHW_WCyd6sR3DqUxTFNxT5H7KXI6-GgNWLForPSb-F9SM3pjOj2XUWiG2r_Zu71Fxccxga2W0eIQ2rFa1jwj9FsuJXj7Up9QHdCicKWJT-rPuJeI3_tqhdQWXX6Ie8wRa1l1LXYrf6TpgB8EKqXOzLoKfPRE1QdLIzlEXMf7mSWFs_RkSqsOMw'"
                    alt="Campus Location"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  <div class="absolute top-3 left-3 flex items-center gap-1">
                    <span class="bg-primary text-on-primary font-caption text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 font-semibold shadow-sm">
                      <span class="material-symbols-outlined text-[14px]">verified</span>
                      <span>{{ locationService.selectedLocation().verificationStatus === 'VERIFIED' ? 'VERIFIED CAMPUS LOCATION' : 'SAMPLE / DEMO VENUE' }}</span>
                    </span>
                  </div>

                  <div class="absolute bottom-3 left-3 right-3 text-white">
                    <span class="font-caption text-xs uppercase tracking-wider text-primary-fixed font-bold">
                      {{ locationService.selectedLocation().campusArea }} • {{ locationService.selectedLocation().buildingBlock || 'Central Concourse' }}
                    </span>
                    <h2 class="font-headline-sm text-lg leading-tight text-white font-bold drop-shadow-sm">
                      {{ locationService.selectedLocation().name }}
                    </h2>
                  </div>
                </div>

                <!-- Venue Metadata & Badges -->
                <div class="p-space-md flex flex-col gap-space-sm">
                  <!-- Faculty & Location line -->
                  <div class="flex items-center gap-1.5 text-on-surface-variant font-body-sm text-xs">
                    <span class="material-symbols-outlined text-[18px] text-primary shrink-0">apartment</span>
                    <span class="truncate">{{ locationService.selectedLocation().buildingBlock || 'School Facility' }} • {{ locationService.selectedLocation().floorLevel || 'Ground Floor' }}</span>
                  </div>

                  <!-- Feature Chips -->
                  <div class="flex flex-wrap gap-1.5 pt-0.5">
                    @if (locationService.selectedLocation().workstationsCount) {
                      <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-container text-on-surface font-label-sm text-xs font-medium">
                        <span class="material-symbols-outlined text-[15px] text-secondary">computer</span>
                        <span>{{ locationService.selectedLocation().workstationsCount }} Workstations</span>
                      </span>
                    }
                    @if (locationService.selectedLocation().hasSolarBackupPower) {
                      <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary-container text-on-secondary-container font-label-sm text-xs font-medium">
                        <span class="material-symbols-outlined text-[15px]">electric_bolt</span>
                        <span>Solar Backup Power</span>
                      </span>
                    }
                    @if (locationService.selectedLocation().wheelchairAccessible) {
                      <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-container text-on-surface font-label-sm text-xs font-medium">
                        <span class="material-symbols-outlined text-[15px] text-primary">accessible</span>
                        <span>Wheelchair Ramp</span>
                      </span>
                    }
                  </div>

                  <!-- Operating Hours & Status -->
                  <div class="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-[#E2E8F0]">
                    <div class="flex items-center gap-2">
                      <span class="w-2.5 h-2.5 rounded-full bg-surface-tint animate-pulse"></span>
                      <div class="flex flex-col">
                        <span class="font-label-sm text-xs font-bold text-on-surface">{{ locationService.selectedLocation().currentStatusLabel || 'Open Now' }}</span>
                        <span class="font-caption text-[11px] text-slate-500">{{ locationService.selectedLocation().openingHours || 'Daily: 8:00 AM – 6:00 PM' }}</span>
                      </div>
                    </div>
                    <span class="font-caption text-xs bg-surface-container-highest px-2 py-0.5 rounded font-mono font-semibold text-on-surface">
                      {{ locationService.selectedLocation().roomNumber || 'RM-01' }}
                    </span>
                  </div>

                  <!-- Facilities Breakdown -->
                  <div class="flex flex-col gap-1 pt-1">
                    <span class="font-label-sm text-xs font-bold text-on-surface">Available Facilities:</span>
                    <p class="font-body-sm text-xs text-slate-600 leading-relaxed">
                      {{ locationService.selectedLocation().availableFacilities || locationService.selectedLocation().description }}
                    </p>
                  </div>

                  <!-- Primary Actions -->
                  <div class="flex flex-col gap-2 pt-2">
                    <button
                      (click)="startNavigationToSelected()"
                      class="w-full py-2.5 px-4 rounded-lg bg-primary hover:bg-tertiary text-on-primary font-label-md text-xs font-semibold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
                      type="button"
                    >
                      <span class="material-symbols-outlined text-[18px]">navigation</span>
                      <span>Start Turn-by-Turn Navigation</span>
                    </button>

                    <div class="grid grid-cols-2 gap-2">
                      <button
                        (click)="toggleBookmarkSelected()"
                        class="py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-[#E2E8F0]"
                        type="button"
                      >
                        <span class="material-symbols-outlined text-[16px] text-secondary">
                          {{ bookmarkService.isBookmarked(locationService.selectedLocation().id) ? 'bookmark' : 'bookmark_border' }}
                        </span>
                        <span>{{ bookmarkService.isBookmarked(locationService.selectedLocation().id) ? 'Saved' : 'Save Place' }}</span>
                      </button>
                      <button
                        (click)="shareSelectedLocation()"
                        class="py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-[#E2E8F0]"
                        type="button"
                      >
                        <span class="material-symbols-outlined text-[16px]">share</span>
                        <span>Share Spot</span>
                      </button>
                    </div>
                  </div>

                  <div class="text-center pt-1">
                    <button
                      (click)="showReportModal = true"
                      class="font-caption text-[11px] text-slate-500 hover:text-primary transition-colors inline-flex items-center gap-1"
                      type="button"
                    >
                      <span class="material-symbols-outlined text-[13px]">flag</span>
                      <span>Report room change or inaccurate info</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Turn-by-Turn Route Preview Stepper -->
              <div class="bg-surface-container-lowest rounded-xl p-space-md shadow-md border border-[#E2E8F0] flex flex-col gap-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-primary text-[20px]">directions</span>
                    <span class="font-headline-sm text-sm font-bold text-on-surface">Active Walking Route</span>
                  </div>
                  <span class="font-caption text-[11px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-semibold">
                    Step-by-step
                  </span>
                </div>

                <!-- Vertical Stepper Steps -->
                <div class="flex flex-col gap-3 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-container-high">
                  @for (step of navigationService.activeRoute().steps; track step.stepNumber) {
                    <div class="relative flex items-start gap-2.5">
                      <div
                        [class.bg-primary]="step.stepNumber === 1"
                        [class.bg-secondary]="step.stepNumber > 1 && step.stepNumber < navigationService.activeRoute().steps.length"
                        [class.bg-surface-tint]="step.stepNumber === navigationService.activeRoute().steps.length"
                        class="absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                      >
                        {{ step.stepNumber === navigationService.activeRoute().steps.length ? '✓' : step.stepNumber }}
                      </div>
                      <div class="flex flex-col">
                        <span class="font-label-sm text-xs font-semibold text-on-surface">{{ step.instruction }}</span>
                        <span class="font-caption text-[11px] text-slate-500">{{ step.detail }}</span>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- Nearby Amenities within 50m -->
              <div class="bg-surface-container-lowest rounded-xl p-space-md shadow-md border border-[#E2E8F0] flex flex-col gap-2">
                <span class="font-label-sm text-xs font-bold text-on-surface">Nearby Amenities within 50m</span>
                <div class="grid grid-cols-3 gap-2 pt-1">
                  <div class="bg-surface-container-low p-2 rounded-lg flex flex-col items-center text-center border border-slate-100">
                    <span class="material-symbols-outlined text-[18px] text-primary">water_drop</span>
                    <span class="font-label-sm text-xs text-on-surface mt-1 truncate w-full font-medium">Water Refill</span>
                    <span class="font-caption text-[10px] text-slate-500">20m away</span>
                  </div>
                  <div class="bg-surface-container-low p-2 rounded-lg flex flex-col items-center text-center border border-slate-100">
                    <span class="material-symbols-outlined text-[18px] text-secondary">wc</span>
                    <span class="font-label-sm text-xs text-on-surface mt-1 truncate w-full font-medium">Restrooms</span>
                    <span class="font-caption text-[10px] text-slate-500">15m • Flr 1</span>
                  </div>
                  <div class="bg-surface-container-low p-2 rounded-lg flex flex-col items-center text-center border border-slate-100">
                    <span class="material-symbols-outlined text-[18px] text-primary">support_agent</span>
                    <span class="font-label-sm text-xs text-on-surface mt-1 truncate w-full font-medium">ICT Desk</span>
                    <span class="font-caption text-[10px] text-slate-500">Ground Flr</span>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Report Modal -->
      @if (showReportModal) {
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div class="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-200 flex flex-col gap-4">
            <div class="flex items-center justify-between border-b pb-3">
              <h3 class="font-bold text-base text-on-surface">Report Location Inaccuracy</h3>
              <button (click)="showReportModal = false" class="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div class="flex flex-col gap-3 text-xs">
              <div>
                <label class="font-semibold block mb-1">Location</label>
                <input [value]="locationService.selectedLocation().name" disabled class="w-full p-2 bg-slate-100 rounded border border-slate-200" />
              </div>
              <div>
                <label class="font-semibold block mb-1">Issue Category</label>
                <select [(ngModel)]="reportIssueType" class="w-full p-2 border rounded">
                  <option value="ROOM_CHANGE">Room Moved / Renamed</option>
                  <option value="INACCURATE_HOURS">Inaccurate Operating Hours</option>
                  <option value="WRONG_COORDINATES">Wrong Location on Map</option>
                  <option value="FACILITY_DEFECT">Faulty Equipment (Projector, AC, etc.)</option>
                </select>
              </div>
              <div>
                <label class="font-semibold block mb-1">Details & Description</label>
                <textarea [(ngModel)]="reportDescription" rows="3" placeholder="Describe the discrepancy..." class="w-full p-2 border rounded"></textarea>
              </div>
            </div>
            <div class="flex justify-end gap-2 pt-2 border-t">
              <button (click)="showReportModal = false" class="px-4 py-1.5 rounded text-xs text-slate-600 hover:bg-slate-100">Cancel</button>
              <button (click)="submitInaccuracyReport()" class="px-4 py-1.5 rounded text-xs bg-primary text-white font-semibold hover:bg-primary-container">
                Submit Report
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class CampusExplorerComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly locationService = inject(LocationService);
  readonly navigationService = inject(NavigationService);
  readonly bookmarkService = inject(BookmarkService);
  private readonly reportService = inject(ReportService);
  private readonly route = inject(ActivatedRoute);

  viewMode: 'map-list' | 'full-map' | 'directory' = 'map-list';
  searchQuery = 'Computer Lab 5';
  selectedCategory: LocationCategory | null = null;
  selectedFloor = '1';
  activeTileType: 'vector' | 'satellite' = 'vector';
  showShuttle = false;

  showReportModal = false;
  reportIssueType = 'ROOM_CHANGE';
  reportDescription = '';

  private map?: L.Map;
  private markersLayer?: L.LayerGroup;
  private routePolyline?: L.Polyline;
  private tileLayer?: L.TileLayer;

  get filteredLocations(): Location[] {
    let list = this.locationService.locations();
    if (this.selectedCategory) {
      list = list.filter(l => l.category === this.selectedCategory);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.description?.toLowerCase().includes(q) ||
        l.buildingBlock?.toLowerCase().includes(q)
      );
    }
    return list;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchQuery = params['q'];
      }
      if (params['category']) {
        this.selectedCategory = params['category'] as LocationCategory;
      }
      if (params['locId']) {
        const found = this.locationService.locations().find(l => l.id === Number(params['locId']));
        if (found) this.locationService.selectLocation(found);
      }
    });
  }

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnDestroy() {
    this.map?.remove();
  }

  private initMap() {
    const container = document.getElementById('leafletMap');
    if (!container || this.map) return;

    // Center on Maseno University Main & Siriba Campus
    this.map = L.map('leafletMap', {
      center: [-0.0041, 34.6015],
      zoom: 17,
      zoomControl: false,
      attributionControl: true
    });

    this.tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, CartoDB',
      maxZoom: 19
    }).addTo(this.map);

    this.markersLayer = L.layerGroup().addTo(this.map);
    this.renderMarkers();
    this.renderRoute();
  }

  private renderMarkers() {
    if (!this.map || !this.markersLayer) return;
    this.markersLayer.clearLayers();

    const selected = this.locationService.selectedLocation();

    this.locationService.locations().forEach(loc => {
      if (!loc.latitude || !loc.longitude) return;

      const isSelected = selected.id === loc.id;
      const isFountain = loc.name.includes('Fountain');

      const markerHtml = `
        <div style="
          width: ${isSelected ? '36px' : '28px'};
          height: ${isSelected ? '36px' : '28px'};
          background: ${isSelected ? '#004c22' : isFountain ? '#1f6c3a' : '#ffffff'};
          border: 2px solid ${isSelected ? '#ffffff' : '#166534'};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          cursor: pointer;
          color: ${isSelected ? '#ffffff' : '#166534'};
          font-weight: bold;
          font-size: 11px;
        ">
          ${isFountain ? '⛲' : isSelected ? '★' : '📍'}
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-campus-pin',
        iconSize: [isSelected ? 36 : 28, isSelected ? 36 : 28],
        iconAnchor: [isSelected ? 18 : 14, isSelected ? 18 : 14]
      });

      const marker = L.marker([loc.latitude, loc.longitude], { icon: customIcon });
      marker.bindPopup(`
        <div style="font-family: Inter, sans-serif; padding: 4px;">
          <b style="color: #004c22; font-size: 13px;">${loc.name}</b><br/>
          <span style="font-size: 11px; color: #64748b;">${loc.campusArea} • ${loc.buildingBlock || ''}</span><br/>
          <span style="font-size: 11px; color: #166534; font-weight: 600;">${loc.currentStatusLabel || 'Open'}</span>
        </div>
      `);

      marker.on('click', () => {
        this.locationService.selectLocation(loc);
        this.renderMarkers();
        this.renderRoute();
      });

      this.markersLayer?.addLayer(marker);
    });
  }

  private renderRoute() {
    if (!this.map) return;
    if (this.routePolyline) {
      this.map.removeLayer(this.routePolyline);
    }

    const route = this.navigationService.activeRoute();
    if (route && route.pathCoordinates && route.pathCoordinates.length > 0) {
      const latlngs = route.pathCoordinates.map(c => [c[0], c[1]] as L.LatLngTuple);
      this.routePolyline = L.polyline(latlngs, {
        color: '#166534',
        weight: 5,
        opacity: 0.9,
        dashArray: '8, 6'
      }).addTo(this.map);
    }
  }

  setViewMode(mode: 'map-list' | 'full-map' | 'directory') {
    this.viewMode = mode;
    setTimeout(() => {
      this.map?.invalidateSize();
    }, 200);
  }

  filterCategory(cat: LocationCategory | null) {
    this.selectedCategory = cat;
    this.locationService.fetchLocations(this.searchQuery, cat || undefined).subscribe(() => {
      this.renderMarkers();
    });
  }

  onSearchChange() {
    this.locationService.fetchLocations(this.searchQuery, this.selectedCategory || undefined).subscribe(() => {
      this.renderMarkers();
    });
  }

  clearSearch() {
    this.searchQuery = '';
    this.onSearchChange();
  }

  selectAndSwitchToMap(loc: Location) {
    this.locationService.selectLocation(loc);
    this.setViewMode('map-list');
    setTimeout(() => {
      this.map?.setView([loc.latitude || -0.0035, loc.longitude || 34.6022], 18);
      this.renderMarkers();
      this.renderRoute();
    }, 250);
  }

  startNavigationToSelected() {
    const sel = this.locationService.selectedLocation();
    this.navigationService.getDirections(10, sel.id, true).subscribe(() => {
      this.renderRoute();
    });
  }

  toggleBookmarkSelected() {
    this.bookmarkService.toggleBookmark(this.locationService.selectedLocation()).subscribe();
  }

  shareSelectedLocation() {
    const loc = this.locationService.selectedLocation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${loc.name} at Maseno University: ${loc.buildingBlock}, ${loc.roomNumber}`);
      alert(`Location details for "${loc.name}" copied to clipboard!`);
    }
  }

  submitInaccuracyReport() {
    if (!this.reportDescription.trim()) return;
    this.reportService.submitReport({
      location: this.locationService.selectedLocation(),
      locationName: this.locationService.selectedLocation().name,
      issueType: this.reportIssueType,
      description: this.reportDescription,
      reporterName: 'Brian Kiprono',
      reporterEmail: 'brian@maseno.ac.ke'
    }).subscribe(() => {
      alert('Thank you! Your correction report has been submitted to Estates & Administration.');
      this.showReportModal = false;
      this.reportDescription = '';
    });
  }

  zoomIn() {
    this.map?.zoomIn();
  }

  zoomOut() {
    this.map?.zoomOut();
  }

  centerMyGps() {
    this.map?.setView([-0.0052, 34.6008], 18);
  }

  alignNorth() {
    this.map?.setView([-0.0041, 34.6015], 17);
  }

  setTileLayer(type: 'vector' | 'satellite') {
    if (!this.map || this.activeTileType === type) return;
    this.activeTileType = type;
    if (this.tileLayer) {
      this.map.removeLayer(this.tileLayer);
    }
    const url = type === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    this.tileLayer = L.tileLayer(url, { maxZoom: 19 }).addTo(this.map);
  }

  toggleShuttleLayer() {
    this.showShuttle = !this.showShuttle;
    if (this.showShuttle) {
      alert('Campus Shuttle Line: Active every 15 mins between Siriba Gate, College Campus, and Kisumu Highway.');
    }
  }
}
