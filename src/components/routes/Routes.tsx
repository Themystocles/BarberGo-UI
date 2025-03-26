// src/components/Routes.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Importando as páginas

import Login from "../login/Login";
import Teste from "../login/Teste";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>

                <Route path="login" element={<Login />} />
                <Route path="teste" element={<Teste />} />

            </Routes>
        </Router>
    );
};

export default AppRoutes;
