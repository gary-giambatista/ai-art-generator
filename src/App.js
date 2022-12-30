import { Configuration, OpenAIApi } from "openai";
import React, { useState } from "react";
import CircleLoader from "react-spinners/CircleLoader";
import "./App.css";
import Image from "./components/Image";

function App() {
	//configure openAI
	const configuration = new Configuration({
		apiKey: process.env.OPEN_AI_KEY,
	});
	const openai = new OpenAIApi(configuration);

	//state
	const [userPrompt, setUserPrompt] = useState("");
	const [images, setImages] = useState([]);
	const [loading, setLoading] = useState(false);

	//api call to generate images, and set state
	const generateImage = async (event) => {
		setLoading(true);
		let emptyArray = [];
		event.preventDefault();
		const imageParameters = {
			prompt: userPrompt,
			n: 4,
			size: "256x256",
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
			} else {
				console.log(error.message);
			}
			setLoading(false);
		}
	};

	return (
		<div className="App">
			<header className="header">
				<h1 className="title">Generate Art with AI</h1>
			</header>
			{/* <Image /> */}
			<form className="form_container">
				<input
					className="form_input"
					type="input"
					placeholder="Write about your picture..."
					onChange={(event) => setUserPrompt(event.target.value)}
					value={userPrompt}
				/>
				<button
					className="form_button"
					onClick={(event) => generateImage(event)}
				>
					Submit
				</button>
			</form>
			<div className="image_row">
				{images.length > 0 && !loading ? (
					images.map((image, index) => {
						return <Image key={index} image={images[index]} />;
					})
				) : loading ? null : (
					<p className="description_text">
						{" "}
						Type a search into the box above to generate your AI images!
					</p>
				)}

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
