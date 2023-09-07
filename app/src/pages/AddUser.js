import { TextField, FormLabel } from "@mui/material";
import React from "react";

import { SERVER_ADDRESS } from "../utils/ServerParams";

const AddUser = () => {
	return (
		<div>
			<FormLabel>Name</FormLabel>
			<TextField></TextField>
		</div>
	);
};

export default AddUser;
