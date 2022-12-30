import { Configuration, OpenAIApi } from "openai";
import React, { useState } from "react";
import CircleLoader from "react-spinners/CircleLoader";
import "./App.css";
import Image from "./components/Image";

function App() {
	const configuration = new Configuration({
		apiKey: process.env.REACT_APP_API_KEY,
	});
	const openai = new OpenAIApi(configuration);

	const [userPrompt, setUserPrompt] = useState("");
	const [images, setImages] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);

	const generateImage = async (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		setLoading(true);
		let emptyArray: any[] = [];
		event.preventDefault();
		const imageParameters = {
			prompt: userPrompt,
			n: 3,
			size: "512x512",
		};

		try {
			const response = await openai.createImage(imageParameters as any);
			// const image_url = response.data.data[0].url;
			const urlData = response.data.data.forEach((picture): void => {
				emptyArray.push(picture.url);
				// setImages((prevPic) => [...prevPic, picture.url]); why doesn't this work?
			});
			setImages(emptyArray);
			setLoading(false);
		} catch (error: any) {
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
				<h1>Generate Art with AI</h1>
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
					<p> Type a search into the box above to generate your AI images!</p>
				)}
				<CircleLoader
					loading={loading}
					aria-label="Loading Spinner"
					size={150}
					color="#36d7b7"
				/>
			</div>
		</div>
	);
}
//

export default App;
