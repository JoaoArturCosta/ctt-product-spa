# PRD: Product Management SPA

## 1. Overview

Build a Single Page Application (SPA) using React, TypeScript, and vanilla Redux to manage a list of products (CRUD operations). The application will interact with a mock API, run in a Docker environment, and follow TDD/TBD principles.

**Key Constraints:**

- TypeScript, React, Redux (vanilla, no `reduxjs/toolkit`)
- No `create-react-app`
- Webpack for bundling
- Docker and Docker Compose for local environment
- Mock API (`json-server`) simulating latency and errors
- No `redux-thunk` or other async middleware
- Unit/Integration testing focus (Jest, React Testing Library)
- Minimal UI styling
- Feature-based directory structure
- TDD and TBD development methods

## 2. Plan Phases

### Phase 1: Project Setup & Core Infrastructure

1.  **Initialize Repository:**
    - Create GitHub repo (`ctt-product-spa`).
    - `git init`, add `.gitignore`, `fe_typescript.md`, `PRD.md`.
    - Initial commit & push.
2.  **Feature-Based Project Structure:**
    - Create main directories: `public/`, `src/`, `tests/`, `mock-api/`, `scripts/`.
    - Inside `src/`: `components/` (shared UI), `features/` (parent for features), `lib/` (utils), `store/` (root store config), `types/` (global types), `App.tsx` (root component), `index.tsx` (entry).
3.  **Install Dependencies:** `react`, `react-dom`, `redux`, `react-redux`, `typescript`, `@types/*`, `webpack`, `webpack-cli`, `webpack-dev-server`, `ts-loader`, `html-webpack-plugin`, `jest`, `@testing-library/*`, `json-server`, etc.
4.  **TypeScript Configuration:** Setup `tsconfig.json`.
5.  **Webpack Configuration:** Setup `webpack.config.js` (entry, output, loaders, plugins, dev server).
6.  **Mock API Setup:** Create `mock-api/db.json` (sample data) and `api-routes.json` (latency/error simulation). Add `package.json` scripts.
7.  **Docker Setup:** Create `Dockerfile` (multi-stage build) and `docker-compose.yml` (frontend, mock-api services).
8.  **Basic App Entry Point & Test:** Create `public/index.html`, `src/index.tsx`, `src/App.tsx` (basic render). Verify build, dev server, Docker work.

### Phase 2: Redux Core & Product List Feature (Read)

1.  **Root Store Setup:** Configure root store (`src/store/store.ts`), root reducer (`src/store/reducer.ts`), wrap App with `<Provider>`.
2.  **Products Feature - Slice Definition (`src/features/products/productSlice.ts`):** Define types, initial state, action constants, action creators, reducer, selectors. Add TDD tests. Update root reducer.
3.  **Products Feature - API Layer (`src/features/products/api.ts`):** Implement `fetchProducts()` using `fetch`.
4.  **Products Feature - List Component (`src/features/products/ProductList.tsx`):** Use selectors, `useEffect` for async logic (dispatch START, call API, dispatch SUCCESS/FAILURE). Render loading/error/list. Add TDD tests.
5.  **Products Feature - Item Component (`src/features/products/components/ProductItem.tsx`):** Display product details. Render within `ProductList`.
6.  **Integrate Feature:** Render `<ProductList />` in `src/App.tsx`.

### Phase 3: CRUD Operations (within `src/features/products/`)

1.  **Add Product:** API function (`api.ts`), Redux slice updates (`productSlice.ts` + tests), Form component (`AddProductForm.tsx` + tests).
2.  **Update Product:** API function, Redux slice updates (+ tests), Edit UI/component (`ProductItem.tsx` or `EditProductForm.tsx` + tests).
3.  **Delete Product:** API function, Redux slice updates (+ tests), Delete button/handler (`ProductItem.tsx` + tests).

### Phase 4: Finalization & CI/CD

1.  **Refinement & Styling:** Basic usability pass.
2.  **Testing:** Review coverage, add missing tests.
3.  **README:** Create `README.md` (setup, assumptions, improvements).
4.  **GitHub Actions:** Setup `.github/workflows/ci.yml` (checkout, install, lint, test, build).
