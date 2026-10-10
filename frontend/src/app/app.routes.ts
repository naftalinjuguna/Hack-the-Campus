import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout.component';
import { OverviewComponent } from './features/overview/overview.component';
import { CampusExplorerComponent } from './features/campus-explorer/campus-explorer.component';
import { LectureFinderComponent } from './features/lecture-finder/lecture-finder.component';
import { CampusServicesComponent } from './features/campus-services/campus-services.component';
import { AiAssistantComponent } from './features/ai-assistant/ai-assistant.component';
import { SavedPlacesComponent } from './features/saved-places/saved-places.component';
import { AdminPortalComponent } from './features/admin/admin-portal.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { path: 'explore-campus', component: CampusExplorerComponent },
      { path: 'find-a-lecture-hall', component: LectureFinderComponent },
      { path: 'campus-services', component: CampusServicesComponent },
      { path: 'ai-campus-assistant', component: AiAssistantComponent },
      { path: 'saved-places-and-routes', component: SavedPlacesComponent },
      { path: 'admin-portal', component: AdminPortalComponent }
    ]
  },
  { path: '**', redirectTo: 'overview' }
];
