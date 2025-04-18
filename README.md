# Product Management SPA (CTT Exercise)

This repository contains the code for a Single Page Application (SPA) built to fulfill the requirements of the CTT Frontend Typescript exercise.

The application allows users to view, add, edit, and delete products fetched from a mock API.

## Tech Stack

- React 19
- TypeScript
- Redux (vanilla)
- React-Redux
- Webpack
- Jest & React Testing Library
- Docker & Docker Compose
- JSON Server (for mock API)

## Running Locally with Docker

**Prerequisites:**

- Docker Desktop (or Docker Engine + Docker Compose) installed.

**Steps:**

1.  **Clone the repository:**

    ```bash
    git clone <your-repo-url> # Replace with your repository URL
    cd ctt-product-spa
    ```

2.  **Build and run the containers:**

    ```bash
    docker compose up --build -d
    ```

    This command will:

    - Build the Docker image for the frontend application (including installing dependencies and building static assets).
    - Build the Docker image for the mock API server.
    - Start both services in detached mode (`-d`).

3.  **Access the application:**
    Open your web browser and navigate to `http://localhost:8080` (or the port mapped in `docker-compose.yml` if different).

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
- **Run Frontend Dev Server:** `npm start` (Serves on `http://localhost:8080`)
- **Run Tests:** `npm test`
- **Build Production Assets:** `npm run build`

## Assumptions Made

- **Mock API Behavior:** Assumed `json-server` provides a standard RESTful interface and handles ID generation for POST requests.
- **API Latency/Errors:** Mock API delays and potential errors are simulated via `json-server` configuration, but complex error scenarios are not deeply handled in the UI beyond displaying a generic message.
- **Styling:** Kept minimal using inline styles as requested.
- **State Management:** Focused on vanilla Redux without middleware like `redux-thunk` or `redux-saga` for async operations; async logic is handled within components (`useEffect`) or action thunks dispatched manually (though not explicitly used here beyond basic action dispatching).
- **Categories:** The `categories` field is part of the data model but not fully implemented in the UI (not editable or displayable in the list/form).
- **Testing:** Focused on unit tests for Redux slice logic and component interactions. End-to-end tests were not implemented.
- **Environment Variables:** API base URL is hardcoded; in production, this would come from environment variables.

## Potential Improvements for Production

- **Styling:** Implement a robust styling solution (CSS Modules, Styled Components, Tailwind CSS) for better maintainability, theming, and responsive design.
- **UI/UX:** Enhance user experience with better loading indicators (e.g., skeleton screens, per-item loading states), more informative error messages, user feedback on actions (e.g., toast notifications), form validation libraries, and potentially pagination for the product list.
- **State Management:** Introduce async middleware (`redux-thunk` or `redux-saga`) for cleaner handling of side effects and API calls. Consider `Redux Toolkit` for boilerplate reduction (though explicitly disallowed for this exercise).
- **API Interaction:** Implement more sophisticated error handling, request cancellation, and potentially data normalization (e.g., using `normalizr` if state shape became complex).
- **Forms:** Use a dedicated form library (e.g., React Hook Form, Formik) for more complex validation and state management.
- **Testing:** Add end-to-end tests (e.g., using Cypress or Playwright) and increase unit/integration test coverage.
- **CI/CD:** Expand the basic CI pipeline with steps for linting, code coverage reporting, vulnerability scanning, and deployment stages.
- **Configuration:** Manage API URLs and other configurations using environment variables.
- **Code Splitting:** Implement route-based or component-based code splitting via Webpack to improve initial load times for larger applications.
- **Accessibility:** Perform an accessibility audit and implement necessary improvements (semantic HTML, ARIA attributes, keyboard navigation).
- **Categories Feature:** Fully implement UI for viewing and potentially managing product categories.
- **Optimistic Updates:** Implement optimistic UI updates for operations like Add/Update/Delete to make the application feel faster.
