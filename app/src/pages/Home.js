import React, { useEffect, useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";

import Navbar from "../components/Navbar";

import axios from "axios";
import Moment from "moment";

import {
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";

import { SERVER_ADDRESS } from "../utils/ServerParams";

const Home = () => {
	const token = localStorage.getItem("token");
	const [tickets, setTickets] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [selectedId, setSelectedId] = useState(null);
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

	function handleSelectTicket(id) {
		// setSelectedId((selectedId) => (id === selectedId ? null : id));
		// <Link to={`/posts/${id}`}></Link>;
		navigate(`/posts/${id}`);
		// alert(id);
	}
	// const handleSelectTicket = (id) => {
	// 	setSelectedId((selectedId) => (id === selectedId ? null : id));
	// };

	const getAllticket = (a) => {
		axios
			.get(`${SERVER_ADDRESS}/api/v1/ticket`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			})
			.then((data) => {
				setIsLoading(true);
				setTickets(data.data.tickets);
				// if (typeof data.data.tickets === "object") {
				// 	setTickets([data.data.tickets]);
				// 	// console.log("data", [data.data.tickets]);
				// } else {
				// 	setTickets(data.data.tickets);
				// }
				setIsLoading(false);
			})
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		getAllticket();
	}, []);

	console.log("Tickets", tickets);
	// console.log("a", tickets);
	return (
		<div>
			<Navbar />
			<h1>Tickets</h1>
			<Button onClick={navigateToAddTicket}>Add Ticket</Button>

			{isLoading ? (
				<Loader />
			) : (
				<TicketTable
					ticketsData={tickets}
					onSelectTicket={handleSelectTicket}
				/>
			)}
		</div>
	);
};

function TicketTable({ ticketsData, onSelectTicket }) {
	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell>TicketId</TableCell>
						<TableCell>Title</TableCell>
						{/* {console.log("name", ticketsData[0]?.r_name)} */}
						{/* {console.log("name", ticketsData)} */}
						{/* {console.log("name", ticketsData.hasOwnProperty("r_name"))} */}
						{ticketsData[0]?.r_name ? <TableCell>Create By</TableCell> : null}
						<TableCell>Create At</TableCell>
						<TableCell>Status</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{ticketsData.map((data, i) => (
						<TableRow onClick={() => onSelectTicket(data.r_id)} key={i}>
							<TableCell>{data.r_id}</TableCell>
							<TableCell>
								<Link to={`/posts/${data.r_id}`}>{data.r_title}</Link>
							</TableCell>
							{data.r_name ? (
								<TableCell>
									{data.r_name}
									{/* {console.log(data)} */}
								</TableCell>
							) : null}
							<TableCell>
								{Moment(data.r_created_at).format("MM/DD/YYYY HH:mm")}
							</TableCell>
							{/* <TableCell>Not solve</TableCell> */}

							<TableCell>{!data.r_is_solved ? "open" : "close"}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

function TicketDetails({ selectedId }) {}

function Loader() {
	return <p>Loading...</p>;
}
export default Home;
