import React from "react";
import { NextPage } from "next";

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
	return <div>token is {token}</div>;
};

ChangePassword.getInitialProps = ({ query }) => {
	console.log(query);
	return {
		token: query.token as string,
	};
};

// export async function getStaticProps({ params }) {
// 	return {
// 		props: params.token,
// 	};
// }

export default ChangePassword;
