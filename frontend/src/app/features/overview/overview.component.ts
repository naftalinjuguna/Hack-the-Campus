import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LocationService } from '../../core/services/location.service';
import { LectureService } from '../../core/services/lecture.service';
import { BookmarkService } from '../../core/services/bookmark.service';
import { AiService } from '../../core/services/ai.service';
import { Location } from '../../core/models/models';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="px-space-lg py-space-lg w-full max-w-[1400px] mx-auto pb-space-2xl flex flex-col gap-space-lg">
      <!-- Hero Welcome Banner -->
      <section class="relative overflow-hidden rounded-xl bg-gradient-to-br from-surface-container-low via-surface-container-lowest to-surface-container-high p-space-lg shadow-sm border border-[#E2E8F0]">
        <div class="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-secondary-container/40 blur-3xl pointer-events-none"></div>
        <div class="absolute right-1/3 -bottom-12 w-64 h-64 rounded-full bg-surface-tint/5 blur-2xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col gap-space-md">
          <!-- Top Status & Academic Session Line -->
          <div class="flex flex-wrap items-center justify-between gap-space-sm">
            <div class="flex items-center gap-space-xs">
              <span class="font-headline-sm text-headline-sm text-on-surface tracking-tight font-semibold">
                Good morning, {{ auth.currentUser().fullName.split(' ')[0] }}
              </span>
              <span class="text-xl">👋</span>
            </div>
            <div class="flex items-center gap-space-xs">
              <span class="inline-flex items-center gap-1 bg-surface-container-highest px-3 py-1 rounded-full text-on-surface font-label-sm text-xs font-medium">
                <span class="material-symbols-outlined text-[15px] text-primary">school</span>
                <span>Semester 2 • 2024/2025</span>
              </span>
              <span class="inline-flex items-center gap-1.5 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-xs font-semibold">
                <span class="w-1.5 h-1.5 rounded-full bg-surface-tint"></span>
                <span>Siriba Campus (Main)</span>
              </span>
            </div>
          </div>

          <!-- Typography Heading -->
          <div class="flex flex-col gap-1 max-w-2xl">
            <h1 class="font-headline-lg text-3xl text-on-surface font-bold tracking-tight">
              Find your way around Maseno University.
            </h1>
            <p class="font-body-md text-sm text-on-surface-variant text-slate-600">
              Discover lecture venues, administrative offices, campus services, and navigate with verified pedestrian pathways.
            </p>
          </div>

          <!-- Prominent Linear Search Box -->
          <div class="w-full max-w-4xl pt-1">
            <div class="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-surface-container-lowest rounded-xl p-1.5 shadow-md border border-[#E2E8F0] gap-1">
              <div class="flex items-center flex-1 px-3 gap-2 min-w-0">
                <span class="material-symbols-outlined text-primary text-[22px] shrink-0">search</span>
                <input
                  [(ngModel)]="searchQuery"
                  (keydown.enter)="executeSearch()"
                  class="w-full bg-transparent font-body-md text-sm text-on-surface placeholder:text-slate-400 focus:outline-none py-2"
                  placeholder="Where do you want to go? e.g., 'Lab 5', 'School of Computing', 'Finance Office'"
                  type="text"
                />
                <button
                  (click)="mockVoiceSearch()"
                  class="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors shrink-0"
                  title="Voice input"
                  type="button"
                >
                  <span class="material-symbols-outlined text-[20px]">mic</span>
                </button>
              </div>
              <button
                (click)="executeSearch()"
                class="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-sm font-semibold shadow-sm hover:bg-primary-container transition-all active:scale-[0.98] shrink-0"
                type="button"
              >
                <span class="material-symbols-outlined text-[18px]">near_me</span>
                <span>Search Campus</span>
              </button>
            </div>

            <!-- Quick Action Category Pills -->
            <div class="flex flex-wrap items-center gap-2 pt-3">
              <button
                routerLink="/find-a-lecture-hall"
                class="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs font-medium rounded-full shadow-sm border border-[#E2E8F0] transition-colors"
              >
                <span>🏫</span>
                <span>Find a Lecture Hall</span>
              </button>
              <button
                routerLink="/explore-campus"
                class="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs font-medium rounded-full shadow-sm border border-[#E2E8F0] transition-colors"
              >
                <span>🗺️</span>
                <span>Explore Interactive Map</span>
              </button>
              <button
                (click)="searchCategory('ACADEMIC_DEPARTMENT')"
                class="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs font-medium rounded-full shadow-sm border border-[#E2E8F0] transition-colors"
              >
                <span>🏢</span>
                <span>Academic & Admin Offices</span>
              </button>
              <button
                (click)="searchCategory('FOOD_AND_MESS')"
                class="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs font-medium rounded-full shadow-sm border border-[#E2E8F0] transition-colors"
              >
                <span>🍽️</span>
                <span>Student Mess & Eateries</span>
              </button>
              <button
                (click)="searchCategory('PRINTING_AND_STATIONERY')"
                class="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs font-medium rounded-full shadow-sm border border-[#E2E8F0] transition-colors"
              >
                <span>🖨️</span>
                <span>Printing & Cyber Services</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Two-Column Asymmetric Dashboard Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg w-full items-start">
        <!-- Left Column (approx 60% -> col-span-7) -->
        <div class="lg:col-span-7 flex flex-col gap-space-lg w-full">
          <!-- Upcoming Lecture Card -->
          <div class="relative bg-surface-container-lowest rounded-xl p-space-md sm:p-space-lg shadow-md border border-[#E2E8F0] overflow-hidden">
            <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>
            <div class="flex flex-col gap-space-md pl-1">
              <!-- Header row -->
              <div class="flex flex-wrap items-center justify-between gap-space-xs">
                <div class="flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-primary text-[20px]">calendar_today</span>
                  <span class="font-label-md text-xs text-primary font-bold uppercase tracking-wider">Next Scheduled Session</span>
                </div>
                <span class="inline-flex items-center gap-1.5 bg-surface-container-high text-on-surface-variant font-caption text-[11px] px-2.5 py-0.5 rounded-full font-medium">
                  <span class="w-1.5 h-1.5 rounded-full bg-outline"></span>
                  <span>SAMPLE TIMETABLE DATA</span>
                </span>
              </div>

              <!-- Unit Info -->
              <div class="flex flex-col gap-1">
                <h2 class="font-headline-sm text-xl text-on-surface font-bold">
                  {{ lectureService.upcomingLecture().unitCode }}: {{ lectureService.upcomingLecture().unitName }}
                </h2>
                <div class="flex items-center gap-1.5 text-on-surface-variant text-sm">
                  <span class="material-symbols-outlined text-[18px] text-primary">meeting_room</span>
                  <span class="font-medium text-on-surface">Computer Laboratory 5</span>
                  <span class="text-slate-500">• {{ lectureService.upcomingLecture().roomDescription }}</span>
                </div>
              </div>

              <!-- Time & Countdown Meta Box -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-surface-container-low rounded-lg border border-[#E2E8F0]">
                <div class="flex flex-col">
                  <span class="font-caption text-xs text-slate-500">Session Time</span>
                  <span class="font-label-md text-sm text-on-surface font-semibold">{{ lectureService.upcomingLecture().startTime }} - {{ lectureService.upcomingLecture().endTime }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="font-caption text-xs text-slate-500">Lecturer</span>
                  <span class="font-label-md text-sm text-on-surface font-semibold">{{ lectureService.upcomingLecture().lecturer }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="font-caption text-xs text-slate-500">Starting In</span>
                  <span class="inline-flex items-center gap-1 text-primary font-label-md text-sm font-bold">
                    <span class="material-symbols-outlined text-[16px] animate-pulse">timer</span>
                    <span>25 mins</span>
                  </span>
                </div>
              </div>

              <!-- Walk Distance Banner -->
              <div class="flex items-center gap-2 px-3 py-2 bg-secondary-container/40 rounded-lg text-on-secondary-container text-xs">
                <span class="material-symbols-outlined text-primary text-[18px]">directions_walk</span>
                <span><strong>4 min walk</strong> (320m) from your detected location near Siriba Mess</span>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-wrap items-center gap-2 pt-1">
                <button
                  routerLink="/explore-campus"
                  class="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-xs font-semibold hover:bg-primary-container shadow-sm transition-all active:scale-[0.98]"
                  type="button"
                >
                  <span class="material-symbols-outlined text-[18px]">turn_right</span>
                  <span>Get Walking Directions</span>
                </button>
                <button
                  routerLink="/explore-campus"
                  class="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-xs font-medium transition-colors"
                  type="button"
                >
                  <span class="material-symbols-outlined text-[18px]">location_on</span>
                  <span>View Venue on Map</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Frequently Visited Campus Locations -->
          <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-primary text-[20px]">explore</span>
                <h3 class="font-headline-sm text-base text-on-surface font-bold">Frequently Visited Locations</h3>
              </div>
              <span class="font-caption text-[11px] text-slate-500 bg-surface-container-high px-2 py-0.5 rounded font-mono">
                SAMPLE RECORDS - DEMO DATA
              </span>
            </div>

            <!-- 4 Cards Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              @for (loc of frequentLocations; track loc.id) {
                <div class="group flex flex-col justify-between p-4 bg-surface-container-lowest hover:bg-surface-container-low rounded-xl shadow-sm border border-[#E2E8F0] transition-all">
                  <div class="flex flex-col gap-1.5">
                    <div class="flex items-center justify-between">
                      <span class="inline-flex items-center gap-1 font-caption text-[11px] px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-medium">
                        <span class="material-symbols-outlined text-[13px]">{{ getCategoryIcon(loc.category) }}</span>
                        <span>{{ formatCategory(loc.category) }}</span>
                      </span>
                      <button
                        (click)="toggleBookmark(loc, $event)"
                        class="text-on-surface-variant hover:text-primary transition-colors"
                        title="Bookmark"
                        type="button"
                      >
                        <span class="material-symbols-outlined text-[20px]" [class.filled]="bookmarkService.isBookmarked(loc.id)" [class.text-primary]="bookmarkService.isBookmarked(loc.id)">
                          {{ bookmarkService.isBookmarked(loc.id) ? 'bookmark' : 'bookmark_border' }}
                        </span>
                      </button>
                    </div>

                    <div class="flex items-start gap-1 pt-1">
                      <div class="flex flex-col min-w-0">
                        <div class="flex items-center gap-1">
                          <h4 class="font-label-md text-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                            {{ loc.name }}
                          </h4>
                          <span class="material-symbols-outlined text-primary text-[15px] shrink-0" title="Verified Campus Geo-pin">verified</span>
                        </div>
                        <span class="font-caption text-xs text-slate-500">{{ loc.campusArea }} - {{ loc.buildingBlock || 'Central' }}</span>
                      </div>
                    </div>

                    <p class="font-body-sm text-xs text-slate-600 line-clamp-2 pt-1 leading-relaxed">
                      {{ loc.description }}
                    </p>
                  </div>

                  <div class="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
                    <span class="inline-flex items-center gap-1 font-caption text-xs text-slate-500">
                      <span class="material-symbols-outlined text-[14px] text-primary">directions_walk</span>
                      <span>{{ getWalkTime(loc.id) }} min walk</span>
                    </span>
                    <button
                      (click)="goToLocation(loc)"
                      class="inline-flex items-center gap-1 font-label-sm text-xs text-primary hover:text-primary-container font-semibold"
                      type="button"
                    >
                      <span>Directions</span>
                      <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Offline Map Sync Active Banner -->
          <div class="relative rounded-xl overflow-hidden shadow-sm bg-surface-container-low p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border border-[#E2E8F0]">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-[22px]">satellite_alt</span>
              </div>
              <div class="flex flex-col">
                <span class="font-label-md text-sm font-semibold text-on-surface">Offline Map Sync Active</span>
                <span class="font-body-sm text-xs text-slate-600">Vector pedestrian layers for Siriba, College & Kisumu campuses cached for poor connectivity.</span>
              </div>
            </div>
            <button
              (click)="manageCacheAlert()"
              class="whitespace-nowrap px-3 py-1.5 bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-sm text-xs font-semibold rounded-lg shadow-sm border border-[#CBD5E1] transition-colors"
              type="button"
            >
              Manage Cache
            </button>
          </div>
        </div>

        <!-- Right Column (approx 40% -> col-span-5) -->
        <div class="lg:col-span-5 flex flex-col gap-space-lg w-full">
          <!-- Ask CampusDinga AI Assistant Card -->
          <div class="relative bg-surface-container-lowest rounded-xl p-space-lg shadow-md flex flex-col gap-space-md overflow-hidden border border-[#E2E8F0]">
            <div class="absolute -top-12 -right-12 w-40 h-40 bg-secondary-container/40 rounded-full blur-2xl pointer-events-none"></div>

            <!-- Header -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-9 h-9 rounded-lg bg-secondary-container text-primary flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-[20px]">auto_awesome</span>
                </div>
                <div class="flex flex-col">
                  <h3 class="font-label-md text-sm font-bold text-on-surface">Ask CampusDinga AI</h3>
                  <span class="font-caption text-[11px] text-slate-500">Verified Maseno directories</span>
                </div>
              </div>
              <span class="inline-flex items-center gap-1.5 bg-secondary-container px-2.5 py-0.5 rounded-full text-on-secondary-container font-caption text-[11px] font-semibold">
                <span class="w-1.5 h-1.5 rounded-full bg-surface-tint"></span>
                <span>Online</span>
              </span>
            </div>

            <p class="font-body-sm text-xs text-slate-600">
              Natural-language campus questions answered from official university floorplans and staff directories.
            </p>

            <!-- Suggested Prompt Chips -->
            <div class="flex flex-col gap-1.5">
              <span class="font-caption text-[11px] text-slate-400 uppercase tracking-wider font-bold">Suggested Questions</span>
              @for (prompt of suggestedPrompts; track prompt) {
                <button
                  (click)="askPrompt(prompt)"
                  class="text-left p-2 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-xs transition-colors flex items-center justify-between group border border-slate-100"
                  type="button"
                >
                  <span class="truncate">{{ prompt }}</span>
                  <span class="material-symbols-outlined text-[16px] text-slate-400 group-hover:text-primary transition-colors shrink-0">north_east</span>
                </button>
              }
            </div>

            <!-- Quick AI Input Bar -->
            <div class="relative flex items-center bg-surface-container-low rounded-lg p-1 border border-[#E2E8F0]">
              <input
                [(ngModel)]="aiInput"
                (keydown.enter)="submitAiQuery()"
                class="w-full bg-transparent px-3 py-1.5 text-on-surface font-body-sm text-xs placeholder:text-slate-400 focus:outline-none"
                placeholder="Ask anything about venues or offices..."
                type="text"
              />
              <button
                (click)="submitAiQuery()"
                [disabled]="aiService.isThinking()"
                class="flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary text-on-primary font-label-sm text-xs font-semibold hover:bg-primary-container transition-all shrink-0"
                type="button"
              >
                <span>{{ aiService.isThinking() ? 'Thinking...' : 'Ask AI' }}</span>
                <span class="material-symbols-outlined text-[14px]">send</span>
              </button>
            </div>

            <!-- AI Response Box -->
            @if (aiResponseText) {
              <div class="p-3 bg-secondary-container/20 rounded-lg text-on-surface font-body-sm text-xs flex flex-col gap-1 border border-secondary-container">
                <div class="flex items-center gap-1.5 text-primary font-label-sm text-xs font-bold">
                  <span class="material-symbols-outlined text-[16px]">smart_toy</span>
                  <span>CampusDinga Assistant</span>
                </div>
                <p class="text-on-surface leading-relaxed">{{ aiResponseText }}</p>
                <div class="pt-1">
                  <button
                    routerLink="/explore-campus"
                    class="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <span>View Venue on Map</span>
                    <span class="material-symbols-outlined text-[13px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            }
          </div>

          <!-- Live Campus Navigation Notices / Updates -->
          <div class="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-[#E2E8F0] flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-primary text-[20px]">campaign</span>
                <h3 class="font-label-md text-sm font-bold text-on-surface">Campus Navigation Notices</h3>
              </div>
              <span class="font-caption text-[11px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-semibold">Active</span>
            </div>

            <div class="flex flex-col gap-2">
              <div class="flex items-start gap-2.5 p-3 rounded-lg bg-surface-container-low border border-slate-100">
                <div class="p-1.5 rounded-lg bg-red-100 text-error shrink-0">
                  <span class="material-symbols-outlined text-[18px]">construction</span>
                </div>
                <div class="flex flex-col min-w-0">
                  <span class="font-label-sm text-xs font-bold text-on-surface">Pathway Detour in Effect</span>
                  <p class="font-body-sm text-xs text-slate-600 pt-0.5 leading-relaxed">
                    Construction near Graduation Square. Please use the paved Science Complex pathway to reach Lecture Hall 12.
                  </p>
                  <span class="font-caption text-[10px] text-slate-400 pt-1">Updated 2h ago • Estates Dept</span>
                </div>
              </div>

              <div class="flex items-start gap-2.5 p-3 rounded-lg bg-surface-container-low border border-slate-100">
                <div class="p-1.5 rounded-lg bg-emerald-100 text-primary shrink-0">
                  <span class="material-symbols-outlined text-[18px]">sync_alt</span>
                </div>
                <div class="flex flex-col min-w-0">
                  <span class="font-label-sm text-xs font-bold text-on-surface">Exam Venues Sync</span>
                  <p class="font-body-sm text-xs text-slate-600 pt-0.5 leading-relaxed">
                    End of semester venue lists will sync directly with your official Maseno ERP student portal timetable.
                  </p>
                  <span class="font-caption text-[10px] text-slate-400 pt-1">Registrar Academic Affairs</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Campus Photo Reference Card -->
          <div
            class="relative rounded-xl overflow-hidden shadow-sm h-44 bg-surface-container flex flex-col justify-end p-4 border border-[#E2E8F0]"
            style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAfEOtQvOrmX2oCHJH9UcgLB6AlPVS7smKIrnVLHuxEAcY7Obzta1wEAxKe8mTuJMn941a4OUFkr0bCt4WH7Xq9dJShO_4tu8jPXhLizFKVJuqUDrbSi_IIfypLBNj7Oh4FfGkNLu0cZBNg1xjjrrhFnHu24EhVIU6a6CaPXDz7_X9TgS_Q3FJRFHtmRV38HM30pHoRyJhq5kiHTlDnJJqheH6zJ3BePiioYWvQW2UzqwjXqBNuWLLXOA'); background-size: cover; background-position: center;"
          >
            <div class="absolute inset-0 bg-gradient-to-t from-[#0B1C30]/90 via-[#0B1C30]/40 to-transparent"></div>
            <div class="relative z-10 flex items-center justify-between text-white">
              <div>
                <span class="font-label-sm text-sm font-bold block">Siriba Campus Main Quad</span>
                <span class="font-caption text-xs text-slate-200">Central Landmark • Elevation 1,503m</span>
              </div>
              <button
                routerLink="/explore-campus"
                class="p-1.5 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white transition-colors"
                type="button"
                title="View on Map"
              >
                <span class="material-symbols-outlined text-[18px]">open_in_new</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Campus Stats Bar -->
      <section class="w-full bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-[#E2E8F0]">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
              <span class="material-symbols-outlined text-[20px]">meeting_room</span>
            </div>
            <div class="flex flex-col">
              <span class="font-headline-sm text-xl font-bold text-on-surface leading-tight">48</span>
              <span class="font-caption text-xs text-slate-500">Verified Lecture Halls</span>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
              <span class="material-symbols-outlined text-[20px]">account_balance</span>
            </div>
            <div class="flex flex-col">
              <span class="font-headline-sm text-xl font-bold text-on-surface leading-tight">18</span>
              <span class="font-caption text-xs text-slate-500">Academic Departments</span>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
              <span class="material-symbols-outlined text-[20px]">local_cafe</span>
            </div>
            <div class="flex flex-col">
              <span class="font-headline-sm text-xl font-bold text-on-surface leading-tight">12</span>
              <span class="font-caption text-xs text-slate-500">Student Amenities</span>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
              <span class="material-symbols-outlined text-[20px]">cloud_done</span>
            </div>
            <div class="flex flex-col">
              <span class="font-headline-sm text-xl font-bold text-primary leading-tight">100%</span>
              <span class="font-caption text-xs text-slate-500">Offline-ready Map Cache</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class OverviewComponent {
  readonly auth = inject(AuthService);
  readonly locationService = inject(LocationService);
  readonly lectureService = inject(LectureService);
  readonly bookmarkService = inject(BookmarkService);
  readonly aiService = inject(AiService);
  private readonly router = inject(Router);

  searchQuery = '';
  aiInput = '';
  aiResponseText = '';

  suggestedPrompts = [
    '"Where is the Computer Science department?"',
    '"Where can I print my assignment right now?"',
    '"How do I get to the Library step-free?"',
    '"Where is the Student Health Dispensary?"'
  ];

  get frequentLocations(): Location[] {
    return this.locationService.locations().filter(l => [2, 3, 4, 5].includes(l.id));
  }

  executeSearch() {
    if (this.searchQuery.trim()) {
      this.bookmarkService.addRecentSearch(this.searchQuery.trim());
      this.router.navigate(['/explore-campus'], { queryParams: { q: this.searchQuery.trim() } });
    }
  }

  mockVoiceSearch() {
    this.searchQuery = 'Computer Laboratory 5, Block B';
    this.executeSearch();
  }

  searchCategory(cat: string) {
    this.router.navigate(['/explore-campus'], { queryParams: { category: cat } });
  }

  goToLocation(loc: Location) {
    this.locationService.selectLocation(loc);
    this.router.navigate(['/explore-campus'], { queryParams: { locId: loc.id } });
  }

  toggleBookmark(loc: Location, event: Event) {
    event.stopPropagation();
    this.bookmarkService.toggleBookmark(loc).subscribe();
  }

  askPrompt(prompt: string) {
    const clean = prompt.replace(/"/g, '');
    this.aiInput = clean;
    this.submitAiQuery();
  }

  submitAiQuery() {
    if (!this.aiInput.trim()) return;
    const q = this.aiInput.trim();
    this.aiService.ask(q).subscribe(resp => {
      this.aiResponseText = resp.answer;
    });
  }

  manageCacheAlert() {
    alert('Campus GIS Cache: 4.8MB vector tiles & building geometry saved for offline access.');
  }

  getWalkTime(id: number): number {
    const times: Record<number, number> = { 2: 5, 3: 7, 4: 2, 5: 8 };
    return times[id] || 4;
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'ACADEMIC_DEPARTMENT': return 'school';
      case 'LIBRARY': return 'local_library';
      case 'FOOD_AND_MESS': return 'restaurant';
      case 'ADMINISTRATIVE_OFFICE': return 'account_balance';
      case 'COMPUTER_LAB': return 'computer';
      case 'HEALTH_FACILITY': return 'local_hospital';
      default: return 'place';
    }
  }

  formatCategory(category: string): string {
    switch (category) {
      case 'ACADEMIC_DEPARTMENT': return 'Academic Dept';
      case 'LIBRARY': return 'Library & Study';
      case 'FOOD_AND_MESS': return 'Food & Dining';
      case 'ADMINISTRATIVE_OFFICE': return 'Administration';
      case 'COMPUTER_LAB': return 'Computer Lab';
      default: return 'Facility';
    }
  }
}
