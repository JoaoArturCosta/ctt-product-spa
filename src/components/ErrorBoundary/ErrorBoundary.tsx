import React, { Component, ErrorInfo, ReactNode } from "react";
import styles from "./ErrorBoundary.module.css";

interface Props {
  children: ReactNode;
  fallbackMessage?: string; // Optional custom message
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  // Use getDerivedStateFromError to update state so the next render will show the fallback UI.
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  // Use componentDidCatch to log error information
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // In a real app, you'd log this to an error reporting service (e.g., Sentry, LogRocket)
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleReload = () => {
    // Attempt to reload the page
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className={styles.errorBoundary}>
          <h2>{this.props.fallbackMessage || "Something went wrong."}</h2>
          <p>An unexpected error occurred in this part of the application.</p>
          {this.state.error && (
            <pre className={styles.errorMessage}>
              {this.state.error.toString()}
            </pre>
          )}
          <button onClick={this.handleReload} className={styles.reloadButton}>
            Reload Page
          </button>
        </div>
      );
    }

    // Normally, just render children
    return this.props.children;
  }
}

export default ErrorBoundary;
