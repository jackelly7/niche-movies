import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const AuthPage = ({ isLogin: initialIsLogin = true }: { isLogin?: boolean }) => {
//   const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
	e.preventDefault();
  
	const endpoint = initialIsLogin ? "https://localhost:4000/login" : "https://localhost:4000/register";
  
	try {
	  const res = await fetch(endpoint, {
		method: "POST",
		headers: {
		  "Content-Type": "application/json",
		},
		body: JSON.stringify({
		  email,
		  password,
		  ...(initialIsLogin ? {} : { name })
		}),
	  });
  
	  const data = await res.json();
  
	  if (!res.ok) {
		alert(data.message || "Something went wrong.");
		return;
	  }
  
	  alert(data.message); // or redirect, or set user state, etc.
  
	} catch (err) {
	  console.error(err);
	  alert("An error occurred. Please try again.");
	}
  };
  

  return (
    <div className="min-h-screen pt-20 pb-12 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-lg">
        <div>
          <h2 className="text-3xl font-bold text-center">
            {initialIsLogin ? "Sign in to your account" : "Create your account"}
          </h2>

		<p className="mt-2 text-center text-gray-400">
		{initialIsLogin ? (
			<>
			Or{" "}
			<button
				className="account-sign-text underline"
				onClick={() => navigate("/register")}
			>
				create a new account
			</button>
			</>
		) : (
			<>
			Already have an account?{" "}
			<button
				className="account-sign-text underline"
				onClick={() => navigate("/login")}
			>
				Sign in
			</button>
			</>
		)}
		</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!initialIsLogin && (
            <div>
              <label htmlFor="first-name" className="block text-sm font-medium">
                Name
              </label>
              <input
                id="first-name"
                name="first-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-border-hover-blue-light mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-border-hover-blue-light mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-border-hover-blue-light mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
            />
          </div>

          <div>
            <button
              type="submit"
              className="niche-blue-bkg w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              {initialIsLogin ? "Sign in" : "Create account"}
            </button>
          </div>
        </form>

        <div className="text-sm text-center">
          <Link to="/privacy" className="text-gray-400 niche-blue-hover-dark">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
