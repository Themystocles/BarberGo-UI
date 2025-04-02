import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "../login/Login";
import Teste from "../login/Teste";
import PrivateRoute from "./PrivateRoute";
import Registrator from "../login/Registrator";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Rota inicial para a tela de Login */}
                <Route path="/" element={<Login />} />

                {/* Páginas públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/registration" element={<Registrator />} />

                {/* Página privada */}
                <Route
                    path="/teste"
                    element={<PrivateRoute element={<Teste />} />}
                />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
