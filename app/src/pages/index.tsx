import { withUrqlClient } from "next-urql";
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";
import { Box, Heading, Link, Stack, Text, Flex } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { useState } from "react";

const Index = () => {
	const [variables, setVariables] = useState({
		limit: 15,
		cursor: null as null | string,
	});
	const [{ data, fetching }] = usePostsQuery({
		variables,
	});
	if (!data && !fetching) {
		return <Heading>Something went wrong.</Heading>;
	}

	return (
		<Layout>
			<Flex align="center">
				<Heading>Readit</Heading>
				<NextLink href="/create-post">
					<Link ml="auto">create post</Link>
				</NextLink>
			</Flex>
			<br />
			{!data && fetching ? (
				<div>loading...</div>
			) : (
				<Stack spacing={8}>
					{data!.posts.posts.map((p) => (
						<Box
							key={p.id}
							p={5}
							shadow="md"
							borderWidth="1px"
							borderRadius="lg"
						>
							<Heading fontSize="xl">{p.title}</Heading>
							<Text>
								posted by&nbsp;
								{p.creator.username}
							</Text>
							<Text mt={4}>{p.textSnippet}...</Text>
						</Box>
					))}
				</Stack>
			)}
			{data && data.posts.hasMore ? (
				<Flex>
					<Button
						onClick={() => {
							setVariables({
								limit: variables.limit,
								cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
							});
						}}
						isLoading={fetching}
						color="tan"
						shadow="md"
						my={8}
						mx="auto"
					>
						load more
					</Button>
				</Flex>
			) : null}
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
