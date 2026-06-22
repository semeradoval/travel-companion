# Travel Companion — Frontend

React SPA pro cestovní zápisky. Umožňuje CRUD operace nad dvěma entitami: **Travel Topic** a **Travel Entry**.

Součást zadání BCAA „Realizace frontendu" pro kurz Architektura cloudových aplikací (Unicorn University, léto 2026).

## Tech Stack

- React + Vite
- React Router
- Tailwind CSS v4

## Spuštění

```bash
cd frontend
npm install
npm run dev
```

Frontend běží na `http://localhost:5173` a volá backend na `http://localhost:3000`.

---

## User view entry point

### Routes

| Name | Uri | Description |
|---|---|---|
| Home | `/` | Přehled všech kategorií cestovních témat |
| Topic List | `/category/:category` | Seznam témat v dané kategorii |
| Topic Detail | `/topic/:id` | Detail tématu — seznam zápisků |
| Entry Detail | `/topic/:id/entry/:entryId` | Detail a čtení zápisku |
| Create Topic | `/topic/create` | Formulář pro vytvoření nového tématu |
| Create Entry | `/entry/create` nebo `/topic/:id/entry/create` | Formulář pro přidání nového zápisku |
| Edit Topic | `/topic/:id/edit` | Editace existujícího tématu |
| Edit Entry | `/entry/:entryId/edit` | Editace existujícího zápisku |

### SPA navigační flow

```
Home (/)
  └─ Topic List (/category/:category)
       └─ Topic Detail (/topic/:id)
            ├─ Edit Topic (/topic/:id/edit)
            ├─ [FAB] Create Entry (/topic/:id/entry/create)
            │         └─ [inline] Create Topic (/topic/create)
            └─ Entry Detail (/topic/:id/entry/:entryId)
                  └─ Edit Entry (/entry/:entryId/edit)

[Bottom nav — Přidat] → Create Entry (/entry/create)
                              └─ [inline] Create Topic
```

---

## Home — `/`

### Properties (props)

| Name | Type | Default value | Description |
|---|---|---|---|
| — | — | — | Žádné props, entry point aplikace |

### Component Diagram

```
Page
├── Header (Moje zápisky / Kategorie)
├── CategoryCard ×6
└── BottomNav (Přehled | Přidat)
```

### Component Render

| Název | Pravidla |
|---|---|
| CategoryCard | Do not display if: data se načítají (zobraz skeleton loader) |
| CategoryCard | Zobrazí se vždy 6× — fixní kategorie: Transport, Sightseeing, Accommodations, Food, Shops, Phrases |

---

## Topic List — `/category/:category`

### Properties (props)

| Name | Type | Default value | Description |
|---|---|---|---|
| category | string | — | Název kategorie (Transport / Sightseeing / Accommodations / Food / Shops / Phrases) |

### Component Diagram

```
Page
├── Header (zpět + ikona kategorie + „Témata")
├── TopicCard ×N  /  EmptyState
└── BottomNav (Přehled | Přidat)
```

### Component Render

| Název | Pravidla |
|---|---|
| TopicCard | Do not display if: v kategorii nejsou žádná témata (zobraz EmptyState) |
| EmptyState | Do not display if: existuje alespoň jedno téma v kategorii |

---

## Topic Detail — `/topic/:id`

### Properties (props)

| Name | Type | Default value | Description |
|---|---|---|---|
| id | string | — | ID tématu (topicId) |

### Component Diagram

```
Page
├── Header (zpět + název tématu + badge kategorie + EditTopicButton + DeleteTopicButton)
├── EntryCard ×N  /  EmptyState
├── FAB (+)
└── BottomNav (Přehled | Přidat)
```

### Component Render

| Název | Pravidla |
|---|---|
| TopicHeader | Vždy zobrazit (název tématu + kategorie badge) |
| EntryCard | Do not display if: téma nemá žádné zápisky (zobraz EmptyState) |
| EmptyState | Do not display if: existuje alespoň jeden zápisek |
| AddEntryButton (FAB) | Vždy zobrazit; otevře Create Entry s předvyplněným topicId |
| EditTopicButton | Vždy zobrazit |
| DeleteTopicButton | Vždy zobrazit; po kliknutí zobrazit potvrzovací dialog |

---

## Entry Detail — `/topic/:id/entry/:entryId`

### Properties (props)

| Name | Type | Default value | Description |
|---|---|---|---|
| id | string | — | ID tématu (pro navigaci zpět) |
| entryId | string | — | ID zápisku (entry) |

### Component Diagram

```
Page
├── Header (zpět + název tématu + badge kategorie + EditButton + DeleteButton)
├── EntryTitle
├── EntryText
└── BottomNav (Přehled | Přidat)
```

### Component Render

| Název | Pravidla |
|---|---|
| EntryTitle | Vždy zobrazit |
| EntryText | Do not display if: zápisek se načítá (zobraz skeleton loader) |
| EditButton | Vždy zobrazit |
| DeleteButton | Vždy zobrazit; po kliknutí zobrazit potvrzovací dialog |

---

## Create Topic — `/topic/create`

### Properties (props)

| Name | Type | Default value | Description |
|---|---|---|---|
| — | — | — | Žádné props, kategorie se vybírá ručně ve formuláři |

### Component Diagram

