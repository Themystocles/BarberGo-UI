import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../components/login/Login";
import PrivateRoute from "./PrivateRoute";
import Registrator from "../components/login/Registrator";
import Home from "../components/home/Home";
import Perfil from "../components/perfil/Perfil";
import Appointment from "../components/appointment/Appointment";
import SchedulesConfig from "../components/admConfig/SchedulesConfig"
import ScheduleConfirmation from "../components/appointment/ScheduleConfirmation";
import WeeklyScheduleComponent from "../components/admConfig/WeeklyScheduleComponent";
import Haircuts from "../components/haircuts/HaircutsComponent";
import HaircutsComponent from "../components/haircuts/HaircutsComponent";



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
                <Route path="/Home" element={<PrivateRoute element={<Home />} />} />
                <Route path="/perfil" element={<PrivateRoute element={<Perfil />} />} />
                <Route path="/agendamentos" element={<PrivateRoute element={<Appointment />} />} />
                <Route path="/ConfiguraçãoHorarios" element={<PrivateRoute element={<SchedulesConfig />} />} />
                <Route path="/ConfirmarHorario" element={<PrivateRoute element={<ScheduleConfirmation />} />} />
                <Route path="/AgendaSemanal" element={<PrivateRoute element={<WeeklyScheduleComponent />} />} />
                <Route path="/CortesDisponíveis" element={<PrivateRoute element={<HaircutsComponent />} />} />


                WeeklySchedule

            </Routes>
        </Router>
    );
};

export default AppRoutes;
