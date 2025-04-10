import { Link } from "react-router-dom";

const Footer = () => {
	return (
		<footer className="page-bkg border-t border-gray-800 py-12">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div className="col-span-1">
						<Link to="/" className="flex items-center space-x-2">
							<span className="text-xl font-bold">
								Niche Movies
							</span>
						</Link>
						<p className="mt-4 text-gray-400">
							Your destination for unique and exceptional cinema.
						</p>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-4">
							Navigation
						</h3>
						<ul className="space-y-2 text-gray-400">
							<li>
								<Link
									to="/"
									className="niche-blue-hover-dark transition-colors"
								>
									Home
								</Link>
							</li>
							<li>
								<Link
									to="/login"
									className="niche-blue-hover-dark transition-colors"
								>
									Sign In
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-4">Legal</h3>
						<ul className="space-y-2 text-gray-400">
							<li>
								<Link
									to="/privacy"
									className="niche-blue-hover-dark transition-colors"
								>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									to="/terms"
									className="niche-blue-hover-dark transition-colors"
								>
									Terms of Service
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-4">Contact</h3>
						<ul className="space-y-2 text-gray-400">
							<li>Email: support@nichemovies.com</li>
							<li>Phone: (555) 123-4567</li>
						</ul>
					</div>
				</div>

				<div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
					<p>
						&copy; {new Date().getFullYear()} Niche Movies. All
						rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
