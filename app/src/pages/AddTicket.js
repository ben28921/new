import { Box, Button, FormLabel, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";

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
				"http://127.0.0.1:82/api/v1/ticket",
				{ f_title: input.id },
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
