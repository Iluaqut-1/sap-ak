# Testing Guide

## Pre-Implementation Testing (Current Features)

### Test Environment Setup
1. Open `index.html` in a modern browser (Chrome, Firefox, Safari, Edge)
2. Open browser DevTools Console (F12)
3. Clear localStorage before testing: `localStorage.clear()`

---

## Current Feature Tests

### ✅ Test 1: Basic Task Creation
**Steps:**
1. Click on any day column
2. Type "Test Task 1"
3. Press Enter

**Expected:**
- Task appears in the day
- Task is saved to localStorage
- Task has default color

**Pass/Fail:** ___

---

### ✅ Test 2: Task Editing
**Steps:**
1. Create a task
2. Click on the task
3. Modify the text in popover
4. Click outside to close

**Expected:**
- Task popover opens
- Text changes are saved
- Changes persist after page reload

**Pass/Fail:** ___

---

### ✅ Test 3: Color Coding
**Steps:**
1. Create a task
2. Open task popover
3. Select different color

**Expected:**
- Color picker shows 8 colors
- Task color changes immediately
- Color persists

**Pass/Fail:** ___

---

### ✅ Test 4: Drag & Drop (Desktop)
**Steps:**
1. Create tasks in different days
2. Drag task from one day to another
3. Drop it

**Expected:**
- Ghost element appears during drag
- Task moves to new day
- Changes save to localStorage

**Pass/Fail:** ___

---

### ✅ Test 5: Mobile Swipe Gestures
**Steps:**
1. Open on mobile device or use DevTools mobile emulation
2. Create a task
3. Swipe left on task (delete)
4. Swipe right on task (complete)

**Expected:**
- Swipe left deletes task
- Swipe right marks complete
- Haptic feedback on supported devices

**Pass/Fail:** ___

---

### ✅ Test 6: Task Completion
**Steps:**
1. Create a task
2. Click checkmark button

**Expected:**
- Task shows completed state (bottom bar)
- Can be uncompleted
- State persists

**Pass/Fail:** ___

---

### ✅ Test 7: Task Deletion
**Steps:**
1. Create a task
2. Click delete (X) button

**Expected:**
- Task is removed
- Changes persist

**Pass/Fail:** ___

---

### ✅ Test 8: Rich Text Formatting
**Steps:**
1. Create a task
2. Open popover
3. Select text and click Bold
4. Select text and click Italic

**Expected:**
- Text becomes bold/italic
- Formatting saves
- Displays correctly in task list

**Pass/Fail:** ___

---

### ✅ Test 9: Week Navigation
**Steps:**
1. Click "Next Week" arrow
2. Click "Previous Week" arrow
3. Note the month/year display

**Expected:**
- Week changes correctly
- Dates update
- Tasks for those dates load
- Month/year updates across boundaries

**Pass/Fail:** ___

---

### ✅ Test 10: Someday Section
**Steps:**
1. Create a task in a day
2. Open task popover
3. Click "Move" → "Someday"

**Expected:**
- Task moves to Someday section
- Can move back to a day
- Persists

**Pass/Fail:** ___

---

### ✅ Test 11: Language Switching
**Steps:**
1. Click menu (three dots)
2. Select different language (DA or KL)

**Expected:**
- UI translates to new language
- Day names change
- Preference saves

**Pass/Fail:** ___

---

### ✅ Test 12: Mobile Drag & Drop
**Steps:**
1. Use mobile device or emulation
2. Long-press a task
3. Drag to another day
4. Release

**Expected:**
- Ghost element appears
- Haptic feedback
- Task moves to new day
- No ghosting artifacts

**Pass/Fail:** ___

---

### ✅ Test 13: Task Cloning
**Steps:**
1. Create a task
2. Click clone icon (⋮⋮)

**Expected:**
- Duplicate task created
- Same properties (color, text)
- Both tasks editable independently

**Pass/Fail:** ___

---

### ✅ Test 14: File Attachments
**Steps:**
1. Create a task
2. Open popover
3. Click file icon
4. Select a file

**Expected:**
- File metadata appears
- File name and size shown
- Can remove file
- (Note: actual file not stored)

**Pass/Fail:** ___

---

### ✅ Test 15: Responsive Layout
**Steps:**
1. Resize browser to different widths:
   - Desktop (>1024px)
   - Tablet (768-1024px)
   - Mobile (<768px)
   - Small mobile (<480px)

**Expected:**
- Layout adapts correctly
- Grid columns adjust
- All features accessible
- No horizontal scroll

**Pass/Fail:** ___

---

### ✅ Test 16: Data Persistence
**Steps:**
1. Create several tasks in different days
2. Close browser tab
3. Reopen `index.html`

**Expected:**
- All tasks reload
- Same colors, positions
- Same completed states

**Pass/Fail:** ___

---

### ✅ Test 17: Print Functionality
**Steps:**
1. Create tasks
2. Click menu → Print
3. View print preview

