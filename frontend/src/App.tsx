import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import MoviesPage from "./pages/MoviesPage";
import PrivacyPage from "./pages/PrivacyPage";

function App() {
	return (
		<Router>
			<div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
				<Header />
				<main className="flex-grow">
					<Routes>
						<Route path="/" element={<LandingPage />} />
						<Route path="/auth" element={<AuthPage />} />
						<Route path="/movies" element={<MoviesPage />} />
						<Route path="/privacy" element={<PrivacyPage />} />
					</Routes>
				</main>
				<Footer />
			</div>
		</Router>
	);
}

export default App;
