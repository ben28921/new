import React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

const Auth = () => {
	return (
		<div>
			<form>
				<Box
					display="flex"
					flexDirection={"column"}
					maxWidth={400}
					alignItems="center"
					justifyContent={"center"}
					margin="auto"
					marginTop={5}
					padding={3}
				>
					<Typography>Login</Typography>
					<TextField></TextField>
					<TextField></TextField>
					<TextField></TextField>
					<Button>Login</Button>
				</Box>
			</form>
		</div>
	);
};

export default Auth;
