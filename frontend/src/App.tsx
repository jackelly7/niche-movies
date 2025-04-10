import { useEffect } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	useNavigate,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import MoviesPage from "./pages/MoviesPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import ScrollToTop from "./components/ScrollToTop";
import AdminPage from "./pages/AdminPage";

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
			const newExpiration = new Date(now.getTime() + 30 * 60 * 1000); // set to 30 minutes
			localStorage.setItem(
				"sessionExpiresAt",
				newExpiration.toISOString()
			);
		};

		checkSessionTimeout();

		const interval = setInterval(checkSessionTimeout, 10000);

		// Track user activity to reset session expiration
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
					<Route
						path="/login"
						element={<AuthPage isLogin={true} />}
					/>
					<Route
						path="/register"
						element={<AuthPage isLogin={false} />}
					/>
					<Route path="/home" element={<MoviesPage />} />
					<Route path="/admin" element={<AdminPage />} />
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
