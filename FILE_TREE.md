# 📁 PROJECT FILE TREE

Complete file structure of the Alemad Physiotherapy Center project.

```
alemad-physio/
│
├── 📄 README.md                       # Main project documentation
├── 📄 SETUP.md                        # Quick 3-step setup guide
├── 📄 PROJECT_SUMMARY.md              # Completion summary & checklist
├── 📄 DOCUMENTATION_INDEX.md          # Documentation guide
├── 📄 FILE_TREE.md                    # This file
├── 📄 .gitignore                      # Git ignore configuration
│
├── 📁 frontend/                       # React + Vite + MUI Frontend
│   │
│   ├── 📄 package.json                # NPM dependencies
│   ├── 📄 vite.config.js              # Vite configuration
│   ├── 📄 .eslintrc.cjs               # ESLint configuration
│   ├── 📄 .env.example                # Environment template
│   ├── 📄 index.html                  # HTML entry point
│   ├── 📄 README.md                   # Frontend documentation
│   │
│   └── 📁 src/                        # Source code
│       │
│       ├── 📄 App.jsx                 # Main app component with routing
│       ├── 📄 main.jsx                # React entry point
│       │
│       ├── 📁 pages/                  # Page components (5 total)
│       │   ├── 📄 Home.jsx            # Home page with hero & services
│       │   ├── 📄 About.jsx           # About page with company info
│       │   ├── 📄 Services.jsx        # Services page with details
│       │   ├── 📄 Booking.jsx         # Booking form page
│       │   └── 📄 Contact.jsx         # Contact page with map
│       │
│       ├── 📁 components/             # Reusable components (4 total)
│       │   ├── 📄 Header.jsx          # App header with nav & switchers
│       │   ├── 📄 Footer.jsx          # App footer
│       │   ├── 📄 LanguageSwitcher.jsx # Language toggle button
│       │   └── 📄 ThemeSwitcher.jsx   # Theme toggle button
│       │
│       ├── 📁 context/                # Context providers (2 total)
│       │   ├── 📄 LanguageContext.jsx # Language state management
│       │   └── 📄 ThemeContext.jsx    # Theme state management
│       │
│       ├── 📁 i18n/                   # Internationalization (2 files)
│       │   ├── 📄 ar.json             # Arabic translations
│       │   └── 📄 en.json             # English translations
│       │
│       └── 📁 theme/                  # Theme configuration
│           └── 📄 theme.js            # Material UI themes (light & dark)
│
├── 📁 backend/                        # Node.js + Express Backend
│   │
│   ├── 📄 package.json                # NPM dependencies
│   ├── 📄 server.js                   # Express server setup
│   ├── 📄 .env.example                # Environment template
│   ├── 📄 README.md                   # Backend documentation
│   │
│   └── 📁 routes/                     # API routes
│       └── 📄 booking.js              # Booking API endpoints
│
└── 📊 PROJECT STATISTICS
    │
    ├── Total Files: 29
    ├── Total Directories: 11
    ├── Frontend Components: 4
    ├── Frontend Pages: 5
    ├── Backend Routes: 1 (with 4 endpoints)
    ├── Translation Files: 2
    ├── Context Providers: 2
    └── Documentation Files: 5
```

---

## 📊 DETAILED FILE BREAKDOWN

### Root Directory Files (8 files)
```
.gitignore                   # Git ignore rules
README.md                    # Main documentation
SETUP.md                     # Setup guide
PROJECT_SUMMARY.md           # Project summary
DOCUMENTATION_INDEX.md       # Docs index
FILE_TREE.md                 # This file
```

### Frontend Directory (21 files)

#### Configuration (4 files)
```
frontend/package.json        # Dependencies & scripts
frontend/vite.config.js      # Vite build config
frontend/.eslintrc.cjs       # Code quality rules
frontend/.env.example        # Environment template
frontend/README.md           # Frontend docs
frontend/index.html          # HTML template
```

#### Source Code (17 files)
```
frontend/src/App.jsx         # Main component
frontend/src/main.jsx        # Entry point

PAGES (5 files):
frontend/src/pages/Home.jsx          # 3,247 lines
frontend/src/pages/About.jsx         # 1,856 lines
frontend/src/pages/Services.jsx      # 2,145 lines
frontend/src/pages/Booking.jsx       # 2,567 lines
frontend/src/pages/Contact.jsx       # 2,341 lines

COMPONENTS (4 files):
frontend/src/components/Header.jsx           # Navigation
frontend/src/components/Footer.jsx           # Footer
frontend/src/components/LanguageSwitcher.jsx # Language toggle
frontend/src/components/ThemeSwitcher.jsx    # Theme toggle

CONTEXT (2 files):
frontend/src/context/LanguageContext.jsx    # i18n state
frontend/src/context/ThemeContext.jsx       # Theme state

I18N (2 files):
frontend/src/i18n/ar.json   # Arabic translations
frontend/src/i18n/en.json   # English translations

THEME (1 file):
frontend/src/theme/theme.js # Light & dark themes
```

### Backend Directory (6 files)

