import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ReactSession } from "react-client-session";
import { Button, Box } from "@chakra-ui/react";
import CollapsibleHeaders from "./CollapsibleHeader";


function Home() {
	const navigate = useNavigate();
	let [breads, setBreads] = useState([]);
	let [orders, setOrders] = useState([]);

	// Redirect user if they're logged in or not
	useEffect(() => {
		const isLoggedIn = ReactSession.get("loggedIn");

		if (isLoggedIn) {
			navigate("/home");
		} else {
			navigate("/login");
		}

		async function fetchBread() {
			const response1 = await fetch("/data/getBreads", {
				method: "GET",
			});

			const result1 = await response1.json();

			const response2 = await fetch("/data/getOrders", {
				method: "GET",
			});

			const result2 = await response2.json();

			setBreads(result1);
			setOrders(result2);
		}

		fetchBread();
	}, []);

	return (
		<Box>
			<Button
				opacity={0.85}
				alignSelf={"flex-start"}
				mb={"2em"}
				borderRadius={"full"}
				px={"1.5em"}
				py={"1em"}
				bgColor={"carbon.400"}
				color="white"
				boxShadow={"xl"}
				onClick={() => {
					navigate("/formpage");
				}}
			>
				Order Bread
			</Button>
			{breads.map((bread, index) => {
				return (
					<CollapsibleHeaders
						key={index}
						variant="home"
						breadCategory={bread._id}
						breads={bread.records}
						orders={orders}
					/>
				);
			})}
		</Box>
	);
}

export default Home;
