import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Location, LocationCategory, VerificationStatus } from '../models/models';
import { Observable, tap, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private readonly defaultLocations: Location[] = [
    {
      id: 1,
      name: 'Computer Laboratory 5 (Lab 5)',
      slug: 'computer-lab-5',
      category: 'COMPUTER_LAB',
      campusArea: 'Siriba Campus',
      buildingBlock: 'Block B',
      floorLevel: '1st Floor East',
      roomNumber: 'ROOM B-104',
      description: 'Modern high-tech university computer laboratory with 60 high-performance desktop computers arranged in clean organized rows, recessed lighting, and dedicated server rack.',
      latitude: -0.0035,
      longitude: 34.6022,
      availableFacilities: 'Gigabit LAN, Practical Exam Host terminal, Ubuntu Linux & Windows 11 dual boot, Laser departmental printing & air conditioning.',
      openingHours: 'Mon – Fri: 8:00 AM – 8:00 PM',
      openNow: true,
      currentStatusLabel: 'Open Now • Practical Session',
      workstationsCount: 60,
      hasSolarBackupPower: true,
      wheelchairAccessible: true,
      verificationStatus: 'VERIFIED',
      verificationNotes: 'Verified by School of Computing GIS mapping team',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDL3OBTLK7wJprMZTARLlPZjwSVrAlXOGi1k_92DKdZUDYk0PDXFfHO7CzBdOopCDOzrHW_WCyd6sR3DqUxTFNxT5H7KXI6-GgNWLForPSb-F9SM3pjOj2XUWiG2r_Zu71Fxccxga2W0eIQ2rFa1jwj9FsuJXj7Up9QHdCicKWJT-rPuJeI3_tqhdQWXX6Ie8wRa1l1LXYrf6TpgB8EKqXOzLoKfPRE1QdLIzlEXMf7mSWFs_RkSqsOMw'
    },
    {
      id: 2,
      name: 'School of Computing & Informatics',
      slug: 'school-of-computing',
      category: 'ACADEMIC_DEPARTMENT',
      campusArea: 'Siriba Campus',
      buildingBlock: 'Wing A',
      floorLevel: 'Ground & 1st Floor',
      roomNumber: 'DEAN-01',
      description: 'Faculty offices, software dev laboratories, student consultation suites.',
      latitude: -0.0034,
      longitude: 34.6020,
      availableFacilities: "Dean's Boardroom, Lecturers' Offices, Departmental Noticeboards, Postgraduate Computer Hub",
      openingHours: 'Mon – Fri: 8:00 AM – 5:00 PM',
      openNow: true,
      currentStatusLabel: 'Open Now',
      workstationsCount: 40,
      hasSolarBackupPower: true,
      wheelchairAccessible: true,
      verificationStatus: 'VERIFIED',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfEOtQvOrmX2oCHJH9UcgLB6AlPVS7smKIrnVLHuxEAcY7Obzta1wEAxKe8mTuJMn941a4OUFkr0bCt4WH7Xq9dJShO_4tu8jPXhLizFKVJuqUDrbSi_IIfypLBNj7Oh4FfGkNLu0cZBNg1xjjrrhFnHu24EhVIU6a6CaPXDz7_X9TgS_Q3FJRFHtmRV38HM30pHoRyJhq5kiHTlDnJJqheH6zJ3BePiioYWvQW2UzqwjXqBNuWLLXOA'
    },
    {
      id: 3,
      name: 'Main University Library',
      slug: 'main-university-library',
      category: 'LIBRARY',
      campusArea: 'Central Quadrangle',
      buildingBlock: 'Library Complex',
      floorLevel: 'Ground, 1st & 2nd Floors',
      roomNumber: 'LIB-MAIN',
      description: 'Quiet study floors, repository catalog, e-resource labs, printing stations.',
      latitude: -0.0042,
      longitude: 34.6012,
      availableFacilities: '1,200 Reading Desks, High-speed Wi-Fi, Discussion Carrels, Cyber Lab, Book Loan Circulation Desk',
      openingHours: 'Mon – Sat: 8:00 AM – 10:00 PM',
      openNow: true,
      currentStatusLabel: 'Open Now • Quiet Study',
      workstationsCount: 1200,
      hasSolarBackupPower: true,
      wheelchairAccessible: true,
      verificationStatus: 'VERIFIED'
    },
    {
      id: 4,
      name: 'Central Student Mess',
      slug: 'central-student-mess',
      category: 'FOOD_AND_MESS',
      campusArea: 'Siriba Campus',
      buildingBlock: "Students' Center Annex",
      floorLevel: 'Ground Floor',
      roomNumber: 'MESS-01',
      description: 'Affordable breakfast, lunch & snacks. Open today 6:30 AM – 9:00 PM.',
      latitude: -0.0055,
      longitude: 34.6005,
      availableFacilities: 'Subsidized Meals, Tuck Shop, Refreshment Terrace, Handwashing Stations, Digital Cashless Pay',
      openingHours: 'Daily: 6:30 AM – 9:00 PM',
      openNow: true,
      currentStatusLabel: 'Open Now',
      wheelchairAccessible: true,
      verificationStatus: 'VERIFIED'
    },
    {
      id: 5,
      name: 'Academic Administration Office',
      slug: 'academic-administration-office',
      category: 'ADMINISTRATIVE_OFFICE',
      campusArea: 'Main Campus',
      buildingBlock: 'Administration Block',
      floorLevel: 'Ground Floor',
      roomNumber: 'ADM-G02',
      description: 'Admissions, Transcripts & Registration, Fee clearing desk.',
      latitude: -0.0048,
      longitude: 34.6010,
      availableFacilities: 'Student Admissions Desk, Finance & Billing Window, Academic Registrar Inquiry, Exam Slips Collection',
      openingHours: 'Mon – Fri: 8:00 AM – 5:00 PM',
      openNow: true,
      currentStatusLabel: 'Open Now',
      wheelchairAccessible: true,
      verificationStatus: 'VERIFIED'
    },
    {
      id: 6,
      name: 'Siriba Lecture Theatre (SLT 1 - 4)',
      slug: 'siriba-lecture-theatre',
      category: 'LECTURE_HALL',
      campusArea: 'Siriba Campus',
      buildingBlock: 'SLT Complex',
      floorLevel: 'Ground Floor',
      roomNumber: 'SLT 1-4',
      description: 'Tiered auditorium lecture halls accommodating large university undergraduate classes.',
      latitude: -0.0046,
      longitude: 34.6002,
      availableFacilities: '350 Seating Capacity, PA Audio Systems, Dual Projectors, Tiered Seating',
      openingHours: 'Mon – Sat: 7:00 AM – 7:00 PM',
      openNow: true,
      currentStatusLabel: 'In Session',
      wheelchairAccessible: true,
      verificationStatus: 'VERIFIED'
    },
    {
      id: 7,
      name: 'Health Centre',
      slug: 'health-centre',
      category: 'HEALTH_FACILITY',
      campusArea: 'Siriba Campus',
      buildingBlock: 'Dispensary Wing',
      floorLevel: 'Ground Floor',
      roomNumber: 'MED-01',
      description: '24/7 Outpatient health center and emergency triage for students and staff.',
      latitude: -0.0038,
      longitude: 34.6028,
      availableFacilities: 'Outpatient Clinic, Pharmacy, Emergency Ambulance Bay, Counseling Unit',
      openingHours: '24 Hours / 7 Days',
      openNow: true,
      currentStatusLabel: 'Open 24/7',
      wheelchairAccessible: true,
      verificationStatus: 'VERIFIED'
    },
    {
      id: 8,
      name: 'Science Complex',
      slug: 'science-complex',
      category: 'ACADEMIC_DEPARTMENT',
      campusArea: 'Main Campus',
      buildingBlock: 'Physical Sciences',
      floorLevel: 'Ground & 1st Floor',
      roomNumber: 'SCI-101',
      description: 'Biological & Chemical Sciences laboratories and lecture auditoriums.',
      latitude: -0.0058,
      longitude: 34.6018,
      availableFacilities: 'Chemistry Wet Labs, Biology Specimen Chamber, Physics Optics Lab',
      openingHours: 'Mon – Fri: 8:00 AM – 6:00 PM',
      openNow: true,
      currentStatusLabel: 'Open Now',
      wheelchairAccessible: true,
      verificationStatus: 'VERIFIED'
    },
    {
      id: 9,
      name: 'Hostel 8 & 9 (Siriba Residences)',
      slug: 'hostel-8-and-9',
      category: 'HOSTEL',
      campusArea: 'Siriba Campus',
      buildingBlock: 'Hostel Zone',
      floorLevel: 'Floors 1-3',
      roomNumber: 'H8-001',
      description: 'On-campus undergraduate student residential halls.',
      latitude: -0.0045,
      longitude: 34.6032,
      availableFacilities: 'Student Rooms, Study Rooms, Security Gate, Common Hall',
      openingHours: '24/7 Access for Residents',
      openNow: true,
      currentStatusLabel: 'Active',
      verificationStatus: 'VERIFIED'
    },
    {
      id: 10,
      name: 'Student Square Fountain',
      slug: 'student-square-fountain',
      category: 'OTHER',
      campusArea: 'Siriba Campus',
      buildingBlock: 'Central Concourse',
      floorLevel: 'Ground',
      roomNumber: 'PLAZA-01',
      description: 'Central student square, circular fountain, and wayfinding junction.',
      latitude: -0.0052,
      longitude: 34.6008,
      availableFacilities: 'Pedestrian Crossroads, Seating, Open Quad',
      openingHours: 'Open Always',
      openNow: true,
      currentStatusLabel: 'Public Area',
      verificationStatus: 'VERIFIED'
    },
    {
      id: 11,
      name: 'University Sports Oval',
      slug: 'university-sports-oval',
      category: 'OTHER',
      campusArea: 'Siriba Campus',
      buildingBlock: 'Athletic Complex',
      floorLevel: 'Field',
      roomNumber: 'OVAL-01',
      description: 'Athletics running track, football pitch, and student sports events field.',
      latitude: -0.0059,
      longitude: 34.6030,
      availableFacilities: 'Full-size Football Pitch, 400m Track, Grandstand Seating',
      openingHours: 'Daily: 6:00 AM – 7:00 PM',
      openNow: true,
      currentStatusLabel: 'Open',
      verificationStatus: 'VERIFIED'
    }
  ];

  readonly locations = signal<Location[]>(this.defaultLocations);
  readonly selectedLocation = signal<Location>(this.defaultLocations[0]);
  readonly isLoading = signal<boolean>(false);

  constructor(private http: HttpClient, private api: ApiService) {
    this.fetchLocations();
  }

  fetchLocations(query?: string, category?: LocationCategory): Observable<Location[]> {
    this.isLoading.set(true);
    let params: any = {};
    if (query) params.q = query;
    if (category) params.category = category;

    return this.http.get<Location[]>(`${this.api.baseUrl}/locations`, { params }).pipe(
      tap(data => {
        if (data && data.length > 0) {
          this.locations.set(data);
          // if selectedLocation is still default, update it with server record
          const currentId = this.selectedLocation().id;
          const matched = data.find(l => l.id === currentId);
          if (matched) this.selectedLocation.set(matched);
        }
        this.isLoading.set(false);
      }),
      catchError(() => {
        // Filter locally if backend is unavailable
        let filtered = [...this.defaultLocations];
        if (category) {
          filtered = filtered.filter(l => l.category === category);
        }
        if (query) {
          const q = query.toLowerCase();
          filtered = filtered.filter(l =>
            l.name.toLowerCase().includes(q) ||
            l.description?.toLowerCase().includes(q) ||
            l.buildingBlock?.toLowerCase().includes(q)
          );
        }
        this.locations.set(filtered);
        this.isLoading.set(false);
        return of(filtered);
      })
    );
  }

  selectLocation(loc: Location) {
    this.selectedLocation.set(loc);
  }

  createLocation(loc: Partial<Location>): Observable<Location> {
    return this.http.post<Location>(`${this.api.baseUrl}/locations`, loc).pipe(
      tap(created => {
        this.locations.update(list => [created, ...list]);
      }),
      catchError(() => {
        const fallbackCreated: Location = {
          id: Date.now(),
          slug: (loc.name || 'loc').toLowerCase().replace(/\s+/g, '-'),
          verificationStatus: loc.verificationStatus || 'PENDING_REVIEW',
          ...loc
        } as Location;
        this.locations.update(list => [fallbackCreated, ...list]);
        return of(fallbackCreated);
      })
    );
  }

  updateLocation(id: number, loc: Partial<Location>): Observable<Location> {
    return this.http.put<Location>(`${this.api.baseUrl}/locations/${id}`, loc).pipe(
      tap(updated => {
        this.locations.update(list => list.map(item => item.id === id ? updated : item));
        if (this.selectedLocation().id === id) this.selectedLocation.set(updated);
      })
    );
  }

  deleteLocation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api.baseUrl}/locations/${id}`).pipe(
      tap(() => {
        this.locations.update(list => list.filter(item => item.id !== id));
      })
    );
  }

  updateVerification(id: number, status: VerificationStatus, notes?: string): Observable<Location> {
    return this.http.patch<Location>(`${this.api.baseUrl}/locations/${id}/verification`, null, {
      params: { status, notes: notes || '' }
    }).pipe(
      tap(updated => {
        this.locations.update(list => list.map(item => item.id === id ? updated : item));
        if (this.selectedLocation().id === id) this.selectedLocation.set(updated);
      })
    );
  }
}
