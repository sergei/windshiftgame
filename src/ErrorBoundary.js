import React from 'react';
import {Link} from "@mui/material";

class ErrorBoundary extends React.Component {
    state = {
        errorMessage: '',
    };

    static getDerivedStateFromError(error) {
        return {
            errorMessage: error.toString()
        };
    }

    componentDidCatch(error, info) {
        this.logErrorToServices(error.toString(), info.componentStack);
    }

    // A fake logging service.
    logErrorToServices = console.log;

    render() {
        if (this.state.errorMessage) {
            return (
                <div>
                    <h1>Sorry the app crashed:</h1>
                    <h4>To help us to debug it you can send us the detailed error found in View->Developer->JavaScript Console</h4>
                    <h4>You can report it to <Link href="https://github.com/sergei/windshiftgame/issues" target="_blank"  rel="noopener">our issues</Link>
                    </h4>
                    <p>{this.state.errorMessage}</p>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
