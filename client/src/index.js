import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FinalScreen from './Components/TestingComponent/Testing';
import InstructionPage from "./Components/InstructionPage";
import Search from "./Components/Search";
import App from "./App";
import TestCompleted from "./Components/TestCompleted";
import RetestExhausted from "./Components/RetestExhausted";
import UserQuestionPaper from "./Components/UserQuestionPaper";
import Login from "./Components/Admin/Login";
import AdminCreatesTestComponent from "./Components/Admin/AdminCreatesTestComponent";
import { CookiesProvider } from 'react-cookie';
import { Auth } from "./contexts/auth";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import Typing from './Components/TypingTest/TypingTest/TypingTest';
import WaitingComponent from "./Components/WaitingComponent";

Sentry.init({
    dsn: process.env.REACT_APP_DSN_KEY,
    integrations: [new BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route index element={<App />} />
                <Route path="/startTest" element={<InstructionPage />} />
                <Route path="/test" element={<FinalScreen />} />
                <Route path="/table" element=
                    {<Auth>
                        <CookiesProvider>
                            <Search />
                        </CookiesProvider>
                    </Auth>
                    } />
                <Route path="/jobs" element=
                    {<Auth>
                        <CookiesProvider>
                            <AdminCreatesTestComponent />
                        </CookiesProvider>
                    </Auth>
                    } />
                <Route path="/TestCompleted" element={<TestCompleted />} />
                <Route path="/retestExhasuted" element={<RetestExhausted />} />
                <Route path="/waitingComponent" element={<WaitingComponent />} />
                <Route path="/questionPaper/:name/:id" element=
                    {<Auth>
                        <UserQuestionPaper />
                    </Auth>
                    } />
                <Route path="/adminLogin" element=
                    {<Auth>
                        <CookiesProvider>
                            <Login />
                        </CookiesProvider>
                    </Auth>
                    } />

                <Route path="/typing-test" element=
                    {<Auth>
                        <CookiesProvider>
                            <Typing />
                        </CookiesProvider>
                    </Auth>
                    } />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
