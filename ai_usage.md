# AI Usage Disclosure

## Tools Used
- **Google Gemini**

## Representative Prompts
1. *"Help me organize and implement the FocusBoard React + Tailwind dashboard with localStorage persistence and derived statistics."*
2. *"Explain how to ensure initial sample tasks in localStorage do not overwrite saved user tasks on page reload."*

## AI-Assisted Areas
- Component scaffolding (`App.jsx`, `TaskModal.jsx`), responsive Tailwind CSS grid classes, and `localStorage` persistence logic.

## Manual Verification & Adjustments
- **Verified & Adjusted:** Added a keyboard-accessible delete confirmation modal (`role="dialog"`), separated modal forms into `TaskModal.jsx` for cleaner maintainability, and verified responsive layouts at `390px`, `768px`, and `1440px`.