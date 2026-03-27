# Technical Specification  
## Pressure Vessel Dished End Calculator — Migration to Full Application in the Local Repository

## 1. Objective

Develop a full-featured application in the **local repository** based on the existing single-page calculator file located in the **repository root**.

The new implementation must preserve the **existing engineering logic, formulas, calculations, and user workflows** already present in the current one-page version, while converting it into a maintainable application aligned with the technologies already used in the repository.

---

## 2. Source for Migration

The implementation must be based on the **existing single-page calculator** currently present in the repository.

### Existing source of truth
- The current one-page application file in the repository root
- All calculation logic, geometry rules, report behavior, nozzle handling, SVG rendering behavior, and UI workflows from that file must be treated as the **baseline functional reference**

### Important requirement
- The current logic must **not be re-invented from scratch**
- The current file must be **analyzed and decomposed**
- Existing formulas and behavior must be **preserved unless a clear bug is identified**
- Any deviation from the current behavior must be explicitly documented

---

## 3. Development Goal

Convert the existing single-file calculator into a **proper structured application** inside the current repository using the **same or compatible frontend technologies already used on the site**.

The target is a production-ready implementation that:
- is easier to maintain
- is modular
- is typed where applicable
- is consistent with the rest of the utilities in the repository
- can be built and run locally through the repository’s existing workflow

---

## 4. Technology Expectations

The implementation should follow the technologies already used in the repository as much as possible.

### Required direction
- **React**
- **Node.js-based project structure/runtime**
- **Vite** for development/build workflow if appropriate within the repo structure
- Reuse **existing styling / utility / component patterns** already present in the repository
- Reuse existing frontend stack from the site wherever possible

### Preferred approach
The new calculator should be implemented as a **real client application/module** inside the repository rather than kept as a standalone static HTML page with inline scripts.

---

## 5. Functional Scope

The new application must preserve the behavior of the current single-page calculator.

### Required functional parity
The new implementation must include, at minimum:

- selection of dished end standard(s) already supported in the current version
- all existing dimension inputs
- all current engineering calculations
- all current derived values/results
- nozzle input / nozzle list behavior
- graphical/SVG visualization behavior
- print/report-related behavior currently available in the single-page version
- engineering output values consistent with the current calculator
- current user workflow from input → calculation → visualization → report

### Existing logic to preserve
This includes, but is not limited to:
- geometric calculation logic
- crown radius / knuckle radius behavior
- dish depth logic
- blank diameter logic
- total height / flange-related logic
- tolerances logic
- edge preparation related logic, if present
- nozzle-related data structures and behavior
- report output content and layout intent

---

## 6. Non-Functional Requirements

The new implementation must improve maintainability and structure.

### Required improvements
- remove inline monolithic implementation
- split logic into reusable modules
- split UI into separate components
- avoid browser-side Babel/inlined vendor-style architecture
- use clean project structure
- make the code suitable for further extension

### Code quality expectations
- readable structure
- clear separation between:
  - UI components
  - state management
  - calculation logic
  - utility functions
  - types/interfaces
- avoid duplicated logic
- preserve deterministic calculation behavior

---

## 7. Expected Project Structure

The exact structure may follow the local repository conventions, but the implementation is expected to be split into logical parts such as:

- page/entry component
- calculator container component
- input/config panel
- result panel
- SVG preview component
- nozzle management component
- report/export component
- calculation utilities
- tolerance utilities
- types/interfaces/constants

### Example logical split
- `components/`
- `lib/` or `utils/`
- `hooks/`
- `types/`

The engineer should adapt naming and placement to the existing repository conventions.

---

## 8. UI / UX Requirements

The new application does not need a brand new engineering workflow.  
The main requirement is to preserve the current behavior while presenting it as a proper application.

### UI requirements
- preserve the main calculator workflow already used in the current file
- preserve engineering clarity of inputs and outputs
- preserve or improve readability of results
- preserve visual preview/SVG functionality
- maintain consistency with the styling of the rest of the utilities in the repository

### UX requirements
- input changes should update calculations reliably
- invalid values should be handled more safely than in the current monolithic version
- form state should be predictable and maintainable
- no breaking changes to the core engineering usage pattern

---

## 9. Validation Requirements

The new implementation must add proper validation around the existing logic.

### Minimum validation expectations
- numeric fields must accept only valid engineering input values
- dimensions must not allow invalid negative/zero values where not physically meaningful
- thickness-related inputs must be validated
- flange / bevel / root face related values must be validated against reasonable constraints
- nozzle-related inputs must be validated before adding/updating entries
- the UI should not silently fail on invalid input

---

## 10. Reporting / Output

The current one-page application contains report/print behavior.  
The new version must preserve that capability.

### Required
- preserve current report intent and data content
- preserve printability or equivalent export flow
- ensure report values match on-screen calculation values

### Acceptable implementation
- browser print workflow
- structured printable report component
- improved export layer if compatible with repository standards

---

## 11. Compatibility with Existing Repository

This task is specifically for the **local repository**, not for a separate standalone project.

### Therefore:
- implementation must fit into the existing repository structure
- implementation must use repository-compatible technologies
- implementation must not introduce a disconnected architecture unless strictly necessary
- implementation must follow the same general approach as the other utilities already implemented on the site

### Reuse expectation
Where the repository already has:
- layout conventions
- utility page patterns
- shared UI components
- styling conventions
- routing conventions
- metadata structures for utilities

those should be reused instead of creating parallel patterns.

---

## 12. Deliverables

The engineer is expected to deliver:

### Code deliverables
- full React-based implementation of the calculator in the local repository
- modularized code structure
- all required components and logic extraction
- integration into the existing application/site structure
- local build/run compatibility

### Functional deliverables
- working calculator with parity to current single-page logic
- working SVG/visual output
- working nozzle handling
- working result generation
- working print/report behavior

### Quality deliverables
- code organized for future support and extension
- logic clearly extracted from the current single-page source
- no critical regression versus the original engineering behavior

---

## 13. Acceptance Criteria

The task is considered complete when all of the following are true:

1. The old single-page logic has been successfully migrated into a structured application inside the repository  
2. The new version reproduces the current calculator behavior with matching engineering outputs  
3. The application is implemented using repository-compatible frontend technologies  
4. The code is modular and maintainable  
5. The visualization/SVG behavior is preserved  
6. Nozzle functionality is preserved  
7. Report/print behavior is preserved or improved without functional loss  
8. The application can be built and run locally within the repository  
9. The implementation is consistent with how other utilities are developed in the same repository  

---

## 14. Notes for the Engineer

- Treat the existing one-page calculator as the **functional baseline**
- Do not simplify engineering logic without explicit approval
- Do not replace formulas unless verified
- Prefer extraction and refactoring over reinterpretation
- Preserve current calculation behavior first, then improve code structure
- Follow the repository’s established patterns before introducing new architectural decisions

---

## 15. Summary

A new full application must be developed in the local repository based on the current one-page calculator in the repository root.

The goal is to transform the current implementation into a structured, maintainable **React-based application** that uses the repository’s existing technologies and patterns, while preserving the engineering logic and behavior already implemented in the original file.