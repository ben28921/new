import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import {
	Box,
	Button,
	FormLabel,
	Grid,
	TextField,
	Typography,
} from "@mui/material";

import axios from "axios";

import Navbar from "../components/Navbar";
import { SERVER_ADDRESS } from "../utils/ServerParams";

const AddTicket = () => {
	const token = localStorage.getItem("token");

	const [input, setInputs] = useState({ title: "" });
	const [title, setTitle] = useState("");

	const handleChange = (e) => {
		setInputs((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(input);
		addTicket(input);
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
			.catch((err) => console.log(err));
	};
	return (
		// <Box>
		// 	<Navbar />
		// 	<h1>Add ticket</h1>
		// 	<form onSubmit={handleSubmit}>
		// 		<FormLabel>Title</FormLabel>
		// 		<TextField onChange={handleChange} name="title" value={input.title} />
		// 		<Button type="submit"> Add</Button>
		// 	</form>
		// </Box>
		<div>
			<Navbar />
			<Grid>
				{/* <Box display="flex" flexDirection={"column"} width="100%" height="100%">
					<Box display="flex" margin="auto" padding={2}>
						<Typography variant="h4">Add Tickets</Typography>
						<form onSubmit={handleSubmit}>
							<TextField
								fullWidth
								label="姓名"
								variant="filled"
								value={title}
								onChange={(event) => {
									setTitle(event.target.value);
								}}
							/>

							<Button
								color="warning"
								sx={{ width: "50%", margin: "auto", borderRadius: 7 }}
								type="submit"
							>
								Add
							</Button>
						</form>
					</Box>
					
				</Box> */}
				<Box display="flex" flexDirection={"column"} width="100%" height="100%">
					<Box display="flex" margin="auto" padding={2}>
						<form autoComplete="off" onSubmit={handleSubmit}>
							<h2>ADD TICKET</h2>
							<TextField
								label="Title"
								onChange={(e) => setTitle(e.target.value)}
								required
								variant="outlined"
								color="secondary"
								sx={{ mb: 3 }}
								fullWidth
								value={title}
								// error={emailError}
							/>

							<Button
								variant="outlined"
								sx={{ width: "100%", margin: "auto", borderRadius: 7 }}
								color="secondary"
								type="submit"
							>
								POST
							</Button>
						</form>
					</Box>
				</Box>
				{/* <Box>
					<Grid display="flex" justifyContent="center">
						<h1>test</h1>
						<Box>
							<form onSubmit={handleChange}>
								<TextField
									label="Title"
									onChange={(e) => setTitle(e.target.value)}
								/>
								<Button
									variant="outlined"
									sx={{ width: "100%", margin: "auto", borderRadius: 7 }}
									color="secondary"
									type="submit"
								>
									POST
								</Button>
							</form>
						</Box>
					</Grid>
				</Box> */}
			</Grid>
		</div>
	);
};

export default AddTicket;
