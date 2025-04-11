import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, User, Menu, X } from "lucide-react";

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isAdminUser, setIsAdminUser] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const loggedIn = localStorage.getItem("isLoggedIn") === "true";
		const adminStatus = localStorage.getItem("isAdmin") === "true";
		setIsLoggedIn(loggedIn);
		setIsAdminUser(adminStatus);
	}, [location.pathname]);

	const handleLogout = () => {
		localStorage.removeItem("isLoggedIn");
		localStorage.removeItem("isAdmin");
		setIsLoggedIn(false);
		setIsAdminUser(false);
		navigate("/login");
	};

	const handleProtectedRoute = (route: string) => {
		if (!isLoggedIn) {
			navigate("/login");
		} else {
			navigate(route);
		}
	};

	const isAuthPage = location.pathname === "/login";

	return (
		<header className="page-bkg fixed top-0 w-full backdrop-blur-sm z-50 border-b border-gray-800">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					<Link to="/" className="flex items-center space-x-2">
						<img
							src="img/logos/niche-logo.png"
							alt="niche movies"
							className="niche-logo"
						/>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center space-x-6">
						{!isAuthPage && (
							<>
								{isLoggedIn && (
									<>
										<button
											onClick={() =>
												handleProtectedRoute("/home")
											}
											className="niche-blue-hover-dark transition-colors"
										>
											Home
										</button>
										<button
											onClick={() =>
												handleProtectedRoute(
													"/all-movies"
												)
											}
											className="niche-blue-hover-dark transition-colors"
										>
											All Movies
										</button>
									</>
								)}
								{isLoggedIn && isAdminUser && (
									<Link
										to="/admin"
										className="niche-blue-hover-dark transition-colors"
									>
										Admin
									</Link>
								)}
								<button
									onClick={() =>
										handleProtectedRoute("/all-movies")
									}
									className="niche-blue-hover-dark transition-colors"
								>
									<Search className="w-5 h-5" />
								</button>
								{isLoggedIn ? (
									<button
										onClick={handleLogout}
										className="flex items-center space-x-1 text-red-400 hover:text-red-600 transition-colors"
									>
										<User className="w-5 h-5" />
										<span>Log out</span>
									</button>
								) : (
									<Link
										to="/login"
										className="flex items-center space-x-1 niche-blue-hover-dark transition-colors"
									>
										<User className="w-5 h-5" />
										<span>Sign In</span>
									</Link>
								)}
							</>
						)}
					</nav>

					{/* Mobile Menu Button */}
					<button
						className="md:hidden"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						{isMenuOpen ? (
							<X className="w-6 h-6" />
						) : (
							<Menu className="w-6 h-6" />
						)}
					</button>
				</div>

				{/* Mobile Navigation */}
				{isMenuOpen && (
					<nav className="md:hidden mt-4 pb-4">
						<div className="flex flex-col space-y-4">
							{!isAuthPage && (
								<>
									{isLoggedIn && isAdminUser && (
										<Link
											to="/admin"
											className="niche-blue-hover-dark transition-colors"
											onClick={() => setIsMenuOpen(false)}
										>
											Admin
										</Link>
									)}
									<button
										onClick={() => {
											handleProtectedRoute("/home");
											setIsMenuOpen(false);
										}}
										className="niche-blue-hover-dark transition-colors text-left"
									>
										Home
									</button>
									<button
										onClick={() => {
											handleProtectedRoute("/all-movies");
											setIsMenuOpen(false);
										}}
										className="niche-blue-hover-dark transition-colors text-left"
									>
										All Movies
									</button>
									<button
										onClick={() => {
											handleProtectedRoute("/all-movies");
											setIsMenuOpen(false);
										}}
										className="niche-blue-hover-dark transition-colors text-left"
									>
										Search
									</button>
									{isLoggedIn ? (
										<button
											onClick={() => {
												setIsMenuOpen(false);
												handleLogout();
											}}
											className="text-red-400 hover:text-red-600 transition-colors text-left"
										>
											Log out
										</button>
									) : (
										<Link
											to="/login"
											className="niche-blue-hover-dark transition-colors"
											onClick={() => setIsMenuOpen(false)}
										>
											Sign In
										</Link>
									)}
								</>
							)}
						</div>
					</nav>
				)}
			</div>
		</header>
	);
};

export default Header;