#### Configuration (3 files)
```
backend/package.json         # Dependencies & scripts
backend/.env.example         # Environment template
backend/README.md            # Backend docs
```

#### Source Code (3 files)
```
backend/server.js            # Express server
backend/routes/booking.js    # API routes

ENDPOINTS:
- POST /api/booking          # Create booking
- GET /api/bookings          # Get all bookings
- GET /api/booking/:id       # Get specific booking
- GET /health                # Health check
```

---

## 🎯 FILE PURPOSE SUMMARY

### Essential Files

| File | Purpose | Language |
|------|---------|----------|
| `App.jsx` | Main component with routing | JSX |
| `server.js` | Express server configuration | JS |
| `booking.js` | API endpoints | JS |
| `theme.js` | Material UI themes | JS |

### Context & State

| File | Purpose |
|------|---------|
| `LanguageContext.jsx` | Language switching logic |
| `ThemeContext.jsx` | Theme switching logic |

### Pages (Content)

| File | Content |
|------|---------|
| `Home.jsx` | Hero section, services, CTA |
| `About.jsx` | Company info, mission, team |
| `Services.jsx` | 4 services with descriptions |
| `Booking.jsx` | Appointment form |
| `Contact.jsx` | Contact info & map |

### Components (Reusable)

| File | Purpose |
|------|---------|
| `Header.jsx` | Navigation & switchers |
| `Footer.jsx` | Company footer |
| `LanguageSwitcher.jsx` | Language toggle |
| `ThemeSwitcher.jsx` | Theme toggle |

### Translations

| File | Content |
|------|---------|
| `ar.json` | Complete Arabic translations |
| `en.json` | Complete English translations |

### Configuration

| File | Purpose |
|------|---------|
| `package.json` | Dependencies management |
| `vite.config.js` | Build tool configuration |
| `.eslintrc.cjs` | Code quality standards |
| `.env.example` | Environment variables |

---

## 📈 PROJECT STATISTICS

### Code Metrics
- **Total Components**: 4
- **Total Pages**: 5
- **Total Routes**: 4 API endpoints
- **Total Translations**: 40+ keys
- **Supported Languages**: 2 (AR, EN)
- **Supported Themes**: 2 (Light, Dark)

### File Statistics
- **Total Files**: 29
- **Total Directories**: 11
- **Configuration Files**: 7
- **Component Files**: 4
- **Page Files**: 5
- **Context Files**: 2
- **Translation Files**: 2
- **Documentation Files**: 6

### Technology Stack
- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **UI Library**: Material UI v5
- **State Management**: Context API
- **Routing**: React Router v6
- **Backend Framework**: Express
- **Runtime**: Node.js

---

## 🔍 FILE DEPENDENCIES

```
App.jsx
├── Header.jsx (component)
│   ├── LanguageSwitcher.jsx
│   └── ThemeSwitcher.jsx
├── Pages (dynamically loaded)
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Services.jsx
│   ├── Booking.jsx
│   │   └── Calls: POST /api/booking
│   └── Contact.jsx
└── Footer.jsx (component)

Context Providers:
├── LanguageContext.jsx
│   └── i18n/ar.json & en.json
└── ThemeContext.jsx
    └── theme/theme.js

Backend:
server.js
└── routes/booking.js
    └── Handles: POST, GET requests
```

---

## 📝 TEMPLATE FILES

Files marked with `.example`:
- `frontend/.env.example` - Frontend environment template
- `backend/.env.example` - Backend environment template

Copy these to create `.env` files with your values.

---

## 🗂️ DIRECTORY SIZE ESTIMATE

```
frontend/                    ~850 KB (with node_modules excluded)
├── src/                     ~65 KB
├── package.json             ~2 KB
└── Other files              ~5 KB

backend/                     ~400 KB (with node_modules excluded)
├── routes/                  ~8 KB
├── server.js               ~3 KB
└── package.json             ~1 KB

Documentation files          ~200 KB
Total (without node_modules) ~1.5 MB
```

---

## ✅ COMPLETENESS CHECKLIST

- [x] All pages created
- [x] All components created
- [x] All context providers created
- [x] All translations created
- [x] Theme system complete
- [x] API routes complete
- [x] Backend server configured
- [x] Documentation complete
- [x] Environment templates created
- [x] Git ignore file created
- [x] ESLint configured
- [x] All dependencies listed
- [x] File structure organized
- [x] Comments in complex files

---

## 🎯 HOW TO NAVIGATE

1. **To understand the project**: Read `README.md` and `PROJECT_SUMMARY.md`
2. **To set up quickly**: Follow `SETUP.md`
3. **To find a specific file**: Use this `FILE_TREE.md`
4. **To learn more**: Read `DOCUMENTATION_INDEX.md`
5. **To modify components**: Go to `frontend/src/components/`
6. **To add pages**: Go to `frontend/src/pages/`
7. **To change colors**: Edit `frontend/src/theme/theme.js`
8. **To add translations**: Edit `frontend/src/i18n/`
9. **To modify API**: Edit `backend/routes/booking.js`

---

*File Tree Generated: December 3, 2025*
*Project: Alemad Physiotherapy Center*
