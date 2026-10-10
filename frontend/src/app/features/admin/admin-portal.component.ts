import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocationService } from '../../core/services/location.service';
import { ReportService } from '../../core/services/report.service';
import { AuthService } from '../../core/services/auth.service';
import { Location, LocationCategory, VerificationStatus, LocationReport } from '../../core/models/models';

@Component({
  selector: 'app-admin-portal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="px-space-lg py-space-lg w-full max-w-[1400px] mx-auto pb-space-2xl flex flex-col gap-space-lg">
      <!-- Admin Header -->
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[28px]">verified</span>
            <h1 class="text-2xl font-bold text-on-surface">Campus GIS Administration Portal</h1>
          </div>
          <p class="text-xs text-slate-500">
            Audit campus geolocation accuracy, approve submitted student waypoints, and maintain official university venue registries.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            (click)="openAddModal()"
            class="px-4 py-2 bg-primary text-white font-semibold text-xs rounded-lg shadow-sm hover:bg-primary-container flex items-center gap-1.5 transition-all"
            type="button"
          >
            <span class="material-symbols-outlined text-[16px]">add_location_alt</span>
            <span>Add Campus Location</span>
          </button>
        </div>
      </div>

      <!-- Live Metric Stats Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
            <span class="material-symbols-outlined text-[24px]">apartment</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-slate-500">Total Venues</span>
            <span class="text-2xl font-bold text-on-surface">{{ locationService.locations().length }}</span>
          </div>
        </div>

        <div class="p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[24px]">verified</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-slate-500">Verified Records</span>
            <span class="text-2xl font-bold text-emerald-700">{{ verifiedCount }}</span>
          </div>
        </div>

        <div class="p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[24px]">science</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-slate-500">Sample / Demo Records</span>
            <span class="text-2xl font-bold text-amber-700">{{ unverifiedCount }}</span>
          </div>
        </div>

        <div class="p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[24px]">report_problem</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-slate-500">Open Inaccuracy Reports</span>
            <span class="text-2xl font-bold text-red-600">{{ openReportsCount }}</span>
          </div>
        </div>
      </div>

      <!-- Tab Switcher -->
      <div class="flex items-center gap-2 border-b border-[#E2E8F0]">
        <button
          (click)="activeTab = 'locations'"
          [class.border-primary]="activeTab === 'locations'"
          [class.text-primary]="activeTab === 'locations'"
          [class.font-bold]="activeTab === 'locations'"
          class="px-4 py-2 border-b-2 border-transparent text-sm text-slate-600 hover:text-primary transition-colors"
        >
          Locations Directory ({{ locationService.locations().length }})
        </button>
        <button
          (click)="activeTab = 'reports'"
          [class.border-primary]="activeTab === 'reports'"
          [class.text-primary]="activeTab === 'reports'"
          [class.font-bold]="activeTab === 'reports'"
          class="px-4 py-2 border-b-2 border-transparent text-sm text-slate-600 hover:text-primary transition-colors flex items-center gap-1.5"
        >
          <span>Correction Reports</span>
          <span class="px-2 py-0.5 rounded-full text-[10px] bg-red-100 text-red-700 font-bold">
            {{ openReportsCount }}
          </span>
        </button>
      </div>

      <!-- Locations Directory Table Tab -->
      @if (activeTab === 'locations') {
        <div class="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div class="p-3 border-b border-slate-100 flex items-center justify-between">
            <input
              [(ngModel)]="searchFilter"
              placeholder="Filter table by name or code..."
              class="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg w-72 focus:outline-none"
            />
            <span class="text-xs text-slate-400">Showing {{ filteredList.length }} entries</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th class="p-3">Venue Name</th>
                  <th class="p-3">Category</th>
                  <th class="p-3">Campus Area / Block</th>
                  <th class="p-3">Room / Code</th>
                  <th class="p-3">Status</th>
                  <th class="p-3">Coordinates</th>
                  <th class="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (loc of filteredList; track loc.id) {
                  <tr class="hover:bg-slate-50/70 transition-colors">
                    <td class="p-3 font-semibold text-on-surface">{{ loc.name }}</td>
                    <td class="p-3">
                      <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {{ loc.category }}
                      </span>
                    </td>
                    <td class="p-3 text-slate-600">{{ loc.campusArea }} • {{ loc.buildingBlock || 'N/A' }}</td>
                    <td class="p-3 font-mono text-slate-500">{{ loc.roomNumber || 'G' }}</td>
                    <td class="p-3">
                      <button
                        (click)="toggleVerification(loc)"
                        [class.bg-emerald-100]="loc.verificationStatus === 'VERIFIED'"
                        [class.text-emerald-800]="loc.verificationStatus === 'VERIFIED'"
                        [class.bg-amber-100]="loc.verificationStatus !== 'VERIFIED'"
                        [class.text-amber-800]="loc.verificationStatus !== 'VERIFIED'"
                        class="px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 hover:opacity-80 transition-opacity"
                        title="Click to toggle status"
                      >
                        <span class="material-symbols-outlined text-[12px]">{{ loc.verificationStatus === 'VERIFIED' ? 'verified' : 'help' }}</span>
                        <span>{{ loc.verificationStatus }}</span>
                      </button>
                    </td>
                    <td class="p-3 font-mono text-slate-400 text-[11px]">
                      {{ loc.latitude?.toFixed(4) }}, {{ loc.longitude?.toFixed(4) }}
                    </td>
                    <td class="p-3 text-right">
                      <div class="flex items-center justify-end gap-1">
                        <button
                          (click)="editLocation(loc)"
                          class="p-1 rounded text-slate-500 hover:text-primary hover:bg-slate-100"
                          title="Edit location"
                        >
                          <span class="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button
                          (click)="deleteLocation(loc)"
                          class="p-1 rounded text-slate-500 hover:text-error hover:bg-slate-100"
                          title="Delete location"
                        >
                          <span class="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- Correction Reports Tab -->
      @if (activeTab === 'reports') {
        <div class="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden p-4 flex flex-col gap-3">
          @if (reportService.reports().length === 0) {
            <p class="text-xs text-slate-400 text-center py-6">No correction reports registered.</p>
          } @else {
            <div class="flex flex-col gap-3">
              @for (rep of reportService.reports(); track rep.id) {
                <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div class="flex flex-col gap-1">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-sm text-on-surface">{{ rep.locationName || 'Campus Venue' }}</span>
                      <span
                        [class.bg-red-100]="rep.status === 'OPEN'"
                        [class.text-red-700]="rep.status === 'OPEN'"
                        [class.bg-emerald-100]="rep.status === 'RESOLVED'"
                        [class.text-emerald-700]="rep.status === 'RESOLVED'"
                        class="px-2 py-0.5 rounded text-[10px] font-bold"
                      >
                        {{ rep.status }}
                      </span>
                      <span class="text-xs text-slate-400">• {{ rep.issueType }}</span>
                    </div>
                    <p class="text-xs text-slate-600">{{ rep.description }}</p>
                    <span class="text-[11px] text-slate-400">Reported by {{ rep.reporterName }} ({{ rep.reporterEmail }}) • {{ rep.createdAt }}</span>
                  </div>

                  @if (rep.status === 'OPEN') {
                    <div class="flex items-center gap-2 shrink-0">
                      <button
                        (click)="resolveReport(rep)"
                        class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                      >
                        Resolve Issue
                      </button>
                      <button
                        (click)="dismissReport(rep)"
                        class="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition-all"
                      >
                        Dismiss
                      </button>
                    </div>
                  }
                </div>
              }
            </div>
          }
        </div>
      }

      <!-- Add / Edit Location Modal -->
      @if (showLocationModal) {
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div class="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between border-b pb-3">
              <h3 class="font-bold text-base text-on-surface">
                {{ modalForm.id ? 'Edit Location' : 'Add New Location' }}
              </h3>
              <button (click)="showLocationModal = false" class="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div class="sm:col-span-2">
                <label class="font-semibold block mb-1">Venue Name *</label>
                <input [(ngModel)]="modalForm.name" placeholder="e.g. Science Complex Lecture 2" class="w-full p-2 border rounded" />
              </div>

              <div>
                <label class="font-semibold block mb-1">Category *</label>
                <select [(ngModel)]="modalForm.category" class="w-full p-2 border rounded">
                  <option value="LECTURE_HALL">LECTURE_HALL</option>
                  <option value="ACADEMIC_DEPARTMENT">ACADEMIC_DEPARTMENT</option>
                  <option value="ADMINISTRATIVE_OFFICE">ADMINISTRATIVE_OFFICE</option>
                  <option value="LIBRARY">LIBRARY</option>
                  <option value="COMPUTER_LAB">COMPUTER_LAB</option>
                  <option value="FOOD_AND_MESS">FOOD_AND_MESS</option>
                  <option value="STUDENT_SERVICES">STUDENT_SERVICES</option>
                  <option value="HEALTH_FACILITY">HEALTH_FACILITY</option>
                  <option value="HOSTEL">HOSTEL</option>
                  <option value="PRINTING_AND_STATIONERY">PRINTING_AND_STATIONERY</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>

              <div>
                <label class="font-semibold block mb-1">Campus Area</label>
                <input [(ngModel)]="modalForm.campusArea" placeholder="Siriba Campus" class="w-full p-2 border rounded" />
              </div>

              <div>
                <label class="font-semibold block mb-1">Building Block</label>
                <input [(ngModel)]="modalForm.buildingBlock" placeholder="Block B" class="w-full p-2 border rounded" />
              </div>

              <div>
                <label class="font-semibold block mb-1">Room Number</label>
                <input [(ngModel)]="modalForm.roomNumber" placeholder="ROOM B-104" class="w-full p-2 border rounded" />
              </div>

              <div>
                <label class="font-semibold block mb-1">Latitude</label>
                <input type="number" [(ngModel)]="modalForm.latitude" step="0.0001" class="w-full p-2 border rounded" />
              </div>

              <div>
                <label class="font-semibold block mb-1">Longitude</label>
                <input type="number" [(ngModel)]="modalForm.longitude" step="0.0001" class="w-full p-2 border rounded" />
              </div>

              <div class="sm:col-span-2">
                <label class="font-semibold block mb-1">Description</label>
                <textarea [(ngModel)]="modalForm.description" rows="2" class="w-full p-2 border rounded"></textarea>
              </div>

              <div class="sm:col-span-2">
                <label class="font-semibold block mb-1">Available Facilities</label>
                <input [(ngModel)]="modalForm.availableFacilities" placeholder="Workstations, Projector, Ramp" class="w-full p-2 border rounded" />
              </div>
            </div>

            <div class="flex justify-end gap-2 pt-3 border-t">
              <button (click)="showLocationModal = false" class="px-4 py-2 rounded text-xs text-slate-600 hover:bg-slate-100">Cancel</button>
              <button (click)="saveLocation()" class="px-4 py-2 rounded text-xs bg-primary text-white font-semibold hover:bg-primary-container">
                Save Location
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class AdminPortalComponent implements OnInit {
  readonly locationService = inject(LocationService);
  readonly reportService = inject(ReportService);
  readonly auth = inject(AuthService);

  activeTab: 'locations' | 'reports' = 'locations';
  searchFilter = '';

  showLocationModal = false;
  modalForm: Partial<Location> = {};

  ngOnInit() {
    this.reportService.fetchReports();
  }

  get verifiedCount(): number {
    return this.locationService.locations().filter(l => l.verificationStatus === 'VERIFIED').length;
  }

  get unverifiedCount(): number {
    return this.locationService.locations().filter(l => l.verificationStatus !== 'VERIFIED').length;
  }

  get openReportsCount(): number {
    return this.reportService.reports().filter(r => r.status === 'OPEN').length;
  }

  get filteredList(): Location[] {
    if (!this.searchFilter.trim()) return this.locationService.locations();
    const q = this.searchFilter.toLowerCase();
    return this.locationService.locations().filter(l =>
      l.name.toLowerCase().includes(q) ||
      l.buildingBlock?.toLowerCase().includes(q) ||
      l.roomNumber?.toLowerCase().includes(q)
    );
  }

  openAddModal() {
    this.modalForm = {
      name: '',
      category: 'LECTURE_HALL',
      campusArea: 'Siriba Campus',
      buildingBlock: '',
      roomNumber: '',
      latitude: -0.0041,
      longitude: 34.6015,
      description: '',
      availableFacilities: '',
      verificationStatus: 'VERIFIED'
    };
    this.showLocationModal = true;
  }

  editLocation(loc: Location) {
    this.modalForm = { ...loc };
    this.showLocationModal = true;
  }

  saveLocation() {
    if (!this.modalForm.name) {
      alert('Please enter a location name');
      return;
    }
    if (this.modalForm.id) {
      this.locationService.updateLocation(this.modalForm.id, this.modalForm).subscribe(() => {
        this.showLocationModal = false;
      });
    } else {
      this.locationService.createLocation(this.modalForm).subscribe(() => {
        this.showLocationModal = false;
      });
    }
  }

  deleteLocation(loc: Location) {
    if (confirm(`Are you sure you want to delete ${loc.name}?`)) {
      this.locationService.deleteLocation(loc.id).subscribe();
    }
  }

  toggleVerification(loc: Location) {
    const nextStatus: VerificationStatus = loc.verificationStatus === 'VERIFIED' ? 'UNVERIFIED_DEMO' : 'VERIFIED';
    this.locationService.updateVerification(loc.id, nextStatus, 'Updated via Admin Portal').subscribe();
  }

  resolveReport(rep: LocationReport) {
    if (rep.id) {
      this.reportService.updateReportStatus(rep.id, 'RESOLVED', 'Resolved by campus administrator').subscribe();
    }
  }

  dismissReport(rep: LocationReport) {
    if (rep.id) {
      this.reportService.updateReportStatus(rep.id, 'DISMISSED', 'Reviewed and dismissed').subscribe();
    }
  }
}
