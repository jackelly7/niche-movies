import { Link } from "react-router-dom";
import { Play } from "lucide-react";

const LandingPage = () => {
	return (
		<div className="flex flex-col">
			{/* Hero Section */}
			<section
				className="min-h-screen pt-20 flex items-center"
				style={{
					backgroundImage:
						'linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url("img/theater.jpeg")',
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>
				<div className="container mx-auto px-4">
					<div className="max-w-3xl">
						<h1 className="text-5xl md:text-6xl font-bold mb-6">
							Discover Extraordinary Cinema
						</h1>
						<p className="text-xl md:text-2xl text-gray-300 mb-8">
							Stream unique and exceptional films from around the
							world. Start your journey into the world of niche
							cinema today.
						</p>
						<div className="flex flex-col sm:flex-row gap-4">
							<Link
								to="/login"
								className="niche-blue-bkg text-white px-8 py-3 rounded-md font-semibold flex items-center justify-center transition-colors"
							>
								<Play className="w-5 h-5 mr-2" />
								Start Watching Now
							</Link>
							<Link
								to="/movies"
								className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-md font-semibold flex items-center justify-center transition-colors"
							>
								Browse Movies
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="page-bkg py-20">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
						Why Choose Niche Movies?
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="bg-gray-800 p-8 rounded-lg">
							<h3 className="text-xl font-semibold mb-4">
								Curated Selection
							</h3>
							<p className="text-gray-400">
								Carefully selected films that push boundaries
								and challenge perspectives.
							</p>
						</div>
						<div className="bg-gray-800 p-8 rounded-lg">
							<h3 className="text-xl font-semibold mb-4">
								High Quality
							</h3>
							<p className="text-gray-400">
								Stream in HD quality with optimized playback for
								the best viewing experience.
							</p>
						</div>
						<div className="bg-gray-800 p-8 rounded-lg">
							<h3 className="text-xl font-semibold mb-4">
								Exclusive Content
							</h3>
							<p className="text-gray-400">
								Access to rare and hard-to-find films not
								available on other platforms.
							</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default LandingPage;
