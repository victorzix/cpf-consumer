/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const authenticationString: string = `${import.meta.env.VITE_GALAX_ID}:${
	import.meta.env.VITE_GALAX_HASH
}`;

const encodedAuthenticationString: string = btoa(authenticationString);

const headers = {
	Authorization: `Basic ${encodedAuthenticationString}`,
	'Content-Type': 'application/json',
};

export interface IUser {
	name: string;
	status: string;
}

export async function listCustomers(
	accessToken: string,
	doc: string
): Promise<string | IUser> {
	try {
		const response = await axios.get(
			`https://api-celcash.celcoin.com.br/v2/customers?documents=${doc}&startAt=0&limit=1`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		if (response.data.Customers.length == 0) {
			return 'Cliente não encontrado';
		}
		if (response.data.Customers[0].status != 'active') {
			return 'Inativo';
		}
		const user: IUser = {
			name: response.data.Customers[0].name,
			status:
				response.data.Customers[0].status == 'active' ? 'Ativo' : 'Inativo',
		};
		return user;
	} catch (error: any) {
		if (error.response.data.error.details.documents[0]) {
			return 'Documento inválido';
		}
		return 'Erro no sistema';
	}
}

export async function getAccessToken() {
	try {
		const response = await axios.post(
			`https://api-celcash.celcoin.com.br/v2/token`,
			{
				grant_type: 'authorization_code',
				scope: 'customers.read',
			},
			{ headers }
		);
		return response.data.access_token;
	} catch (error) {
		console.log(error);
		return error;
	}
}
