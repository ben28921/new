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

			<NavLink to="/User" activeStyle>
				Ticket
			</NavLink>
		</>
	);
};

export default Navbar;
