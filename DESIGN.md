---
name: Campus Navigation System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#404940'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#707a6f'
  outline-variant: '#bfc9bd'
  surface-tint: '#1f6c3a'
  primary: '#004c22'
  on-primary: '#ffffff'
  primary-container: '#166534'
  on-primary-container: '#93e0a2'
  inverse-primary: '#8bd79b'
  secondary: '#2e6a41'
  on-secondary: '#ffffff'
  secondary-container: '#b1f2be'
  on-secondary-container: '#347047'
  tertiary: '#004b1e'
  on-tertiary: '#ffffff'
  tertiary-container: '#00662b'
  on-tertiary-container: '#54e97d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a6f4b5'
  primary-fixed-dim: '#8bd79b'
  on-primary-fixed: '#00210b'
  on-primary-fixed-variant: '#005226'
  secondary-fixed: '#b1f2be'
  secondary-fixed-dim: '#96d5a3'
  on-secondary-fixed: '#00210d'
  on-secondary-fixed-variant: '#12512c'
  tertiary-fixed: '#6bff8f'
  tertiary-fixed-dim: '#4ae176'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005321'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-hero:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.005em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  caption:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xxs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

This design system delivers a high-utility, institutional wayfinding and operational platform tailored for university environments. Merging the data-dense utility of Linear with the spatial clarity of modern mapping platforms, it projects stability, precision, and frictionless utility. 

The aesthetic is functional, crisp, and uncluttered. It emphasizes reliable institutional navigation—helping students, faculty, and visitors traverse sprawling campus infrastructure under direct sunlight or in low-connectivity situations. The emotional tone avoids trendy academic novelty; it instills total trust through structured visual density, sharp information hierarchies, ultra-crisp line work, and accessible contrasts.

## Colors

The color palette centers on high-contrast institutional stability anchored by deep botanic greens and neutral slate substrates.

- **Primary (`#166534`)**: Primary institutional green. Applied to foundational interactive controls, focused states, and key navigational landmarks.
- **Secondary (`#14532D`)**: Deep forest tone. Reserved for active navigation waypoints, persistent status headers, and maximum-contrast structural anchors.
- **Tertiary Accent (`#22C55E`)**: Vibrant emerald. Used for live GPS tracking beacons, real-time campus shuttle statuses, open facility signals, and success alerts.
- **Neutral Core (`#64748B`)**: Secondary text, subtle metadata badges, non-active tab indicators, and contextual coordinate markers.
- **Canvas & Surface System**: Foundations sit on `#F8FAFC` (Canvas Slate) with primary floating modular sheets, panels, and route overlays utilizing `#FFFFFF`.
- **System Semantic Tones**: Critical alerts use `#EF4444`, campus advisories/delays use `#F59E0B` (Warning Amber), and auxiliary departmental links employ `#2563EB` (Informational Blue).
- **Structural Outlines**: All interactive and spatial containers leverage `#E2E8F0` for low-contrast definition without visual noise. Text defaults strictly to `#0F172A` (Dark Slate) for high legibility under outdoor ambient conditions.

## Typography

Typography prioritizes functional legibility, structural economy, and mechanical precision. The single-family integration of `Inter` avoids aesthetic distraction, providing deep numeric legibility for coordinates, lecture hall rooms, ETAs, and building IDs.

- **Headlines**: Tight negative tracking (`-0.01em` to `-0.02em`) ensures dense, purposeful typographic lockups that match modern productivity software.
- **Labels & Captions**: Shifted toward medium weights (`500`) with neutral to positive tracking to maintain high clarity at compact scale across navigation badges, map markers, and status chips.
- **Body Text**: Tuned for neutral presentation using standard tracking and calibrated line-heights to support route instructions and directory dossiers.

## Layout & Spacing

The layout operates on a strict 8px rhythmic grid with a base 4px sub-grid for high-density components (e.g., search dropdowns, waypoint cards, breadcrumbs).

- **Grid Architecture**: 
  - **Desktop (1024px+)**: A persistent multi-pane split layout. A 380px or 420px fixed floating contextual drawer/sidebar for route calculation and search, anchored over a full-bleed interactive map canvas.
  - **Tablet (768px - 1023px)**: A 12-column adaptive fluid grid or semi-collapsible panel overlay with `1.5rem` outer margins.
  - **Mobile (<768px)**: A map-first viewport with bottom-sheet drawer overlays (`margin: 1rem`) spanning 100% minus outer gutters, allowing thumb-driven one-handed route manipulation.
