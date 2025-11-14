import React, { Component, ErrorInfo, ReactNode } from "react";
import "./ErrorBoundary.css";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the whole app.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    this.setState({
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    // Example:
    // if (process.env.NODE_ENV === 'production') {
    //   Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
    // }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-icon">⚠️</div>
            <h2 className="error-title">Oops! Something went wrong</h2>
            <p className="error-message">
              We're sorry for the inconvenience. An unexpected error occurred.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="error-details">
                <summary>Error Details (Development Only)</summary>
                <pre className="error-stack">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="error-actions">
              <button
                className="btn-primary"
                onClick={() => window.location.reload()}
              >
                🔄 Reload Page
              </button>
              <button
                className="btn-secondary"
                onClick={() => (window.location.href = "/")}
              >
                🏠 Go Home
              </button>
            </div>

            <p className="error-help">
              If this problem persists, please contact support at{" "}
              <a href="mailto:support@bookmydoctor.com">
                support@bookmydoctor.com
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
