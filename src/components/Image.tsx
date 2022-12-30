import React from "react";
import "./Image.css";

interface Props {
	image: string;
}

const Image: React.FC<Props> = ({ image }) => {
	return (
		<div className="imageContainer">
			{/* <p className="image_title">Test</p> */}
			<img className="image" src={image} alt="Ai generated" />
		</div>
	);
};

export default Image;
