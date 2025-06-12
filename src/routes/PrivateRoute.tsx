import { Navigate, RouteProps } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import React, { JSX } from "react";

type JwtPayload = {
    exp: number;
};

type PrivateRouteProps = RouteProps & {
    element: JSX.Element;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
    const token = localStorage.getItem("token");

    if (!token) return <Navigate to="/login" />;

    try {
        const decoded = jwtDecode<JwtPayload>(token);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
            localStorage.removeItem("token");
            return <Navigate to="/login" />;
        }

        return element;
    } catch {
        localStorage.removeItem("token");
        return <Navigate to="/login" />;
    }
};

export default PrivateRoute;
