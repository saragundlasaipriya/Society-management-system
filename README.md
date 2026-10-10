# Society Management System

**Project type:** Final-year academic prototype  
**Technology:** HTML, CSS, JavaScript  
**Difficulty:** Beginner-friendly  
**AI/ML component:** Explainable, rule-based maintenance priority assistant

## Features
- Resident directory: add and delete residents, with basic input validation.
- Maintenance helpdesk: submit issues, receive suggested High/Medium/Low priority, and mark open requests resolved.
- Society notices: publish community announcements.
- Maintenance payment register: record sample payment entries and calculate the demo total.
- Dashboard summary cards.
- Local browser storage: demo records remain after refresh on the same browser.

## Setup
1. Download and extract the ZIP.
2. Open the `society_management_system` folder.
3. Double-click `index.html`, or open it in Chrome, Edge, or Firefox.
4. No server, package installation, or API key is required.

## Important limitations
- This is a front-end demonstration, not a production society-management platform.
- Data is stored in the current browser using `localStorage`; it is not shared across devices and can be cleared by the user.
- The priority helper uses transparent keyword rules. It is AI-inspired automation, **not a trained machine-learning model**. For a genuine ML extension, collect labelled issue examples and train/evaluate a classifier in Python, then connect it through an API.
- Payments are only recorded as demo entries. No real payment is processed.
- There is no login, access control, database server, or personal-data security layer. Use fictional data for demonstrations.

## Suggested viva explanation
“The Society Management System helps manage resident details, maintenance requests, announcements, and sample maintenance collections in one dashboard. I used HTML for structure, CSS for responsive styling, and JavaScript for validation, rendering, calculations, and browser storage. The maintenance assistant assigns an explainable priority using keywords. It is a rule-based prototype; a future version can replace it with a trained machine-learning classifier and a backend database.”
