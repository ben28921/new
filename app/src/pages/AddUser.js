import React from "react";

import { TextField, FormLabel, Button } from "@mui/material";

import Navbar from "../components/Navbar";
import { SERVER_ADDRESS } from "../utils/ServerParams";

const AddUser = () => {
	const handleSubmit = (e) => {
		e.preventDefault();
		alert("clicked");
	};
	return (
		<div>
			<Navbar />
			<h1>Add user</h1>
			<form onSubmit={handleSubmit}>
				<FormLabel>Name</FormLabel>
				<TextField></TextField>
				<Button type="submit">submit</Button>
			</form>
		</div>
	);
};

export default AddUser;
