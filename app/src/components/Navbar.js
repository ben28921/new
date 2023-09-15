import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import { AppBar, Box, Grid, Toolbar, Typography } from "@mui/material";

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
									<Typography sx={{ fontWeight: "bold" }}>User</Typography>
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
						{/* 
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
