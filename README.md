# Travel Companion — Backend

Web application for travelers to store and organize travel notes by topics. This repository contains the backend implementation built with Node.js + Express.js and file-based JSON storage.

Submitted as the BCAA homework assignment "Realizace backendu" for **Architektura cloudových aplikací** (Unicorn University, summer 2026).

## Tech Stack

- Node.js (24+)
- Express.js 5
- File-based JSON storage (no external database)

## Getting Started

### Prerequisites

- Node.js installed
- Git installed

### Installation

```bash
git clone https://github.com/semeradoval/travel-companion.git
cd travel-companion/backend
npm install
```

### Running the Server

```bash
node server.js
```

Server starts on `http://localhost:3000`. Open it in a browser and you should see `Travel Companion backend is running.` as a health check.

To stop the server press `Ctrl+C` in the terminal where it runs.

## Project Structure

```
backend/
├── server.js                 entry point — wires Express together
├── package.json
├── storage/                  persisted data (JSON)
│   ├── topics.json
│   └── entries.json
├── dao/                      data access — only layer that touches storage
│   ├── topic-dao.js
│   └── entry-dao.js
├── helpers/                  shared utilities
│   ├── categories.js         allowed topic categories
│   ├── error.js              uniform error builder
│   └── validate.js           dtoIn validator
├── abl/                      application business logic (commands)
│   ├── topic/
│   │   ├── create.js
│   │   ├── get.js
│   │   ├── list.js
│   │   ├── update.js
│   │   └── delete.js
│   └── entry/
│       ├── create.js
│       ├── get.js
│       ├── list.js
│       ├── update.js
│       └── delete.js
└── routes/                   express routing — maps URLs to ABL
    ├── topic-routes.js
    └── entry-routes.js
```

## User Stories

The application is built around four user stories from the Business Requests assignment.

### BROWSE — find a stored note

User picks a category, drills down to a topic, and reads the entry they need.

1. User opens the app
2. App shows the list of categories
3. User picks a category → app shows topics in that category
4. User picks a topic → app shows entries under that topic
5. User picks an entry → app shows the full entry text

### CREATE — add a new note

User saves a new entry under an existing topic.

**Pre-condition:** at least one TRAVEL TOPIC exists.

1. User clicks CREATE
2. App loads the list of topics
3. App opens a form (TITLE, TEXT, TOPIC dropdown)
4. User fills and confirms
5. App validates required fields
6. App creates the entry and shows it to the user

**Alternative — no topics exist:** App offers to create a topic first.

### EDIT — modify an existing entry

User updates a previously stored entry (title, text, or move to another topic).

**Pre-condition:** the entry to edit exists.

1. User opens an entry detail and clicks EDIT
2. App loads the entry data into a form
3. User changes fields and confirms
4. App validates required fields
5. App updates the entry and shows the result

### NEW TOPIC — create a custom topic

User adds a new topic so future entries can be filed under it.

1. User clicks NEW TOPIC
2. App opens a form (TOPIC NAME + CHOOSE CATEGORY)
3. User fills and confirms
4. App validates and checks for duplicate (same title in same category)
5. App creates the topic; it appears in topic dropdowns of CREATE / EDIT

**Alternative — duplicate topic:** App returns `topicAlreadyExists` and user must change name or category.

## Business Model

Detailed use case specifications. Key business rules of the application:

- **CATEGORY is a string attribute on TRAVEL TOPIC** with a fixed enum (Transport, Sightseeing, Accommodations, Food, Shops, Phrases). It is not a separate entity.
- **TRAVEL ENTRY does not have its own category.** The category is derived from the parent TRAVEL TOPIC.
- **Validation is performed before creating or updating** the record.
- **CREATE and EDIT forms do not contain a CATEGORY field** — selecting a TOPIC implies the category.
- **Alternative flows** explicitly cover empty topic list (CREATE) and duplicate topic (NEW TOPIC).

### BROWSE

**Pre-conditions:** none.

**Post-conditions:** App displays the BROWSE screen — CREATE button, NEW TOPIC button, list of categories.

#### Happy day scenario
1. User opens the app or returns to the BROWSE screen
2. App shows the BROWSE screen with: CREATE button, NEW TOPIC button, category list
3. User picks a category → app shows topics belonging to that category
4. User picks a topic → app shows entries belonging to that topic
5. User picks an entry → app shows the entry detail (TITLE + TEXT)

#### Mockup
BROWSE screen contains: CREATE (button), NEW TOPIC (button), six category buttons — Transport, Sightseeing, Accommodations, Food, Shops, Phrases. Selecting a category opens its topic list; selecting a topic opens its entry list; selecting an entry opens its detail.

### CREATE

**Pre-conditions:** at least one TRAVEL TOPIC exists.

**Post-conditions:** New TRAVEL ENTRY exists in storage and is shown to the user.

#### Happy day scenario
1. User clicks CREATE on the BROWSE screen
2. App loads the list of topics
3. App opens a form: TITLE, TEXT, TOPIC (dropdown)
4. User fills in the fields and confirms with OK
5. App validates that all required fields are filled
6. App creates the new TRAVEL ENTRY under the selected topic
7. App displays the newly created entry to the user

