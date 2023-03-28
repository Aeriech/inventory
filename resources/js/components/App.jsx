import React from "react";
import Router from "../router/Router";
import Header from "./inventory/Header";

const App = () => {
    return(
        <div>
            <Header />
            <Router />
        </div>
    )
}

export default App;