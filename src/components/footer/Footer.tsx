import { useContext } from "react";
import { CustomizationContext } from "../../context/CustomizationContext";

const Footer = () => {
    const { customization, } = useContext(CustomizationContext);

    return (
        <footer className="fixed bottom-0 left-0 w-full text-center p-4 text-sm text-gray-400"
            style={{ backgroundColor: customization?.corPrimaria || "#111827" }}>
            © 2025 {customization?.nomeSistema || "Barbearia Barba Negra"}. Todos os direitos reservados.
        </footer>
    );
};

export default Footer;
