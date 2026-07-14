# Store 8181 Hub â€” Claude Development Reference

> Read this at the start of every session before writing any code.
> This is the single source of truth â€” no need to read old files or memory.

---

## Repos & URLs
- **Hub repo**: `prit946/store8181-hub` â†’ live at `prit946.github.io/store8181-hub/`
- **Local clone**: `C:\Users\theupsstore8181\store8181-hub\`
- **Admin PIN**: `1997` Â· **SessionStorage key**: `s8181_admin`

---

## Gateway â€” Cloudflare Worker (PERMANENT â€” no OAuth, no expiry, ever)

**âš ï¸ The old GAS gateway is DEAD. Never use it. Never reference it.**

```
Worker name:  store8181-hub-gateway
Worker file:  gateway-worker\worker.js  (local)
Worker URL:   https://spring-sea-ac0a.prit946.workers.dev
Key:          Store8181Prit2026  (CF secret: SECRET_KEY)
SA JSON:      CF secret: GOOGLE_SA_JSON  (file: C:\Users\theupsstore8181\Downloads\store8181-hub-a7f8dc09ee85.json)
SA email:     hub-gateway@store8181-hub.iam.gserviceaccount.com
```

### Worker request format (POST, JSON body)
```javascript
{ key: 'Store8181Prit2026', action: 'ACTION', sid: 'SHEET_ID', range: 'Tab!A1', values: [[...]] }
```

### Supported actions
| Action | Required params | Notes |
|---|---|---|
| `ping` | â€” | Returns `{pong:true, ts}` |
| `sheets.read` | `sid`, `range` | Returns `{values: [[...]]}` |
| `sheets.append` | `sid`, `range`, `values` | Appends rows |
| `sheets.update` | `sid`, `range`, `values` | Overwrites range |

**âš ï¸ NO delete action** â€” clear rows with empty values or rewrite range instead.

### PowerShell call pattern (Claude Code sessions)
```powershell
$body = '{"key":"Store8181Prit2026","action":"sheets.read","sid":"SHEET_ID","range":"Tab!A1"}'
$r = Invoke-WebRequest -Uri $GW -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing
($r.Content | ConvertFrom-Json).values
```

### Sheets that use this gateway
| Sheet | ID | SA access |
|---|---|---|
| Z Report | `1OiU8cDWGvpJFIV2h89Oq6gWwfqkyso2GDmqzsrhqwxQ` | Editor (already shared) |
| Credentials | 1ZGTqHz3oEiYYgaZqnnEv_LdJMOqvGlxSQ3KinRiQJ_c | Editor (must be shared) |

**To add a new tool that needs Sheets:** just share the sheet with `hub-gateway@store8181-hub.iam.gserviceaccount.com` as Editor. No new Worker setup needed.

### Z Report sheet tabs (exact strings including emoji)
`ðŸ“Š This Month` | `ðŸ“… Daily` | `ðŸ“† Monthly` | `ðŸ“… Yearly` | `Raw Log` | `ðŸ“‹ Tips`

### Credentials sheet tab
`Credentials` â€” single cell `A1` stores JSON blob `{accounts:[...], pins:{o,e}}`  
(If tab doesn't exist yet: open the sheet, click + to add tab, name it `Credentials`)

### Updating the Worker code
Edit `gateway-worker\worker.js`, then paste the full file into:  
Cloudflare dashboard â†’ Workers & Pages â†’ store8181-hub-gateway â†’ Edit Code â†’ Deploy

---

## After Cloudflare Deployment Checklist
When the Worker URL is known (format: `https://store8181-hub-gateway.ACCOUNT.workers.dev`):
- [ ] Replace `[CF_WORKER_URL]` in `zreport.html` (`const GW`)
- [ ] Replace `[CF_WORKER_URL]` in `credentials.html` (`const GW`)
- [ ] Add `Credentials` tab to Z Report sheet (one blank cell A1 is enough)
- [ ] Test: ping Worker â†’ expect `{pong:true}`
- [ ] Push both files to GitHub â†’ GitHub Pages auto-deploys

---

## Design Tokens
| Token | Value |
|---|---|
| Navy | `#1b2d45` |
| Teal | `#0498BC` |
| Background | `#eaecef` |
| Border | `#dde0e5` |
| Success | `#28a745` |
| Warning | `#f0ad00` |
| Danger | `#dc3545` |
| Purple | `#7c3aed` |
| Gold | `#ca8a04` |

