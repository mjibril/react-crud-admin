import React from "react";
import ReactDOM from "react-dom";
//import exampleComponent from "./example5.js";
import Example from "./example4.js";
import { Voter } from "./voter.js";
//import Evoting from './evoting.js';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    //   logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
ReactDOM.render(
  <Example />,

  document.getElementById("app")
);
