# Grady Memorial Hospital - Patient Registry

A comprehensive patient record management system built with React, TypeScript, and Tailwind CSS for Grady Memorial Hospital.

## 📋 Project Overview

This Patient Registry application provides a complete interface for managing patient medical records with 346+ data fields organized across 11 categories including demographics, injury information, emergency department data, and treatment outcomes.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Install dependencies:
```bash
pnpm install
# or
npm install
```

2. Run the development server:
```bash
pnpm dev
# or
npm run dev
```

The application will open in your default browser at the configured port.

## 🏗️ Project Structure

```
├── src/
│   ├── app/
│   │   ├── components/         # React components
│   │   │   ├── Navigation.tsx         # Top navigation bar
│   │   │   ├── PatientHeader.tsx      # Patient info display
│   │   │   ├── PatientRecord.tsx      # Main tabbed interface
│   │   │   └── FormField.tsx          # Reusable form fields
│   │   ├── data/
│   │   │   └── patientFields.ts       # All 346+ field definitions
│   │   └── App.tsx                    # Main app component
│   ├── imports/
│   │   ├── grady-logo.svg             # Official Grady logo
│   │   └── pasted_text/
│   │       └── patient-data-fields.csv
│   └── styles/
│       ├── theme.css                  # Grady brand colors
│       └── globals.css
├── ASSETS.md                          # Design assets reference
├── UI-GUIDELINES.md                   # Complete design system
├── PROJECT-README.md                  # Detailed documentation
├── package.json
└── README.md                          # This file
```

## 🎨 Key Features

- ✅ **11 Organized Tabs** with left sidebar navigation
- ✅ **346+ Patient Data Fields** grouped by medical category
- ✅ **Authentic Grady Branding** (red, teal, yellow color scheme)
- ✅ **Responsive Design** - works on desktop, tablet, mobile
- ✅ **Optimized Layout** - 4-column grid, compact spacing
- ✅ **Smart Grouping** - Related fields organized in visual sections
- ✅ **GCS Calculation Display** - Visual operators (+, =) for Glasgow Coma Scale
- ✅ **Unit Indicators** - Shows cm, kg, °C for measurements
- ✅ **Professional EMR UI** - Matches industry standards (Epic, Cerner)

## 📊 Data Categories

1. **Demographic Information** - Patient IDs, personal info, address
2. **Injury Information** - Incident details, location, ICD-10 codes
3. **Pre-Hospital Information** - EMS data, transport, field vitals
4. **Emergency Department Information** - Arrival, vitals, screenings
5. **Hospital Procedure Information** - Procedures, ICD-10 codes
6. **Pre-Existing Conditions** - 30 medical conditions (checkboxes)
7. **Diagnosis Information** - AIS, ICD-10, severity scores
8. **Hospital Events** - Complications, infections
9. **Outcome Information** - Discharge, mortality data
10. **TQIP Measures** - Quality measures, transfusions
11. **Practitioners** - Healthcare team information

## 🎨 Design System

### Brand Colors
- **Primary Red**: #E31E24 (Grady cross color)
- **Secondary Teal**: #00A9CE
- **Accent Yellow**: #FFC72C
- **Neutrals**: White, grays, black

### Typography
- **Font**: Inter (sans-serif)
- **Sizes**: Compact and professional
- **Labels**: text-xs for form fields

### Layout
- **Grid**: 4 columns (XL screens), responsive down to 1 column
- **Compact Layouts**: 5 columns for address/location fields
- **Custom Layouts**: 3 columns for Personal Information

See `UI-GUIDELINES.md` for complete design specifications.

## 🔧 Technology Stack

- **React 18.3** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Radix UI** - Accessible components (Tabs)
- **Lucide React** - Icons
- **Vite** - Build tool & dev server
- **pnpm** - Package manager

## 📝 Development Notes

### Adding New Fields

Edit `src/app/data/patientFields.ts`:

```typescript
{
  groupName: 'Group Name',
  fields: [
    { 
      name: 'Field Name', 
      type: 'text',
      colSpan: 2,           // Optional: span 2 columns
      operatorAfter: '+',   // Optional: show + or = after field
      unit: 'cm'            // Optional: show unit (cm, kg, °C)
    },
  ],
}
```

### Field Types
- `text` - Text input
- `number` - Numeric input
- `date` - Date picker
- `time` - Time picker
- `select` - Dropdown
- `textarea` - Multi-line text
- `checkbox` - Yes/no checkbox

### Special Properties
- `colSpan` - Span multiple columns (1-4)
- `operatorAfter` - Show math operator (+, =) after field
- `unit` - Display unit abbreviation (cm, kg, °C)
- `compactLayout` - Use 5-column grid for groups
- `gridColumns` - Custom column count (1-5)

## 🚢 Building for Production

```bash
pnpm build
# or
npm run build
```

**Note:** This project uses a custom Figma Make build system. The standard `vite build` command is not configured for production deployment. Contact your development team for deployment instructions.

## 📚 Documentation Files

- **README.md** (this file) - Getting started guide
- **PROJECT-README.md** - Complete project documentation
- **UI-GUIDELINES.md** - Design system and brand guidelines
- **ASSETS.md** - Stock photos, icons, logo specs

## 🏥 Medical Data Fields

All field definitions are based on:
- National Trauma Data Bank (NTDB) standards
- TQIP (Trauma Quality Improvement Program) measures
- ICD-10 coding requirements
- Standard trauma registry data elements

Source: `src/imports/pasted_text/patient-data-fields.csv`

## 🎯 Future Enhancements

- [ ] Backend integration (Supabase)
- [ ] Save/load patient records
- [ ] Search and filter functionality
- [ ] Print-friendly views
- [ ] PDF export
- [ ] Data validation
- [ ] User authentication
- [ ] Auto-calculate GCS totals
- [ ] Audit trail

## 🤝 Contributing

This is a school project for Grady Memorial Hospital. For questions or modifications, contact the development team.

## 📄 License

Educational/School Project - Not for production use

---

**Built with React + TypeScript + Tailwind CSS**

For detailed design specifications, see `UI-GUIDELINES.md`  
For asset resources, see `ASSETS.md`  
For complete documentation, see `PROJECT-README.md`
