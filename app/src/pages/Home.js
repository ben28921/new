import React from "react";

import axios from "axios";

const Home = () => {
	const getAllticket = (a) => {
		axios.get("http://127.0.0.1:82/api/v1/ticket");
	}.then((data) =>{
        
    })
	console.log(ticket);
	return <div>home</div>;
};

export default Home;
