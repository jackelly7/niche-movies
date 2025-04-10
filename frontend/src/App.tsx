import { useEffect, ReactNode } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	useNavigate,
	Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import MoviesPage from "./pages/MoviesPage";
import AllMoviesPage from "./pages/AllMoviesPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import ScrollToTop from "./components/ScrollToTop";
import AdminPage from "./pages/AdminPage";

// 🔒 Protects any route that requires login
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
	const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
	return isLoggedIn ? <>{children}</> : <Navigate to="/" replace />;
};

const AdminRoute = ({ children }: { children: ReactNode }) => {
	const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
	const isAdmin = localStorage.getItem("isAdmin") === "true";
	return isLoggedIn && isAdmin ? <>{children}</> : <Navigate to="/" replace />;
};


function AppContent() {
	const navigate = useNavigate();

	useEffect(() => {
		const checkSessionTimeout = () => {
			const expiresAt = localStorage.getItem("sessionExpiresAt");
			const isLoggedIn = localStorage.getItem("isLoggedIn");

			if (expiresAt && isLoggedIn === "true") {
				const now = new Date();
				const expirationDate = new Date(expiresAt);

				if (now > expirationDate) {
					console.log("💥 Session expired!");
					localStorage.clear();
					navigate("/login");
				}
			}
		};

		const resetSessionExpiration = () => {
			const now = new Date();
			const newExpiration = new Date(now.getTime() + 30 * 60 * 1000);
			localStorage.setItem("sessionExpiresAt", newExpiration.toISOString());
		};

		checkSessionTimeout();
		const interval = setInterval(checkSessionTimeout, 10000);

		const events = ["click", "keydown", "mousemove", "scroll"];
		events.forEach((event) =>
			window.addEventListener(event, resetSessionExpiration)
		);

		return () => {
			clearInterval(interval);
			events.forEach((event) =>
				window.removeEventListener(event, resetSessionExpiration)
			);
		};
	}, [navigate]);

	return (
		<div className="page-bkg min-h-screen text-gray-100 flex flex-col">
			<Header />
			<ScrollToTop />
			<main className="flex-grow">
				<Routes>
					<Route path="/" element={<LandingPage />} />
					<Route path="/login" element={<AuthPage isLogin={true} />} />
					<Route path="/register" element={<AuthPage isLogin={false} />} />

					{/* 🔐 Protected routes */}
					<Route
						path="/home"
						element={
							<ProtectedRoute>
								<MoviesPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/all-movies"
						element={
							<ProtectedRoute>
								<AllMoviesPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin"
						element={
							<AdminRoute>
								<AdminPage />
							</AdminRoute>
						}
					/>

					{/* Public pages */}
					<Route path="/privacy" element={<PrivacyPage />} />
					<Route path="/terms" element={<TermsPage />} />
				</Routes>
			</main>
			<Footer />
		</div>
	);
}

function App() {
	return (
		<Router>
			<AppContent />
		</Router>
	);
}

export default App;
