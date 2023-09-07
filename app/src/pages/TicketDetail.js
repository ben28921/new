import React, { useEffect, useState } from "react";
import { useNavigate, useParams, NavLink } from "react-router-dom";

import axios from "axios";

import { TextField, Button } from "@mui/material";

import { SERVER_ADDRESS } from "../utils/ServerParams";
import Navbar from "../components/Navbar";

const TicketDetail = () => {
	const token = localStorage.getItem("token");
	const [posts, setPosts] = useState([]);
	const [newPost, setNewPost] = useState("");
	const { id } = useParams();

	useEffect(() => {
		getAllPosts();
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		axios
			.post(
				// `http://127.0.0.1:82/api/v1/posts/${id}`,
				`${SERVER_ADDRESS}/api/v1/posts/${id}`,
				{ f_content: newPost },
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.catch((err) => console.log(err));
	};
	const getAllPosts = (a) =>
		axios
			// .get(`${SERVER_ADDRESS}/api/v1/posts/${id}`)
			.get(`${SERVER_ADDRESS}/api/v1/posts/${id}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			})
			.then((data) => setPosts(data.data.posts))

			.catch((err) => console.log(err));
	// console.log(posts);
	console.log(id);
	console.log(posts);
	return (
		<div>
			<Navbar />
			<h1>ticketDetail</h1>
			<h2>Ticket id :{id}</h2>
			{posts.map((data) => (
				<div>
					postID:{data.r_id},userID:{data.r_user_id},content:{data.r_content}
					,createAt:{data.r_created_at}
				</div>
			))}
			<form onSubmit={handleSubmit}>
				<TextField
					value={newPost}
					onChange={(e) => setNewPost(e.target.value)}
				></TextField>
				<Button type="submit">Add Post</Button>
			</form>
		</div>
	);
};

export default TicketDetail;
