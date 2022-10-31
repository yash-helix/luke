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

import { CookiesProvider } from 'react-cookie';
import { Auth } from "./contexts/auth";


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
                <Route path="/TestCompleted" element={<TestCompleted />} />
                <Route path="/retestExhasuted" element={<RetestExhausted />} />
                <Route path="/questionPaper/:name/:id" element={<UserQuestionPaper />} />
                <Route path="/adminLogin" element=
                {<Auth>
                    <CookiesProvider>
                        <Login/>
                    </CookiesProvider>
                </Auth>
                }/>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
