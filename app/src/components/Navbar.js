import { NavLink } from "react-router-dom";

const Navbar = () => {
	return (
		<>
			<NavLink to="/Home" activeStyle>
				Home
			</NavLink>

			<NavLink to="/User" activeStyle>
				User
			</NavLink>
		</>
	);
};

export default Navbar;
