# Store 8181 Hub — Claude Development Reference

> Read this file at the start of every session before writing any new tool.
> Everything you need is here — no need to re-read old files.

## Repos & URLs
- **Hub repo**: `prit946/store8181-hub` → live at `prit946.github.io/store8181-hub/`
- **Local clone**: `C:\Users\theupsstore8181\store8181-hub\`
- **Z Report sheet**: `1OiU8cDWGvpJFIV2h89Oq6gWwfqkyso2GDmqzsrhqwxQ`
- **GAS gateway**: `https://script.google.com/macros/s/AKfycbwUh6kuKSn4h-YrHdxBjbZHelGDtg0NmTmKXwUZrCW0nB9RUWwmBLcrCIVZIAs0gzQj/exec`
- **GAS key**: `Store8181Prit2026`
- **Admin PIN**: `1997` · **SessionStorage key**: `s8181_admin`

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

## Shared Files — ALWAYS import both
```html
<link rel="stylesheet" href="hub.css">   <!-- all shared CSS classes -->
<script src="hub.js"></script>            <!-- toast, tabs, PIN state, copy, lsGet/lsSet -->
```
`hub.js` exposes: `$(id)`, `toast(msg,type,dur)`, `showLoader(msg)`, `hideLoader()`,
`switchTab(id)`, `hubCopy(text,msg)`, `makePinState(dotIds,errId,cb)`,
`lsGet(key,fallback)`, `lsSet(key,val)`, `todayLocal()`, `shortDate(d)`, `fmt(n)`

## New Tool Checklist
- [ ] Starts from `tool-template.html` (copy, rename, edit)
- [ ] `<link rel="stylesheet" href="hub.css">` + `<script src="hub.js"></script>`
- [ ] `<meta name="viewport" ...>` + `<meta name="theme-color" content="#1b2d45">`
- [ ] Auth: role select → PIN → main (admin always PIN, even from hub)
- [ ] Back nav on every sub-screen
- [ ] Settings tab: How to Use + Notes + Export/Import + tool config
- [ ] Toast instead of alert()
- [ ] Sticky header + sticky nav tabs
- [ ] localStorage for guest; GAS gateway for admin store 8181; Firebase for Prit's other stores
- [ ] Role pill in header when guest/employee is logged in
- [ ] Employee always sees Submit only; Owner/Admin sees all tabs
- [ ] Add tool card to index.html tool list
- [ ] Add tool card to template.html Portals tab

## Auth Architecture
```
zreport.html (and all future tools):
  ALWAYS showRole() on page load — no sessionStorage bypass
  Admin → PIN (1997) → enterAdmin()
  Other Store (guest) → setup if first time → guest role select → PIN → enterGuest()
```

### localStorage Key Convention
```
zr_guest_cfg          zreport guest config
zr_data_{storeSlug}   zreport localStorage-only store data
zr_admin_cfg          admin multi-store config (fbUrl, stores[])
zr_admin_notes_{id}   admin notes per store
ups_store_{num}_v1    template.html credentials per store
```

## Standard JS Init Pattern
```javascript
const ADMIN_PIN = '1997';
let mode = 'admin'; // 'admin' | 'guest-owner' | 'guest-employee'

function showRole(){ showScreen('role'); }
function showScreen(n){
  ['role','pin','main'].forEach(s=>$('screen-'+s).style.display=s===n?'block':'none');
}

// Admin PIN
const adminPS = makePinState(['pd0','pd1','pd2','pd3'], 'pinErr', v => {
  if(v === ADMIN_PIN){ enterAdmin(); }
  else{ adminPS.shake('pinDots','Incorrect PIN'); }
});
// Wire keypad buttons with onclick="adminPS.add('N')"

function enterAdmin(){
  mode = 'admin';
  $('hdrBack').href = 'index.html';
  $('storeTitle').textContent = 'Tool Name';
  $('storeSub').textContent = 'Store 8181 · Joelton TN';
  document.querySelectorAll('.nav-owner').forEach(el=>el.style.display='');
  $('rolePill').style.display = 'none';
  showScreen('main'); initApp();
}

// BOOT — always show role, no bypass
if(!checkSpecialParams()){ showRole(); }
```

## Questions Before Starting a New Tool
1. Admin-only, or shareable with employees/other stores?
2. If shareable: localStorage (standalone) or cross-device sync needed?
3. What tabs? (Employee always gets Submit only)
4. Settings content: How to Use + Notes + what config/export?
5. Does it need a GAS gateway call? Firebase?

## Tool Inventory
| File | Purpose | Auth | Data |
|---|---|---|---|
| `index.html` | Hub launcher | Admin PIN | None |
| `zreport.html` | Z Report | Admin + Guest | GAS/Firebase/localStorage |
| `credentials.html` | Static credentials | Admin PIN | Static |
| `template.html` | Guest credentials hub | Store# + PIN | localStorage |
| `store-ops.html` | Royalty & Inventory | Admin PIN | TBD |

## Gateway Quick Reference
**URL**: `https://script.google.com/macros/s/AKfycbwUh6kuKSn4h-YrHdxBjbZHelGDtg0NmTmKXwUZrCW0nB9RUWwmBLcrCIVZIAs0gzQj/exec`
**Key**: `Store8181Prit2026` · **Script ID**: `1qmZ9Vravgtx2uf0VjQYB-_-IGO8si8eEu7jUQM9x1d2C9ntX24Czehaf`

**Claude Code call pattern (PowerShell):**
```powershell
$r = Invoke-WebRequest -Uri $GW -Method POST -Body '{"key":"Store8181Prit2026","action":"ACTION","params":{...}}' -ContentType 'text/plain;charset=utf-8' -MaximumRedirection 5 -UseBasicParsing
```

**Available actions**: ping | sheets.read | sheets.append | sheets.update | drive.list | drive.readDoc | drive.createDoc | drive.updateDoc | gmail.send | cal.create | cal.list | tasks.*

**⚠️ NO delete action** — to remove rows: read all data, clear target rows with empty values, or rewrite range.

**Z Report Sheet**: `1OiU8cDWGvpJFIV2h89Oq6gWwfqkyso2GDmqzsrhqwxQ`
**Tab names** (use exact strings including emoji):
`📊 This Month` | `📅 Daily` | `📆 Monthly` | `📅 Yearly` | `Raw Log` | `📋 Tips`

**drive.updateDoc params**: `{id, content, append: true/false}` — use `id` not `fileId`

## How to Add a Tool (session startup script)
```
New session — read CLAUDE.md first.
1. Copy tool-template.html → new-tool.html
2. Follow checklist above
3. Wire to index.html + template.html Portals
4. Commit & push
5. Update CLAUDE.md Tool Inventory table
```
