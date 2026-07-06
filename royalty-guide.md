# Store 8181 — Monthly Royalty Submission Guide

**Tool:** `royalty.html` (linked from the Store Hub → Admin → Royalty & Stamps)  
**Deadline:** 5th of the following month  
**Browser:** Google Chrome only (Center Management requirement)

---

## Overview

The UPS Store royalty is submitted monthly in Center Management (CM). It covers:
- **Stamps** — inventory cost, purchases, sales, and ending stock
- **Metered Mail** — Stamps.com postage meter usage
- **Exclusions** — iShip processing fee + auto-populated deductions
- **Commissions** — PRP commissions (auto-populated by HQ)

The royalty tool at `royalty.html` collects all the numbers throughout the month and then generates the exact values to type into CM — no manual math required.

---

## Step 1 — Track Throughout the Month (4×6 Card)

Keep the physical **Stamp Activity Card** at the register.

### Front of Card — Daily Sales Log
| Date | Product | Qty Sold |
|------|---------|---------|
| (date) | B = Book of 20 | (number sold) |
| (date) | C = Coil of 100 | (number sold) |

Log every stamp sale the day it happens.

### Back of Card — Stamp Purchases + Stamps.com Summary

**STAMP PURCHASES** (from USPS receipt when order arrives)
| Date | Product | Qty | Total Cost $ |
|------|---------|-----|-------------|
| | B or C | | |

**STAMPS.COM BALANCE SUMMARY** (pulled at month end)  
Go to: `or.stamps.com` → Reports → Balances → Summary → select the month

| Field | Amount |
|-------|--------|
| Beginning Balance | $ |
| Funds Added | $ |
| ~~Funds Credited~~ | *(skip — always $0.00)* |
| Funds Deducted | $ |
| Ending Balance | $ |

> **Note:** Funds Credited is always $0.00 — skip it entirely.

---

## Step 2 — Enter Data into the Royalty Tool

Open `royalty.html` at royalty time and enter the card data.

### Stamps Tab
- **Beginning Inventory** — enter beginning balance from last month's ending (or $0 if first month)
- **Purchases** — enter each USPS order from the back of the card
- **Daily Sales** — enter each sale row from the front of the card (Date, B or C, Qty)
- **Ending Qty** — count physical stamps on hand at month end (Books + Coils separately)

### Metered Tab
Comes from the Stamps.com Balance Summary (back of card):

| Card Field | Tool Field | CM Field |
|-----------|-----------|---------|
| Beginning Balance | Beginning | Beginning Metered Mail |
| Funds Added | Meter Fills | Meter Fills |
| Funds Deducted | Funds Deducted | (verify only) |
| Ending Balance | Ending | Ending Metered Mail Reading |
**Metered Mail Exclusion** — only fill in if you printed USPS labels through the Stamps.com meter this month. Most months this is $0. If you did print labels, run the Endicia Appendix A report (print.endicia.com → Reports → Prints → By Type → Data → Net Amount Paid for Letters) and enter that amount. In CM: one line, Description = "USPS First Class."

> **Auto-reloads:** These appear in Funds Added → entered as Meter Fills on CM left side. They do NOT go in the CM right-side exclusion table.

### CM Guide Tab
After entering all data, the CM Guide tab shows the exact dollar values and quantities to type into each CM field. No math needed.

---

## Step 3 — Submit in Center Management

**Path:** CM → My Center → Royalty → Submit Royalty → select month

### Tab 1: Products/Services
Auto-populated from POS. Verify Stamp Sales matches the tool's Stamp Sales (retail) figure. Do not edit.

### Tab 2: Exclusions
Most fields auto-populate from POS:
- Stamp Cost — auto (from your stamp inventory)
- Metered Mail Cost — auto
- Sales Tax — auto
- Deposits — auto
- iShip Proc Fee — auto (verify it looks right, typically $25–$35/mo)
- **Other 1 Adjustment** — editable; **almost always $0.00**, leave blank unless instructed

### Tab 3: Commissions
All fields auto-populate or are pre-filled by HQ:
- Money Transfer — auto from POS
- Other 1 (PRP commissions) — pre-filled by HQ from POS
- **Other 2 Adjustment** — editable; **almost always $0.00**, leave blank unless area rep instructs

### Tab: Stamps and Metered Mail (main entry)
Use the CM Guide tab values here:

**Stamps Inventory — Left Side**
| CM Field | Value |
|---------|-------|
| Beginning Stamps Inventory | From tool |
| Stamps Purchases | From tool |
| Ending Stamps Inventory Cost | Greyed out — CM calculates |
| Cost of Stamps Sold | Greyed out — CM calculates |

**Ending Inventory — Right Side Table**
Unit costs ($15.60 Book / $78.00 Coil) are pre-filled by CM. Enter **Qty only**.
| CM Row | Enter |
|--------|-------|
| Book Of Stamps 20 | Qty count |
| Roll of Stamps 100 | Qty count |

**Metered Mail — Left Side**
| CM Field | Value |
|---------|-------|
| Beginning Metered Mail | From tool |
| Meter Fills | From tool (= Funds Added on Stamps.com) |
| Ending Metered Mail Reading | From tool |
| Cost of Metered Mail Used | Greyed out — CM calculates |

**Metered Mail Exclusion — Right Side**
Description: `USPS First Class`  
Amount: Appendix A amount from Endicia

### Tab: View & Submit Royalty
Review totals, then click Submit.

---

## Pricing Reference

| Product | Current USPS Cost | After July 12, 2026 |
|---------|-------------------|---------------------|
| Book of 20 stamps | $15.60 | $16.40 |
| Coil of 100 stamps | $78.00 | $82.00 |

> The royalty tool stores pricing and warns when it's 45+ days stale. Always use **USPS cost** (what the store paid), never retail price.

---

## Where to Find Each Report

| Report | Location |
|--------|----------|
| Stamps.com Balance Summary | or.stamps.com → Reports → Balances → Summary |
| Endicia Appendix A | print.endicia.com → Reports → Prints → By Type → Data → Prints, Refunds & Adjustments → Net Amount Paid for Letters |
| Center Management | CM → My Center → Royalty → Submit Royalty |

---

## Common Errors

| Error | Fix |
|-------|-----|
| Page won't load in CM | Must use Google Chrome only |
| Stamp Cost > Stamp Sales | Check that all inventory entries use USPS cost, not retail. Verify beginning inventory carries from last month. |
| Metered Cost > Metered Sales | Reduce Appendix A exclusion amount in CM right side |
| Wrong period | Double-check month selection when opening Submit Royalty |

---

## Stamp Pricing Notes

- **Always use USPS cost** for all inventory fields (what the store paid per stamp), never the retail selling price
- **Mixing cost and retail** is the #1 cause of CM submission blocks ("Stamp Cost > Stamp Sales" error)
- Retail prices: Book of 20 = $19.60, Coil of 100 = $98.00

---

*Last updated: July 2026 | Store 8181 — Joelton, TN*
