import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import { AUTH_TOKEN } from '../constants';

class Login extends Component {
	state = {
		login: true,
		email: '',
		password: '',
		name: '',
	};

	render() {
		const { login, email, password, name } = this.state;
		return (
			<div>
				<h4 className="mv3">{login ? 'Login' : 'Sign Up'}</h4>
				<div className="flex flex-column">
					{!login && (
						<input
							value={name}
							onChange={e => this.setState({ name: e.target.value })}
							type="text"
							placeholder="Your name"
						/>
					)}
					<input
						value={email}
						onChange={e => this.setState({ email: e.target.value })}
						type="text"
						placeholder="Your email address"
					/>
					<input
						value={password}
						onChange={e => this.setState({ password: e.target.value })}
						type="text"
						placeholder={login ? 'Your password' : 'Choose a safe password'}
					/>
				</div>
				<div className="flex mt3">
					<div className="pointer mr2 button" onClick={() => this._confirm()}>
						{login ? 'login' : 'create account'}
					</div>
					<div
						className="pointer button"
						onClick={() => this.setState({ login: !this.state.login })}
					>
						{login ? 'need to create an account?' : 'already have an account?'}
					</div>
				</div>
			</div>
		);
	}

	_confirm = async () => {
		const { signupMutation, loginMutation } = this.props;
		const { login, email, password, name } = this.state;
		let token;
		if (login) {
			const res = await loginMutation({
				variables: {
					email,
					password
				}
			});
			token = res.data.login.token;
		} else {
			const res = await signupMutation({
				variables: {
					email,
					password,
					name
				}
			});
			token = res.data.signup.token;
		}
		this._saveUserData(token);
		this.props.history.push('/');
	}

	_saveUserData = token => {
		localStorage.setItem(AUTH_TOKEN, token);
	}
}

const SIGNUP_MUTATION = gql`
	mutation SignupMutation($email: String!, $password: String!, $name: String!) {
		signup(email: $email, password: $password, name: $name) {
			token
		}
	}
`;

const LOGIN_MUTATION = gql`
	mutation LoginMutation($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			token
		}
	}
`;

export default compose(
	graphql(SIGNUP_MUTATION, { name: 'signupMutation' }),
	graphql(LOGIN_MUTATION, { name: 'loginMutation' }),
)(Login)