- **Rhythm Rules**: Internal container padding stays strictly at `space-md` (`1rem`) to keep interface footprint compact, reserving `space-lg` (`1.5rem`) exclusively for structural page headers and primary panel divisions.

## Elevation & Depth

Visual hierarchy uses a refined ambient elevation system. Surfaces stay grounded through low-contrast perimeter borders coupled with neutral, multi-stop drop shadows tinted with slate.

- **Level 0 (Flat)**: Map canvas background, table rows, and secondary layout containers. Border: `1px solid #E2E8F0`.
- **Level 1 (Card / Resting)**: Standard cards, building directory listings, search inputs. Border: `1px solid #E2E8F0`, Shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)`.
- **Level 2 (Floating Overlay / Hover)**: Hovered location cards, floating map utility controls (zoom, compass, layer toggles). Border: `1px solid #E2E8F0`, Shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`.
- **Level 3 (Interactive Drawer / Modal)**: Active route planning sidebars, bottom sheets, search autocomplete flyouts. Border: `1px solid #E2E8F0`, Shadow: `0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)`.
- **Level 4 (High Focus Waypoint)**: Selected destination pins and dynamic direction prompts. Shadow: `0 20px 25px -5px rgba(22, 101, 52, 0.12), 0 8px 10px -6px rgba(22, 101, 52, 0.08)`.

## Shapes

The interface implements a standardized `roundedness: 2` geometry, instilling a contemporary, tool-grade feel:

- **Base Radius (0.5rem / 8px)**: Applied to all standard buttons, search bars, inputs, list items, and standard cards.
- **Large Radius (1rem / 16px)**: Applied to floating overlay panels, bottom sheets, navigation summary modals, and campus map callouts.
- **Extra Large Radius (1.5rem / 24px)**: Applied to sheet corners on mobile devices.
- **Pill / Circular (9999px)**: Applied strictly to map control icon buttons (re-center, layers), status pill badges, live bus telemetry tags, and numeric waypoint pins.

## Components

### Buttons
- **Primary**: Background `#166534`, text `#FFFFFF`, border `1px solid #14532D`, border-radius `0.5rem`. Hover: `#14532D`. Focus-visible: outline `2px solid #22C55E` with `2px` offset.
- **Secondary / Subdued**: Background `#FFFFFF`, text `#0F172A`, border `1px solid #E2E8F0`, border-radius `0.5rem`. Hover: `#F8FAFC` and border `#CBD5E1`.
- **Ghost Utility**: Background transparent, text `#64748B`, border-radius `0.5rem`. Hover: `#F1F5F9`, text `#0F172A`.

### Input Fields & Search Bars
- Background `#FFFFFF`, border `1px solid #E2E8F0`, text `#0F172A`, placeholder `#94A3B8`, border-radius `0.5rem`, padding `0.5rem 0.75rem`.
- Active/Focus: Border `#166534`, box-shadow `0 0 0 1px #166534`.
- Fast search inputs feature dedicated left-aligned glyph slots (`16px`) and trailing shortcut keys styled as subtle slate badges (`#F1F5F9`).

### Waypoint & Navigation Cards
- Background `#FFFFFF`, border `1px solid #E2E8F0`, border-radius `0.5rem`, padding `1rem`.
- Interactive state features a hover translation of `0px` with border color transition to `#CBD5E1` and ambient elevation uplift.
- Active route step states feature a left-accent indicator border (`3px solid #166534`).

### Badges & Status Chips
- Height `24px`, padding `0 0.5rem`, border-radius `9999px`, font-size `12px`, weight `500`.
- **Live / Active (ETA, Shuttle Live)**: Background `#DCFCE7`, text `#14532D`, border `1px solid #BBF7D0`. Features a pulsing `6px` tertiary `#22C55E` dot.
- **Departmental Tag**: Background `#F1F5F9`, text `#475569`, border `1px solid #E2E8F0`.

### Selection Controls (Checkboxes & Radios)
- Checkboxes: `18px x 18px`, border `1.5px solid #CBD5E1`, border-radius `4px`. Checked state: background `#166534`, border `#166534`, check icon `#FFFFFF`.
- Radio buttons: `18px x 18px`, circular, border `1.5px solid #CBD5E1`. Selected state: border `#166534` with an inner `#166534` concentric dot (`8px`).

### Lists & Directories
- Clean linear rows with continuous separator lines (`1px solid #F1F5F9`).
- Hover states trigger a smooth background shift to `#F8FAFC`.
- Integrated layout includes left-aligned category icons inside soft rounded squares (`32px`, `#F0FDF4`, icon `#166534`), clear building metadata titles, and trailing walk-time estimates (`12px`, `#64748B`).