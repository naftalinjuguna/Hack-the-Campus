import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CampusServicesDirectoryService } from '../../core/services/campus-service.service';
import { LocationService } from '../../core/services/location.service';
import { CampusService } from '../../core/models/models';

@Component({
  selector: 'app-campus-services',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="px-space-lg py-space-lg w-full max-w-[1400px] mx-auto pb-space-2xl flex flex-col gap-space-lg">
      <!-- Header -->
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-[28px]">account_balance</span>
          <h1 class="text-2xl font-bold text-on-surface">Campus Services Directory</h1>
        </div>
        <p class="text-xs text-slate-500">
          Find student messes, printing kiosks, medical clinics, and student support linked directly to verified campus venues.
        </p>
      </div>

      <!-- Filters & Category Tabs -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-sm">
        <div class="relative flex-1 flex items-center">
          <span class="material-symbols-outlined absolute left-3 text-slate-400 text-[20px]">search</span>
          <input
            [(ngModel)]="searchQuery"
            (ngModelChange)="onFilterChange()"
            class="w-full bg-slate-50 pl-10 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Search services, facilities, or support..."
            type="text"
          />
        </div>

        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            (click)="selectCategory('')"
            [class.bg-primary]="selectedCategory === ''"
            [class.text-white]="selectedCategory === ''"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors shrink-0"
          >
            All Services
          </button>
          <button
            (click)="selectCategory('PRINTING_AND_STATIONERY')"
            [class.bg-primary]="selectedCategory === 'PRINTING_AND_STATIONERY'"
            [class.text-white]="selectedCategory === 'PRINTING_AND_STATIONERY'"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors shrink-0"
          >
            Printing & Cyber
          </button>
          <button
            (click)="selectCategory('FOOD_AND_DINING')"
            [class.bg-primary]="selectedCategory === 'FOOD_AND_DINING'"
            [class.text-white]="selectedCategory === 'FOOD_AND_DINING'"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors shrink-0"
          >
            Student Mess
          </button>
          <button
            (click)="selectCategory('HEALTH_SERVICES')"
            [class.bg-primary]="selectedCategory === 'HEALTH_SERVICES'"
            [class.text-white]="selectedCategory === 'HEALTH_SERVICES'"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors shrink-0"
          >
            Health & Medical
          </button>
          <button
            (click)="selectCategory('IT_SUPPORT')"
            [class.bg-primary]="selectedCategory === 'IT_SUPPORT'"
            [class.text-white]="selectedCategory === 'IT_SUPPORT'"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors shrink-0"
          >
            IT Helpdesk
          </button>
        </div>
      </div>

      <!-- Services Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        @for (serv of filteredServices; track serv.id) {
          <div class="p-5 bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between gap-4 hover:border-primary transition-all">
            <div class="flex flex-col gap-3">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary-container text-on-secondary-container">
                  {{ serv.category }}
                </span>
                <span class="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <span class="material-symbols-outlined text-[15px] text-primary">schedule</span>
                  <span>{{ serv.operatingHours || 'Mon – Fri: 8:00 AM – 5:00 PM' }}</span>
                </span>
              </div>

              <div>
                <h3 class="font-bold text-base text-on-surface">{{ serv.name }}</h3>
                <p class="text-xs text-slate-600 pt-1 leading-relaxed">{{ serv.description }}</p>
              </div>

              @if (serv.availableOptions) {
                <div class="p-3 bg-surface-container-low rounded-lg text-xs text-slate-700 border border-slate-100">
                  <span class="font-bold text-primary block mb-0.5">Available Services:</span>
                  <span>{{ serv.availableOptions }}</span>
                </div>
              }
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-slate-100">
              <span class="text-xs text-slate-500 flex items-center gap-1">
                <span class="material-symbols-outlined text-[15px] text-primary">call</span>
                <span>{{ serv.contactPhone || '+254 700 000000' }}</span>
              </span>
              <button
                (click)="viewOnMap(serv)"
                class="px-3 py-1.5 rounded-lg bg-primary text-white font-semibold text-xs flex items-center gap-1 hover:bg-primary-container transition-all"
                type="button"
              >
                <span>Navigate to Facility</span>
                <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class CampusServicesComponent implements OnInit {
  readonly servicesService = inject(CampusServicesDirectoryService);
  private readonly router = inject(Router);

  searchQuery = '';
  selectedCategory = '';

  ngOnInit() {
    this.servicesService.fetchServices();
  }

  get filteredServices(): CampusService[] {
    let list = this.servicesService.services();
    if (this.selectedCategory) {
      list = list.filter(s => s.category.toLowerCase() === this.selectedCategory.toLowerCase());
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.availableOptions?.toLowerCase().includes(q)
      );
    }
    return list;
  }

  selectCategory(cat: string) {
    this.selectedCategory = cat;
    this.onFilterChange();
  }

  onFilterChange() {
    this.servicesService.fetchServices(this.searchQuery, this.selectedCategory);
  }

  viewOnMap(serv: CampusService) {
    const locId = serv.location?.id || 3;
    this.router.navigate(['/explore-campus'], { queryParams: { locId } });
  }
}
