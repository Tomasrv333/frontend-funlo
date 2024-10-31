export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-100">
      <h1 className="text-4xl font-bold mb-6">Bienvenido a Funlo</h1>
      <p className="text-lg text-gray-700 mb-8">
        Mejora tu experiencia de aprendizaje con nuestra plataforma de cursos y foros.
      </p>
      <div className="space-x-4">
        <a href="/pages/login" className="px-6 py-3 bg-blue-500 text-white rounded-lg">
          Iniciar sesión
        </a>
        <a href="/pages/register" className="px-6 py-3 bg-gray-300 text-black rounded-lg">
          Registrarse
        </a>
      </div>
    </div>
  );
}