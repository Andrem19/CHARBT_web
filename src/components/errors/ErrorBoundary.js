import React from "react";
import { Spinner } from "react-bootstrap";

export class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      // Обновить состояние, чтобы следующий рендер показал запасной UI.
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      // Вы также можете логировать ошибку в службу отчетов об ошибках
      console.log(error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        // Вы можете отрендерить любой запасной UI
        return <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>;
      }
  
      return this.props.children; 
    }
  }
  