# Grady Memorial Hospital - UI Design Guidelines

## Brand Overview
Grady Memorial Hospital is Atlanta's premier healthcare institution, founded in 1892. The design should convey trust, professionalism, care, and accessibility while maintaining a modern, clean aesthetic.

**Brand Tagline:** "The Heart of Healing in Atlanta"

---

## Color Palette

### Primary Colors
```css
--color-primary-red: #E31E24;         /* Main brand red - Grady cross */
--color-primary-red-dark: #C31820;    /* Hover/active states */
--color-primary-red-light: #FFE8E9;   /* Backgrounds, highlights */
```

### Secondary Colors
```css
--color-secondary-teal: #00A9CE;      /* Teal accent color */
--color-secondary-teal-light: #E6F7FB; /* Teal backgrounds */
--color-accent-yellow: #FFC72C;       /* Yellow accent - CTAs */
--color-accent-yellow-light: #FFF4D6; /* Yellow backgrounds */
```

### Neutral Colors
```css
--color-white: #ffffff;
--color-gray-50: #f9fafb;
--color-gray-100: #f3f4f6;
--color-gray-200: #e5e7eb;
--color-gray-300: #d1d5db;
--color-gray-400: #9ca3af;
--color-gray-500: #6b7280;
--color-gray-600: #4b5563;
--color-gray-700: #374151;
--color-gray-800: #1f2937;
--color-gray-900: #111827;
```

### Semantic Colors
```css
--color-success: #10b981;      /* Confirmations, success states */
--color-warning: #f59e0b;      /* Warnings, important notices */
--color-error: #ef4444;        /* Errors, critical alerts */
--color-info: #3b82f6;         /* Information, links */
```

### Usage Guidelines
- **Primary Red**: Use for primary CTAs, navigation bars, headers, and brand touchpoints (matches Grady cross logo)
- **Secondary Teal**: Use for supporting elements, info cards, secondary buttons
- **Accent Yellow**: Use for important CTAs like "Get Care Now", attention-grabbing elements
- **White/Light Grays**: Primary backgrounds to maintain a clean, clinical feel
- **Dark Grays/Black**: Body text, headings (use gray-800 or gray-900)
- **Semantic Colors**: Only for their intended purposes (success, error, etc.)

---

## Typography

### Font Families
```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
--font-headings: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
```

### Type Scale
```css
/* Headings */
--text-4xl: 2.25rem;    /* 36px - Hero headlines */
--text-3xl: 1.875rem;   /* 30px - Page titles */
--text-2xl: 1.5rem;     /* 24px - Section headers */
--text-xl: 1.25rem;     /* 20px - Subsection headers */
--text-lg: 1.125rem;    /* 18px - Large body text */

/* Body */
--text-base: 1rem;      /* 16px - Default body text */
--text-sm: 0.875rem;    /* 14px - Small text, captions */
--text-xs: 0.75rem;     /* 12px - Fine print, labels */
```

### Font Weights
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Line Heights
```css
--leading-tight: 1.25;   /* Headings */
--leading-normal: 1.5;   /* Body text */
--leading-relaxed: 1.75; /* Long-form content */
```

### Usage Guidelines
- **Headings**: Use semibold (600) or bold (700) weights
- **Body**: Use normal (400) or medium (500) weights
- **Line height**: Use tight for headings, normal for body, relaxed for long paragraphs
- **Color**: Headings in gray-900, body text in gray-700

---

## Spacing Scale

```css
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
--spacing-20: 5rem;     /* 80px */
```

### Usage Guidelines
- **Tight spacing**: 4-8px for inline elements, icon gaps
- **Medium spacing**: 16-24px for component padding, card spacing
- **Large spacing**: 32-64px for section margins, page layout

---

## Components

### Buttons

#### Primary Button (Red)
```css
Background: var(--color-primary-red)
Text: white
Padding: 12px 24px (spacing-3 spacing-6)
Border Radius: 6px
Font Weight: 600 (semibold)
Hover: var(--color-primary-red-dark)
```

#### Secondary Button (Teal)
```css
Background: var(--color-secondary-teal)
Text: white
Padding: 12px 24px
Border Radius: 6px
Font Weight: 600
Hover: Background darken 10%
```

#### Accent Button (Yellow)
```css
Background: var(--color-accent-yellow)
Text: #111827 (dark gray)
Padding: 12px 24px
Border Radius: 6px
Font Weight: 600
Hover: Background darken 10%
```

#### Outlined Button
```css
Background: white
Text: var(--color-primary-red)
Border: 2px solid var(--color-primary-red)
Padding: 12px 24px
Border Radius: 6px
Font Weight: 600
Hover: Background var(--color-primary-red-light)
```

#### Text Button
```css
Background: transparent
Text: var(--color-primary-red)
Padding: 8px 16px
Font Weight: 500
Hover: Underline
```

### Cards

```css
Background: white
Border: 1px solid var(--color-gray-200)
Border Radius: 8px
Padding: 24px (spacing-6)
Shadow: 0 1px 3px rgba(0, 0, 0, 0.1)
Hover: Shadow 0 4px 6px rgba(0, 0, 0, 0.1)
```

