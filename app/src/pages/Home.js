import React, { useEffect, useState } from "react";

import axios from "axios";

const Home = () => {
	const token = localStorage.getItem("token");
	const [tickets, setTickets] = useState([]);
	const getAllticket = (a) => {
		axios
			.get("http://127.0.0.1:82/api/v1/ticket", {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			})
			.then((data) => {
				setTickets(data.data.tickets);
				console.log(data.data.tickets);
			})
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		getAllticket();
	}, []);
	return (
		<div>
			{tickets.map((data, i) => (
				<div>
					Ticket:{data.r_title},id{data.r_id}
					<button>Detail</button>
				</div>
			))}
		</div>
	);
};

export default Home;