#### Alternative flows
- **A1 — Validation failed:** App displays an error message ("Please fill in all required fields") and keeps the user on the form.
- **A2 — No topics exist:** App displays a message ("No topics available — create one first") and offers a NEW TOPIC shortcut button.

#### Mockup
NEW TRAVEL ENTRY form contains: TITLE (text input), TEXT (text input), TOPIC (dropdown), OK (button). No CATEGORY field — category is determined by the selected TOPIC.

#### Data binding
| Field | Binding   | Component       |
|-------|-----------|-----------------|
| TITLE | `title`   | text input      |
| TEXT  | `text`    | text input      |
| TOPIC | `topicId` | dropdown menu   |

### EDIT

**Pre-conditions:** at least one TRAVEL ENTRY exists; the entry to edit is identified.

**Post-conditions:** Selected TRAVEL ENTRY has its TITLE, TEXT, and/or TOPIC successfully updated.

#### Happy day scenario
1. User opens an entry detail and clicks EDIT
2. App loads the current entry data into a form: TITLE, TEXT, TOPIC (dropdown)
3. User modifies one or more fields and confirms with OK
4. App validates that required fields are filled
5. App updates the TRAVEL ENTRY in storage
6. App displays the updated entry to the user

#### Alternative flows
- **A1 — Validation failed:** App displays an error message and keeps the user on the form.

#### Mockup
EDIT screen contains: TITLE (text input, prefilled), TEXT (text input, prefilled), TOPIC (dropdown, prefilled), EDIT (button), BACK (button). The TOPIC dropdown allows moving the entry to another topic.

#### Data binding
| Field | Binding   | Component       |
|-------|-----------|-----------------|
| TITLE | `title`   | text input      |
| TEXT  | `text`    | text input      |
| TOPIC | `topicId` | dropdown menu   |

### NEW TOPIC

**Pre-conditions:** none.

**Post-conditions:** New TRAVEL TOPIC exists in storage and appears in the topic dropdowns of CREATE and EDIT.

#### Happy day scenario
1. User clicks NEW TOPIC on the BROWSE screen
2. App opens a form: NEW TOPIC NAME (text input), CHOOSE CATEGORY (dropdown)
3. User fills in the fields and confirms with ADD NEW
4. App validates that required fields are filled
5. App checks for a duplicate (same title in the same category)
6. App creates the new TRAVEL TOPIC
7. The new topic appears in the topic dropdowns of CREATE / EDIT

#### Alternative flows
- **A1 — Validation failed:** App displays an error message and keeps the user on the form.
- **A2 — Duplicate topic:** App returns `topicAlreadyExists` and displays a message; user must change the name or pick a different category.

#### Mockup
NEW TOPIC form contains: NEW TOPIC NAME (text input), CHOOSE CATEGORY (dropdown), ADD NEW (button).

#### Data binding
| Field           | Binding    | Component       |
|-----------------|------------|-----------------|
| NEW TOPIC NAME  | `title`    | text input      |
| CHOOSE CATEGORY | `category` | dropdown menu   |

## Data Model

The application has two related entities. One topic can contain multiple entries.

```
TRAVEL TOPIC (1) ────< (N) TRAVEL ENTRY
                 via topicId
```

Deleting a topic cascade-deletes its entries.

### TRAVEL TOPIC

| Attribute  | Type            | Required | Constraints              | Description                |
|------------|-----------------|----------|--------------------------|----------------------------|
| `id`       | string (UUID)   | yes      | system-generated         | Unique identifier          |
| `title`    | string          | yes      | max 20 chars             | Topic name                 |
| `category` | string          | yes      | enum (see below)         | Fixed category             |

Allowed `category` values: `Transport`, `Sightseeing`, `Accommodations`, `Food`, `Shops`, `Phrases`.

#### DAO Methods (`dao/topic-dao.js`)

| Method                                       | Description                                                  |
|----------------------------------------------|--------------------------------------------------------------|
| `create(topic)`                              | Insert new topic; returns the created object with new `id`   |
| `get(id)`                                    | Find topic by id; returns `null` if not found                |
| `list(filter)`                               | Returns array; optional filter `{ category }`                |
| `update(id, changes)`                        | Merge `changes` into existing topic                          |
| `remove(id)`                                 | Delete by id; returns the removed object                     |
| `findByTitleAndCategory(title, category)`    | Helper for duplicate check                                   |

### TRAVEL ENTRY

| Attribute  | Type            | Required | Constraints                     | Description           |
|------------|-----------------|----------|---------------------------------|-----------------------|
| `id`       | string (UUID)   | yes      | system-generated                | Unique identifier     |
| `title`    | string          | yes      | max 30 chars                    | Entry name            |
| `text`     | string          | yes      | max 1800 chars                  | Entry content         |
| `topicId`  | string (UUID)   | yes      | references TRAVEL TOPIC         | Parent topic          |

#### DAO Methods (`dao/entry-dao.js`)

