# 📚 StudyFlow

StudyFlow is a modern, responsive, and multilingual study task manager designed to help students organize their study tasks, track progress, and stay productive.

The project is built with vanilla HTML, CSS, and JavaScript and is progressively evolving into a complete study productivity platform.

---

## ✨ Features

### 📋 Task Management

- ➕ Add study tasks
- ✅ Mark tasks as completed
- ↩️ Undo completed tasks
- 🗑️ Delete tasks
- 💾 Automatically save tasks using Local Storage
- 🔒 Safe DOM-based task rendering

### 🔎 Search & Filters

- 🔍 Search tasks instantly
- 📋 View all tasks
- ✅ View completed tasks
- ⏳ View remaining tasks
- ⚡ Instant filtering without page reload

### 📊 Progress Tracking

StudyFlow automatically displays:

- Total tasks
- Completed tasks
- Remaining tasks

Statistics update automatically whenever the task list changes.

---

## 🌍 Multilingual Interface

StudyFlow supports two languages:

- 🇬🇧 English
- 🇲🇦 العربية

### Language Features

- 🔄 Instant language switching
- ↔️ Automatic LTR / RTL layout
- 💾 Selected language is saved locally
- 📝 Translated interface labels
- 🔎 Translated placeholders and messages
- ♿ Accessible language controls

### Fonts

Each language uses a dedicated font for better readability:

**English**
- Inter

**Arabic**
- Cairo

---

## 🎨 User Interface

StudyFlow uses a modern SaaS-inspired interface combining:

- ✨ Glass-inspired surfaces
- 🪟 Liquid Glass-inspired visual elements
- 🌈 Soft gradients
- 🌓 Light and dark themes
- 🎯 Micro-interactions
- 🖱️ Hover states
- 👆 Active states
- ⌨️ Keyboard focus states
- 📱 Responsive layouts
- 🍎 Apple-inspired visual simplicity

The design focuses on keeping the interface clean and comfortable while adding modern visual effects.

---

## 🌙 Dark Mode

StudyFlow includes a persistent dark mode.

The selected theme is stored using Local Storage so the preference remains after refreshing the page.

Supported modes:

- ☀️ Light
- 🌙 Dark

The interface automatically updates colors, borders, surfaces, shadows, and interactive elements.

---

## ✨ Animations & Micro-interactions

The interface is designed with subtle animations rather than excessive motion.

Current and planned interaction effects include:

- Smooth theme transitions
- Button hover animations
- Button press feedback
- Card hover effects
- Task interaction animations
- Smooth UI state changes
- Language transition effects
- Reduced-motion support

Animations are designed to improve feedback without distracting the user.

---

## 📱 Responsive Design

StudyFlow is designed to work across:

- 📱 Smartphones
- 📲 Tablets
- 💻 Laptops
- 🖥️ Desktop computers

The layout automatically adapts to different screen sizes.

Special mobile optimizations include:

- Stacked task actions
- Full-width buttons
- Responsive statistics
- Mobile-friendly spacing
- Responsive filters
- Touch-friendly controls

---

## ♿ Accessibility

Accessibility is considered throughout the interface.

Current accessibility features include:

- Semantic HTML
- Proper labels
- Keyboard navigation
- Visible focus states
- `aria-label` attributes
- `aria-live` regions
- `aria-pressed` filter states
- Screen-reader-friendly controls
- Reduced-motion support
- RTL support for Arabic

---

## 💾 Data Storage

StudyFlow currently uses the browser's **Local Storage**.

No account or backend is required.

Tasks are stored locally on the user's device.

### Important

Clearing browser storage may remove saved tasks.

Future versions may introduce cloud synchronization and user accounts.

---

## 🛡️ Security

StudyFlow currently uses DOM APIs such as:

```javascript
textContent
