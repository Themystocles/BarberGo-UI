
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
import HaircutsComponent from "../components/haircuts/HaircutsComponent";
import CreateHairCuts from "../components/haircuts/CreateHairCuts";
import Customers from "../components/customers/Customers";
import Barbers from "../components/barbers/Barbers";
import LoginSuccess from "../components/login/LoginSuccess";
import MyAppointments from "../components/appointment/MyAppointments";
import HistoryAppointment from "../components/appointment/HistoryAppointiment";
import BarberHistory from "../components/appointment/BarberHistory";
import RegistratorUserAdmin from "../components/login/RegistratorAdmin";
import UpdatePerfil from "../components/perfil/UpdatePerfil";
import PromoveUserToAdmin from "../components/login/PromoveUsetoAdmin";
import RecoveryPassword from "../components/login/RecoveryPassword";



const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Rota inicial para a tela de Login */}
                <Route path="/" element={<Login />} />


                {/* Páginas públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/registration" element={<Registrator />} />
                <Route path="/login-success" element={<LoginSuccess />} />
                <Route path="/CortesDisponíveis" element={<PrivateRoute element={<HaircutsComponent />} />} />
                <Route path="/Recuperar-Senha" element={<RecoveryPassword />} />

                {/* Página privada */}
                <Route path="/Home" element={<PrivateRoute element={<Home />} />} />
                <Route path="/perfil" element={<PrivateRoute element={<Perfil />} />} />
                <Route path="/Updateperfil" element={<PrivateRoute element={<UpdatePerfil />} />} />
                <Route path="/agendamentos" element={<PrivateRoute element={<Appointment />} />} />
                <Route path="/ConfiguraçãoHorarios" element={<PrivateRoute element={<SchedulesConfig />} />} />
                <Route path="/ConfirmarHorario" element={<PrivateRoute element={<ScheduleConfirmation />} />} />
                <Route path="/AgendaSemanal" element={<PrivateRoute element={<WeeklyScheduleComponent />} />} />
                <Route path="/NovoCorte" element={<PrivateRoute element={<CreateHairCuts />} />} />
                <Route path="/Clientes_do_dia" element={<PrivateRoute element={<Customers />} />} />
                <Route path="/Barbeiros" element={<PrivateRoute element={<Barbers />} />} />
                <Route path="/MeusAgendamentos" element={<PrivateRoute element={<MyAppointments />} />} />
                <Route path="/Historico" element={<PrivateRoute element={<HistoryAppointment />} />} />
                <Route path="/HistoricoClientes" element={<PrivateRoute element={<BarberHistory />} />} />
                <Route path="/CadastrarAdm" element={<PrivateRoute element={<RegistratorUserAdmin />} />} />
                <Route path="/PromoverUsuario" element={<PrivateRoute element={<PromoveUserToAdmin />} />} />




            </Routes>
        </Router>
    );
};

export default AppRoutes;
