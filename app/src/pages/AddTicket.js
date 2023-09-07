import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import { Box, Button, FormLabel, TextField } from "@mui/material";

import axios from "axios";

import Navbar from "../components/Navbar";
import { SERVER_ADDRESS } from "../utils/ServerParams";

const AddTicket = () => {
	const token = localStorage.getItem("token");

	const [input, setInputs] = useState({ title: "" });

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
				{ f_title: input.title },
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
		<Box>
			<Navbar />
			<h1>Add ticket</h1>
			<form onSubmit={handleSubmit}>
				<FormLabel>Title</FormLabel>
				<TextField onChange={handleChange} name="title" value={input.title} />
				<Button type="submit"> Add</Button>
			</form>
		</Box>
	);
};

export default AddTicket;
