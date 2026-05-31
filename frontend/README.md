# Travel Companion — Frontend dokumentace (podklad pro UU)

---

# User view entry point

## SPA diagram (uuBmlDraw #1)
*Již vyplněno v UU.*

## Routes

| Name | Uri | Description |
|---|---|---|
| Home | `/` | Přehled všech kategorií cestovních témat |
| Topic List | `/category/:category` | Seznam témat v dané kategorii |
| Topic Detail | `/topic/:id` | Detail tématu — seznam zápisků |
| Entry Detail | `/topic/:id/entry/:entryId` | Detail a čtení zápisku |
| Create Topic | `/topic/create` | Formulář pro vytvoření nového tématu |
| Create Entry | `/topic/:id/entry/create` | Formulář pro přidání nového zápisku |
| Edit Topic | `/topic/:id/edit` | Editace existujícího tématu |
| Edit Entry | `/entry/:entryId/edit` | Editace existujícího zápisku |

## Spa (uuBmlDraw #2)
*Nakreslit navigační flow — stejné schéma jako SPA diagram #1:*
```
Home (/)
  └─ Topic List (/category/:category)
       └─ Topic Detail (/topic/:id)
            ├─ Edit Topic (/topic/:id/edit)
            ├─ [FAB] Create Entry (/topic/:id/entry/create)
            │         └─ [inline] Create Topic (/topic/create)
            └─ Entry Detail (/topic/:id/entry/:entryId)
                  └─ Edit Entry (/entry/:entryId/edit)

[Bottom nav — Přidat] → Create Entry
                              └─ [inline] Create Topic
```

---

# Home

**Route Name:** Home

## Properties (props)

| Name | Type | Default value | Description |
|---|---|---|---|
| — | — | — | Žádné props, entry point aplikace |

## Component Diagram
*Nakreslit: Page → Header (Moje zápisky / Kategorie) → CategoryCard ×6 → BottomNav*

## Component Render

| Název | Pravidla |
|---|---|
| CategoryCard | Do not display if: data se načítají (zobraz skeleton loader) |
| CategoryCard | Zobrazí se vždy 6× — fixní kategorie: Transport, Sightseeing, Accommodations, Food, Shops, Phrases |

---

# Topic List

**Route Name:** Topic List

## Properties (props)

| Name | Type | Default value | Description |
|---|---|---|---|
| category | string | — | Název kategorie (Transport / Sightseeing / Accommodations / Food / Shops / Phrases) |

