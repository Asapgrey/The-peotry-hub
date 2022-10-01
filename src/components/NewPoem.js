import React from "react";

import { useState } from "react";

const NewPoem = (props) => {
	const [title, setTitle] = useState("");
	const [poem, setPoem] = useState("");
	const [price, setPrice] = useState("");

	const submitHandler = (e) => {
		e.preventDefault();

		if (!title || !poem || !price) {
			alert("Please fill up all fields");
			return;
		}
		props.addPoem(title, poem, price);
		setTitle("");
		setPoem("");
		setPrice("");
	};

	return (
		<div className="container mt-3">
			<h2>Poem form</h2>
			<form onSubmit={submitHandler}>
				<div className="mb-3 mt-3">
					<label for="title">Title:</label>
					<input
						type="title"
						className="form-control"
						id="title"
						placeholder="Enter title"
						name="email"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>

				<div className="mb-3">
					<label for="poem">Poem:</label>
					<input
						type="text"
						className="form-control"
						id="pwd"
						placeholder="Enter Poem"
						name="poem"
						value={poem}
						onChange={(e) => setPoem(e.target.value)}
					/>
				</div>
				<div className="mb-3">
					<label for="price">Price:</label>
					<input
						type="price"
						className="form-control"
						id="price"
						placeholder="Enter price"
						name="price"
						value={price}
						onChange={(e) => setPrice(e.target.value)}
					/>
				</div>

				<button type="submit" className="btn btn-primary">
					Add Poem
				</button>
			</form>
		</div>
	);
};

export default NewPoem;
