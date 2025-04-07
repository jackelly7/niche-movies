import React, { useState } from "react";
import { Link } from "react-router-dom";

const AuthPage = () => {
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle authentication with backend
	};

	return (
		<div className="min-h-screen pt-20 pb-12 flex items-center justify-center px-4">
			<div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-lg">
				<div>
					<h2 className="text-3xl font-bold text-center">
						{isLogin
							? "Sign in to your account"
							: "Create your account"}
					</h2>
					<p className="mt-2 text-center text-gray-400">
						{isLogin ? (
							<>
								Or{" "}
								<button
									className="account-sign-text"
									onClick={() => setIsLogin(false)}
								>
									create a new account
								</button>
							</>
						) : (
							<>
								Already have an account?{" "}
								<button
									className="account-sign-text"
									onClick={() => setIsLogin(true)}
								>
									Sign in
								</button>
							</>
						)}
					</p>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					{!isLogin && (
						<div className="input-group">
							<div>
								<label
									htmlFor="first-name"
									className="block text-sm font-medium"
								>
									First Name
								</label>
								<input
									id="first-name"
									name="first-name"
									type="text"
									required
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="input-border-hover-blue-light mt-1 block px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
								/>
							</div>
							<div>
								<label
									htmlFor="last-name"
									className="block text-sm font-medium"
								>
									Last Name
								</label>
								<input
									id="last-name"
									name="last-name"
									type="text"
									required
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="input-border-hover-blue-light mt-1 block px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
								/>
							</div>
						</div>
					)}

					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium"
						>
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
						<label
							htmlFor="password"
							className="block text-sm font-medium"
						>
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
							{isLogin ? "Sign in" : "Create account"}
						</button>
					</div>
				</form>

				<div className="text-sm text-center">
					<Link
						to="/privacy"
						className="text-gray-400 niche-blue-hover-dark"
					>
						Privacy Policy
					</Link>
				</div>
			</div>
		</div>
	);
};

export default AuthPage;