Zero external imports. Mobile-first. `Segoe UI`, system-ui stack.

---

## Tool Inventory
| File | Purpose | Auth | Data layer |
|---|---|---|---|
| `index.html` | Hub launcher â€” Store Ops / Credentials / Business / Personal sections | Admin PIN | None |
| `zreport.html` | Z Report daily submission, missing dates, monthly/yearly totals | Admin PIN + Guest Owner/Employee | Admin: CF Worker â†’ Sheet; Guest: localStorage |
| `credentials.html` | Store 8181 passwords & portals â€” editable, Owner/Employee roles | Owner PIN + Employee PIN | CF Worker â†’ `Credentials!A1` in Z Report sheet |
| `royalty.html` | Royalty & Stamps calculator | Admin PIN + Guest Owner/Employee | localStorage |
| `template.html` | Guest hub â€” credentials + portals for other UPS Store owners | Store config + PIN | localStorage |
| `store-ops.html` | Legacy â€” superseded by royalty.html | â€” | â€” |

---

## Hub Index Sections (index.html)
- **Store Operations** â€” Z Report, Royalty & Stamps
- **Access & Credentials** â€” Store 8181 Access Hub, UPS Store Guest Access Hub
- **Business** â€” Prit Business Op (external), Multi-Store Dashboard (soon)
- **Personal** â€” Personal Finance (soon), Life Dashboard (soon), Notion Workspace (soon)

When adding a new tool: add a card to the correct section in `index.html` AND update this table.

---

## Auth Architecture

### index.html
Role select â†’ Admin (PIN 1997 â†’ `sessionStorage s8181_admin='ok'`) | Guest (â†’ template.html)

### credentials.html
Role select â†’ Owner (PIN from `pins.o`, default `1997`) | Employee (PIN from `pins.e`, default `0000`)  
Owner sees all tabs including Settings (change PINs, backup). Employee sees Credentials + Portals only.  
On login: pulls from CF Worker. On every edit: auto-pushes to CF Worker (600ms debounce).

### zreport.html
Four modes: Admin (Store 8181) | Guest Owner | Guest Employee | Employee join link  
`let mode = 'admin' | 'guest-owner' | 'guest-employee'`

### localStorage key convention
```
s8181_v6              credentials.html â€” accounts, pins, notes
zr_guest_cfg          zreport guest config
zr_data_{storeSlug}   zreport localStorage-only store data
zr_admin_cfg          admin multi-store config
zr_admin_notes_{id}   admin notes per store
ups_store_{num}_v1    template.html credentials per store
ry_pricing_v1         royalty.html pricing config
ry_sess_admin_v1      royalty.html admin session
```

---

## New Tool Checklist
- [ ] Mobile-first viewport meta + `<meta name="theme-color" content="#1b2d45">`
- [ ] Zero external imports (no CDN, no frameworks)
- [ ] Navy/teal palette â€” use design tokens above
- [ ] Auth: role select â†’ PIN â†’ main (never bypass to main without PIN)
- [ ] Back nav (`â€¹` link to index.html) in header
- [ ] Settings tab: How to Use + Notes section + Export/Import backup + tool config
- [ ] Toast notifications instead of `alert()`
- [ ] Sticky header + sticky nav tabs
- [ ] If admin needs Sheets: use CF Worker (see above) â€” share the sheet with SA email first
- [ ] If guest/standalone: localStorage only â€” no gateway dependency
- [ ] Role pill in header when guest/employee is logged in
- [ ] Employee always sees Submit only; Owner/Admin sees all tabs
- [ ] Add card to `index.html` in correct section
- [ ] Update Tool Inventory table in this file

## Questions Before Starting a New Tool
1. Admin-only, or shareable with employees/other stores?
2. If shareable: localStorage (standalone) or cross-device sync needed?
3. What tabs? (Employee always gets Submit only)
4. Settings content: How to Use + Notes + what config/export?
5. Does it need Sheets access? If yes: share that sheet with the SA email above.

---

## GAS Script (still exists â€” automation only, NOT a gateway)
- Script ID: `1qmZ9Vravgtx2uf0VjQYB-_-IGO8si8eEu7jUQM9x1d2C9ntX24Czehaf`
- Old web app URL: **DEAD â€” do not use**
- Still runs: `starredToTasks` (10min), `granolaEmailsToDrive` (30min), `dailyBriefing` (7am)
- `healthCheck` trigger deleted (was causing hourly failure email spam)
