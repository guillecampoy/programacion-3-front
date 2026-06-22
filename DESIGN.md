---
name: Food Store
description: Simple, modern, smooth product UI for a browser-only food store prototype.
colors:
  brand: "#ff6347"
  brand-hover: "#ff4500"
  bg: "#f0f0f0"
  surface: "#ffffff"
  text: "#333333"
  ink: "#111111"
  border: "#dddddd"
  overlay: "#0000008c"
  danger: "#a92b2b"
  danger-hover: "#7f1f1f"
  danger-soft: "#fff3f3"
  danger-border: "#d8a0a0"
  danger-text: "#8f2424"
  success-soft: "#eef8ef"
  success-border: "#b9dfbf"
  success-text: "#286b34"
  warning-soft: "#fff7ed"
  warning-border: "#ffc9a8"
  warning-text: "#9b3f16"
typography:
  display:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "normal"
  headline:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
  title:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "normal"
  body:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "normal"
  label:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "10px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
  3xl: "28px"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md}"
  button-secondary:
    backgroundColor: "{colors.text}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md}"
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md}"
  surface-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  nav-link:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm}"
  modal-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
---

# Design System: Food Store

## 1. Overview

**Creative North Star: "The Trusted Counter"**

This system is a practical storefront, not a performance. It should feel like a clean, familiar counter in a small food shop: clear labels, fast decisions, and no decorative detours. The existing UI already points in that direction with a soft gray canvas, white surfaces, tomato-orange accents, and a single sans family used everywhere.

The interface favors quick comprehension over atmosphere. Pages are dense where they need to be, but the hierarchy stays calm: headers lead, panels contain, and actions are obvious. The responsive behavior is structural rather than theatrical, collapsing from a two-column layout to a single column at smaller widths so the workflow stays intact on mobile. Because the app is browser-storage driven, the visual language should stay lightweight and trustworthy rather than enterprise-heavy.

This system explicitly rejects anything extravagant, ornamental, or hard to use. It should never feel cluttered, flashy, or clever for its own sake. Familiar patterns win because the product is a university prototype and the job is to show the flow clearly.

**Key Characteristics:**
- Clear task-first hierarchy.
- Familiar browser-native interactions.
- Compact, readable forms and tables.
- Orange as a functional accent, not decoration.
- White surfaces, soft borders, and restrained elevation.

## 2. Colors

The palette is direct and low-drama: warm accent color on a neutral gray field, with white cards and simple semantic feedback colors.

### Primary
- **Tomato Orange** (`#ff6347`): Primary actions, highlighted totals, current selections, and brand moments.
- **Signal Orange** (`#ff4500`): Hover state for primary actions and focus color for interactive controls.

### Neutral
- **Cloud Gray** (`#f0f0f0`): Page background and the default canvas behind cards and forms.
- **Card White** (`#ffffff`): Primary surface for cards, dialogs, filter boxes, and tables.
- **Ink Gray** (`#333333`): Body text, labels, and most non-accented content.
- **Deep Ink** (`#111111`): Secondary button hover and the darkest neutral available in the system.
- **Border Gray** (`#dddddd`): Dividers, outlines, table rules, and surface boundaries.
- **Overlay Black** (`#0000008c`): Modal scrim over the app when a dialog is open.

### Semantic
- **Alert Red** (`#a92b2b`): Destructive actions such as canceling an order flow.
- **Alert Red Dark** (`#7f1f1f`): Hover state for destructive actions.
- **Alert Tint** (`#fff3f3`): Soft destructive background for remove actions and error messaging.
- **Alert Border** (`#d8a0a0`): Supporting border for destructive or error feedback.
- **Alert Text** (`#8f2424`): Body text inside destructive feedback blocks.
- **Success Tint** (`#eef8ef`): Positive status blocks.
- **Success Border** (`#b9dfbf`): Boundary for success feedback.
- **Success Text** (`#286b34`): Positive status copy.
- **Warning Tint** (`#fff7ed`): Informational or cautionary feedback.
- **Warning Border** (`#ffc9a8`): Boundary for caution blocks.
- **Warning Text** (`#9b3f16`): Informational or cautionary copy.

### Named Rules
**The Accent Is Work Rule.** Tomato orange is reserved for primary actions, active states, and important totals. If everything is orange, nothing is.

**The Neutral First Rule.** Most of the screen should be gray, white, or ink. The surface carries the interface; the accent carries the intent.

## 3. Typography

**Display Font:** Arial, Helvetica, sans-serif  
**Body Font:** Arial, Helvetica, sans-serif  
**Label Font:** Arial, Helvetica, sans-serif

The typography is deliberately familiar and unspecialized. It does not try to become a brand signature; it tries to disappear so the user can move through login, catalog, cart, and admin tasks without friction. Weight and spacing do the work, not font swaps.

