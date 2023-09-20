// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

// import Login from "./pages/Login.js";
// function App() {
// 	return <Login />;
// }

// export default App;

import Login from "./pages/Login";
import Home from "./pages/Home";
import TicketDetail from "./pages/TicketDetail";
import AddTicket from "./pages/AddTicket";
import AddUser from "./pages/AddUser";
import User from "./pages/User";
import { Route, Routes } from "react-router-dom";

function App() {
	// const isLoggedIn = useSelector((state) => state.isLoggedIn);
	// console.log(isLoggedIn);
	return (
		<div>
			{/* <Login /> */}

			{/* <section> */}
			<Routes>
				{/* <Route index element={<App />} /> */}

				<Route path="/" element={<Login />} />
				<Route path="login" element={<Login />} />
				<Route path="home" element={<Home />} />
				<Route path="posts/:id" element={<TicketDetail />} />
				<Route path="addTicket" element={<AddTicket />} />
				<Route path="user" element={<User />} />
				<Route path="addUser" element={<AddUser />} />
			</Routes>
			{/* </section> */}
		</div>
	);
}

export default App;
