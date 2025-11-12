Global/look-and-feel
- Overall vibe: clean medical UI with soft gradients (mint → sky/indigo), rounded “pill” controls, and friendly iconography.
- Max page width: 1200–1280px centered; background gradients stretch full width.
- Border radius: large/pill. Use 24–32px on containers, 9999px on inputs/buttons.
- Shadows: very soft elevation for buttons/cards (rgba(0,0,0,.12) at 8–16px blur).
- Primary gradient: left-to-right mint to light blue. Example: linear-gradient(90deg, #C8F3E1 0%, #A8E1EA 35%, #90B8F7 100%).
- Color tokens
  - Primary (teal): #13B6C6
  - Secondary (indigo/blue): #477DFF
  - Accent (dark navy for headings): #113B57
  - Body text: #0E2B3A at 85% opacity
  - Surfaces (aqua overlay): rgba(23, 163, 183, 0.85)
- Typography
  - UI font: Poppins/Inter/Montserrat (600 for headings, 400 for body).
  - Decorative script for the word “Care” (Great Vibes or Dancing Script).
  - Uppercased, bold headline for “LIKE A MOTHER”.
- Icon set: Material Symbols or Font Awesome, outlined style. Sizes 20–28px in UI, 36–48px for section titles.
- Spacing scale: 8px base. Typical paddings 16/24/32.

Header (top navigation)
- Sticky bar across the top over a very light mint→blue gradient.
- Left: hamburger icon.
- Center-left: circular site logo (stethoscope in a plus) with “BOOK MY DOCTOR” text wrapping the circle.
- Center: nav links: Home, About, Information, Get Pro.
- Right side cluster:
  - Search bar: pill input with a magnifying-glass icon inside on the left. Approx 360–420px wide on desktop.
  - Two circular icon buttons: profile and clock/history.
- Heights/sizing: header 72px tall; logo circle ~56px; nav link font 16px semibold.
- Behavior:
  - Header remains sticky on scroll.
  - Search expands slightly on focus, shows caret and placeholder.
  - Hover states for links and icons (slight color shift and shadow).

Hero section (landing banner)
- Full-width panel under the header with the same soft gradient background.
- Left image: doctor examining a child; right image: doctor talking to a patient. Images appear with “brush stroke” masks/edges.
- Headline overlay:
  - Word “Care” in large script (approx 90–110px).
  - “LIKE A MOTHER” directly underneath in heavy, uppercase sans (approx 44–56px).
- Primary CTA: “Booking now ...” rounded pill button centered under the text.
- Bottom-right floating pill: “Hotline: 1900 9000”.
- At the bottom of the hero: 3 small rounded progress indicators (carousel dots style), with the center one highlighted green.
- Behavior:
  - CTA scrolls to the booking form section.
  - Optional: hero can auto-rotate through images; dots indicate the active slide.

Section: Outstanding doctor (carousel of featured doctors)
- Section title: “Outstanding doctor” with a teal plus icon at the left, styled large (H2 ~40–48px).
- Main container: rounded rectangle with a mint→blue horizontal gradient background and big corner radii (24–32px). Full width of the content container (≈1140–1200px).
- Inside:
  - Left and right arrow buttons (circular with chevrons) positioned mid-vertical on the container edges.
  - Three equally spaced doctor cards visible on desktop.
    - Each card has:
      - A blue rounded square (approx 220×220) with a cartoon doctor avatar centered.
      - Name (bold): “Dt: Nguyen Van A/B/C”.
      - Department (smaller, regular): “ENT Department”, “Nutrition Department”, “Neurology Department”.
      - A pill button “More”.
- Behavior:
  - Clicking arrows slides cards horizontally.
  - On hover, the avatar tile lifts slightly (shadow), and the “More” button highlights.
  - “More” opens a doctor details modal/drawer (photo, bio, specialties, available hours) — can be stubbed initially.

Section: Booking now (appointment form)
- Section title similar to “Outstanding doctor”: plus icon + “Booking now”.
- Background: medical-themed photo with a translucent aqua overlay card (rounded, semi-opaque).
- Card layout: two columns on desktop.
  - Left column fields (stacked):
    - Full name (prefilled example: “Tran Thi M”)
    - Phone number (example: 0123456789)
    - Date (dropdown/date picker; example: 12/09/2005)
    - Hour (dropdown/time picker; example: 17:00)
    - Date of birth (dropdown/date picker; example: 06/10/2005)
    - Gender (dropdown; example: Female)
  - Right column:
    - Choose doctor (dropdown; default “Nguyen Van A”)
    - Symptom (short) — large text area with placeholder text centered (e.g., “blablabla” in the mock)
  - Centered at the bottom: “BOOKING” pill button with a slight gradient (mint→lilac) and bold label.
- Sizing:
  - Inputs are full-width pill fields, approx 320–360px wide per column on desktop.
  - Text area approx 360×220.
- Validation (frontend):
  - Required: Full name, Phone, Date, Hour, Gender, Choose doctor.
  - Phone: 9–11 digits (country-configurable), numeric only.
  - Date/time: cannot be in the past relative to “today” and must be valid.
  - Symptom: optional but show character counter; max 500 chars.
  - Inline error messages under each field; red ring on error, green ring on success.
- Interactions:
  - Date/Hour pickers use 15–30 min increments.
  - Gender and doctor pickers are select menus with pill styling and down-arrow affordance.
  - On submit: loading state, success toast “Your appointment has been booked” (or error toast).
  - Optional: if a doctor is chosen first, disable/show only valid dates/hours for that doctor.

Footer (wavy footer with logo and links)
- Big aqua footer with layered “wave” shapes at the top and bottom.
- Three content columns:
  - Left:
    - “Address” heading with a map pin icon.
    - “FPT University Quy Nhon AI Campus”.
    - “Contact us” with email/phone icon and “Hotline: 1900 9000”.
  - Center:
    - Large circular brand logo (same as header) with “BOOK MY DOCTOR” text around it.
  - Right: vertical list of links in Vietnamese:
    - Chính sách bảo mật
    - Điều khoản sử dụng
    - Câu hỏi thường gặp
    - Cẩm nang
    - Tư vấn miễn phí
- Bottom bar inside the footer:
  - Left: “© Book My Doctor 9/11/25” (or current year).
  - Right: social icons (TikTok, Facebook, YouTube).
- Hover/focus states on all links and icons.

Responsive rules
- Breakpoints (suggested):
  - ≥1200px: full desktop layouts as shown; 3 doctor cards visible.
  - 992–1199px: nav links tighten; search shrinks; doctor carousel shows 2 cards; booking form still 2 columns.
  - 768–991px (tablet): stacked hero text above images; doctor carousel shows 1–2 cards; booking form switches to single column; footer stacks columns.
  - ≤767px (mobile): hamburger menu controls all nav; search collapses to icon that expands to full-width overlay when tapped; single-card carousel with swipe; CTA and hotline are full-width pills; footer becomes a single column with centered items.
- Touch support: swipe for the doctor carousel; large tap targets (44px min).

Accessibility
- Color contrast WCAG AA (buttons and text on gradients must meet ≥4.5:1 where applicable).
- All icons and images have alt text.
- Focus outlines visible and accessible on all interactive elements.
- Form fields have explicit labels and aria-describedby for errors.
- Keyboard navigable carousels (arrow keys or tab+buttons).

Animation/micro-interactions
- Subtle 150–250ms transitions on hover/focus for buttons, inputs, and cards.
- Carousel slide transition 300–400ms ease.
- CTA and “More” buttons scale 1.02 on hover.

Data/content needed to build
- Logo SVG (stethoscope + cross).
- 2–3 hero photos (transparent brush-edge masks if you want to match the cutout look).
- 3 cartoon avatar images for doctor cards.
- Copy for all headings, departments, and footer links.
- Hotline number and address.
- List of doctors and schedule for the booking dropdown (seed with Nguyen Van A/B/C).

Suggested component breakdown (React or similar)
- Header (Logo, NavLinks, SearchBar, IconButtons)
- Hero (Headline, CTA, Images, Dots, HotlineBadge)
- DoctorsCarousel (DoctorCard, ArrowButton)
- BookingForm (FormField, Select, DatePicker, TimePicker, TextArea, SubmitButton)
- Footer (WaveBackground, FooterColumns, SocialIcons)
- Modal/Drawer (for “More” doctor details)

Sizing cheatsheet (approximate, tweak during build)
- Header: 72px tall; search pill 40px high, 360–420px wide.
- CTA and “More” buttons: 44–48px high; min-width 140–180px.
- Doctor avatar tile: 220×220; card body max-width 280–300px.
- Booking card: max-width 1160px; padding 32–40px; text area ~360×220.
- Corner radii: container 28–32px; input/button 9999px; avatar tile 20–24px.

Acceptance checklist
- Sticky gradient header with working search, hamburger, and icon buttons.
- Hero section exactly positioned with big “Care / LIKE A MOTHER” title, CTA scrolls to booking, hotline pill visible.
- Doctor carousel with 3 cards visible on desktop, arrows slide, “More” opens a stub modal.
- Booking form matches fields, pill styling, validation, and booking button in the center bottom of the card.
- Wavy footer with three columns, copyright, and social icons.
- Looks identical at desktop and behaves correctly down to 320px wide with the responsive behavior described above.

If you want, I can turn this into a starter React + Tailwind or plain HTML/CSS scaffold with tokens and components named per this spec.