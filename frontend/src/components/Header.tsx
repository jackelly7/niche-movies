import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Film, Search, User, Menu, X } from "lucide-react";

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const location = useLocation();
	const isAuthPage = location.pathname === "/auth";

	return (
		<header className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-sm z-50 border-b border-gray-800">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					<Link to="/" className="flex items-center space-x-2">
						<Film className="w-8 h-8 text-red-600" />
						<span className="text-xl font-bold">Niche Movies</span>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center space-x-6">
						{!isAuthPage && (
							<>
								<Link
									to="/movies"
									className="hover:text-red-500 transition-colors"
								>
									Movies
								</Link>
								<button className="hover:text-red-500 transition-colors">
									<Search className="w-5 h-5" />
								</button>
								<Link
									to="/auth"
									className="flex items-center space-x-1 hover:text-red-500 transition-colors"
								>
									<User className="w-5 h-5" />
									<span>Sign In</span>
								</Link>
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
									<Link
										to="/movies"
										className="hover:text-red-500 transition-colors"
										onClick={() => setIsMenuOpen(false)}
									>
										Movies
									</Link>
									<button className="hover:text-red-500 transition-colors text-left">
										Search
									</button>
									<Link
										to="/auth"
										className="hover:text-red-500 transition-colors"
										onClick={() => setIsMenuOpen(false)}
									>
										Sign In
									</Link>
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
