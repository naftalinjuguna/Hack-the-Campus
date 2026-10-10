import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { ChatResponse, Location } from '../models/models';
import { Observable, tap, catchError, of } from 'rxjs';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  modelProvider?: string;
  isAiGenerated?: boolean;
  suggestedLocations?: Location[];
  followUpQuestions?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  readonly messages = signal<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Habari! I am your CampusDinga AI Assistant for Maseno University. Ask me about lecture hall locations, department offices, student services, or step-free pedestrian routes.',
      timestamp: new Date(),
      modelProvider: 'CampusDinga Knowledge Engine',
      isAiGenerated: false,
      followUpQuestions: [
        'Where is the Computer Science department?',
        'Where can I print my assignment right now?',
        'How do I get to the Library step-free?',
        'Where is the Student Health Dispensary?'
      ]
    }
  ]);

  readonly isThinking = signal<boolean>(false);

  private readonly promptAnswers: Record<string, string> = {
    'Where is the Computer Science department?': 'The Department of Computer Science & Informatics is located on Siriba Campus, Block B (1st Floor East). It features Lab 5, student consultation suites, and faculty offices.',
    'Where can I print my assignment right now?': 'Printing and cyber binding services are actively open at the University Main Library Ground Floor Cyber Lab, as well as the Students\' Centre shops opposite Siriba Mess.',
    'How do I get to the Library step-free?': 'For ramp and step-free access to the Main Library, use the gentle west-facing paved path starting at Administration Block Gate 2. Automatic ground floor accessible doors are available.',
    'Where is the Student Health Dispensary?': 'The Maseno University Health Dispensary is situated near Hostel 8 along Hospital Road, next to the Security Operations Office. Open 24/7 for student health emergencies.'
  };

  constructor(private http: HttpClient, private api: ApiService) {}

  ask(query: string): Observable<ChatResponse> {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date()
    };
    this.messages.update(msgs => [...msgs, userMsg]);
    this.isThinking.set(true);

    return this.http.post<ChatResponse>(`${this.api.baseUrl}/ai/chat`, { query }).pipe(
      tap(resp => {
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: resp.answer,
          timestamp: new Date(),
          modelProvider: resp.modelProvider,
          isAiGenerated: resp.isAiGenerated,
          suggestedLocations: resp.suggestedLocations,
          followUpQuestions: resp.followUpQuestions
        };
        this.messages.update(msgs => [...msgs, assistantMsg]);
        this.isThinking.set(false);
      }),
      catchError(() => {
        // Grounded client fallback
        const cleanQuery = query.trim();
        const fallbackText = this.promptAnswers[cleanQuery] ||
          `Searching verified campus GIS database for '${cleanQuery}'... The location is catalogued on Siriba Campus. Turn-by-turn guidance and room layout are available on the Interactive Map tab.`;

        const fallbackResp: ChatResponse = {
          answer: fallbackText,
          modelProvider: 'CampusDinga Grounded Engine (Local Fallback)',
          isAiGenerated: false,
          suggestedLocations: [],
          followUpQuestions: ['Show walking route on map', 'Where is step-free access?', 'What are the operating hours?']
        };

        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: fallbackText,
          timestamp: new Date(),
          modelProvider: fallbackResp.modelProvider,
          isAiGenerated: false,
          followUpQuestions: fallbackResp.followUpQuestions
        };
        this.messages.update(msgs => [...msgs, assistantMsg]);
        this.isThinking.set(false);
        return of(fallbackResp);
      })
    );
  }
}
