# Tweek Features Implementation Plan

## Current State Analysis
- ✅ Weekly view with Mon-Fri + Weekend layout
- ✅ Basic task management (create, edit, delete, complete)
- ✅ Drag & drop (desktop & mobile)
- ✅ 8 color options
- ✅ Rich text formatting
- ✅ File attachments (metadata only)
- ✅ LocalStorage persistence
- ✅ Mobile-optimized with gestures
- ✅ Multi-language support (EN, DA, KL)

## Features to Implement

---

## Phase 1: Core View Enhancements
**Priority:** High | **Complexity:** Medium | **Estimated Effort:** 3-4 days

### 1.1 Month View
**Description:** Calendar grid showing entire month with tasks

**Implementation:**
- [ ] Create month grid layout (7 columns x 5-6 rows)
- [ ] Show mini task indicators in each date cell
- [ ] Click date to expand and show full tasks
- [ ] Navigation: previous/next month, jump to today
- [ ] Show task count per day
- [ ] Color dots for different task colors
- [ ] Responsive design for mobile

**Files to modify:**
- `index.html` - Add month view container
- `script.js` - Add `renderMonth()`, month navigation
- `styles.css` - Month grid styles

**Testing:**
- [ ] Month displays correct dates for current month
- [ ] Navigation between months works
- [ ] Tasks appear in correct dates
- [ ] Clicking date shows tasks
- [ ] Mobile responsive layout
- [ ] Works across year boundaries (Dec→Jan)

### 1.2 Day View
**Description:** Single day focused view

**Implementation:**
- [ ] Full-screen single day layout
- [ ] Hour-based timeline (optional grid)
- [ ] All tasks for selected day
- [ ] Quick navigation to prev/next day
- [ ] Jump to today button
- [ ] Time slots (optional: 24-hour grid)

**Files to modify:**
- `index.html` - Add day view container
- `script.js` - Add `renderDay()`, day navigation
- `styles.css` - Day view styles

**Testing:**
- [ ] Day view shows correct date
- [ ] All tasks for that day appear
- [ ] Navigation prev/next works
- [ ] Can add/edit/delete tasks
- [ ] Switch back to week/month view
- [ ] Mobile optimized

### 1.3 View Switcher
**Description:** Toggle between Month/Week/Day views

**Implementation:**
- [ ] View switcher buttons in header
- [ ] Save current view preference to localStorage
- [ ] Smooth transitions between views
- [ ] Remember current date position when switching

**Files to modify:**
- `index.html` - Add view switcher UI
- `script.js` - Add view state management
- `styles.css` - Switcher styles

**Testing:**
- [ ] All three views accessible
- [ ] View preference persists
- [ ] Current date maintained across views
- [ ] Mobile-friendly switcher

### 1.4 Search Functionality
**Description:** Fast search through all tasks

**Implementation:**
- [ ] Search bar (swipe down or header button)
- [ ] Real-time search as you type
- [ ] Filter by color tags
- [ ] Show results with date context
- [ ] Click result to open task editor
- [ ] Highlight matching text
- [ ] Search across all dates + someday

**Files to modify:**
- `index.html` - Add search UI
- `script.js` - Add search algorithm, filtering
- `styles.css` - Search interface styles

**Testing:**
- [ ] Search finds tasks by text
- [ ] Color filter works
- [ ] Results update in real-time
- [ ] Clicking result opens task
- [ ] Clear/close search
- [ ] Works with special characters
- [ ] Fast performance with 100+ tasks

---

## Phase 2: Enhanced Task Features
**Priority:** High | **Complexity:** Medium | **Estimated Effort:** 4-5 days

### 2.1 Endless Colors
**Description:** Full color palette with custom colors

**Implementation:**
- [ ] Expand beyond 8 colors to full spectrum
- [ ] Color picker with HEX/RGB input
- [ ] Custom color sets (user-defined palettes)
- [ ] Save custom colors to localStorage
- [ ] Quick access to recent colors
- [ ] Default palette + custom palette tabs

**Files to modify:**
- `script.js` - Expand color system, custom color storage
- `styles.css` - Dynamic color generation
- `index.html` - Enhanced color picker

