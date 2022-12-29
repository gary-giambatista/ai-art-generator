import { Configuration, OpenAIApi } from "openai";
import React, { useState } from "react";
import "./App.css";
import Image from "./components/Image";

function App() {
	const configuration = new Configuration({
		apiKey: process.env.OPENAI_API_KEY,
	});
	const openai = new OpenAIApi(configuration);

	const [userPrompt, setUserPrompt] = useState<string>("");
	const [images, setImages] = useState<[string]>([
		"https://raw.githubusercontent.com/motdotla/dotenv/master/dotenv.svg",
	]);

	const generateImage = async (event: any) => {
		event.target.preventDefault();
		const imageParameters = {
			prompt: userPrompt,
			n: 2,
			size: "512x512",
		};

		console.log("clicked");

		try {
			const response = await openai.createImage(imageParameters as any);

			const urlData = response.data.data.forEach((picture: any) => {
				console.log(picture);
				// setImages(prevPictures => ...prevPictures, picture.url)
				return urlData;
			});
		} catch (error: any) {
			if (error.response) {
				console.log(error.response.status);
				console.log(error.response.data);
			} else {
				console.log(error.message);
			}
		}
	};

	return (
		<div className="App">
			<header className="header">
				<h1>Generate Art with AI</h1>
			</header>
			{/* <Image /> */}
			<form
				className="form_container"
				action="submit"
				onSubmit={(event) => generateImage(event)}
			>
				<input
					className="form_input"
					type="input"
					onChange={(event) => setUserPrompt(event.target.value)}
				/>
				<input className="form_button" type="submit" />
			</form>
			<div className="image_row">
				<Image image={images[0]} />
			</div>
		</div>
	);
}

export default App;
