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

## License

MIT — see [LICENSE](LICENSE).
