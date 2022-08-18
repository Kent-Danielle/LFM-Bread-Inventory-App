import {
	Button,
	Box,
	Flex,
	VStack,
	Heading,
	Center,
	ButtonGroup,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { createContext, useState } from "react";
import { CheckIcon } from "@chakra-ui/icons";
import PreviousOrderForm from "./PreviousOrderForm";
import SaleStatusForm from "./SaleStatusForm";
import EditOrderForm from "./EditOrderForm";

function getStepContent(step) {
	switch (step) {
		case 0:
			return <PreviousOrderForm />;
		case 1:
			return <SaleStatusForm />;
		case 2:
			return <EditOrderForm />;
		default:
			throw new Error("Unknown step");
	}
}

export const OrderContext = createContext(null);

const steps = ["Previous Order", "Sale Status", "Edit Order"];

function FormPage() {
	const [prevOrder, setPrevOrder] = useState({})
	const [step, setStep] = useState(0);

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
						<OrderContext.Provider value={{prevOrder, setPrevOrder}}>
							<Flex direction={"column"} as="form">
								{getStepContent(step)}
							</Flex>
						</OrderContext.Provider>

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
							<Button disabled={step > 2} onClick={handleNext}>
								{step === 2 ? "Submit" : "Next"}
							</Button>
						</ButtonGroup>
					</>
				)}
			</>
		</>
	);
}

export default FormPage;