## Component Diagram
*Nakreslit: Page → Header (zpět + ikona kategorie + „Témata") → TopicCard ×N / EmptyState → BottomNav*

## Component Render

| Název | Pravidla |
|---|---|
| TopicCard | Do not display if: v kategorii nejsou žádná témata (zobraz EmptyState) |
| EmptyState | Do not display if: existuje alespoň jedno téma v kategorii |

---

# Topic Detail

**Route Name:** Topic Detail

## Properties (props)

| Name | Type | Default value | Description |
|---|---|---|---|
| id | string | — | ID tématu (topicId) |

## Component Diagram
*Nakreslit: Page → Header (zpět + název tématu + badge kategorie + EditTopicButton + DeleteTopicButton) → EntryCard ×N / EmptyState → FAB → BottomNav*

## Component Render

| Název | Pravidla |
|---|---|
| TopicHeader | Vždy zobrazit (název tématu + kategorie badge) |
| EntryCard | Do not display if: téma nemá žádné zápisky (zobraz EmptyState) |
| EmptyState | Do not display if: existuje alespoň jeden zápisek |
| AddEntryButton (FAB) | Vždy zobrazit; otevře Create Entry s předvyplněným topicId |
| EditTopicButton | Vždy zobrazit |
| DeleteTopicButton | Vždy zobrazit; po kliknutí zobrazit potvrzovací dialog |

---

# Entry Detail

**Route Name:** Entry Detail

## Properties (props)

| Name | Type | Default value | Description |
|---|---|---|---|
| id | string | — | ID tématu (pro navigaci zpět) |
| entryId | string | — | ID zápisku (entry) |

## Component Diagram
*Nakreslit: Page → Header (zpět + název tématu + badge kategorie + EditButton + DeleteButton) → EntryTitle → EntryText → BottomNav*

## Component Render

| Název | Pravidla |
|---|---|
| EntryTitle | Vždy zobrazit |
| EntryText | Do not display if: zápisek se načítá (zobraz skeleton loader) |
| EditButton | Vždy zobrazit |
| DeleteButton | Vždy zobrazit; po kliknutí zobrazit potvrzovací dialog |

---

# Create Topic

**Route Name:** Create Topic

## Properties (props)

| Name | Type | Default value | Description |
|---|---|---|---|
| defaultCategory | string | undefined | Volitelné předvyplnění kategorie |

## Component Diagram
*Nakreslit: Page → Header (Zrušit + „Nové téma" + Uložit) → CategorySelect → TitleInput + CharCounter → SubmitButton → BottomNav*

## Component Render

| Název | Pravidla |
|---|---|
| CategorySelect | Vždy zobrazit; výběr z 6 fixních kategorií; předvyplněno dle defaultCategory |
| TitleInput | Vždy zobrazit; max 20 znaků |
| CharCounter | Vždy zobrazit vedle TitleInput (zbývající znaky z 20) |
| SubmitButton | Disabled if: kategorie nevybrána NEBO title prázdný NEBO title > 20 znaků |
| ErrorMessage | Do not display if: formulář je validní |

---

# Create Entry

**Route Name:** Create Entry

## Properties (props)

| Name | Type | Default value | Description |
|---|---|---|---|
| id | string | undefined | Volitelné ID tématu; undefined pokud uživatel přichází z bottom navu |

## Component Diagram
*Nakreslit: Page → Header (Zrušit + „Nový zápisek" + Uložit) → CategorySelect → TopicSelect → TitleInput + CharCounter → TextArea + CharCounter → SubmitButton → BottomNav*

## Component Render

| Název | Pravidla |
|---|---|
| CategorySelect | Vždy zobrazit; výběr z 6 fixních kategorií; předvyplněno pokud lze odvodit z id |
| TopicSelect | Vždy zobrazit; disabled dokud není vybrána kategorie; předvyplněno dle id; obsahuje možnost vytvoření nového tématu inline |
| TitleInput | Vždy zobrazit; max 30 znaků |
| TextArea | Vždy zobrazit; max 1800 znaků |
| CharCounter (title) | Vždy zobrazit (zbývající znaky z 30) |
| CharCounter (text) | Vždy zobrazit (zbývající znaky z 1800) |
| SubmitButton | Disabled if: kategorie nevybrána NEBO téma nevybráno NEBO title prázdný NEBO title > 30 znaků NEBO text > 1800 znaků |
| ErrorMessage | Do not display if: formulář je validní |

> **Design decision:** CategorySelect → TopicSelect kaskáda. Backend přijímá pouze topicId — kategorie slouží jen jako filtr na frontendu. Nové téma lze vytvořit inline z TopicSelect bez opuštění formuláře.

---

# Edit Topic

**Route Name:** Edit Topic

## Properties (props)

| Name | Type | Default value | Description |
|---|---|---|---|
| id | string | — | ID tématu (topicId) k editaci |

## Component Diagram
*Nakreslit: Page → Header (Zrušit + „Upravit téma" + Uložit) → CategorySelect (předvyplněno) → TitleInput + CharCounter (předvyplněno) → SubmitButton → BottomNav*

## Component Render

| Název | Pravidla |
|---|---|
| CategorySelect | Vždy zobrazit; předvyplněno aktuální kategorií; výběr z 6 fixních kategorií |
| TitleInput | Vždy zobrazit; předvyplněno aktuální hodnotou; max 20 znaků |
| CharCounter | Vždy zobrazit vedle TitleInput (zbývající znaky z 20) |
| SubmitButton | Disabled if: title prázdný NEBO title > 20 znaků |
| ErrorMessage | Do not display if: formulář je validní |

---

# Edit Entry

**Route Name:** Edit Entry

## Properties (props)

| Name | Type | Default value | Description |
|---|---|---|---|
| entryId | string | — | ID zápisku (entry) k editaci |

## Component Diagram
*Nakreslit: Page → Header (Zrušit + „Upravit zápisek" + Uložit) → CategorySelect (předvyplněno) → TopicSelect (předvyplněno) → TitleInput + CharCounter → TextArea + CharCounter → SubmitButton → BottomNav*

## Component Render

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