| Method                              | Description                                                  |
|-------------------------------------|--------------------------------------------------------------|
| `create(entry)`                     | Insert new entry; returns the created object                 |
| `get(id)`                           | Find by id; returns `null` if not found                      |
| `list(filter)`                      | Returns array; optional filter `{ topicId }`                 |
| `update(id, changes)`               | Merge `changes` into existing entry                          |
| `remove(id)`                        | Delete by id                                                 |
| `removeAllByTopicId(topicId)`       | Cascade delete helper used by `topic/delete`                 |

## API Endpoints

All requests / responses use JSON. Errors share a uniform format (see below).

### Topic

| Command         | Method | URL                          | dtoIn                              | dtoOut                                                |
|-----------------|--------|------------------------------|------------------------------------|-------------------------------------------------------|
| `topic/create`  | POST   | `/topic/create`              | `{ title, category }`              | `{ id, title, category }`                             |
| `topic/get`     | GET    | `/topic/get?id=...`          | `{ id }`                           | `{ id, title, category }`                             |
| `topic/list`    | GET    | `/topic/list?category=...`   | `{ category? }`                    | `{ itemList: [ ... ] }`                               |
| `topic/update`  | POST   | `/topic/update`              | `{ id, title?, category? }`        | `{ id, title, category }`                             |
| `topic/delete`  | POST   | `/topic/delete`              | `{ id }`                           | `{ id, title, category, removedEntriesCount }`        |

### Entry

| Command         | Method | URL                           | dtoIn                                       | dtoOut                                |
|-----------------|--------|-------------------------------|---------------------------------------------|---------------------------------------|
| `entry/create`  | POST   | `/entry/create`               | `{ title, text, topicId }`                  | `{ id, title, text, topicId }`        |
| `entry/get`     | GET    | `/entry/get?id=...`           | `{ id }`                                    | `{ id, title, text, topicId }`        |
| `entry/list`    | GET    | `/entry/list?topicId=...`     | `{ topicId? }`                              | `{ itemList: [ ... ] }`               |
| `entry/update`  | POST   | `/entry/update`               | `{ id, title?, text?, topicId? }`           | `{ id, title, text, topicId }`        |
| `entry/delete`  | POST   | `/entry/delete`               | `{ id }`                                    | `{ id, title, text, topicId }`        |

### Errors

| Code                    | Status | Where                                                                       | Reason                                              |
|-------------------------|--------|-----------------------------------------------------------------------------|-----------------------------------------------------|
| `invalidDtoIn`          | 400    | any command                                                                 | dtoIn does not match dtoInType                      |
| `topicAlreadyExists`    | 400    | `topic/create`, `topic/update`                                              | Title + category combination already exists         |
| `topicDoesNotExist`     | 404    | `topic/get`, `topic/update`, `topic/delete`, `entry/create`, `entry/update` | No topic with given id                              |
| `entryDoesNotExist`     | 404    | `entry/get`, `entry/update`, `entry/delete`                                 | No entry with given id                              |

### Warnings (non-failing)

| Code               | Trigger                                                            |
|--------------------|--------------------------------------------------------------------|
| `unsupportedKeys`  | dtoIn contains keys outside dtoInType — request is still processed |

## Error Format

All error responses share the same structure:

```json
{
  "code": "travel-companion/{command}/{errorCode}",
  "message": "human-readable description",
  "params": { }
}
```

Example — invalid dtoIn for `topic/create`:

```json
{
  "code": "travel-companion/topic/create/invalidDtoIn",
  "message": "dtoIn is not valid",
  "params": {
    "invalidTypeKeyMap": {},
    "invalidValueKeyMap": {
      "category": "must be one of: Transport, Sightseeing, Accommodations, Food, Shops, Phrases"
    },
    "missingKeyMap": {}
  }
}
```

## Storage

Data is persisted in two JSON files in `backend/storage/`:

- `topics.json` — array of topic objects
- `entries.json` — array of entry objects

The DAO layer reads and writes these files on every request. Switching to a real database (e.g. MongoDB, PostgreSQL) only requires changes inside `dao/`; commands and routes stay the same.

## Frontend Integration

The future React frontend (next assignment) will live in the same repository under `frontend/` and run on a different port — typically `5173` (Vite) or `3001` (Create React App). The backend currently rejects cross-origin requests by default; before frontend work, install and enable CORS:

```bash
cd backend
npm install cors
```

```javascript
// at the top of backend/server.js
const cors = require('cors');

// before route registrations
app.use(cors());
```

### Example API calls (JavaScript fetch)

```javascript
// list all topics
const res = await fetch('http://localhost:3000/topic/list');
const data = await res.json();
console.log(data.itemList);

// create a new topic
const res = await fetch('http://localhost:3000/topic/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'Shinkansen tickets', category: 'Transport' })
});

if (!res.ok) {
  const err = await res.json();
  console.error(err.code, err.message, err.params);
} else {
  const created = await res.json();
  console.log(created.id);
}

// get entries under a specific topic (BROWSE drill-down)
const topicId = '5bfbef68-619a-4107-9d60-04ad816d6685';
const res = await fetch(`http://localhost:3000/entry/list?topicId=${topicId}`);
const data = await res.json();
console.log(data.itemList);
```

## License

MIT — see [LICENSE](LICENSE).
