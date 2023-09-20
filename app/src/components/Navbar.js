import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
	AppBar,
	Box,
	Grid,
	Toolbar,
	Typography,
	IconButton,
	Button,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TuneIcon from "@mui/icons-material/Tune";
import LogoutIcon from "@mui/icons-material/Logout";
import { auto } from "async";

const NavItem = ({ exact, to, children }) => {
	return (
		<NavLink
			to={to}
			style={({ isActive }) => ({
				textDecoration: "none",
				color: isActive ? "white" : "black",
				borderBottom: isActive ? "3px solid #00C36E" : null,
			})}
		>
			{children}
		</NavLink>
	);
};

const Navbar = () => {
	const navigate = useNavigate();
	const handleClick = () => {
		navigate("/login");
		localStorage.clear();
	};
	return (
		<>
			{/* <AppBar>
				<Toolbar></Toolbar>
			</AppBar> */}
			<Box sx={{ display: "flex" }}>
				<AppBar component="nav" sx={{ zIndex: 999, position: "sticky" }}>
					<Toolbar>
						<Box>
							<Grid container sx={{ alignItems: "center" }}></Grid>
						</Box>
						<Box pl={1}>
							<NavItem to={"/Home"}>
								<Grid
									container
									px={7}
									sx={{
										alignItems: "center",
										height: "50px",
										borderRight: "1px solid black",
									}}
								>
									<Typography sx={{ fontWeight: "bold" }}>Home</Typography>
								</Grid>
							</NavItem>
						</Box>

						<Box>
							<NavItem to={"/User"}>
								<Grid
									container
									px={7}
									sx={{
										alignItems: "center",
										height: "50px",
										borderRight: "1px solid black",
									}}
								>
									<Typography sx={{ fontWeight: "bold" }}>User list</Typography>
								</Grid>
							</NavItem>
						</Box>

						<Box>
							<NavItem to={"/Adduser"}>
								<Grid
									container
									px={7}
									sx={{
										alignItems: "center",
										height: "50px",
										borderRight: "1px solid black",
									}}
								>
									<Typography sx={{ fontWeight: "bold" }}>Add User</Typography>
								</Grid>
							</NavItem>
						</Box>

						<Box>
							<NavItem to={"/addTicket"}>
								<Grid
									container
									px={7}
									sx={{
										alignItems: "center",
										height: "50px",
										borderRight: "1px solid black",
									}}
								>
									<Typography sx={{ fontWeight: "bold" }}>AddTicket</Typography>
								</Grid>
							</NavItem>
						</Box>
						<Box>
							<Grid container>
								<Button
									sx={{
										color: "black",
										fontWeight: "bold",
										display: "flex",
									}}
									onClick={handleClick}
								>
									logout
								</Button>
							</Grid>
						</Box>

						{/* 
						<Box ml={"auto"}>
							<Grid container sx={{ alignItems: "center" }}>
								<Box pr={1} sx={{ display: "none" }}>
									<IconButton>
										<TuneIcon sx={{ color: "#8CA4BD", fontSize: 26 }} />
									</IconButton>
								</Box>
								<Box pl={1}>
									<NavLink to={`/admin`}>
										<IconButton>
											<AccountCircleIcon
												sx={{ color: "#8CA4BD", fontSize: 40 }}
											/>
										</IconButton>
									</NavLink>
								</Box>
								<Box pl={2}>
									<IconButton
										onClick={() => {
											// dispatch(onLogout());
										}}
									>
										<LogoutIcon sx={{ color: "#8CA4BD", fontSize: 28 }} />
									</IconButton>
								</Box>
							</Grid>
						</Box> */}
					</Toolbar>
				</AppBar>
			</Box>
			{/* <NavLink to="/Home" activeStyle>
					Home
				</NavLink>

				<NavLink to="/User" activeStyle>
					User
				</NavLink>

				<NavLink to="/User" activeStyle>
					Ticket
				</NavLink> */}
		</>
	);
};

export default Navbar;