**Testing:**
- [ ] Can select any color
- [ ] Custom colors persist
- [ ] Task displays correct custom color
- [ ] Color picker UI works on mobile
- [ ] Performance with many custom colors

### 2.2 Subtasks
**Description:** Nested checklist within tasks

**Implementation:**
- [ ] Add subtask button in task popover
- [ ] Subtask list with checkboxes
- [ ] Create/edit/delete subtasks
- [ ] Show progress (e.g., "2/5 completed")
- [ ] Mark parent complete when all subtasks done (optional)
- [ ] Indent subtasks visually
- [ ] Drag to reorder subtasks

**Files to modify:**
- `script.js` - Extend task data model, subtask operations
- `index.html` - Subtask UI in popover
- `styles.css` - Subtask styling

**Testing:**
- [ ] Can add multiple subtasks
- [ ] Checkbox toggles work
- [ ] Progress indicator accurate
- [ ] Delete subtasks
- [ ] Reorder subtasks
- [ ] Data persists correctly

### 2.3 Enhanced Notes & Attachments
**Description:** Better note-taking and file handling

**Implementation:**
- [ ] Dedicated notes section in task (separate from title)
- [ ] Support for longer notes/descriptions
- [ ] Better file attachment UI
- [ ] Show file previews (images)
- [ ] Multiple file attachments
- [ ] Drag & drop files into task

**Files to modify:**
- `script.js` - Enhance attachment handling
- `index.html` - Notes textarea, file preview
- `styles.css` - Notes and attachment styles

**Testing:**
- [ ] Notes save separately from title
- [ ] Multiple files can be attached
- [ ] File preview displays
- [ ] Drag & drop files works
- [ ] Remove individual files

### 2.4 Share Task via Link
**Description:** Generate shareable links for individual tasks

**Implementation:**
- [ ] Generate unique URL for each task
- [ ] URL encodes task data (or uses short ID)
- [ ] View-only mode for shared tasks
- [ ] Copy link to clipboard
- [ ] QR code option (optional)
- [ ] No sign-up required to view

**Files to modify:**
- `script.js` - URL generation, task export
- `index.html` - Share button, view-only mode
- `styles.css` - Share UI

**Testing:**
- [ ] Link generation works
- [ ] Shared link opens task in view mode
- [ ] Copy to clipboard works
- [ ] Works across different browsers
- [ ] URL parameters parse correctly

---

## Phase 3: Advanced Scheduling
**Priority:** High | **Complexity:** High | **Estimated Effort:** 5-6 days

### 3.1 Recurring Tasks
**Description:** Tasks that repeat on schedules

