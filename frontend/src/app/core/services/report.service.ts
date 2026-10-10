import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { LocationReport } from '../models/models';
import { Observable, tap, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly defaultReports: LocationReport[] = [
    {
      id: 1,
      locationName: 'Siriba Lecture Hall SLT 2',
      reporterName: 'Brian Kiprono',
      reporterEmail: 'brian@maseno.ac.ke',
      issueType: 'ROOM_CHANGE',
      description: 'Whiteboard light is malfunctioning in the right corner, projector occasionally flickers.',
      status: 'OPEN',
      createdAt: '2 hours ago'
    }
  ];

  readonly reports = signal<LocationReport[]>(this.defaultReports);

  constructor(private http: HttpClient, private api: ApiService) {
    this.fetchReports();
  }

  fetchReports(): Observable<LocationReport[]> {
    return this.http.get<LocationReport[]>(`${this.api.baseUrl}/reports`).pipe(
      tap(data => {
        if (data && data.length > 0) this.reports.set(data);
      }),
      catchError(() => of(this.defaultReports))
    );
  }

  submitReport(report: LocationReport): Observable<LocationReport> {
    return this.http.post<LocationReport>(`${this.api.baseUrl}/reports`, report).pipe(
      tap(created => {
        this.reports.update(list => [created, ...list]);
      }),
      catchError(() => {
        const fallback: LocationReport = {
          id: Date.now(),
          status: 'OPEN',
          createdAt: 'Just now',
          ...report
        };
        this.reports.update(list => [fallback, ...list]);
        return of(fallback);
      })
    );
  }

  updateReportStatus(id: number, status: string, adminNotes?: string): Observable<LocationReport> {
    return this.http.patch<LocationReport>(`${this.api.baseUrl}/reports/${id}`, null, {
      params: { status, adminNotes: adminNotes || '' }
    }).pipe(
      tap(updated => {
        this.reports.update(list => list.map(r => r.id === id ? updated : r));
      })
    );
  }
}
