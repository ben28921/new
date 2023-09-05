import { React, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// import Avatar from '@mui/material/Avatar';
import Swal from "sweetalert2";

import {
	onShowLoading,
	onHideLoading,
	onLoggedIn,
	onLogout,
} from "../redux/actions/settings";

import {
	Typography,
	Box,
	Grid,
	Link,
	Container,
	Button,
	CssBaseline,
	TextField,
} from "@mui/material";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const defaultTheme = createTheme();

export default function Login() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [username, setUserName] = useState("");
	const [password, setPassword] = useState("");

	// const [authenticated, setAuthenticated] = useState(
	//   //set up the localStorage
	//   localStorage.getItem(localStorage.getItem("authenticated") || false)
	// );

	// const [loading, setLoading] = useState(false);

	useEffect(() => {
		dispatch(onLogout());
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(onShowLoading());
		// const data = new FormData(e.currentTarget);
		// setLoading(true);
		axios
			.post("http://127.0.0.1:82/api/v1/do-login", {
				f_username: username,
				f_password: password,
				// name: name,
				// password: password,
			})
			.then((res) => {
				// // check login status
				// console.log(res.data["msg"]);
				// setLoading(false);
				// if (res.data.token) {
				// 	localStorage.setItem("token", res.data.token);
				// 	localStorage.setItem("name", data.get("email"));
				// 	navigate("/draw");
				// } else {
				// 	// setLoading(false);
				// 	// alert("Wrong username or password");
				// 	Swal.fire("Wrong username or password");
				// }
				// console.log(res.data["msg"]);
				// // console.table(res.data);
				const { r_access_token, r_refresh_token } = res;
				dispatch(onHideLoading());
				dispatch(onLoggedIn(r_access_token, r_refresh_token));
				navigate("/");
			})
			.catch((error) => {
				console.error(error);
			});
	};
	return (
		<div className="container">
			<ThemeProvider theme={defaultTheme}>
				<Typography component="h1" variant="h5"></Typography>
				<Container component="main" maxWidth="xs">
					<CssBaseline />
					<Box
						sx={{
							// marginTop: 30,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							// height: "100vh",
							height: "100vh",
						}}
					>
						{/* <Title /> */}
						<Typography component="h1" variant="h5">
							Sign in
						</Typography>
						<Box
							component="form"
							onSubmit={handleSubmit}
							noValidate
							sx={{ mt: 1 }}
						>
							<TextField
								margin="normal"
								required
								fullWidth
								id="email"
								label="User Name"
								name="email"
								autoComplete="email"
								autoFocus
								// value={name}
								// onChange={(e) => setName(e.target.value)}
							/>
							<TextField
								margin="normal"
								required
								fullWidth
								name="password"
								label="Password"
								type="password"
								id="password"
								autoComplete="current-password"
								// value={password}
								// onChange={(e) => setPassword(e.target.value)}
							/>

							<Button
								type="submit"
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2, backgroundColor: "#0377fc" }}
							>
								Sign In
							</Button>

							<Grid container>
								<Grid item xs>
									<Link href="#" variant="body2"></Link>
								</Grid>
								<Grid item>
									<Link href="/signup" variant="body2">
										{"Don't have an account? Sign Up"}
									</Link>
								</Grid>
							</Grid>
						</Box>
					</Box>
				</Container>
			</ThemeProvider>
		</div>
	);
}
