import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AuthPage = ({
	isLogin: initialIsLogin = true,
}: {
	isLogin?: boolean;
}) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [gender, setGender] = useState("");
	const [state, setState] = useState("");
	const [streamingServices, setStreamingServices] = useState<string[]>([]);
	const [passwordError, setPasswordError] = useState("");
	const [age, setAge] = useState("");
	const [city, setCity] = useState("");
	const [zip, setZip] = useState("");
	const navigate = useNavigate();
	const [isMfaLoginStep, setIsMfaLoginStep] = useState(false);
	const [mfaCode, setMfaCode] = useState("");

	const handleStreamingChange = (service: string) => {
		setStreamingServices((prev) =>
			prev.includes(service)
				? prev.filter((s) => s !== service)
				: [...prev, service]
		);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!initialIsLogin && (password.length < 15 || password.length > 30)) {
			setPasswordError("Password must be between 15 and 30 characters.");
			return;
		}

		setPasswordError("");

		const endpoint = initialIsLogin
			? "https://localhost:4000/login"
			: "https://localhost:4000/register";

		const body = initialIsLogin
			? { email, password }
			: {
					email,
					password,
					name,
					phone,
					age: parseInt(age),
					gender,
					city,
					state,
					zip: parseInt(zip),
					netflix: streamingServices.includes("Netflix"),
					hulu: streamingServices.includes("Hulu"),
					max: streamingServices.includes("Max"),
					disneyPlus: streamingServices.includes("Disney+"),
					amazonPrime: streamingServices.includes("Amazon Prime"),
					paramountPlus: streamingServices.includes("Paramount+"),
					appleTVPlus: streamingServices.includes("Apple TV+"),
					peacock: streamingServices.includes("Peacock"),
				};

		try {
			const res = await fetch(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			const data = await res.json();

			if (!res.ok) {
				alert(data.message || "Something went wrong.");
				return;
			}

			if (initialIsLogin) {
				if (data.mfaRequired) {
					// MFA required – show MFA code input step
					setIsMfaLoginStep(true);
					return;
				}

				localStorage.setItem("isLoggedIn", "true");
				localStorage.setItem(
					"isAdmin",
					data.isAdmin ? "true" : "false"
				);
				navigate(data.isAdmin ? "/admin" : "/movies");
			} else {
				localStorage.setItem("isLoggedIn", "true");
				localStorage.setItem("isAdmin", "false");

				// Set flag so /movies knows to show MFA prompt
				sessionStorage.setItem("justSignedUp", "true");
				localStorage.setItem("userEmail", email);

				navigate("/movies");
			}
		} catch (err) {
			console.error(err);
			alert("An error occurred. Please try again.");
		}
	};

	if (isMfaLoginStep) {
		return (
			<div className="min-h-screen pt-20 pb-12 flex items-center justify-center px-4 bg-black bg-opacity-90">
				<div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-lg">
					<h2 className="text-3xl font-bold text-center text-white">
						Multi-Factor Authentication
					</h2>
					<p className="text-center text-gray-400">
						Enter the 6-digit code from your authenticator app
					</p>

					<div className="space-y-4">
						<input
							type="text"
							value={mfaCode}
							onChange={(e) => setMfaCode(e.target.value)}
							placeholder="6-digit code"
							className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
						/>
						<button
							className="bg-green-600 px-4 py-2 rounded-md w-full font-medium text-white"
							onClick={async () => {
								try {
									const res = await fetch(
										"https://localhost:4000/login-mfa",
										{
											method: "POST",
											headers: {
												"Content-Type":
													"application/json",
											},
											body: JSON.stringify({
												email,
												code: mfaCode,
											}),
										}
									);

									const result = await res.json();

									if (res.ok) {
										localStorage.setItem(
											"isLoggedIn",
											"true"
										);
										localStorage.setItem(
											"isAdmin",
											result.isAdmin ? "true" : "false"
										);
										navigate(
											result.isAdmin
												? "/admin"
												: "/movies"
										);
									} else {
										alert(
											result.message ||
												"Invalid MFA code."
										);
									}
								} catch (err) {
									alert("Something went wrong.");
									console.error(err);
								}
							}}
						>
							Verify & Sign In
						</button>

						<button
							className="text-sm text-gray-400 hover:underline mt-2"
							onClick={() => {
								setIsMfaLoginStep(false);
								setMfaCode("");
							}}
						>
							← Back to login
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen pt-20 pb-12 flex items-center justify-center px-4">
			<div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-lg">
				<div>
					<h2 className="text-3xl font-bold text-center text-white">
						{initialIsLogin
							? "Sign in to your account"
							: "Create your account"}
					</h2>
					<p className="mt-2 text-center text-gray-400">
						{initialIsLogin ? (
							<>
								Or{" "}
								<button
									className="account-sign-text underline"
									onClick={() => navigate("/register")}
								>
									create a new account
								</button>
							</>
						) : (
							<>
								Already have an account?{" "}
								<button
									className="account-sign-text underline"
									onClick={() => navigate("/login")}
								>
									Sign in
								</button>
							</>
						)}
					</p>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					{!initialIsLogin && (
						<>
							<div>
								<label
									htmlFor="first-name"
									className="block text-sm font-medium text-white"
								>
									Name
								</label>
								<input
									id="first-name"
									name="first-name"
									type="text"
									required
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="input-border-hover-blue-light mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
								/>
							</div>

							<div>
								<label
									htmlFor="phone"
									className="block text-sm font-medium text-white"
								>
									Phone Number <br />
									<span className="text-gray-400 text-xs">
										* Format: 123-456-7890
									</span>
								</label>
								<input
									id="phone"
									name="phone"
									type="tel"
									placeholder="123-456-7890"
									value={phone}
									onChange={(e) => {
										const raw = e.target.value.replace(
											/\D/g,
											""
										);
										let formatted = raw;
										if (raw.length > 3 && raw.length <= 6) {
											formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
										} else if (raw.length > 6) {
											formatted = `${raw.slice(0, 3)}-${raw.slice(3, 6)}-${raw.slice(6, 10)}`;
										}
										setPhone(formatted);
									}}
									maxLength={12}
									className="input-border-hover-blue-light mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
								/>
							</div>
						</>
					)}

					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-white"
						>
							Email address
						</label>
						<input
							id="email"
							name="email"
							type="email"
							required
							value={email}
							placeholder={
								initialIsLogin
									? "Enter your email"
									: "example@movies.com"
							}
							onChange={(e) => setEmail(e.target.value)}
							className="input-border-hover-blue-light mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-white"
						>
							Password
						</label>
						<input
							id="password"
							name="password"
							type="password"
							required
							placeholder={
								initialIsLogin
									? "Enter your password"
									: "Must be 15-30 characters"
							}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="input-border-hover-blue-light mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
						/>
						{!initialIsLogin && passwordError && (
							<p className="mt-1 text-sm text-red-500">
								{passwordError}
							</p>
						)}
					</div>

					{!initialIsLogin && (
						<>
							<div>
								<label
									htmlFor="age"
									className="block text-sm font-medium text-white"
								>
									Age
								</label>
								<input
									id="age"
									name="age"
									type="number"
									min="0"
									value={age}
									onChange={(e) => setAge(e.target.value)}
									className="input-border-hover-blue-light mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
								/>
							</div>

							<div>
								<label
									htmlFor="gender"
									className="block text-sm font-medium text-white"
								>
									Gender
								</label>
								<select
									id="gender"
									name="gender"
									value={gender}
									onChange={(e) => setGender(e.target.value)}
									className="input-border-hover-blue-light mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
								>
									<option value="">Select</option>
									<option value="Male">Male</option>
									<option value="Female">Female</option>
								</select>
							</div>

							<div>
								<label
									htmlFor="city"
									className="block text-sm font-medium text-white"
								>
									City
								</label>
								<input
									id="city"
									name="city"
									type="text"
									value={city}
									onChange={(e) => setCity(e.target.value)}
									className="input-border-hover-blue-light mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
								/>
							</div>

							<div>
								<label
									htmlFor="state"
									className="block text-sm font-medium text-white"
								>
									State
								</label>
								<select
									id="state"
									name="state"
									value={state}
									onChange={(e) => setState(e.target.value)}
									className="input-border-hover-blue-light mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
								>
									<option disabled value="">
										Select
									</option>
									<option value="AL">Alabama</option>
									<option value="AK">Alaska</option>
									<option value="AZ">Arizona</option>
									<option value="AR">Arkansas</option>
									<option value="CA">California</option>
									<option value="CO">Colorado</option>
									<option value="CT">Connecticut</option>
									<option value="DE">Delaware</option>
									<option value="FL">Florida</option>
									<option value="GA">Georgia</option>
									<option value="HI">Hawaii</option>
									<option value="ID">Idaho</option>
									<option value="IL">Illinois</option>
									<option value="IN">Indiana</option>
									<option value="IA">Iowa</option>
									<option value="KS">Kansas</option>
									<option value="KY">Kentucky</option>
									<option value="LA">Louisiana</option>
									<option value="ME">Maine</option>
									<option value="MD">Maryland</option>
									<option value="MA">Massachusetts</option>
									<option value="MI">Michigan</option>
									<option value="MN">Minnesota</option>
									<option value="MS">Mississippi</option>
									<option value="MO">Missouri</option>
									<option value="MT">Montana</option>
									<option value="NE">Nebraska</option>
									<option value="NV">Nevada</option>
									<option value="NH">New Hampshire</option>
									<option value="NJ">New Jersey</option>
									<option value="NM">New Mexico</option>
									<option value="NY">New York</option>
									<option value="NC">North Carolina</option>
									<option value="ND">North Dakota</option>
									<option value="OH">Ohio</option>
									<option value="OK">Oklahoma</option>
									<option value="OR">Oregon</option>
									<option value="PA">Pennsylvania</option>
									<option value="RI">Rhode Island</option>
									<option value="SC">South Carolina</option>
									<option value="SD">South Dakota</option>
									<option value="TN">Tennessee</option>
									<option value="TX">Texas</option>
									<option value="UT">Utah</option>
									<option value="VT">Vermont</option>
									<option value="VA">Virginia</option>
									<option value="WA">Washington</option>
									<option value="WV">West Virginia</option>
									<option value="WI">Wisconsin</option>
									<option value="WY">Wyoming</option>
								</select>
							</div>

							<div>
								<label
									htmlFor="zip"
									className="block text-sm font-medium text-white"
								>
									ZIP Code
								</label>
								<input
									id="zip"
									name="zip"
									type="text"
									pattern="[0-9]{5}"
									maxLength={5}
									placeholder="12345"
									value={zip}
									onChange={(e) => setZip(e.target.value)}
									className="input-border-hover-blue-light mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
								/>
							</div>

							<fieldset className="mt-4">
								<legend className="text-sm font-medium text-white">
									Streaming Services
								</legend>
								<div className="mt-2 space-y-1">
									{[
										"Netflix",
										"Hulu",
										"Max",
										"Disney+",
										"Amazon Prime",
										"Paramount+",
										"Apple TV+",
										"Peacock",
									].map((service) => (
										<div
											key={service}
											className="flex items-center"
										>
											<input
												id={service}
												name={service}
												type="checkbox"
												checked={streamingServices.includes(
													service
												)}
												onChange={() =>
													handleStreamingChange(
														service
													)
												}
												className="h-4 w-4 text-blue-600 border-gray-300 rounded"
											/>
											<label
												htmlFor={service}
												className="ml-2 block text-sm text-white"
											>
												{service}
											</label>
										</div>
									))}
								</div>
							</fieldset>
						</>
					)}

					<div>
						<button
							type="submit"
							className="niche-blue-bkg w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
						>
							{initialIsLogin ? "Sign in" : "Create account"}
						</button>
					</div>
				</form>

				<div className="text-sm text-center">
					<Link
						to="/privacy"
						className="text-gray-400 niche-blue-hover-dark"
					>
						Privacy Policy
					</Link>
					{" | "}
					<Link
						to="/terms"
						className="text-gray-400 niche-blue-hover-dark"
					>
						Terms of Use
					</Link>
				</div>
			</div>
		</div>
	);
};

export default AuthPage;
