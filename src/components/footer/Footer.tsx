import { useContext } from "react";
import { CustomizationContext } from "../../context/CustomizationContext";

const Footer = () => {
    const { customization } = useContext(CustomizationContext);

    const hexToRGBA = (hex: string, alpha: number) => {
        if (!hex) return `rgba(17,24,39,${alpha})`;

        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);

        return `rgba(${r},${g},${b},${alpha})`;
    };

    const footerColor = customization?.corPrimaria
        ? hexToRGBA(customization.corPrimaria, 0.85)
        : "rgba(17,24,39,0.85)";

    return (
        <footer
            className="fixed bottom-0 left-0 w-full backdrop-blur-xl border-t border-white/10 shadow-lg"
            style={{ backgroundColor: footerColor }}
        >
            <div className="text-center px-4 py-3 text-sm text-gray-300 tracking-wide">

                © 2025{" "}
                <span
                    className="font-semibold"
                    style={{ color: customization?.corSecundaria }}
                >
                    {customization?.nomeSistema || "Barbearia Barba Negra"}
                </span>{" "}
                — Todos os direitos reservados.

            </div>
        </footer>
    );
};

export default Footer;