**Expected:**
- Print-friendly layout
- Tasks visible
- No UI buttons in print

**Pass/Fail:** ___

---

### ✅ Test 18: Share Functionality
**Steps:**
1. Click menu → Share
2. Use browser share dialog

**Expected:**
- Share dialog opens
- Can share via available methods
- (Note: browser dependent)

**Pass/Fail:** ___

---

## Performance Tests

### ⚡ Test P1: Load Time
**Steps:**
1. Clear cache
2. Reload page
3. Measure time to interactive

**Expected:**
- < 1 second initial load
- Immediate interactivity

**Result:** ___ ms

---

### ⚡ Test P2: Rendering Many Tasks
**Steps:**
1. Create 50+ tasks
2. Navigate between weeks
3. Switch days

**Expected:**
- Smooth rendering
- No lag
- Fast navigation

**Result:** Pass/Fail ___

---

### ⚡ Test P3: localStorage Limits
**Steps:**
1. Check current storage usage
2. Create 500+ tasks
3. Monitor performance

**Expected:**
- Storage within 5MB limit
- Performance stable

**Result:** ___ KB used

---

## Cross-Browser Tests

### 🌐 Chrome
- All features: ___
- Drag & drop: ___
- Mobile emulation: ___

### 🌐 Firefox
- All features: ___
- Drag & drop: ___

### 🌐 Safari
- All features: ___
- iOS Safari: ___
- Touch events: ___

### 🌐 Edge
- All features: ___

---

## Accessibility Tests

### ♿ Test A1: Keyboard Navigation
**Steps:**
1. Use Tab to navigate
2. Use Enter/Escape keys
3. Navigate without mouse

**Expected:**
- Can navigate to all elements
- Popover closes with Escape
- Forms submit with Enter

**Pass/Fail:** ___

---

### ♿ Test A2: Screen Reader
**Steps:**
1. Enable screen reader
2. Navigate through app

**Expected:**
- ARIA labels read correctly
- Buttons announced
- Task content readable

**Pass/Fail:** ___

---

### ♿ Test A3: Reduced Motion
**Steps:**
1. Enable reduced motion preference
2. Use app features

**Expected:**
- Animations disabled
- Still functional
- No jarring transitions

**Pass/Fail:** ___

---

## Bug Testing

### 🐛 Edge Cases

#### Edge Case 1: Year Boundary
- [ ] Navigate from Dec 2025 → Jan 2026
- [ ] Tasks in correct dates
- [ ] No date errors

#### Edge Case 2: Empty States
- [ ] No tasks in a day
- [ ] No tasks in Someday
- [ ] Empty week

#### Edge Case 3: Special Characters
- [ ] Create task with emoji
- [ ] Create task with HTML tags
- [ ] Create task with quotes/apostrophes

#### Edge Case 4: Long Text
- [ ] Create task with 1000+ characters
- [ ] Formatting with long text
- [ ] Display in list view

#### Edge Case 5: Multiple Quick Actions
- [ ] Create multiple tasks rapidly
- [ ] Delete multiple tasks rapidly
- [ ] Drag multiple tasks quickly

---

## Phase 1 Pre-Implementation Checklist

Before starting Phase 1 implementation, verify:

- [ ] All current features pass tests
- [ ] No console errors
- [ ] localStorage working correctly
- [ ] Mobile gestures functional
- [ ] Cross-browser compatible
- [ ] Code is readable and documented
- [ ] Git branch is clean

---

## Testing After Each Phase

### After Phase 1 (Views & Search):
- [ ] Month view displays correctly
- [ ] Day view functional
- [ ] View switching smooth
- [ ] Search finds tasks accurately
- [ ] All old features still work
- [ ] No regressions

### After Phase 2 (Enhanced Tasks):
- [ ] Subtasks work
- [ ] Custom colors save
- [ ] Notes separate from title
- [ ] Share links work
- [ ] All old features still work

### After Phase 3 (Scheduling):
- [ ] Recurring tasks generate correctly
- [ ] Reminders notify on time
- [ ] Auto-rollover works
- [ ] All old features still work

### After Phase 4 (Themes):
- [ ] All themes display correctly
- [ ] Theme switching smooth
- [ ] Custom palettes work
- [ ] All old features still work

### After Phase 5 (Sync):
- [ ] Multiple calendars work
- [ ] Collaboration syncs
- [ ] Calendar sync works
- [ ] All old features still work

---

## Automated Testing (Future)

Consider adding:
- Jest for unit tests
- Playwright for E2E tests
- Lighthouse for performance
- axe for accessibility

---

## Test Results Log

### Test Date: ___________
### Tester: ___________
### Browser: ___________
### OS: ___________

**Summary:**
- Tests Passed: ___ / ___
- Tests Failed: ___ / ___
- Bugs Found: ___

**Notes:**
_______________________________________________
_______________________________________________
_______________________________________________
