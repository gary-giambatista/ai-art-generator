import { Configuration, OpenAIApi } from "openai";
import React, { useState } from "react";
import { DebounceInput } from "react-debounce-input";
import CircleLoader from "react-spinners/CircleLoader";
import "./App.css";
import Image from "./components/Image";

function App() {
	//state
	const [userPrompt, setUserPrompt] = useState("");
	const [images, setImages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [apiKey, setApiKey] = useState("");
	const [count, setCount] = useState(1);
	const [size, setSize] = useState("256x256");

	//configure openAI
	const configuration = new Configuration({
		apiKey: apiKey,
	});
	const openai = new OpenAIApi(configuration);

	//api call to generate images, and set state
	const generateImage = async (event) => {
		setLoading(true);
		let emptyArray = [];
		event.preventDefault();
		const imageParameters = {
			prompt: userPrompt,
			n: count,
			size: size,
		};

		try {
			const response = await openai.createImage(imageParameters);
			// const image_url = response.data.data[0].url;
			const urlData = response.data.data.forEach((picture) => {
				emptyArray.push(picture.url);
				// setImages((prevPic) => [...prevPic, picture.url]); why doesn't this work?
			});
			setImages(emptyArray);
			setLoading(false);
		} catch (error) {
			if (error.response) {
				console.log(error.response.status);
				console.log(error.response.data);
				if (error.response.data.error.code === "invalid_api_key")
					alert(`
					${JSON.stringify(error.response.data.error.code)},
					${JSON.stringify(error.response.data.error.message)}
				`);
			} else {
				console.log(error.message);
			}
			setLoading(false);
		}
	};

	return (
		<div className="App">
			<header className="header">
				<h1 className="title">Generate Art with Ai</h1>
			</header>
			{/* <Image /> */}
			<div className="requirements_container">
				<h2 className="requirements_title">
					{" "}
					First enter your{" "}
					<a href="https://beta.openai.com/account/api-keys">OpenAI API</a> key
					below
				</h2>
				<DebounceInput
					className="requirements_api_input"
					placeholder="sk-PVru72TUlIOy4mJopZpTT3BlbkFJwGuOaH1LqYgilfr8y7w..."
					// minLength={51}
					debounceTimeout={300}
					onChange={(event) => setApiKey(event.target.value)}
					value={apiKey}
				/>
				{apiKey.length >= 1 && apiKey.length !== 51 ? (
					<p className="requirements_prompt">
						{" "}
						Please enter the exact 51 character key
					</p>
				) : null}
			</div>
			<form className="form_container">
				<DebounceInput
					className="form_input"
					type="input"
					debounceTimeout={300}
					placeholder="Write about your picture..."
					onChange={(event) => setUserPrompt(event.target.value)}
					value={userPrompt}
					disabled={apiKey.length < 51}
				/>
				<button
					className="form_button"
					onClick={(event) => generateImage(event)}
					disabled={apiKey.length < 51}
				>
					Submit
				</button>
			</form>
			{userPrompt.length >= 1 ? (
				<form className="image_settings_container" htmlFor="count">
					<label className="settings_text">
						Amount
						<select
							className="count_selector"
							value={count}
							onChange={(event) => setCount(parseInt(event.target.value))}
						>
							<option value={1}>1</option>
							<option value={2}>2</option>
							<option value={3}>3</option>
							<option value={4}>4</option>
							<option value={5}>5</option>
						</select>
					</label>
					<label className="settings_text" htmlFor="size">
						Size
						<select
							className="size_selector"
							value={size}
							onChange={(event) => setSize(event.target.value)}
						>
							<option value="256x256">256x256</option>
							<option value="512x512">512x512</option>
							<option value="1024x1024">1024x1024</option>
						</select>
					</label>
				</form>
			) : null}
			<div className="image_row">
				{images.length > 0 && !loading ? (
					images.map((image, index) => {
						return <Image key={index} image={images[index]} />;
					})
				) : loading ? null : apiKey.length === 51 ? (
					<p className="description_text">
						{" "}
						Now type a search into the box above and click submit to generate
						your Ai images!
					</p>
				) : null}

				<CircleLoader
					cssOverride={override}
					loading={loading}
					aria-label="Loading Spinner"
					size={150}
					color="#36d7b7"
				/>
			</div>
			<div className="footer_container">
				<ul className="footer_text">
					<li>Desgined by Gary Giambatista</li>
					<li>Gary.Giambatista@gmail.com</li>
					<li>Copyright © Gary Giambatista 2022</li>
				</ul>
			</div>
		</div>
	);
}
//css style for CircleLoader
const override = {
	marginTop: 100,
	position: "relative",
};

export default App;
