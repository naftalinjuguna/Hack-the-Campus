import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LectureService } from '../../core/services/lecture.service';
import { LocationService } from '../../core/services/location.service';
import { Lecture } from '../../core/models/models';

@Component({
  selector: 'app-lecture-finder',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="px-space-lg py-space-lg w-full max-w-[1400px] mx-auto pb-space-2xl flex flex-col gap-space-lg">
      <!-- Header -->
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-[28px]">meeting_room</span>
          <h1 class="text-2xl font-bold text-on-surface">Lecture Hall & Examination Venue Finder</h1>
        </div>
        <p class="text-xs text-slate-500">
          Search course units, view scheduled venues, and get pedestrian directions across Maseno University.
        </p>
      </div>

      <!-- Search & Filters -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-sm">
        <div class="relative flex-1 flex items-center">
          <span class="material-symbols-outlined absolute left-3 text-slate-400 text-[20px]">search</span>
          <input
            [(ngModel)]="searchQuery"
            (ngModelChange)="onFilterChange()"
            class="w-full bg-slate-50 pl-10 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Search by unit code (CSC 311) or unit name..."
            type="text"
          />
        </div>

        <div class="flex items-center gap-2">
          <select
            [(ngModel)]="selectedDay"
            (ngModelChange)="onFilterChange()"
            class="bg-slate-50 px-3 py-2 text-xs rounded-lg border border-slate-200 font-medium text-slate-700 focus:outline-none"
          >
            <option value="">All Days (Mon - Fri)</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
          </select>
        </div>
      </div>

      <!-- Timetable Results Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        @for (lec of filteredLectures; track lec.id) {
          <div class="p-5 bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between gap-4 hover:border-primary transition-all">
            <div class="flex flex-col gap-3">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-white">
                  {{ lec.unitCode }}
                </span>
                <span class="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <span class="material-symbols-outlined text-[15px] text-primary">schedule</span>
                  <span>{{ lec.dayOfWeek }} • {{ lec.startTime }} - {{ lec.endTime }}</span>
                </span>
              </div>

              <div>
                <h3 class="font-bold text-base text-on-surface">{{ lec.unitName }}</h3>
                <span class="text-xs text-slate-500">Lecturer: {{ lec.lecturer || 'Department Staff' }}</span>
              </div>

              <div class="p-3 bg-surface-container-low rounded-lg border border-slate-100 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary text-[20px]">location_on</span>
                  <div class="flex flex-col">
                    <span class="font-bold text-xs text-on-surface">{{ lec.location?.name || 'Computer Laboratory 5' }}</span>
                    <span class="text-[11px] text-slate-500">{{ lec.roomDescription }}</span>
                  </div>
                </div>
                <span class="text-xs font-semibold text-primary bg-white px-2 py-1 rounded shadow-sm border border-slate-100">
                  {{ lec.estimatedMinutesWalk }} min walk
                </span>
              </div>
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-slate-100">
              <span class="text-[11px] font-mono text-slate-400">{{ lec.timetableSource }}</span>
              <button
                (click)="viewOnMap(lec)"
                class="px-3 py-1.5 rounded-lg bg-primary text-white font-semibold text-xs flex items-center gap-1 hover:bg-primary-container transition-all"
                type="button"
              >
                <span>View on Map</span>
                <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class LectureFinderComponent implements OnInit {
  readonly lectureService = inject(LectureService);
  private readonly locationService = inject(LocationService);
  private readonly router = inject(Router);

  searchQuery = '';
  selectedDay = '';

  ngOnInit() {
    this.lectureService.fetchLectures();
  }

  get filteredLectures(): Lecture[] {
    let list = this.lectureService.lectures();
    if (this.selectedDay) {
      list = list.filter(l => l.dayOfWeek?.toLowerCase() === this.selectedDay.toLowerCase());
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(l =>
        l.unitCode.toLowerCase().includes(q) ||
        l.unitName.toLowerCase().includes(q) ||
        l.lecturer?.toLowerCase().includes(q)
      );
    }
    return list;
  }

  onFilterChange() {
    this.lectureService.fetchLectures(this.searchQuery, this.selectedDay);
  }

  viewOnMap(lec: Lecture) {
    const locId = lec.location?.id || 1;
    this.router.navigate(['/explore-campus'], { queryParams: { locId } });
  }
}
