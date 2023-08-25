import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Navigate, useOutlet } from "react-router-dom";

import { Login } from "./pages/Login.js";
import { Home } from "./pages/home";

const AppRoutes = () => {
	//const outlet = useOutlet();
	const dispatch = useDispatch();
	const { token } = useSelector((state) => state.settings);

	return (
		<Routes>
			{/* <Route path="*" element={<Error />} /> */}
			<Route path="/login" element={<Login />} />
			{/* <Route element={<ProtectedLayout token={token} />}>
				<Route path="/" element={<Home />} />
			</Route> */}
		</Routes>
	);
};

export default AppRoutes;
