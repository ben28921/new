import React, { useEffect, useState } from "react";
import { useNavigate, useParams, NavLink } from "react-router-dom";

import axios from "axios";
import Moment from "moment";

import {
	TextField,
	Button,
	Grid,
	ListItem,
	List,
	Typography,
	ListItemText,
	Paper,
	Box,
	TextareaAutosize,
} from "@mui/material";

import { SERVER_ADDRESS } from "../utils/ServerParams";
import Navbar from "../components/Navbar";

const TicketDetail = () => {
	const token = localStorage.getItem("token");
	const [posts, setPosts] = useState([]);
	const [newPost, setNewPost] = useState("");
	const { id } = useParams();
	const [loading, setLoading] = useState(false);

	// useEffect(() => {
	// 	// getAllPosts();
	// 	// setPosts(posts);
	// }, [posts]);
	useEffect(() => {
		getAllPosts();

		// setPosts(posts);
	}, []);

	// console.log(posts);
	// getAllPosts(),
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
			//
			.then(getAllPosts(), console.log("post2", posts))
			.catch((err) => console.log(err));
	};
	const getAllPosts = async (a) =>
		await axios
			// .get(`${SERVER_ADDRESS}/api/v1/posts/${id}`)
			.get(`${SERVER_ADDRESS}/api/v1/posts/${id}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			})
			.then((data) => {
				setLoading(true);
				setPosts(data.data.posts);
				// setPosts((posts) => [data.data.posts, ...posts]);
				setLoading(false);
			})

			.catch((err) => console.log(err));
	// console.log(posts);
	// console.log(id);
	// console.log(posts);
	return (
		<div>
			<Navbar />
			<Grid></Grid>
			<Paper
				display="flex"
				// alignItems="center"
				// justifyContent="center"
				// textAlign="center"
				elevation={3}
			>
				<h1>TicketDetail</h1>
				{/* {console.log(posts[0]?.r_title)} */}
				<h2>Ticket Title :{posts[0]?.r_title}</h2>
				{/* {posts.map((data) => (
					<div>
						postID:{data.r_id},userID:{data.r_user_id},content:{data.r_content}
						,createAt:{data.r_created_at}
					</div>
				))} */}
				<TicketMessage MessageData={posts} />
				<form onSubmit={handleSubmit}>
					<Grid>
						{/* <TextareaAutosize
							value={newPost}
							onChange={(e) => setNewPost(e.target.value)}
						></TextareaAutosize> */}
						<TextField
							placeholder="test"
							value={newPost}
							onChange={(e) => setNewPost(e.target.value)}
							multiline
							rows={5}
							cols={20}
						></TextField>
					</Grid>
					<select>
						<option value={0}>not sovled</option>
						<option value={1}>sovled</option>
					</select>
					<Button type="submit">Add Post</Button>
				</form>
			</Paper>
		</div>
	);
};

function NewLineText(props) {
	const text = props.text;
	const newText = text.split("\n").map((str) => <p>{str}</p>);
	return newText;
}

function TicketMessage({ MessageData }) {
	return (
		<>
			{MessageData.map((data, i) => (
				// <ListItem>
				// 	<ListItemText
				// 		primary={data.r_id}
				// 		secondary={data.r_content}
				// 	></ListItemText>
				// </ListItem>

				<Box key={i} sx={{ borderBottom: 1, padding: 3 }}>
					<Typography>UserName:{data.r_name}</Typography>
					<Typography>
						Content:
						<NewLineText text={data.r_content} />
					</Typography>
					<Typography>
						Created At: {Moment(data.r_created_at).format("MM/DD/YYYY HH:mm")}
					</Typography>
				</Box>
			))}
		</>
	);
}

// function inputText() {
// 	return (
// 		<>
// 			<form onSubmit={handleSubmit}>
// 				<TextField
// 					value={newPost}
// 					onChange={(e) => setNewPost(e.target.value)}
// 				></TextField>
// 				<Button type="submit">Add Post</Button>
// 			</form>
// 		</>
// 	);
// }

export default TicketDetail;
