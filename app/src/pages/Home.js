import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import axios from "axios";

import { Button } from "@mui/material";

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
				// console.log(data.data.tickets);
			})
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		getAllticket();
	}, []);
	return (
		<div>
			<h1>Tickets</h1>
			<Button
				onClick={() => {
					alert("clicked");
				}}
			>
				Add Ticket
			</Button>
			{tickets.map((data, i) => (
				<div>
					TicketId:{data.r_id} ,title:
					<Link to={`/posts/${data.r_id}`}>{data.r_title}</Link> , createAt :
					{data.r_created_at}
					<hr />
				</div>
			))}
		</div>
	);
};

export default Home;
