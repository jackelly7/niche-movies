const TermsPage = () => {
	return (
		<div className="min-h-screen pt-20 pb-12">
			<div className="container mx-auto px-4 max-w-3xl">
				<h1
					className="text-4xl font-bold mb-8"
					style={{ marginTop: "10px" }}
				>
					Terms of Use
				</h1>

				<div className="prose prose-invert">
					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							Welcome to Niche Movies!
						</h2>
						<p className="text-gray-300">
							These Terms of Use ("Terms") govern your use of the
							Niche Movies website, apps, and related services
							(the "Service") provided by [Insert Company Name]
							("we," "our," or "us").
							<br />
							By accessing or using the Service, you agree to
							these Terms. If you do not agree, please do not use
							the Service.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							1. Eligibility
						</h2>
						<ul className="list-disc pl-6 text-gray-300 space-y-1">
							<li>
								You must be at least 13 years old to use the
								Service. If under 18, you must have parental or
								guardian consent.
							</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							2. Account Registration
						</h2>
						<ul className="list-disc pl-6 text-gray-300 space-y-1">
							<li>Provide accurate and complete information.</li>
							<li>Keep your account credentials secure.</li>
							<li>
								Notify us immediately if you suspect
								unauthorized use.
							</li>
							<li>
								You are responsible for all activity under your
								account.
							</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							3. Subscription and Payments
						</h2>
						<ul className="list-disc pl-6 text-gray-300 space-y-1">
							<li>You agree to pay all applicable fees.</li>
							<li>
								Payments are processed by third-party providers.
							</li>
							<li>
								Subscriptions renew automatically unless
								canceled before the renewal date.
							</li>
							<li>
								You can manage or cancel subscriptions via your
								account settings.
							</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							4. Use of the Service
						</h2>
						<ul className="list-disc pl-6 text-gray-300 space-y-1">
							<li>No account sharing.</li>
							<li>
								No unauthorized copying, distribution, or
								modification of content.
							</li>
							<li>
								No reverse engineering or interference with
								functionality.
							</li>
							<li>
								No harmful, illegal, or offensive content
								uploads.
							</li>
							<li>
								Violations may result in suspension or
								termination.
							</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							5. Content and Intellectual Property
						</h2>
						<p className="text-gray-300">
							All content is owned by or licensed to us and
							protected by law. You are granted a limited,
							non-exclusive, non-transferable license for
							personal, non-commercial use.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							6. User-Generated Content
						</h2>
						<ul className="list-disc pl-6 text-gray-300 space-y-1">
							<li>
								You grant us a worldwide, royalty-free license
								to use and distribute your content.
							</li>
							<li>
								You confirm your content does not violate laws
								or rights.
							</li>
							<li>We may remove content at our discretion.</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							7. Termination
						</h2>
						<p className="text-gray-300">
							We may suspend or terminate your access at any time
							for violations. You may cancel your account at any
							time via settings.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							8. Disclaimers
						</h2>
						<ul className="list-disc pl-6 text-gray-300 space-y-1">
							<li>
								The Service is provided "as is" without
								warranties.
							</li>
							<li>
								We do not guarantee content accuracy or
								completeness.
							</li>
							<li>
								We do not guarantee Service availability or
								security.
							</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							9. Limitation of Liability
						</h2>
						<p className="text-gray-300">
							To the fullest extent permitted by law, Niche Movies
							shall not be liable for any indirect, incidental, or
							consequential damages from your use of the Service.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							10. Changes to These Terms
						</h2>
						<p className="text-gray-300">
							We may update these Terms. Significant changes will
							be communicated. Continued use indicates acceptance.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							11. Governing Law
						</h2>
						<p className="text-gray-300">
							Governed by the laws of [Insert State/Country].
							Disputes will be resolved in courts in [Insert
							Location].
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							12. Contact Us
						</h2>
						<p className="text-gray-300">
							If you have questions about these Terms, please
							contact us at:
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

export default TermsPage;
