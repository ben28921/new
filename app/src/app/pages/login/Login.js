// import React, { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";

// import Config from "config";

// import { Typography, Box, Grid, TextField, Button } from "@mui/material";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// import axios from "axios";

// import BackgroundImage from "../../img/Parking-Dashboard-login-02.jpg";
// import {
// 	onShowLoading,
// 	onHideLoading,
// 	onLoggedIn,
// 	onLogout,
// } from "../../redux/actions/settings";

// import { OvalButton } from "../../components";
// import { checkEmailValid } from "../../utils";
// import { SERVER_ADDRESS } from "../../utils/ServerParams";

// export const Login = () => {
// 	const navigate = useNavigate();
// 	const dispatch = useDispatch();

// 	// const [username, setUsername] = useState("applied_materials");
// 	// const [password, setPassword] = useState("password");
// 	const [username, setUsername] = useState("");
// 	const [password, setPassword] = useState("");
// 	//const [error, setError] = useState(false);

// 	useEffect(() => {
// 		dispatch(onLogout());
// 	}, []);

// 	const onSubmit = () => {
// 		//setError(false);
// 		dispatch(onShowLoading());

// 		axios
// 			.post(`${SERVER_ADDRESS}/api/v1/do-login`, {
// 				f_username: username,
// 				f_password: password,
// 			})
// 			.then(({ data }) => {
// 				const { r_access_token, r_refresh_token } = data;

// 				dispatch(onHideLoading());
// 				dispatch(onLoggedIn(r_access_token, r_refresh_token));
// 				navigate("/");
// 			})
// 			.catch((err) => console.error(err));
// 	};

// 	return (
// 		<React.Fragment>
// 			<Grid
// 				container
// 				sx={{
// 					height: "calc(100vh - 100px)",
// 					justifyContent: "center",
// 					alignItems: "center",
// 					backgroundColor: "#E5ECF6",
// 				}}
// 			>
// 				<Grid item xs={10} md={6} sx={{ textAlign: "center" }}>
// 					<Grid
// 						container
// 						sx={{
// 							minHeight: "450px",
// 							borderRadius: "5px",
// 							backgroundColor: "#FFF",
// 						}}
// 					>
// 						<Box
// 							flex={3}
// 							p={4}
// 							sx={{
// 								backgroundImage: `url(${BackgroundImage})`,
// 								backgroundPosition: "center",
// 							}}
// 						></Box>
// 						<Grid
// 							container
// 							flex={2}
// 							p={4}
// 							sx={{ justifyContent: "center", alignItems: "center" }}
// 						>
// 							<Box>
// 								<AccountCircleIcon sx={{ fontSize: 68, color: "#8CA4BD" }} />
// 								<Typography
// 									sx={{ display: "none" }}
// 									color={"#3F4254"}
// 									fontSize={30}
// 									fontWeight={"bold"}
// 								>
// 									歡迎回來，請點擊下方按鈕登入
// 								</Typography>
// 								<Grid container sx={{ justifyContent: "center" }}>
// 									<Box pt={2} sx={{ width: "100%" }}>
// 										<TextField
// 											fullWidth
// 											label="Username"
// 											variant="outlined"
// 											value={username}
// 											onChange={(event) => {
// 												setUsername(event.target.value);
// 											}}
// 										/>
// 									</Box>
// 									<Box pt={2} sx={{ width: "100%" }}>
// 										<TextField
// 											fullWidth
// 											label="Password"
// 											type="password"
// 											variant="outlined"
// 											value={password}
// 											onChange={(event) => {
// 												setPassword(event.target.value);
// 											}}
// 										/>
// 									</Box>
// 									<Box pt={4}>
// 										<OvalButton
// 											backgroundColor={"#00C36E"}
// 											onClick={() => onSubmit()}
// 										>
// 											<Typography color={"white"}>登入</Typography>
// 										</OvalButton>
// 									</Box>
// 								</Grid>
// 							</Box>
// 						</Grid>
// 					</Grid>
// 				</Grid>
// 			</Grid>
// 		</React.Fragment>
// 	);
// };