**Usage**: Service listings, department info, news items, patient resources

### Navigation

```css
Background: white
Border Bottom: 1px solid var(--color-gray-200)
Height: 64px
Links Color: var(--color-gray-700)
Links Hover: var(--color-primary-teal)
Active Link: var(--color-primary-teal), border-bottom 2px
```

### Form Elements

#### Input Fields
```css
Background: white
Border: 1px solid var(--color-gray-300)
Border Radius: 6px
Padding: 10px 12px
Focus: Border var(--color-primary-teal), outline 2px
Font Size: 16px (text-base)
```

#### Labels
```css
Font Weight: 500 (medium)
Font Size: 14px (text-sm)
Color: var(--color-gray-700)
Margin Bottom: 8px (spacing-2)
```

---

## Icons

### Style Guidelines
- Use outline style icons (e.g., Heroicons, Lucide React)
- Default size: 24px
- Color: Inherit from parent or use gray-600
- Stroke width: 2px

### Common Icons Needed
- **Navigation**: Menu (hamburger), Search, Phone, Location Pin
- **Services**: Heart, Stethoscope, Calendar, User
- **Actions**: ChevronRight, ChevronDown, X (close), Check
- **Social**: Facebook, Twitter, LinkedIn, Instagram, YouTube

---

## Layout Principles

### Grid System
- **Container Max Width**: 1280px
- **Columns**: 12-column grid
- **Gutter**: 24px (spacing-6)
- **Breakpoints**:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

### Section Spacing
- **Vertical padding**: 64px on desktop, 48px on mobile
- **Section margins**: 80px between major sections

### Responsive Design
- Stack columns on mobile (< 640px)
- 2-column layouts on tablet
- 3-4 column layouts on desktop
- Always maintain touch-friendly tap targets (min 44px × 44px)

---

## Accessibility Requirements

### Color Contrast
- Text on white: Minimum 4.5:1 contrast ratio
- Large text (18px+): Minimum 3:1 contrast ratio
- All interactive elements must meet WCAG AA standards

### Interactive Elements
- Minimum touch target: 44px × 44px
- Visible focus states on all interactive elements
- Keyboard navigation support required

### Content
- Alt text for all images
- ARIA labels for icon-only buttons
- Semantic HTML structure (header, nav, main, footer)

---

## Logo & Brand Assets

### Logo Usage
- **Format**: SVG preferred for scalability
- **Minimum size**: 120px width
- **Clear space**: Minimum 16px around logo
- **Color variations**: Full color (teal), white (for dark backgrounds), grayscale

### File Naming Convention
```
grady-logo.svg           (primary logo)
grady-logo-white.svg     (white version)
grady-icon.svg           (icon/favicon version)
```

---

## Design Patterns

### Hero Section
```css
Background: var(--color-primary-red) or hero image with overlay
Height: 400-500px
Text: White
Overlay: rgba(0, 0, 0, 0.3) for images
Content: Centered or left-aligned
CTA: Yellow accent button or black button with white text
```

### Service Grid
```css
Layout: 3-4 columns on desktop, 1-2 on mobile
Card: White background, border, hover shadow
Icon: 48px, primary teal color
Title: text-xl, semibold, gray-900
Description: text-base, gray-600
```

### Footer
```css
Background: var(--color-gray-900)
Text: white / gray-300
Links: gray-300, hover: white
Sections: Multi-column (4 columns on desktop)
Bottom: Copyright, privacy links
```

---

## Example Use Cases

### Emergency Services Banner
```css
Background: var(--color-error) or var(--color-primary-teal)
Text: White, bold
Position: Top of page or hero
Content: "24/7 Emergency Care Available - (404) 616-1000"
```

### Department Cards
```css
Card with:
- Icon (48px)
- Department name (text-xl, semibold)
- Short description (text-base)
- "Learn More" link (teal)
```

### Contact Information
```css
Phone: Large, bold, clickable link
Address: Gray-600, with location icon
Hours: Listed with clock icon
All in easy-to-scan format
```

---

## Additional Notes

### Images
- Use high-quality, professional healthcare imagery
- Diverse representation of patients and staff
- Images should convey care, trust, and professionalism
- Optimize all images for web (WebP format when possible)

### Animation & Interactions
- Subtle transitions (200-300ms)
- Hover states on all interactive elements
- Smooth scrolling for anchor links
- Loading states for async operations

### Content Tone
- Professional yet compassionate
- Patient-centered language
- Clear, accessible medical terminology
- Inclusive and welcoming

---

## Quick Reference

**Primary Brand Color**: #E31E24 (Red)
**Secondary Color**: #00A9CE (Teal)
**Accent Color**: #FFC72C (Yellow)
**Primary Font**: Inter
**Card Border Radius**: 8px
**Button Border Radius**: 6px
**Max Container Width**: 1280px
**Base Font Size**: 16px
**Minimum Contrast**: 4.5:1

---

*This UI Guidelines document is designed for the Grady Memorial Hospital school project. Refer to this document when making design decisions to ensure consistency throughout the application.*
