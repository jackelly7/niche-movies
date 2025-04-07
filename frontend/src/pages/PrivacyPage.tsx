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
							We are committed to protecting your privacy. This
							Privacy Policy explains how we collect, use,
							disclose, and safeguard your information when you
							visit and use Niche Movies (the "Service").
							<br />
							By using the Service, you agree to the collection
							and use of information in accordance with this
							Privacy Policy. If you do not agree, please do not
							use the Service.
						</p>
					</section>
					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							1. Information We Collect
						</h2>
						<h3 className="text-xl font-semibold">
							Personal Information:
						</h3>
						<ul className="list-disc pl-6 text-gray-300 space-y-1">
							<li>Name</li>
							<li>Email address</li>
							<li>Date of birth</li>
							<li>
								Payment information (for subscriptions, if
								applicable)
							</li>
							<li>Profile preferences (like favorite genres)</li>
						</ul>

						<h3 className="text-xl font-semibold mt-4">
							Usage Data:
						</h3>
						<ul className="list-disc pl-6 text-gray-300 space-y-1">
							<li>IP address</li>
							<li>Browser type</li>
							<li>Device type</li>
							<li>Pages visited</li>
							<li>Movies watched</li>
							<li>Ratings and reviews you submit</li>
							<li>Viewing history</li>
						</ul>

						<h3 className="text-xl font-semibold mt-4">
							Cookies and Tracking Technologies:
						</h3>
						<p className="text-gray-300">
							We use cookies and similar technologies to enhance
							your experience, such as remembering your
							preferences and analyzing site usage.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							2. How We Use Your Information
						</h2>
						<ul className="list-disc pl-6 text-gray-300 space-y-1">
							<li>Provide, operate, and maintain the Service</li>
							<li>Personalize your movie recommendations</li>
							<li>Process payments and manage subscriptions</li>
							<li>
								Communicate with you, including updates and
								promotional offers
							</li>
							<li>
								Monitor and analyze usage to improve the Service
							</li>
							<li>
								Enforce our Terms of Use and protect against
								fraud or abuse
							</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							3. Sharing Your Information
						</h2>
						<ul className="list-disc pl-6 text-gray-300 space-y-1">
							<li>
								<strong>Service Providers:</strong> Third
								parties who help us deliver our Service (e.g.,
								payment processors, hosting providers).
							</li>
							<li>
								<strong>Analytics Providers:</strong> To help us
								understand how the Service is being used.
							</li>
							<li>
								<strong>Legal Requirements:</strong> If required
								by law or to protect our rights and users’
								safety.
							</li>
						</ul>
						<p className="text-gray-300 mt-2">
							We do not sell or rent your personal information to
							third parties.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							4. Your Choices and Rights
						</h2>
						<ul className="list-disc pl-6 text-gray-300 space-y-1">
							<li>
								Access and update your information through
								account settings
							</li>
							<li>
								Request account deletion by contacting us at
								info@nichemovies.com
							</li>
							<li>
								Opt out of marketing emails via the unsubscribe
								link
							</li>
							<li>
								Additional rights may apply based on your local
								privacy laws
							</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							5. Security of Your Information
						</h2>
						<p className="text-gray-300">
							We use administrative, technical, and physical
							security measures to protect your information.
							However, no method of transmission over the internet
							is 100% secure.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							6. Children's Privacy
						</h2>
						<p className="text-gray-300">
							Niche Movies is not intended for children under 13
							years old. If you believe we have collected info
							from a child, please contact us.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							7. Changes to This Privacy Policy
						</h2>
						<p className="text-gray-300">
							We may update this Privacy Policy from time to time.
							Check back periodically for the latest version.
							Significant changes will be communicated directly.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							8. Contact Us
						</h2>
						<p className="text-gray-300">
							If you have questions or concerns, reach out at:
						</p>
						<ul className="list-none pl-0 text-gray-300">
							<li>Email: info@nichemovies.com</li>
							<li>
								Address: TNRB, Brigham Young University, Provo,
								UT 84602
							</li>
						</ul>
					</section>
				</div>
			</div>
		</div>
	);
};

export default PrivacyPage;
