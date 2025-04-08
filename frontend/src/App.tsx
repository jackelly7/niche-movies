import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import MoviesPage from "./pages/MoviesPage";
import PrivacyPage from "./pages/PrivacyPage";
import ScrollToTop from "./components/ScrollToTop";
import AdminPage from "./pages/AdminPage";

function App() {
	return (
		<Router>
			<div className="page-bkg min-h-screen text-gray-100 flex flex-col">
				<Header />
				<ScrollToTop />
				<main className="flex-grow">
					<Routes>
						<Route path="/" element={<LandingPage />} />
						<Route path="/login" element={<AuthPage isLogin={true} />} />
						<Route path="/register" element={<AuthPage isLogin={false} />} />
						<Route path="/movies" element={<MoviesPage />} />
						<Route path="/admin" element={<AdminPage />} />
						<Route path="/privacy" element={<PrivacyPage />} />
					</Routes>
				</main>
				<Footer />
			</div>
		</Router>
	);
}

export default App;
