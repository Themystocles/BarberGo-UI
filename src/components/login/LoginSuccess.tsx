import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            // Salva o token no localStorage
            localStorage.setItem("token", token);

            // Fecha a popup se for janela aberta por outra
            if (window.opener) {
                window.close();
            } else {
                // Se não for popup, redireciona para home normalmente
                navigate("/home");
            }
        } else {
            // Se não veio token, volta para login
            navigate("/login");
        }
    }, [navigate]);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-gray-700 text-lg">Processando login...</p>
        </div>
    );
};

export default LoginSuccess;
