import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";
import App from "./App";


const BaseUrl = document.getElementsByTagName("base")[0].getAttribute("href");
const RootElement = document.getElementById("root");

ReactDOM.render(
    <BrowserRouter
        basename={BaseUrl} >
        <App />
    </BrowserRouter>,
    RootElement);