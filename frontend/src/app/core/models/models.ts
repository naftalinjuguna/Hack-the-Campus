export type LocationCategory =
  | 'LECTURE_HALL'
  | 'ACADEMIC_DEPARTMENT'
  | 'ADMINISTRATIVE_OFFICE'
  | 'LIBRARY'
  | 'COMPUTER_LAB'
  | 'FOOD_AND_MESS'
  | 'STUDENT_SERVICES'
  | 'HEALTH_FACILITY'
  | 'HOSTEL'
  | 'PRINTING_AND_STATIONERY'
  | 'OTHER';

export type VerificationStatus = 'VERIFIED' | 'UNVERIFIED_DEMO' | 'PENDING_REVIEW';

export interface Location {
  id: number;
  name: string;
  slug: string;
  category: LocationCategory;
  campusArea: string;
  buildingBlock?: string;
  floorLevel?: string;
  roomNumber?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  availableFacilities?: string;
  openingHours?: string;
  openNow?: boolean;
  currentStatusLabel?: string;
  workstationsCount?: number;
  hasSolarBackupPower?: boolean;
  wheelchairAccessible?: boolean;
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Lecture {
  id: number;
  unitCode: string;
  unitName: string;
  lecturer?: string;
  dayOfWeek?: string;
  startTime?: string;
  endTime?: string;
  location?: Location;
  roomDescription?: string;
  timetableSource?: string;
  verified?: boolean;
  estimatedMinutesWalk?: number;
  distanceMeters?: number;
}

export interface CampusService {
  id: number;
  name: string;
  category: string;
  description?: string;
  location?: Location;
  operatingHours?: string;
  contactPhone?: string;
  contactEmail?: string;
  availableOptions?: string;
}

export interface RouteStep {
  stepNumber: number;
  instruction: string;
  detail?: string;
  distanceMeters: number;
  completed?: boolean;
}

export interface RouteResponse {
  originName: string;
  destinationName: string;
  totalDistanceMeters: number;
  estimatedMinutes: number;
  stepFree: boolean;
  summaryVia: string;
  steps: RouteStep[];
  pathCoordinates: number[][]; // [lat, lng]
  verifiedWalkingPath: boolean;
}

export interface ChatResponse {
  answer: string;
  modelProvider: string;
  isAiGenerated: boolean;
  suggestedLocations?: Location[];
  followUpQuestions?: string[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  course?: string;
  role: 'ROLE_STUDENT' | 'ROLE_ADMIN';
  token?: string;
}

export interface LocationReport {
  id?: number;
  location?: Location;
  locationName?: string;
  reporterName?: string;
  reporterEmail?: string;
  issueType: string;
  description: string;
  status?: string;
  adminNotes?: string;
  createdAt?: string;
}

export interface Bookmark {
  id: number;
  location: Location;
  createdAt: string;
}
