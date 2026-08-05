# Contributing to Cosmic Portfolio

**Engineered by Omran Khaled**

This document outlines the standards and workflow for contributing to this project.

---

## Philosophy

This portfolio is built with production-grade standards:

- **Type safety**: Strict TypeScript, no compromises
- **Performance**: Budgets defined and enforced
- **Accessibility**: Built-in, not bolted on
- **Quality**: Every contribution must pass all checks

---

## Quick Start

```bash
# Clone and install
git clone https://github.com/Omran-Khaled/cosmic-portfolio.git
cd cosmic-portfolio
pnpm install

# Start development
pnpm dev

# Run quality checks
pnpm lint && pnpm format && pnpm build
```

---

## Code Standards

### TypeScript

- ✅ Strict mode enabled
- ✅ No `any` types
- ✅ Explicit return types on public functions
- ✅ Interfaces for objects, types for unions/primitives

### React

- ✅ Functional components only
- ✅ Hooks at the top
- ✅ `displayName` on all components
- ✅ `useCallback` for event handlers
- ✅ `useMemo` for expensive computations

### Git

Follow [Conventional Commits](https://www.conventionalcommits.org):

```
feat: add new feature
fix: resolve bug
docs: update documentation
refactor: restructure code
chore: maintenance
```

### Branch Strategy

- `main` — Production-ready, always deployable
- Feature branches from `main`
- PRs required for all changes

---

## Pull Request Checklist

- [ ] Code passes TypeScript strict mode
- [ ] ESLint passes with zero warnings
- [ ] Prettier formatting applied
- [ ] Build succeeds
- [ ] Tested on desktop and mobile
- [ ] No `console.log` or `debugger` statements
- [ ] No unused imports or variables

---

## What to Contribute

**Welcome**:
- Bug fixes
- Performance improvements
- Accessibility enhancements
- Documentation updates
- New celestial body data

**Not Accepted**:
- Complete design overhauls
- Breaking changes without discussion
- Commercial use without permission

---

## Support

**Omran Khaled**

- Email: omranhk815@gmail.com
- GitHub: [@Omran-Khaled](https://github.com/Omran-Khaled)
- LinkedIn: [in/omran-khaled](https://www.linkedin.com/in/omran-khaled-334726426)

---

_Quality over quantity. Precision over speed._