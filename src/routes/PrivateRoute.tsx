import React, { JSX } from "react";
import { Navigate, RouteProps } from "react-router-dom";

// Tipo para as propriedades do PrivateRoute
type PrivateRouteProps = RouteProps & {
    element: JSX.Element;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
    const isAuthenticated = !!localStorage.getItem("token");

    // Se não estiver autenticado, redireciona para a tela de login
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return element; // Retorna o elemento passado como "element" se autenticado
};

export default PrivateRoute;
