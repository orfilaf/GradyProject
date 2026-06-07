# Grady Memorial Hospital - Patient Record System

A comprehensive patient record management system built for Grady Memorial Hospital as a school project.

## Overview

This web application provides a complete patient record interface with organized tabs for different categories of patient information, from demographics to treatment history.

## Features

### ✅ Patient Information Management
- **Demographics**: Age, DOB, gender, address, ethnicity, race
- **Emergency Department**: Vital signs, GCS scores, arrival/discharge times
- **Diagnosis**: ICD-10 codes, injury diagnoses, comorbid conditions
- **Injury Information**: Incident details, location, external causes
- **Pre-Hospital**: EMS transport, field vitals, scene information
- **Pre-Existing Conditions**: Medical history, chronic conditions
- **Hospital Events**: Complications, infections, adverse events
- **Hospital Procedures**: ICD-10 procedures, procedure locations
- **Outcome**: Discharge disposition, length of stay, mortality data
- **TQIP Measures**: Quality measures, transfusions, prophylaxis

### 🎨 Design System
- **Brand Colors**: Grady's signature teal (#00a19a)
- **Typography**: Clean, professional sans-serif fonts
- **Components**: Accessible form fields, tabs, buttons
- **Responsive**: Works on desktop, tablet, and mobile

### 🏗️ Technical Stack
- **React 18.3** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Vite** - Fast build tool

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── Navigation.tsx        # Top navigation bar
│   │   ├── PatientHeader.tsx     # Patient info header
│   │   ├── PatientRecord.tsx     # Main tabbed record view
│   │   └── FormField.tsx         # Reusable form field component
│   ├── data/
│   │   └── patientFields.ts      # Field definitions from CSV
│   └── App.tsx                   # Main application
├── styles/
│   ├── theme.css                 # Grady brand theme
│   └── fonts.css                 # Font imports
└── imports/
    └── pasted_text/
        └── patient-data-fields.csv

```

## Data Categories

The system organizes **346 patient data fields** into **10 main categories**:

1. **Demographic Information** (19 fields) - includes payment method
2. **Emergency Department** (30 fields)
3. **Diagnosis Information** (10 fields)
4. **Injury Information** (19 fields)
5. **Pre-Hospital Information** (23 fields)
6. **Pre-Existing Conditions** (30 fields)
7. **Hospital Events/Complications** (20 fields)
8. **Hospital Procedures** (4 fields)
9. **Outcome Information** (11 fields)
10. **TQIP Measures** (20 fields)

## Color Palette

```css
/* Grady Memorial Hospital Brand */
Primary Teal: #00a19a
Teal Dark: #008a84
Teal Light: #e6f7f6

/* Neutrals */
Gray 50: #f9fafb
Gray 200: #e5e7eb
Gray 600: #6b7280
Gray 900: #111827

/* Semantic */
Success: #10b981
Warning: #f59e0b
Error: #ef4444
Info: #3b82f6
```

## Key Components

### Navigation
Top-level navigation bar with Grady branding, search, notifications, and user profile access.

### Patient Header
Displays key patient information:
- Medical Record Number (MRN)
- Patient name and photo placeholder
- Age, gender, date of birth
- Contact information
- Action buttons (Print, Save)

### Tabbed Interface
10 organized tabs for different data categories with smooth transitions and active state indicators.

### Form Fields
Smart form fields that adapt based on field type:
- Text inputs
- Number inputs
- Date/time pickers
- Dropdown selects
- Checkboxes
- Text areas

## Usage

### Navigating Records
- Click any tab to view that category of patient data
- All 10 tabs are accessible from the top navigation
- Current tab is highlighted in red

### Entering Data
- Fill in any field to update patient information
- Changes are tracked in component state
- Click "Save Changes" to persist (to be implemented)

### Form Field Types
- **Text**: Standard text input
- **Number**: Numeric values only
- **Date**: Date picker
- **Time**: Time picker
- **Select**: Dropdown menu
- **Checkbox**: Yes/no toggle
- **Textarea**: Multi-line text

## Design Guidelines

Refer to `UI-GUIDELINES.md` for:
- Complete color system
- Typography scale
- Spacing system
- Component specifications
- Accessibility requirements

Refer to `ASSETS.md` for:
- Logo specifications
- Icon library
- Stock photos
- Font resources

## Sample Patient Data

The application includes a sample patient:
```
Name: John Anderson
MRN: MRN-2024-001234
Age: 45 years old
DOB: 03/15/1979
Gender: Male
Address: 123 Peachtree St NE, Atlanta, GA 30303
```

## Future Enhancements

- [ ] Backend integration with Supabase
- [ ] Save and load patient records
- [ ] Search and filter patients
- [ ] Print-friendly record views
- [ ] Export to PDF
- [ ] Data validation and required fields
- [ ] User authentication
- [ ] Audit trail for changes
- [ ] Multi-user access control

## Accessibility

- WCAG AA compliant color contrast
- Keyboard navigation support
- Screen reader compatible
- Semantic HTML structure
- Focus indicators on all interactive elements
- Minimum 44px touch targets

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Credits

**School Project for Grady Memorial Hospital**

Design based on Grady Health System's official website and brand guidelines.

Stock photos from Unsplash (see ASSETS.md for attribution).

---

*This is a student project and not an official Grady Memorial Hospital application.*
