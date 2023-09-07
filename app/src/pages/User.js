import React, { useEffect, useState } from "react";

import axios from "axios";

import Navbar from "../components/Navbar";
import { SERVER_ADDRESS } from "../utils/ServerParams";

const User = () => {
	const token = localStorage.getItem("token");

	const [userData, setUserData] = useState([]);

	const getAllUserData = () =>
		axios
			.get(`${SERVER_ADDRESS}/api/v1/users`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			})
			.then((data) => {
				console.log("data", data.data.users);
				setUserData(data.data.users);
			});

	useEffect(() => {
		getAllUserData();
	}, []);
	console.log("user", userData);
	return (
		<div>
			<Navbar />
			<h1>User</h1>
			{userData.map((data) => (
				<div>
					{data.r_id}
					{data.r_name}
					<hr />
				</div>
			))}
		</div>
	);
};

export default User;
