import { login, signup } from "../actions";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Welcome Back</h1>
        
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              name="email" 
              type="email" 
              required 
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              name="password" 
              type="password" 
              required 
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <div className="flex flex-col gap-2 mt-4">
            {/* Form Actions connect to the server functions we will write next */}
            <button formAction={login} className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium">
              Sign In
            </button>
            <button formAction={signup} className="bg-white text-gray-700 border border-gray-300 py-2 rounded hover:bg-gray-50 text-sm">
              Sign Up (New User)
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}