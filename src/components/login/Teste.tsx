import { useAuth } from "../../hooks/useAuth"; // Importa o hook de autenticação

const Teste = () => {
    const { logout } = useAuth(); // Desestruturando a função de logout

    const handleClick = () => {
        alert('Botão clicado!');
    };

    const handleLogout = () => {
        logout(); // Chama a função de logout
        alert("Você foi desconectado!");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold text-blue-500 mb-4">Página de Teste</h1>
            <p className="text-lg text-gray-700 mb-6">Essa é uma página de exemplo com um título, descrição e um botão.</p>
            <button
                onClick={handleClick}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition mb-4">
                Clique aqui
            </button>
            <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                Logout
            </button>
        </div>
    );
};

export default Teste;