### Hierarchy
- **Display** (700, 22px, 1.1): Page titles and the strongest visible headings.
- **Headline** (700, 20px, 1.2): Section titles such as catalog and admin blocks.
- **Title** (700, 18px, 1.25): Product names and dialog titles.
- **Body** (400, 14px, 1.45): Paragraphs, descriptions, labels, and table content.
- **Label** (700, 14px, 1.2): Form labels and button text.

### Named Rules
**The One Family Rule.** One sans family is enough for this app. Keep headings, controls, and data in the same voice.

**The Small-UI Rule.** Keep type fixed and compact. No fluid scaling, no display theatrics, and no oversized headers that break the dashboard rhythm.

## 4. Elevation

The system is mostly flat and border-led. Depth is used sparingly: a single soft shadow on the auth card, and elevated modal content over a dark scrim. Everywhere else, separation comes from white surfaces, 1px borders, and spacing.

### Shadow Vocabulary
- **Auth Lift** (`box-shadow: 0 12px 28px rgb(0 0 0 / 12%)`): Used for the login card only, to distinguish the entry point from the page background.

### Named Rules
**The Flat-By-Default Rule.** Do not stack shadows on cards and controls. Flat surfaces with borders are the default; shadow is reserved for the few places that need true lift.

**The One Lift Rule.** When depth appears, it should signal a single state change, not decorate every container.

## 5. Components

### Buttons
Buttons are compact, obvious, and familiar. Primary buttons are orange, secondary buttons are dark gray, and destructive buttons are red.

- **Shape:** 4px radius.
- **Primary:** Tomato orange background with white text, 12px padding, bold label, used for submit and main actions.
- **Hover / Focus:** Hover shifts to signal orange. Keyboard focus is visible through the same strong orange border treatment used elsewhere in the app.
- **Secondary / Destructive:** Secondary buttons use dark gray; destructive buttons use deep red with a darker hover state.
- **Focus:** Keep interactive focus states obvious and consistent, with the same orange emphasis used for important actions.

### Cards / Containers
Cards are the main containment pattern for forms, filters, product summaries, and admin boxes.

- **Corner Style:** 8px radius for grouped surfaces; 6px for nested media and small preview elements.
- **Background:** White on a soft gray canvas.
- **Shadow Strategy:** Mostly none. Only the auth card uses a lift shadow.
- **Border:** 1px solid border gray.
- **Internal Padding:** 12px to 16px, depending on density.

### Form Messages
Feedback blocks are tinted, bordered, and explicit. They are used for success, error, and info states instead of custom banners or toast-like flourishes.

- **Style:** Small rounded rectangles with strong text contrast and no shadow.
- **States:** Success, error, and info each use their own tint and border color.

### Inputs / Fields
Inputs are plain and unambiguous. There are no custom controls beyond light radius and color changes.

- **Style:** White fill, 1px border, 4px radius, and inherited body type.
- **Focus:** Orange 2px border treatment with no extra ornament.
- **Error / Disabled:** Error and info states use tinted message blocks rather than special input chrome.

### Navigation
Navigation is simple text links at the top of the page. The desktop layout keeps it inline; the mobile layout right-aligns it when the header stacks.

- **Style:** Plain links, no pills, no icon chrome, no tabs.
- **State:** The active category and selected actions rely on filled background treatments instead of bespoke navigation styling.
- **Mobile Treatment:** The header collapses into a vertical stack and the navigation remains readable and right-aligned.

### Tables
Tables are used for product, category, and order management in admin views.

- **Style:** Compact grid with collapsed borders and 1px row separators.
- **Headers:** Orange text for column labels.
- **Behavior:** The container scrolls horizontally when needed so content stays usable on smaller screens.

### Modals
The product detail modal is the only overlay in the app.

- **Style:** White panel on a dark scrim, with a fixed viewport overlay and a moderate 8px radius.
- **Behavior:** The dialog sits above the app with centered content and internal scrolling when the content exceeds the viewport.

## 6. Do's and Don'ts

### Do:
- **Do** keep the primary path obvious on every screen: login, browse, cart, admin.
- **Do** use the existing gray-and-white surfaces as the base of the interface.
- **Do** reserve tomato orange for primary actions, active states, and totals.
- **Do** keep forms, cards, and tables compact and easy to scan.
- **Do** preserve the familiar browser-native feel of the current prototype.
- **Do** collapse the layout structurally on small screens so the flow stays usable.
- **Do** use simple feedback blocks for success, error, and info states.

### Don't:
- **Don't** make the interface extravagant, ornamental, or hard to use.
- **Don't** add flashy motion, decorative effects, or clever interactions that slow the task down.
- **Don't** introduce a new font family or a second visual voice.
- **Don't** replace the current neutral background-and-surface system with a tinted or saturated full-page treatment.
- **Don't** turn the accent color into decoration; it is functional.
- **Don't** make cards, buttons, or inputs feel overdesigned or unusually rounded.
- **Don't** obscure standard form and navigation behavior behind custom UI.
