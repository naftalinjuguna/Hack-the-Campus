import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { RouteResponse } from '../models/models';
import { Observable, tap, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private readonly defaultRoute: RouteResponse = {
    originName: 'Student Square Fountain',
    destinationName: 'Computer Laboratory 5 (Lab 5)',
    totalDistanceMeters: 320,
    estimatedMinutes: 4,
    stepFree: true,
    summaryVia: 'Via Siriba Quadrangle & Computing East Ramp',
    verifiedWalkingPath: true,
    pathCoordinates: [
      [-0.0052, 34.6008],
      [-0.0048, 34.6010],
      [-0.0042, 34.6012],
      [-0.0038, 34.6018],
      [-0.0035, 34.6022]
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Depart Student Square Fountain',
        detail: 'Head North along the central paved corridor (80m)',
        distanceMeters: 80
      },
      {
        stepNumber: 2,
        instruction: 'Turn right onto Siriba Quadrangle',
        detail: 'Cross past Main Library entrance toward Computing (140m)',
        distanceMeters: 140
      },
      {
        stepNumber: 3,
        instruction: 'Enter School of Computing Block B',
        detail: 'Take the East accessible wheelchair ramp to Floor 1 (100m)',
        distanceMeters: 100
      },
      {
        stepNumber: 4,
        instruction: 'Arrive at Computer Lab 5',
        detail: 'Door is immediately to your left (Room B-104)',
        distanceMeters: 0
      }
    ]
  };

  readonly activeRoute = signal<RouteResponse>(this.defaultRoute);
  readonly isNavigating = signal<boolean>(true);

  constructor(private http: HttpClient, private api: ApiService) {}

  getDirections(originId?: number, destinationId?: number, stepFree: boolean = true): Observable<RouteResponse> {
    const params: any = { stepFree };
    if (originId) params.originId = originId;
    if (destinationId) params.destinationId = destinationId;

    return this.http.get<RouteResponse>(`${this.api.baseUrl}/navigation/directions`, { params }).pipe(
      tap(route => {
        this.activeRoute.set(route);
        this.isNavigating.set(true);
      }),
      catchError(() => {
        this.activeRoute.set(this.defaultRoute);
        this.isNavigating.set(true);
        return of(this.defaultRoute);
      })
    );
  }
}
