

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b py-2">
      <div className="container mx-auto ">
        <div className="flex justify-between items-center ">
          <div className="flex items-center">
            <div className=" flex items-center">
              <img src="https://kooqxit.com/wp-content/uploads/2025/08/logo-removebg-preview.png" className="w-full h-full"/>
            </div>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-900 hover:text-green-600 px-3 py-2 text-lg font-medium">
              Home
            </a>
            <a href="#" className="text-gray-700 hover:text-green-600 px-3 py-2 text-lg font-medium">
              About Us
            </a>
            <a href="#" className="text-gray-700 hover:text-green-600 px-3 py-2 text-lg font-medium">
              Portfolios
            </a>
            <a href="#" className="text-gray-700 hover:text-green-600 px-3 py-2 text-lg font-medium">
              All Courses
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-green-600 px-6 py-1.5 rounded-2xl border-black border-1">
              Login
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-1.5 rounded-2xl ">Sign Up</button>
          </div>
        </div>
      </div>
    </header>
  )
}
