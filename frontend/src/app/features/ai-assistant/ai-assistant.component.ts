import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AiService } from '../../core/services/ai.service';
import { LocationService } from '../../core/services/location.service';
import { Location } from '../../core/models/models';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="px-space-lg py-space-lg w-full max-w-[1100px] mx-auto min-h-[calc(100vh-64px)] flex flex-col justify-between pb-space-lg">
      <!-- Header -->
      <div class="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-secondary-container text-primary flex items-center justify-center">
            <span class="material-symbols-outlined text-[24px]">auto_awesome</span>
          </div>
          <div class="flex flex-col">
            <h1 class="text-xl font-bold text-on-surface">CampusDinga AI Assistant</h1>
            <span class="text-xs text-slate-500">Grounded with Maseno University verified GIS floorplans & timetables</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold">
            <span class="w-2 h-2 rounded-full bg-surface-tint animate-pulse"></span>
            <span>Online</span>
          </span>
        </div>
      </div>

      <!-- Messages Scroll Area -->
      <div class="flex-1 overflow-y-auto py-6 flex flex-col gap-5">
        @for (msg of aiService.messages(); track msg.id) {
          <div
            [class.justify-end]="msg.sender === 'user'"
            [class.justify-start]="msg.sender === 'assistant'"
            class="flex items-start gap-3 max-w-[85%]"
            [class.self-end]="msg.sender === 'user'"
          >
            @if (msg.sender === 'assistant') {
              <div class="w-8 h-8 rounded-full bg-secondary-container text-primary flex items-center justify-center shrink-0 mt-1 shadow-sm">
                <span class="material-symbols-outlined text-[18px]">smart_toy</span>
              </div>
            }

            <div class="flex flex-col gap-2">
              <div
                [class.bg-primary]="msg.sender === 'user'"
                [class.text-white]="msg.sender === 'user'"
                [class.bg-white]="msg.sender === 'assistant'"
                [class.text-on-surface]="msg.sender === 'assistant'"
                [class.border]="msg.sender === 'assistant'"
                [class.border-slate-200]="msg.sender === 'assistant'"
                class="p-4 rounded-2xl shadow-sm text-sm leading-relaxed"
              >
                <p>{{ msg.text }}</p>

                <!-- Grounding Provider Badge -->
                @if (msg.sender === 'assistant' && msg.modelProvider) {
                  <div class="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span class="material-symbols-outlined text-[14px] text-primary">verified_user</span>
                    <span>Source: {{ msg.modelProvider }}</span>
                  </div>
                }
              </div>

              <!-- Suggested Venue Cards inside Assistant Message -->
              @if (msg.suggestedLocations && msg.suggestedLocations.length > 0) {
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  @for (loc of msg.suggestedLocations; track loc.id) {
                    <div class="p-3 bg-surface-container-low rounded-xl border border-slate-200 flex items-center justify-between gap-2 shadow-sm">
                      <div class="flex flex-col min-w-0">
                        <span class="font-bold text-xs text-on-surface truncate">{{ loc.name }}</span>
                        <span class="text-[10px] text-slate-500 truncate">{{ loc.buildingBlock }} • {{ loc.roomNumber }}</span>
                      </div>
                      <button
                        (click)="navigateTo(loc)"
                        class="px-2.5 py-1 bg-primary text-white text-[11px] font-semibold rounded-lg shrink-0 flex items-center gap-1 hover:bg-primary-container"
                        type="button"
                      >
                        <span>Navigate</span>
                        <span class="material-symbols-outlined text-[13px]">near_me</span>
                      </button>
                    </div>
                  }
                </div>
              }

              <!-- Follow up questions -->
              @if (msg.followUpQuestions && msg.followUpQuestions.length > 0) {
                <div class="flex flex-wrap gap-1.5 pt-1">
                  @for (q of msg.followUpQuestions; track q) {
                    <button
                      (click)="sendQuickPrompt(q)"
                      class="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition-colors"
                      type="button"
                    >
                      {{ q }}
                    </button>
                  }
                </div>
              }
            </div>
          </div>
        }

        @if (aiService.isThinking()) {
          <div class="flex items-center gap-2 text-xs text-slate-500 italic p-3 bg-white rounded-xl border border-slate-200 w-fit">
            <span class="material-symbols-outlined text-[16px] text-primary animate-spin">progress_activity</span>
            <span>Consulting Maseno University campus directories...</span>
          </div>
        }
      </div>

      <!-- Input Box & Quick Chips -->
      <div class="flex flex-col gap-3 pt-4 border-t border-[#E2E8F0]">
        <!-- Suggested Prompts Pills -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span class="text-[11px] text-slate-400 font-bold uppercase shrink-0">Try asking:</span>
          <button
            (click)="sendQuickPrompt('Where is the Computer Science department?')"
            class="text-xs bg-white hover:bg-surface-container px-3 py-1 rounded-full border border-slate-200 text-slate-700 whitespace-nowrap shadow-sm"
          >
            "Where is Computer Science?"
          </button>
          <button
            (click)="sendQuickPrompt('Where can I print my assignment right now?')"
            class="text-xs bg-white hover:bg-surface-container px-3 py-1 rounded-full border border-slate-200 text-slate-700 whitespace-nowrap shadow-sm"
          >
            "Where can I print documents?"
          </button>
          <button
            (click)="sendQuickPrompt('How do I get to the Library step-free?')"
            class="text-xs bg-white hover:bg-surface-container px-3 py-1 rounded-full border border-slate-200 text-slate-700 whitespace-nowrap shadow-sm"
          >
            "Step-free Library route"
          </button>
          <button
            (click)="sendQuickPrompt('Where is the Student Health Dispensary?')"
            class="text-xs bg-white hover:bg-surface-container px-3 py-1 rounded-full border border-slate-200 text-slate-700 whitespace-nowrap shadow-sm"
          >
            "Health Dispensary location"
          </button>
        </div>

        <!-- Chat Input Bar -->
        <div class="relative flex items-center bg-white rounded-xl shadow-md border border-[#E2E8F0] p-1.5 gap-2">
          <input
            [(ngModel)]="userInput"
            (keydown.enter)="sendMessage()"
            [disabled]="aiService.isThinking()"
            class="w-full bg-transparent px-4 py-2.5 text-sm text-on-surface placeholder:text-slate-400 focus:outline-none"
            placeholder="Ask a campus question (e.g. 'Where is SLT 1?', 'How do I reach the finance office?')..."
            type="text"
          />
          <button
            (click)="sendMessage()"
            [disabled]="aiService.isThinking() || !userInput.trim()"
            class="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-white font-semibold text-xs hover:bg-primary-container disabled:opacity-50 transition-all shrink-0 shadow-sm"
            type="button"
          >
            <span>Send</span>
            <span class="material-symbols-outlined text-[16px]">send</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class AiAssistantComponent {
  readonly aiService = inject(AiService);
  private readonly locationService = inject(LocationService);
  private readonly router = inject(Router);

  userInput = '';

  sendMessage() {
    if (!this.userInput.trim()) return;
    const q = this.userInput.trim();
    this.userInput = '';
    this.aiService.ask(q).subscribe();
  }

  sendQuickPrompt(prompt: string) {
    this.userInput = prompt.replace(/"/g, '');
    this.sendMessage();
  }

  navigateTo(loc: Location) {
    this.locationService.selectLocation(loc);
    this.router.navigate(['/explore-campus'], { queryParams: { locId: loc.id } });
  }
}
