import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { CampusService } from '../models/models';
import { Observable, tap, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CampusServicesDirectoryService {
  private readonly defaultServices: CampusService[] = [
    {
      id: 1,
      name: 'University Main Cyber & Printing',
      category: 'PRINTING_AND_STATIONERY',
      description: 'High-speed printing, document binding, thesis printing, laminating, and digital scanning.',
      operatingHours: 'Mon – Fri: 8:00 AM – 7:00 PM',
      contactPhone: '+254 700 123456',
      availableOptions: 'Spiral Binding, Color A4/A3 Printing, Passport Photos, Document Scanning'
    },
    {
      id: 2,
      name: 'Siriba Cafeteria & Student Mess',
      category: 'FOOD_AND_DINING',
      description: 'Affordable, subsidized catering for students with clean indoor seating and fast takeaway.',
      operatingHours: 'Daily: 6:30 AM – 9:00 PM',
      contactPhone: '+254 700 234567',
      availableOptions: 'Breakfast Chai & Mandazi, Lunch Ugali & Beef/Sukuma, Evening Supper'
    },
    {
      id: 3,
      name: 'Maseno Outpatient Health Dispensary',
      category: 'HEALTH_SERVICES',
      description: 'Student medical attention, emergency stabilization, medication prescription, and ambulance dispatch.',
      operatingHours: '24/7 All Days',
      contactPhone: '+254 700 345678',
      availableOptions: 'General Outpatient, Rapid Malaria & Typhoid Testing, Student Wellness Counseling'
    },
    {
      id: 4,
      name: 'ICT Student Helpdesk & Portal Support',
      category: 'IT_SUPPORT',
      description: 'Student ERP portal password reset, Eduroam campus Wi-Fi access credentials, and LMS support.',
      operatingHours: 'Mon – Fri: 8:00 AM – 5:00 PM',
      contactPhone: '+254 700 456789',
      availableOptions: 'Eduroam Wi-Fi configuration, Student Portal ERP clearance, Computer Lab access'
    }
  ];

  readonly services = signal<CampusService[]>(this.defaultServices);

  constructor(private http: HttpClient, private api: ApiService) {
    this.fetchServices();
  }

  fetchServices(query?: string, category?: string): Observable<CampusService[]> {
    let params: any = {};
    if (query) params.q = query;
    if (category) params.category = category;

    return this.http.get<CampusService[]>(`${this.api.baseUrl}/services`, { params }).pipe(
      tap(data => {
        if (data && data.length > 0) this.services.set(data);
      }),
      catchError(() => {
        let filtered = [...this.defaultServices];
        if (category) filtered = filtered.filter(s => s.category.toLowerCase() === category.toLowerCase());
        if (query) {
          const q = query.toLowerCase();
          filtered = filtered.filter(s =>
            s.name.toLowerCase().includes(q) ||
            s.description?.toLowerCase().includes(q) ||
            s.availableOptions?.toLowerCase().includes(q)
          );
        }
        this.services.set(filtered);
        return of(filtered);
      })
    );
  }
}
