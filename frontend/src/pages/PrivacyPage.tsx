const PrivacyPage = () => {
	return (
		<div className="min-h-screen pt-20 pb-12">
			<div className="container mx-auto px-4 max-w-3xl">
				<h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

				<div className="prose prose-invert">
					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							Introduction
						</h2>
						<p className="text-gray-300 mb-4">
							At Niche Movies, we take your privacy seriously.
							This privacy policy describes how we collect, use,
							and protect your personal information when you use
							our streaming service.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							Information We Collect
						</h2>
						<ul className="list-disc pl-6 text-gray-300 space-y-2">
							<li>Account information (name, email, password)</li>
							<li>Viewing history and preferences</li>
							<li>Payment information</li>
							<li>Device information and IP addresses</li>
							<li>Usage data and analytics</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							How We Use Your Information
						</h2>
						<p className="text-gray-300 mb-4">
							We use your information to:
						</p>
						<ul className="list-disc pl-6 text-gray-300 space-y-2">
							<li>Provide and improve our streaming service</li>
							<li>Personalize your viewing experience</li>
							<li>Process your payments</li>
							<li>Communicate with you about our service</li>
							<li>Prevent fraud and abuse</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							Data Security
						</h2>
						<p className="text-gray-300 mb-4">
							We implement appropriate technical and
							organizational measures to protect your personal
							information against unauthorized access, alteration,
							disclosure, or destruction.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							Your Rights
						</h2>
						<p className="text-gray-300 mb-4">
							You have the right to:
						</p>
						<ul className="list-disc pl-6 text-gray-300 space-y-2">
							<li>Access your personal information</li>
							<li>Correct inaccurate information</li>
							<li>Request deletion of your information</li>
							<li>Object to processing of your information</li>
							<li>Download a copy of your data</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							Contact Us
						</h2>
						<p className="text-gray-300">
							If you have any questions about this privacy policy
							or our practices, please contact us at
							privacy@nichemovies.com.
						</p>
					</section>
				</div>
			</div>
		</div>
	);
};

export default PrivacyPage;