```
Page
├── Header (Zrušit + „Nové téma" + Uložit)
├── CategorySelect
├── TitleInput + CharCounter
└── BottomNav (Přehled | Přidat)
```

### Component Render

| Název | Pravidla |
|---|---|
| CategorySelect | Vždy zobrazit; výběr z 6 fixních kategorií; předvyplněno dle defaultCategory |
| TitleInput | Vždy zobrazit; max 20 znaků |
| CharCounter | Vždy zobrazit vedle TitleInput (zbývající znaky z 20) |
| SubmitButton | Disabled if: kategorie nevybrána NEBO title prázdný NEBO title > 20 znaků |
| ErrorMessage | Do not display if: formulář je validní |

---

## Create Entry — `/entry/create` nebo `/topic/:id/entry/create`

### Properties (props)

| Name | Type | Default value | Description |
|---|---|---|---|
| id | string | — | Volitelné ID tématu; není přítomno pokud uživatel přichází z bottom navu (`/entry/create`) |

### Component Diagram

```
Page
├── Header (Zrušit + „Nový zápisek" + Uložit)
├── CategorySelect
├── TopicSelect (disabled dokud není vybrána kategorie)
├── TitleInput + CharCounter
├── TextArea + CharCounter
└── BottomNav (Přehled | Přidat)
```

### Component Render

| Název | Pravidla |
|---|---|
| CategorySelect | Vždy zobrazit; výběr z 6 fixních kategorií; předvyplněno pokud lze odvodit z id |
| TopicSelect | Vždy zobrazit; disabled dokud není vybrána kategorie; předvyplněno dle id; pod výběrem se zobrazí tlačítko „+ Vytvořit nové téma" — rozbalí inline formulář pro vytvoření tématu bez opuštění stránky |
| TitleInput | Vždy zobrazit; max 30 znaků |
| TextArea | Vždy zobrazit; max 1800 znaků |
| CharCounter (title) | Vždy zobrazit (zbývající znaky z 30) |
| CharCounter (text) | Vždy zobrazit (zbývající znaky z 1800) |
| SubmitButton | Disabled if: kategorie nevybrána NEBO téma nevybráno NEBO title prázdný NEBO title > 30 znaků NEBO text > 1800 znaků |
| ErrorMessage | Do not display if: formulář je validní |

> **Design decision:** Formulář přidává krok CategorySelect → TopicSelect. Backend přijímá pouze `topicId` — kategorie slouží jen jako filtr na frontendu. Nové téma lze vytvořit inline z TopicSelect bez opuštění formuláře.

---

## Edit Topic — `/topic/:id/edit`

### Properties (props)

| Name | Type | Default value | Description |
|---|---|---|---|
| id | string | — | ID tématu (topicId) k editaci |

### Component Diagram

```
Page
├── Header (Zrušit + „Upravit téma" + Uložit)
├── CategorySelect (předvyplněno)
├── TitleInput + CharCounter (předvyplněno)
└── BottomNav (Přehled | Přidat)
```

### Component Render

| Název | Pravidla |
|---|---|
| CategorySelect | Vždy zobrazit; předvyplněno aktuální kategorií; výběr z 6 fixních kategorií |
| TitleInput | Vždy zobrazit; předvyplněno aktuální hodnotou; max 20 znaků |
| CharCounter | Vždy zobrazit vedle TitleInput (zbývající znaky z 20) |
| SubmitButton | Disabled if: title prázdný NEBO title > 20 znaků |
| ErrorMessage | Do not display if: formulář je validní |

---

## Edit Entry — `/entry/:entryId/edit`

### Properties (props)

| Name | Type | Default value | Description |
|---|---|---|---|
| entryId | string | — | ID zápisku (entry) k editaci |

### Component Diagram

```
Page
├── Header (Zrušit + „Upravit zápisek" + Uložit)
├── CategorySelect (předvyplněno)
├── TopicSelect (předvyplněno)
├── TitleInput + CharCounter (předvyplněno)
├── TextArea + CharCounter (předvyplněno)
└── BottomNav (Přehled | Přidat)
```

### Component Render

| Název | Pravidla |
|---|---|
| CategorySelect | Vždy zobrazit; předvyplněno kategorií aktuálního tématu |
| TopicSelect | Vždy zobrazit; předvyplněno aktuálním topicId; umožňuje přesun zápisku jinam |
| TitleInput | Vždy zobrazit; předvyplněno aktuální hodnotou; max 30 znaků |
| TextArea | Vždy zobrazit; předvyplněno aktuální hodnotou; max 1800 znaků |
| CharCounter (title) | Vždy zobrazit (zbývající znaky z 30) |
| CharCounter (text) | Vždy zobrazit (zbývající znaky z 1800) |
| SubmitButton | Disabled if: title prázdný NEBO title > 30 znaků NEBO text > 1800 znaků |
| ErrorMessage | Do not display if: formulář je validní |

---

## Navigace

### Bottom nav (přítomen na všech screenech)

| Položka | Akce |
|---|---|
| Přehled | Navigace na Home `/` |
| Přidat | Otevře formulář pro nový zápisek |

### FAB

| Screen | FAB |
|---|---|
| Home | ❌ |
| Topic List | ❌ |
| Topic Detail | ✅ — přidá zápisek do aktuálního tématu |
| Entry Detail | ❌ |
| Formuláře (Create/Edit) | ❌ |
