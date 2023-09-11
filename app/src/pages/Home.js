import React, { useEffect, useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";

import Navbar from "../components/Navbar";

import axios from "axios";

import { Button } from "@mui/material";

import { SERVER_ADDRESS } from "../utils/ServerParams";

const Home = () => {
	const token = localStorage.getItem("token");
	const [tickets, setTickets] = useState([]);

	const navigate = useNavigate();

	const navigateToAddTicket = () => {
		navigate("/addTicket");
	};

	const handleFinish = (id) => {
		console.log("i", id);
		axios
			.delete(`${SERVER_ADDRESS}/api/v1/ticket/${id}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			})
			.catch((err) => console.log(err));
	};

	const getAllticket = (a) => {
		axios
			.get(`${SERVER_ADDRESS}/api/v1/ticket`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			})
			.then((data) => {
				setTickets(data.data.tickets);
				// if (typeof data.data.tickets === "object") {
				// 	setTickets([data.data.tickets]);
				// 	// console.log("data", [data.data.tickets]);
				// } else {
				// 	setTickets(data.data.tickets);
				// }
			})
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		getAllticket();
	}, []);

	console.log("a", tickets);
	return (
		<div>
			<Navbar />
			<h1>Tickets</h1>
			<Button onClick={navigateToAddTicket}>Add Ticket</Button>
			console.log(tickets);
			{/* {tickets.map((data) => data.r_id)} */}
			{tickets.map((data, i) => (
				<div key={i}>
					TicketId:{data.r_id} ,title:
					<Link to={`/posts/${data.r_id}`}>{data.r_title}</Link> , createAt :
					{data.r_created_at}
					<Button onClick={() => handleFinish(data.r_id)}>Finish</Button>
					<hr />
				</div>
			))}
		</div>
	);
};

export default Home;
