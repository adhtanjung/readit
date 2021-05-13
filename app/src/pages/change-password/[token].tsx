import React, { useState } from "react";
import { NextPage } from "next";
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { toErrorMap } from "../../utils/toErrorMap";
import { useChangePasswordMutation } from "../../generated/graphql";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import NextLink from "next/link";

const ChangePassword: NextPage = () => {
	const router = useRouter();

	const [, changePassword] = useChangePasswordMutation();
	const [tokenError, setTokenError] = useState("");
	return (
		<Wrapper variant="small">
			<Formik
				initialValues={{ newPassword: "" }}
				onSubmit={async (values, { setErrors }) => {
					const response = await changePassword({
						newPassword: values.newPassword,
						token:
							typeof router.query.token === "string" ? router.query.token : "",
					});
					if (response.data?.changePassword.errors) {
						const errorMap = toErrorMap(response.data.changePassword.errors);

						if ("token" in errorMap) {
							setTokenError(errorMap.token);
						}

						setErrors(errorMap);
					} else if (response.data?.changePassword.user) {
						router.push("/");
					}
					// const response = await login(values);
					// if (response.data?.login.errors) {
					// 	setErrors(toErrorMap(response.data.login.errors));
					// } else if (response.data?.login.user) {
					// 	router.push("/");
					// }
				}}
			>
				{({ values, handleChange, isSubmitting }) => {
					return (
						<Form>
							<InputField
								name="newPassword"
								placeholder="New Password"
								label="New Password"
								type="password"
							/>
							{tokenError ? (
								<Flex>
									<Box mr={2} color="red">
										{tokenError}
									</Box>
									<NextLink href="/forgot-password">
										<Link>go to forgot password page</Link>
									</NextLink>
								</Flex>
							) : null}
							<Button
								mt={4}
								isLoading={isSubmitting}
								type="submit"
								colorScheme="red"
							>
								change password
							</Button>
						</Form>
					);
				}}
			</Formik>
		</Wrapper>
	);
};

// ChangePassword.getInitialProps = ({ query }) => {
// 	return {
// 		token: query.token as string,
// 	};
// };

// export async function getStaticProps({ params }) {
// 	return {
// 		props: params.token,
// 	};
// }

export default withUrqlClient(createUrqlClient)(ChangePassword);
