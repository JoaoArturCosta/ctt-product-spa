# Product Management SPA (CTT Exercise)

This repository contains the code for a Single Page Application (SPA) built to fulfill the requirements of the CTT Frontend Typescript exercise.

The application allows users to view, add, edit, and delete products fetched from a mock API.

## Tech Stack

- **Frontend:** React 19, TypeScript, CSS Modules
- **State Management:** Redux (core), React-Redux
- **Build & Development:** Webpack, Webpack Dev Server, ts-loader, Docker, Docker Compose
- **Testing:** Jest, React Testing Library, ts-jest, redux-mock-store
- **Mock API:** JSON Server

## Running Locally with Docker

**Prerequisites:**

- Docker Desktop (or Docker Engine + Docker Compose) installed.

**Steps:**

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/JoaoArturCosta/ctt-product-spa.git
    cd ctt-product-spa
    ```

2.  **Build and run the containers:**

    ```bash
    docker compose up --build -d
    ```

    This command will build the Docker images and start the frontend application and the mock API server.

3.  **Access the application:**
    Open your web browser and navigate to `http://localhost:3000`.

4.  **Access the mock API (optional):**
    The mock API data can be viewed directly at `http://localhost:3001/products`.

5.  **Stopping the application:**
    ```bash
    docker compose down
    ```

## Development Scripts (without Docker)

While Docker is the recommended way to run the full setup, you can also run parts individually if needed (requires Node.js/npm installed locally):

- **Install Dependencies:** `npm install`
- **Run Mock API:** `npm run mock:api` (Serves on `http://localhost:3001`)
- **Run Frontend Dev Server:** `npm run dev` (Serves on `http://localhost:3000`)
- **Run Tests:** `npm test`
- **Build Production Assets:** `npm run build`

## Project Details & Assumptions

- **Mock API Behavior:** Uses `json-server` for a standard RESTful mock interface. Assumes default behavior for ID generation on POST.
- **API Interaction:** Basic API client in `src/lib/api-client.ts` handles requests. Error handling in the UI is basic, mainly relying on the top-level `ErrorBoundary`.
- **Styling:** Uses CSS Modules for component-scoped styling. Overall styling is functional rather than heavily designed.
- **State Management:** Uses core Redux and React-Redux for state management. Async operations (API calls) are initiated directly from components (`ProductItem`, `AddProductForm`), and state updates (loading, success, failure) are handled within the `productsReducer`. No async middleware (like thunk/saga) is used. State includes caching logic for the product list fetch.
- **Categories:** The `categories` data field exists but is not implemented in the form or list UI.
- **Testing:** Includes unit tests for the Redux slice and component tests using Jest/React Testing Library/`redux-mock-store`. No end-to-end tests are included.
- **Configuration:** The mock API URL is configured via `docker-compose.yml` (`MOCK_API_URL`) and proxied by the Webpack Dev Server.

## Potential Improvements

- **Styling:** While CSS Modules are used, explore more advanced styling solutions (e.g., utility classes, design system integration) for better consistency, theming, and responsive design.
- **UI/UX:** Enhance user experience with per-item loading/error states during updates/deletes, toast notifications for action feedback, and pagination for the product list. Improve form validation feedback.
- **State Management:** Introduce async middleware (`redux-thunk` or `redux-saga`) for cleaner side effect handling. Consider `Redux Toolkit` for reducing boilerplate (if allowed in a real-world scenario). Refine caching strategy if needed.
- **API Interaction:** Implement more sophisticated API error handling (e.g., specific retry logic based on error codes), request cancellation on component unmount.
- **Forms:** Use a dedicated form library (e.g., React Hook Form, Formik) for more robust validation and state management, especially if forms become more complex.
- **Testing:** Add end-to-end tests (e.g., using Cypress or Playwright) and potentially integration tests for feature flows. Increase unit test coverage where valuable.
- **CI/CD:** Expand the CI pipeline (`.github/workflows/ci.yml`) with linting, code coverage checks, vulnerability scanning, and potentially automated deployment stages.
- **Code Splitting:** Implement route-based or component-based code splitting via Webpack if the application grows significantly, to improve initial load times.
- **Accessibility (a11y):** Conduct a thorough accessibility audit and implement necessary improvements (semantic HTML, ARIA attributes, keyboard navigation testing).
- **Categories Feature:** Fully implement UI for viewing and managing product categories.
- **Optimistic Updates:** Implement optimistic UI updates for Add/Update/Delete operations to improve perceived performance.
- **Error Handling:** Enhance the `ErrorBoundary` or add more granular error boundaries. Log errors to a dedicated monitoring service.
