# KUSHAL MULTI SPECIALITY HOSPITAL — Management System

A complete, premium, fully-functional **Hospital Management System** for a multi-speciality hospital. Built with vanilla HTML/CSS/JavaScript for the frontend, Node.js + Express for the backend, and MySQL for the database.

The frontend runs entirely in the browser and includes a **Demo Mode** (LocalStorage) so it can be demonstrated without the backend — perfect for GitHub Pages, project demos, and college submissions.

---

## Features

- **Premium UI** — glassmorphism, gradient cards, animated stats, charts, dark/light mode
- **Authentication** — JWT login, bcrypt hashing, 7 roles, role-based menu
- **Patients** — unlimited patients, auto-generated IDs, photo upload, search, filter, sort, pagination, CSV export, print, full CRUD, medical timeline, document upload
- **Doctors** — unlimited doctors, auto-generated IDs, photo upload, search, specializations, professional profiles, document upload
- **Appointments** — book, reschedule, cancel, filter by date/status
- **Departments** — 27 pre-loaded specialities, add/edit/delete
- **Operations** — schedule surgeries, track status, operation theatres
- **Laboratory** — add tests, upload reports, assign patient/doctor
- **Pharmacy** — medicine inventory, low-stock/expiry alerts, stock status
- **Billing** — invoices with GST, insurance, discount, auto-computed totals, printable bills
- **Staff** — manage all hospital staff by role
- **Reports** — 8 report types, CSV export, department & revenue charts
- **Notifications** — in-app notification centre
- **Responsive** — mobile, tablet, desktop with collapsible sidebar and card-view tables

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript, Font Awesome, Google Fonts |
| Backend | Node.js, Express.js, JWT, bcrypt, Multer, CORS |
| Database | MySQL 8.0+ |
| API | RESTful JSON API |

---

## Project Structure

```
Kushal-Multi-Speciality-Hospital/
├── index.html              # Redirects to login
├── login.html
├── register.html
├── dashboard.html
├── patients.html / add-patient.html / patient-details.html
├── doctors.html / add-doctor.html / doctor-details.html
├── appointments.html
├── departments.html
├── operations.html
├── laboratory.html
├── pharmacy.html
├── billing.html
├── staff.html
├── reports.html
├── profile.html
├── settings.html
├── notifications.html
├── css/                     # 11 CSS files (theme, buttons, forms, tables, etc.)
├── js/                      # 14 JS modules (config, api, auth, storage, etc.)
├── server/                  # Express backend
│   ├── server.js / app.js
│   ├── config/ middleware/ controllers/ models/ routes/
│   └── uploads/
├── database/                # MySQL scripts
│   ├── hospital.sql (master)
│   ├── schema.sql
│   ├── sample-data.sql
│   ├── advanced-queries.sql  (22 verified queries)
│   ├── views.sql
│   ├── procedures.sql
│   └── triggers.sql
├── postman/                 # Postman collection
├── docs/                    # AI dev log, standup log
└── README.md
```

---

## Installation

### Frontend (Demo Mode — no backend needed)

1. Open `login.html` in any browser, **or**
2. Host the folder on GitHub Pages / VS Code Live Server
3. Click **Demo Login** (admin@kmsh.in / admin123)

The app automatically detects whether the backend is available. If not, it uses **Demo Mode** with LocalStorage — all data persists across refreshes.

### Backend setup

```bash
cd server
npm install
cp .env.example .env       # edit DB credentials + JWT secret
npm run dev                 # starts on http://localhost:5000
```

### Database setup

```bash
mysql -u root -p < database/hospital.sql
```

Or run the files individually:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/sample-data.sql
mysql -u root -p < database/views.sql
mysql -u root -p < database/procedures.sql
mysql -u root -p < database/triggers.sql
```

---

## Environment Variables

Create `server/.env` (see `.env.example`):

| Variable | Description |
|----------|-------------|
| PORT | Server port (default 5000) |
| DB_HOST / DB_PORT / DB_USER / DB_PASSWORD / DB_NAME | MySQL connection |
| JWT_SECRET | Secret key for signing tokens |
| JWT_EXPIRES_IN | Token lifetime (e.g. 7d) |
| CORS_ORIGIN | Allowed origin (* for dev) |

To point the frontend at your backend, edit `js/config.js` → `API_BASE_URL`.

---

## Demo Mode

When the backend is unreachable, the frontend stores all data in browser LocalStorage. A banner displays **"Demo Mode"**. Sample data is seeded automatically on first run. All CRUD operations work: add, edit, delete, search, filter, paginate, upload photos.

To reset: **Settings → Clear All Local Data** or **Reload Sample Data**.

---

## API Documentation

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register a new user |
| POST | /auth/login | Login, returns JWT |
| GET | /auth/me | Current user (auth) |
| GET/POST/PUT/DELETE | /patients | Patient CRUD |
| GET/POST/PUT/DELETE | /doctors | Doctor CRUD |
| GET/POST/PUT/DELETE | /appointments | Appointment CRUD |
| GET/POST/PUT/DELETE | /departments | Department CRUD |
| GET/POST/PUT/DELETE | /operations | Operation CRUD |
| GET/POST/PUT/DELETE | /lab-tests | Lab test CRUD |
| GET/POST/PUT/DELETE | /pharmacy | Medicine CRUD |
| GET/POST/PUT/DELETE | /billing | Billing CRUD |
| GET/POST/PUT/DELETE | /staff | Staff CRUD |
| GET | /notifications | List notifications |
| PUT | /notifications/:id/read | Mark as read |
| PUT | /notifications/read-all | Mark all read |
| POST | /upload | Upload a file (multipart) |
| GET | /health | Health check |

All endpoints except `/auth/*` and `/health` require `Authorization: Bearer <token>`.

---

## Postman Testing

1. Import `postman/Kushal-Multi-Speciality-Hospital.postman_collection.json`
2. Set the `baseUrl` variable to your API URL
3. Run the **Login** request — the token is auto-saved
4. Run any CRUD request — the token is sent automatically

---

## GitHub Pages Deployment

1. Push the repository to GitHub
2. Go to **Settings → Pages**
3. Set source to `main` branch, root folder
4. Your app is live at `https://<username>.github.io/<repo>/login.html`

The frontend works fully on GitHub Pages in Demo Mode.

---

## 22 SQL Queries

See `database/advanced-queries.sql` for 22 verified queries covering:
INNER JOIN, LEFT JOIN, RIGHT JOIN, GROUP BY, HAVING, aggregates, subqueries, correlated subqueries, CTEs, window functions (RANK, DENSE_RANK, LAG), running totals, patient visit history, revenue analysis, department performance, and more.

---

## AI-Assisted Development

See `docs/AI-Development-Log.md` and `docs/Daily-Standup-Log.md` for the full development log.

---

## Credits

Built with assistance from **Bolt** (bolt.new) for AI-assisted development.

---

## License

MIT — free to use for educational and commercial purposes.
