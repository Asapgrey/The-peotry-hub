import React from "react";

const peotlist = (props) => {
	return (
		<div className="row">
			{props.poems.map((poem) => (
				<div className="col-3">
					<div className="card" key={poem.index}>
						<div className="card-title">
							<h3>poem title: {poem.title}</h3>
						</div>

						<div className="card-section">
							<h3>poem: {poem.poem}</h3>
						</div>
						<div className="card-footer">
							<h3>
								Price : {poem.price / 1000000000000000000}cUSD
							</h3>
						</div>
					</div>

					<div>
						<sm>
							<button
								type="button"
								className="btn btn-outline-primary"
								onClick={() => props.buypoem(poem.index)}
							>
								Buy poem
							</button>
						</sm>
						<sm>
							<button
								onClick={() => props.Like(poem.index)}
								className="btn btn-dark btn-b"
							>
								<i className="fa-solid fa-heart"></i>
							</button>
						</sm>
					</div>
				</div>
			))}
			;
		</div>
	);
};

export default peotlist;
