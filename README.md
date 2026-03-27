# Pressure Vessel Dished End Calculator

React + Vite version of the dished-end calculator that was previously delivered as a single `app.html` file.

## What is in this folder

- `app.html` keeps the original single-file calculator as the functional reference.
- `src/` contains the modular React implementation.
- `    readme.md` is the original migration brief that came with the project.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The build output is written to `dist/`.

## Structure

- `src/App.tsx` coordinates form state, validation, preview, and report flow.
- `src/lib/calculations.ts` preserves the original engineering formulas.
- `src/lib/validation.ts` adds safer input and nozzle validation.
- `src/lib/drawing.ts` centralizes SVG geometry and nozzle placement logic.
- `src/components/` contains the preview, report, icons, fields, and SVG dimension helpers.

## Notes

- The refactor preserves the original standards, geometry formulas, nozzle workflow, preview drawing, and print-oriented report behavior.
- Validation now blocks invalid engineering inputs from silently producing broken geometry or reports.
