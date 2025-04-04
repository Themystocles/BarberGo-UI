import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "../components/login/Login";
import Teste from "../components/home/Home";
import PrivateRoute from "./PrivateRoute";
import Registrator from "../components/login/Registrator";
import Home from "../components/home/Home";

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
                    path="/Home"
                    element={<PrivateRoute element={<Home />} />}
                />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