**Implementation:**
- [ ] Recurrence options: daily, weekly, monthly, yearly, custom
- [ ] Custom recurrence builder (every X days/weeks/months)
- [ ] End date for recurrence (or never)
- [ ] Skip weekends option
- [ ] Edit single instance or all future instances
- [ ] Show recurrence icon on tasks
- [ ] Generate instances dynamically (don't store all)

**Files to modify:**
- `script.js` - Recurrence logic, instance generation
- `index.html` - Recurrence picker UI
- `styles.css` - Recurrence UI styles

**Testing:**
- [ ] Daily recurrence works
- [ ] Weekly on specific days
- [ ] Monthly on specific date
- [ ] Custom intervals work
- [ ] End dates respected
- [ ] Edit affects correct instances
- [ ] Performance with many recurring tasks

### 3.2 Reminders System
**Description:** Notifications for tasks

**Implementation:**
- [ ] Set reminder time for any task
- [ ] Multiple reminders per task
- [ ] Browser push notifications (Web Push API)
- [ ] Email reminders (requires backend service)
- [ ] Snooze functionality
- [ ] Reminder before due time (5min, 1hr, 1day, etc.)
- [ ] Sound/vibration options

**Files to modify:**
- `script.js` - Reminder scheduling, notification logic
- `index.html` - Reminder picker UI
- `styles.css` - Reminder UI

**Backend needed:**
- Email reminders require server or service (e.g., Firebase, Netlify Functions)

**Testing:**
- [ ] Push notifications appear on time
- [ ] Multiple reminders work
- [ ] Snooze works
- [ ] Notifications on mobile
- [ ] Permission request handled
- [ ] Works when browser closed (service worker)

### 3.3 Automate - Roll Unfinished Tasks
**Description:** Automatically move incomplete tasks to next day

**Implementation:**
- [ ] Settings toggle for auto-rollover
- [ ] Run daily at midnight or app open
- [ ] Only move incomplete tasks
- [ ] Option: keep copy in original day vs. move
- [ ] Notification of rolled tasks
- [ ] Exclude specific tasks from rollover (tag/setting)

**Files to modify:**
- `script.js` - Rollover logic, scheduling
- `index.html` - Settings for automation
- `styles.css` - Settings UI

**Testing:**
- [ ] Tasks roll over at correct time
- [ ] Only incomplete tasks move
- [ ] Settings persist
- [ ] Manual trigger works
- [ ] Recurring tasks handled correctly
- [ ] No duplicate tasks

---

## Phase 4: Customization & Themes
**Priority:** Medium | **Complexity:** Medium | **Estimated Effort:** 3-4 days

### 4.1 Theme System
**Description:** Multiple visual themes

**Implementation:**
- [ ] Define theme presets: white/paper, blue, dark, minimal
- [ ] CSS custom properties for theming
- [ ] Theme switcher in settings
- [ ] Save theme preference
- [ ] Smooth theme transitions
- [ ] Themes affect all UI elements

**Themes to create:**
- White/Paper (current default)
- Cold Blue
- Dark mode
- Minimal/Zen
- High contrast (accessibility)

**Files to modify:**
- `styles.css` - CSS custom properties, theme classes
- `script.js` - Theme switching logic
- `index.html` - Theme selector

**Testing:**
- [ ] All themes display correctly
- [ ] Theme preference persists
- [ ] All UI elements themed
- [ ] No color contrast issues
- [ ] Mobile themes work
- [ ] Print styles respect theme

### 4.2 Custom Color Sets
**Description:** User-defined color palettes

**Implementation:**
- [ ] Create custom color palette
- [ ] Name and save palettes
- [ ] Switch between palettes
- [ ] Share palettes (export/import)
- [ ] Default palette always available

**Files to modify:**
- `script.js` - Palette management
- `index.html` - Palette editor UI
- `styles.css` - Palette UI

**Testing:**
- [ ] Can create multiple palettes
- [ ] Switch between palettes
- [ ] Palettes persist
- [ ] Export/import works
- [ ] Delete custom palettes

---

## Phase 5: Collaboration & Sync
**Priority:** Medium | **Complexity:** Very High | **Estimated Effort:** 7-10 days

### 5.1 Multiple Calendars
**Description:** Separate calendars for different purposes

**Implementation:**
- [ ] Create multiple calendar instances
- [ ] Name each calendar
- [ ] Switch between calendars
- [ ] Color-code calendars
- [ ] Settings per calendar
- [ ] Merge view (show all calendars)
- [ ] Calendar list/sidebar

**Files to modify:**
- `script.js` - Multi-calendar data structure
- `index.html` - Calendar selector UI
- `styles.css` - Multi-calendar UI

**Testing:**
- [ ] Create multiple calendars
- [ ] Switch between calendars
- [ ] Tasks isolated per calendar
- [ ] Merge view shows all
- [ ] Delete calendars
- [ ] Data integrity maintained

### 5.2 Real-time Collaboration
**Description:** Share and collaborate with others

**Implementation:**
- [ ] Share calendar with others (view or edit)
- [ ] Real-time updates (WebSocket or polling)
- [ ] User presence indicators
- [ ] Conflict resolution
- [ ] Permission levels (view, edit, admin)
- [ ] Invite via link or email

**Backend required:**
- WebSocket server or Firebase Realtime Database
- User authentication system
- Permission management

**Files to modify:**
- `script.js` - WebSocket client, sync logic
- New: `auth.js` - Authentication
- `index.html` - Share/invite UI
- `styles.css` - Collaboration UI

**Testing:**
- [ ] Share link works
- [ ] Real-time updates appear
- [ ] Permissions enforced
- [ ] Conflict handling
- [ ] Multiple users simultaneously
- [ ] Network failure recovery

### 5.3 Publish Calendar to Web
**Description:** Public read-only calendar view

**Implementation:**
- [ ] Generate public URL
- [ ] Embeddable widget
- [ ] View-only mode
- [ ] No sign-up to view
- [ ] Customize public view (hide completed, etc.)

**Files to modify:**
- `script.js` - Public view generation
- New: `public-view.html` - Public template
- `styles.css` - Public view styles

**Testing:**
- [ ] Public URL accessible
- [ ] View-only enforced
- [ ] Embed code works
- [ ] Updates reflect in public view
- [ ] Customization options work

### 5.4 Calendar Sync (Google, Apple)
**Description:** Two-way sync with external calendars

**Implementation:**
- [ ] Google Calendar API integration
- [ ] Apple Calendar (CalDAV) integration
- [ ] Two-way sync (import + export)
- [ ] Conflict resolution
- [ ] Select which calendars to sync
- [ ] Sync interval settings
- [ ] OAuth authentication

**Backend required:**
- OAuth flow handling
- API proxy (hide API keys)
- Sync service

**Files to modify:**
- New: `sync.js` - Sync logic
- `script.js` - Integration hooks
- `index.html` - Sync settings UI
- `styles.css` - Sync UI

**Testing:**
- [ ] Google Calendar auth works
- [ ] Import events from Google
- [ ] Export tasks to Google
- [ ] Two-way sync maintains data
- [ ] Apple Calendar sync works
- [ ] Siri integration (Apple Reminders)
- [ ] Handles sync conflicts

---

## Implementation Order

### Recommended Sequence:
1. **Phase 1** - Core Views (Month/Day/Search)
2. **Phase 2** - Enhanced Tasks (Subtasks, Colors, Notes)
3. **Phase 4** - Themes (visual enhancement, easier than Phase 3)
4. **Phase 3** - Advanced Scheduling (Recurring, Reminders, Automate)
5. **Phase 5** - Collaboration (requires backend)

### Testing Strategy per Phase:
1. **Unit Testing:** Test individual functions
2. **Integration Testing:** Test feature interactions
3. **User Testing:** Manual testing of workflows
4. **Cross-browser:** Chrome, Firefox, Safari, Edge
5. **Mobile Testing:** iOS Safari, Chrome Mobile
6. **Performance:** Test with 500+ tasks
7. **Accessibility:** Screen readers, keyboard nav

---

## Technical Considerations

### Backend Services Needed:
- **Phase 3 (Reminders):** Email service (optional)
- **Phase 5 (Collaboration):**
  - WebSocket server or Firebase
  - User authentication
  - Database (PostgreSQL, MongoDB, or Firebase)
  - API proxy for calendar sync

### Storage Migration:
- Current: localStorage only
- Future: localStorage + Backend sync
- Migration path needed for existing users

### Performance Targets:
- Page load: < 1 second
- View switching: < 200ms
- Search results: < 100ms
- Render 100 tasks: < 500ms

### Browser APIs to Add:
- Web Push API (notifications)
- Service Worker (offline, background sync)
- Web Share API (already using)
- Calendar API (if available)
- Notification API

---

## Risk Assessment

### Low Risk:
- Phase 1: Views and Search
- Phase 2: Enhanced task features
- Phase 4: Themes

### Medium Risk:
- Phase 3: Reminders (browser compatibility)
- Multiple calendars (data complexity)

### High Risk:
- Real-time collaboration (backend complexity)
- Calendar sync (API changes, OAuth)
- Email reminders (deliverability)

---

## Success Criteria

### Phase 1:
- Users can switch between Month/Week/Day views
- Search finds tasks instantly
- Mobile-optimized

### Phase 2:
- Tasks support subtasks and rich notes
- Unlimited custom colors
- Share individual tasks

### Phase 3:
- Recurring tasks generate correctly
- Reminders notify on time
- Auto-rollover works reliably

### Phase 4:
- 5+ themes available
- Custom themes can be created
- Theme switching is smooth

### Phase 5:
- Multiple calendars work independently
- Real-time collaboration syncs
- Google/Apple Calendar sync works

---

## Next Steps

1. Review and approve this plan
2. Set up testing framework
3. Begin Phase 1 implementation
4. Test each feature before moving to next
5. Iterate based on feedback
