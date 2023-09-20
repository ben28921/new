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
	Typography,
	Modal,
	Box,
	TextField,
} from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";
import { SERVER_ADDRESS } from "../utils/ServerParams";

const Home = () => {
	const token = localStorage.getItem("token");
	const [input, setInputs] = useState({ title: "" });
	const [title, setTitle] = useState("");
	const [tickets, setTickets] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [selectedId, setSelectedId] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);

	const handleModalOpen = () => setModalOpen(true);
	const handleModalClose = () => setModalOpen(false);

	const handleChange = (e) => {
		setInputs((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		// console.log(input);
		addTicket(input);
		// Swal.fire("Ticket add ");
		// history.push("/Home");
		// navigate("/home");
	};
	const addTicket = (data) => {
		console.log(data);
		axios
			.post(
				`${SERVER_ADDRESS}/api/v1/ticket`,
				{ f_title: title },
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then((data) => {
				console.log(data);
				// Swal.fire("Ticket add ");
				window.location.href = "/home";
			})
			.catch((err) => console.log(err));
	};

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
			{/* <h1>Tickets</h1> */}
			{/* <Button onClick={navigateToAddTicket}>Add Ticket</Button> */}

			{isLoading ? (
				<Loader />
			) : (
				// <TicketTable
				// 	ticketsData={tickets}
				// 	navigateToAddTicket={navigateToAddTicket}
				// 	onSelectTicket={handleSelectTicket}
				// />

				<TableContainer component={Paper}>
					<BuildIcon />
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead sx={{ backgroundColor: "grey" }}>
							<TableCell align="center" colSpan={5}>
								<div
									style={{ display: "flex", justifyContent: "space-around" }}
								>
									<Typography style={{ fontSize: 30 }}>Tickets</Typography>
									<Button onClick={handleModalOpen}>Add Ticket</Button>
								</div>
							</TableCell>
							<TableRow>
								<TableCell style={{ fontSize: 20 }}>Ticket ID</TableCell>
								<TableCell style={{ fontSize: 20 }}>Title</TableCell>
								{/* {console.log("name", ticketsData[0]?.r_name)} */}
								{/* {console.log("name", ticketsData)} */}
								{/* {console.log("name", ticketsData.hasOwnProperty("r_name"))} */}
								{tickets[0]?.r_name ? (
									<TableCell style={{ fontSize: 20 }}>Create By</TableCell>
								) : null}
								<TableCell style={{ fontSize: 20 }}>Create At</TableCell>
								<TableCell style={{ fontSize: 20 }}>Status</TableCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{tickets.map((data, i) => (
								<TableRow onClick={() => handleSelectTicket(data.r_id)} key={i}>
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
			)}
			<Modal
				open={modalOpen}
				onClose={handleModalClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box
					style={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: 400,
						height: 300,
						backgroundColor: "white",
						border: "2px solid #000",
						boxShadow: 24,
						p: 4,
						display: "flex",
						justifyContent: "space-evenly",
						alignItems: "center",
						flexDirection: "column",
					}}
				>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						Add Ticket
					</Typography>
					<form autoComplete="off" onSubmit={handleSubmit}>
						<TextField
							label="Title"
							onChange={(e) => setTitle(e.target.value)}
							required
							variant="outlined"
							color="secondary"
							sx={{ mb: 3 }}
							fullWidth
							value={title}
						/>
						<Button
							variant="outlined"
							sx={{ width: "100%", margin: "auto", borderRadius: 7 }}
							color="secondary"
							type="submit"
						>
							Create
						</Button>
					</form>
				</Box>
			</Modal>
		</div>
	);
};

// function TicketTable({ ticketsData, onSelectTicket, navigateToAddTicket }) {
// 	return (
// 		<TableContainer component={Paper}>
// 			<Table sx={{ minWidth: 650 }} aria-label="simple table">
// 				<TableHead sx={{ backgroundColor: "grey" }}>
// 					<TableCell align="center" colSpan={5}>
// 						<div style={{ display: "flex", justifyContent: "space-around" }}>
// 							<Typography style={{ fontSize: 30 }}>Tickets</Typography>
// 							<Button onClick={navigateToAddTicket}>Add Ticket</Button>
// 						</div>
// 					</TableCell>
// 					<TableRow>
// 						<TableCell style={{ fontSize: 20 }}>Ticket ID</TableCell>
// 						<TableCell style={{ fontSize: 20 }}>Title</TableCell>
// 						{/* {console.log("name", ticketsData[0]?.r_name)} */}
// 						{/* {console.log("name", ticketsData)} */}
// 						{/* {console.log("name", ticketsData.hasOwnProperty("r_name"))} */}
// 						{ticketsData[0]?.r_name ? (
// 							<TableCell style={{ fontSize: 20 }}>Create By</TableCell>
// 						) : null}
// 						<TableCell style={{ fontSize: 20 }}>Create At</TableCell>
// 						<TableCell style={{ fontSize: 20 }}>Status</TableCell>
// 					</TableRow>
// 				</TableHead>

// 				<TableBody>
// 					{ticketsData.map((data, i) => (
// 						<TableRow onClick={() => onSelectTicket(data.r_id)} key={i}>
// 							<TableCell>{data.r_id}</TableCell>
// 							<TableCell>
// 								<Link to={`/posts/${data.r_id}`}>{data.r_title}</Link>
// 							</TableCell>
// 							{data.r_name ? (
// 								<TableCell>
// 									{data.r_name}
// 									{/* {console.log(data)} */}
// 								</TableCell>
// 							) : null}
// 							<TableCell>
// 								{Moment(data.r_created_at).format("MM/DD/YYYY HH:mm")}
// 							</TableCell>
// 							{/* <TableCell>Not solve</TableCell> */}

// 							<TableCell>{!data.r_is_solved ? "open" : "close"}</TableCell>
// 						</TableRow>
// 					))}
// 				</TableBody>
// 			</Table>
// 		</TableContainer>
// 	);
// }

function TicketDetails({ selectedId }) {}

function Loader() {
	return <p>Loading...</p>;
}
export default Home;
