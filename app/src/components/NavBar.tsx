import { Box, Flex, Link } from "@chakra-ui/layout";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { Button } from "@chakra-ui/button";
import { isServer } from "../utils/isServer";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
	const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
	const [{ data, fetching }] = useMeQuery({
		pause: isServer(),
	});

	let body = null;

	if (fetching) {
	} else if (!data?.me) {
		body = (
			<>
				<NextLink href="/login">
					<Link mr={2}>login</Link>
				</NextLink>
				<NextLink href="/register">
					<Link>register</Link>
				</NextLink>
			</>
		);
	} else {
		body = (
			<Flex>
				<Box mr={4}>{data.me.username}</Box>
				<Button
					onClick={() => {
						logout();
					}}
					variant="link"
					isLoading={logoutFetching}
				>
					logout
				</Button>
			</Flex>
		);
	}

	return (
		<Flex position="sticky" top={0} zIndex={1} bg="tan" p={4}>
			<Box bg="tan" p={4} ml={"auto"}>
				{body}
			</Box>
		</Flex>
	);
};
