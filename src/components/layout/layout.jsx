export function Layout() {
  return (
    // Contenedor principal del layout
    <div>
      {/* 1. Encabezado (Header) */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Título Principal */}
          <h1 className="text-2xl font-bold text-blue-700">
            PLATAFORMA DE COTIZACIÓN
          </h1>

          {/* Contenedor Opcional para Navegación/Botones */}
          <nav>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-500 transition duration-150 ease-in-out px-3 py-2 rounded-md font-medium"
            >
              Inicio
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-500 transition duration-150 ease-in-out px-3 py-2 rounded-md font-medium ml-4"
            >
              Ayuda
            </a>
          </nav>
        </div>
      </header>
    </div>
  );
}
