import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Lecture } from '../models/models';
import { Observable, tap, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LectureService {
  private readonly defaultLectures: Lecture[] = [
    {
      id: 1,
      unitCode: 'CSC 311',
      unitName: 'Data Structures and Algorithms',
      lecturer: 'Dr. Ochieng',
      dayOfWeek: 'Monday',
      startTime: '10:00 AM',
      endTime: '12:00 PM',
      roomDescription: 'Siriba Campus Block B',
      timetableSource: 'SAMPLE TIMETABLE DATA',
      verified: true,
      estimatedMinutesWalk: 4,
      distanceMeters: 320
    },
    {
      id: 2,
      unitCode: 'CSC 312',
      unitName: 'Database Systems Implementation',
      lecturer: 'Prof. Wafula',
      dayOfWeek: 'Tuesday',
      startTime: '8:00 AM',
      endTime: '11:00 AM',
      roomDescription: 'Siriba Lecture Hall SLT 1',
      timetableSource: 'SAMPLE TIMETABLE DATA',
      verified: true,
      estimatedMinutesWalk: 6,
      distanceMeters: 450
    },
    {
      id: 3,
      unitCode: 'BIT 314',
      unitName: 'Network Administration & Security',
      lecturer: 'Dr. Anyango',
      dayOfWeek: 'Wednesday',
      startTime: '2:00 PM',
      endTime: '5:00 PM',
      roomDescription: 'Siriba Campus Block B',
      timetableSource: 'SAMPLE TIMETABLE DATA',
      verified: true,
      estimatedMinutesWalk: 4,
      distanceMeters: 320
    },
    {
      id: 4,
      unitCode: 'MAT 202',
      unitName: 'Linear Algebra II',
      lecturer: 'Dr. Otieno',
      dayOfWeek: 'Thursday',
      startTime: '11:00 AM',
      endTime: '1:00 PM',
      roomDescription: 'Siriba Lecture Hall SLT 2',
      timetableSource: 'SAMPLE TIMETABLE DATA',
      verified: true,
      estimatedMinutesWalk: 5,
      distanceMeters: 400
    }
  ];

  readonly lectures = signal<Lecture[]>(this.defaultLectures);
  readonly upcomingLecture = signal<Lecture>(this.defaultLectures[0]);

  constructor(private http: HttpClient, private api: ApiService) {
    this.fetchLectures();
  }

  fetchLectures(query?: string, day?: string): Observable<Lecture[]> {
    let params: any = {};
    if (query) params.q = query;
    if (day) params.day = day;

    return this.http.get<Lecture[]>(`${this.api.baseUrl}/lectures`, { params }).pipe(
      tap(data => {
        if (data && data.length > 0) {
          this.lectures.set(data);
          this.upcomingLecture.set(data[0]);
        }
      }),
      catchError(() => {
        let filtered = [...this.defaultLectures];
        if (day) filtered = filtered.filter(l => l.dayOfWeek?.toLowerCase() === day.toLowerCase());
        if (query) {
          const q = query.toLowerCase();
          filtered = filtered.filter(l =>
            l.unitCode.toLowerCase().includes(q) ||
            l.unitName.toLowerCase().includes(q) ||
            l.lecturer?.toLowerCase().includes(q)
          );
        }
        this.lectures.set(filtered);
        return of(filtered);
      })
    );
  }
}
