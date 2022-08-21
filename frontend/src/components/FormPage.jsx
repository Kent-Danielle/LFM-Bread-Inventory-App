import {
	Button,
	Box,
	Flex,
	VStack,
	Heading,
	Center,
	ButtonGroup,
	Skeleton,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { createContext, useState, useEffect } from "react";
import { CheckIcon } from "@chakra-ui/icons";
import PreviousOrderForm from "./PreviousOrderForm";
import SaleStatusForm from "./SaleStatusForm";
import EditOrderForm from "./EditOrderForm";

export const FormContext = createContext(null);

const steps = ["Previous Order", "Sale Status", "Edit Order"];

function FormPage() {
	const [loaded, setLoaded] = useState(false);
	const [prevOrder, setPrevOrder] = useState({});
	const [saleStatus, setSaleStatus] = useState({});
	const [step, setStep] = useState(0);
	let [isEmpty, setIsEmpty] = useState(false);
	let [breads, setBreads] = useState([]);
	let [orders, setOrders] = useState([]);

	useEffect(() => {
		let tempOrder = {};
		async function fetchBread() {
			const fetchBreadResponse = await fetch("/data/getBreads", {
				method: "GET",
			});

			const fetchBreadResult = await fetchBreadResponse.json();

			const fetchBreadOrder = await fetch("/data/getPrevOrders", {
				method: "GET",
			});

			const { weekOrders, day } = await fetchBreadOrder.json();

			setOrders(weekOrders);
			setBreads(fetchBreadResult);

			weekOrders.forEach((order) => {
				if (order[day] === null) {
					setIsEmpty(true);
				}
				tempOrder[order.bread] = order[day] === null ? 0 : order[day];
			});

			setPrevOrder((prev) => ({ ...prev, ...tempOrder }));
			setLoaded(true);
		}

		fetchBread();
	}, []);

	function getStepContent(step) {
		switch (step) {
			case 0:
				return <PreviousOrderForm isEmpty={isEmpty} />;
			case 1:
				return <SaleStatusForm />;
			case 2:
				return <EditOrderForm />;
			default:
				throw new Error("Unknown step");
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault();

		setLoaded(false);

		switch (step) {
			case 0:
				const response = await fetch("/data/addPrevOrders", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(prevOrder),
				});
				break;
			case 1:
				console.log(saleStatus);
				break;
			case 2:
				break;
			default:
				throw new Error("Unknown step");
		}

		setLoaded(true);
		handleNext();
	};

	const handleNext = () => {
		setStep(step + 1);
	};

	const handleBack = () => {
		setStep(step - 1);
	};

	const navigate = useNavigate();
	return (
		<>
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
					navigate("/home");
				}}
			>
				Return
			</Button>
			<Flex justifyContent={"space-around"} mb={["2rem"]}>
				<VStack w={"7em"}>
					<Center
						h={["2.5rem", "3rem"]}
						w={["2.5rem", "3rem"]}
						borderRadius={"full"}
						bg={step >= 0 ? "carbon.400" : "gray.300"}
						textAlign={"center"}
						color={"white"}
						fontWeight={"bold"}
						fontSize={"xl"}
					>
						{step > 0 ? <CheckIcon /> : 1}
					</Center>
					<Heading as="h1" size="sm" textAlign={"center"}>
						Yesterday's Order
					</Heading>
				</VStack>
				<VStack w={"7em"}>
					<Center
						h={["2.5rem", "3rem"]}
						w={["2.5rem", "3rem"]}
						borderRadius={"full"}
						bg={step >= 1 ? "carbon.400" : "gray.300"}
						textAlign={"center"}
						color={"white"}
						fontWeight={"bold"}
						fontSize={"xl"}
					>
						{step > 1 ? <CheckIcon /> : 2}
					</Center>
					f
					<Heading as="h1" size="sm" textAlign={"center"}>
						Sale Status
					</Heading>
				</VStack>
				<VStack w={"7em"}>
					<Center
						h={["2.5rem", "3rem"]}
						w={["2.5rem", "3rem"]}
						borderRadius={"full"}
						bg={step >= 2 ? "carbon.400" : "gray.300"}
						textAlign={"center"}
						color={"white"}
						fontWeight={"bold"}
						fontSize={"xl"}
					>
						{step > 2 ? <CheckIcon /> : 3}
					</Center>
					<Heading as="h1" size="sm" textAlign={"center"}>
						Edit Order
					</Heading>
				</VStack>
			</Flex>
			<>
				{step === steps.length ? (
					<>
						<Heading>tysm</Heading>
					</>
				) : (
					<>
						<FormContext.Provider
							value={{
								prevOrder,
								setPrevOrder,
								loaded,
								setLoaded,
								saleStatus,
								setSaleStatus,
								breads,
								orders,
							}}
						>
							<Flex
								onSubmit={handleSubmit}
								id="OrderForm"
								direction={"column"}
								as="form"
							>
								<Skeleton
									display={loaded && "none"}
									isLoaded={loaded}
									fadeDuration={4}
									height={["20rem"]}
									borderRadius={["lg"]}
								/>
								{getStepContent(step)}
								<Box mb={"5rem"}></Box>
								<ButtonGroup
									display={"flex"}
									position={"fixed"}
									width={"100%"}
									bottom={0}
									bg={"white"}
									p={"1rem"}
									justifyContent={"center"}
									justifySelf={"flex-end"}
									alignSelf={"center"}
									spacing="6"
									zIndex={99}
								>
									<Button disabled={step === 0} onClick={handleBack}>
										Back
									</Button>
									<Button disabled={step > 2} type="submit" form="OrderForm">
										{step === 2 ? "Submit" : "Next"}
									</Button>
								</ButtonGroup>
							</Flex>
						</FormContext.Provider>
					</>
				)}
			</>
		</>
	);
}

export default FormPage;
