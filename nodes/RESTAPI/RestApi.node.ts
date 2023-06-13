import { IExecuteFunctions } from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';


export class RestApi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'REST API',
		name: 'restApi',
		icon: 'file:emficon.svg',
		group: ['transform'],
		version: 1,
		description: 'EMF REST end point to perform CRUD operations',
		defaults: {
			name: 'EMF REST Node',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			// Node properties which the user gets displayed and
			// can change on the node.
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				placeholder: 'http://localhost:8080/department/all',
				description: 'This is the URL for the EMF REST endpoint',
				required: true,
			},
			{
				displayName: 'Method',
				name: 'method',
				type: 'options',
				options: [
					{
						name: 'DELETE',
						value: 'DELETE',
					},
					{
						name: 'GET',
						value: 'GET',
					},
					{
						name: 'POST',
						value: 'POST',
					},
					{
						name: 'PUT',
						value: 'PUT',
					},
				],
				default: 'GET',
				description: 'This is GET request method',
			},
			{
				displayName: 'Send Query Parameter',
				name: 'sendBody',
				type: 'boolean',
				default: false,
				noDataExpression: true,
				description: 'Whether the request has a body or not',
			},
			{
				displayName: 'Body Content Type',
				name: 'contentType',
				type: 'options',
				displayOptions: {
					show: {
						sendBody: [true],
					},
				},
				options: [
					{
						name: 'Form Urlencoded',
						value: 'form-urlencoded',
					},
					{
						name: 'Form-Data',
						value: 'multipart-form-data',
					},
					{
						name: 'JSON',
						value: 'json',
					},
					{
						// eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
						name: 'n8n Binary Data',
						value: 'binaryData',
					},
					{
						name: 'Raw',
						value: 'raw',
					},
				],
				default: 'json',
				description: 'Content-Type to use to send body parameters',
			},
			{
				displayName: 'Specify Body',
				name: 'specifyBody',
				type: 'options',
				displayOptions: {
					show: {
						sendBody: [true],
						contentType: ['json'],
					},
				},
				options: [
					{
						name: 'Using Fields Below',
						value: 'keypair',
					},
					{
						name: 'Using JSON',
						value: 'json',
					},
				],
				default: 'keypair',
				// eslint-disable-next-line n8n-nodes-base/node-param-description-miscased-json
				description:
					'The body can be specified using explicit fields (<code>keypair</code>) or using a JavaScript object (<code>json</code>)',
			},
			{
				displayName: 'Body Parameters',
				name: 'bodyParameters',
				type: 'fixedCollection',
				displayOptions: {
					show: {
						sendBody: [true],
						contentType: ['json'],
						specifyBody: ['keypair'],
					},
				},
				typeOptions: {
					multipleValues: true,
				},
				placeholder: 'Add Parameter',
				default: {
					parameters: [
						{
							name: '',
							value: '',
						},
					],
				},
				options: [
					{
						name: 'parameters',
						displayName: 'Parameter',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
								description:
									'ID of the field to set. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Value of the field to set',
							},
						],
					},
				],
			},
			{
				displayName: 'JSON',
				name: 'jsonBody',
				type: 'json',
				displayOptions: {
					show: {
						sendBody: [true],
						contentType: ['json'],
						specifyBody: ['json'],
					},
				},
				default: '',
			},
			{
				displayName: 'Body Parameters',
				name: 'bodyParameters',
				type: 'fixedCollection',
				displayOptions: {
					show: {
						sendBody: [true],
						contentType: ['multipart-form-data'],
					},
				},
				typeOptions: {
					multipleValues: true,
				},
				placeholder: 'Add Parameter',
				default: {
					parameters: [
						{
							name: '',
							value: '',
						},
					],
				},
				options: [
					{
						name: 'parameters',
						displayName: 'Parameter',
						values: [
							{
								displayName: 'Parameter Type',
								name: 'parameterType',
								type: 'options',
								options: [
									{
										// eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
										name: 'n8n Binary Data',
										value: 'formBinaryData',
									},
									{
										name: 'Form Data',
										value: 'formData',
									},
								],
								default: 'formData',
							},
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
								description:
									'ID of the field to set. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								displayOptions: {
									show: {
										parameterType: ['formData'],
									},
								},
								default: '',
								description: 'Value of the field to set',
							},
							{
								displayName: 'Input Data Field Name',
								name: 'inputDataFieldName',
								type: 'string',
								noDataExpression: true,
								displayOptions: {
									show: {
										parameterType: ['formBinaryData'],
									},
								},
								default: '',
								description:
									'The name of the incoming field containing the binary file data to be processed',
							},
						],
					},
				],
			},
			{
				displayName: 'Specify Body',
				name: 'specifyBody',
				type: 'options',
				displayOptions: {
					show: {
						sendBody: [true],
						contentType: ['form-urlencoded'],
					},
				},
				options: [
					{
						name: 'Using Fields Below',
						value: 'keypair',
					},
					{
						name: 'Using Single Field',
						value: 'string',
					},
				],
				default: 'keypair',
			},
			{
				displayName: 'Body Parameters',
				name: 'bodyParameters',
				type: 'fixedCollection',
				displayOptions: {
					show: {
						sendBody: [true],
						contentType: ['form-urlencoded'],
						specifyBody: ['keypair'],
					},
				},
				typeOptions: {
					multipleValues: true,
				},
				placeholder: 'Add Parameter',
				default: {
					parameters: [
						{
							name: '',
							value: '',
						},
					],
				},
				options: [
					{
						name: 'parameters',
						displayName: 'Parameter',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
								description:
									'ID of the field to set. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Value of the field to set',
							},
						],
					},
				],
			},
			{
				displayName: 'Body',
				name: 'body',
				type: 'string',
				displayOptions: {
					show: {
						sendBody: [true],
						specifyBody: ['string'],
					},
				},
				default: '',
				placeholder: 'field1=value1&field2=value2',
			},
			{
				displayName: 'Input Data Field Name',
				name: 'inputDataFieldName',
				type: 'string',
				noDataExpression: true,
				displayOptions: {
					show: {
						sendBody: [true],
						contentType: ['binaryData'],
					},
				},
				default: '',
				description:
					'The name of the incoming field containing the binary file data to be processed',
			},
			{
				displayName: 'Content Type',
				name: 'rawContentType',
				type: 'string',
				displayOptions: {
					show: {
						sendBody: [true],
						contentType: ['raw'],
					},
				},
				default: '',
				placeholder: 'text/html',
			},
			{
				displayName: 'Body',
				name: 'body',
				type: 'string',
				displayOptions: {
					show: {
						sendBody: [true],
						contentType: ['raw'],
					},
				},
				default: '',
				placeholder: '',
			},
		],
	};

	// The function below is responsible for actually doing whatever this node
	// is supposed to do. In this case, we're just appending the `myString` property
	// with whatever the user has entered.
	// You can make async calls and use `await`.

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		let item: INodeExecutionData;
		let url: string;

		// Iterates over all input items and add the key "myString" with the
		// value the parameter "myString" resolves to.
		// (This could be a different value for each item in case it contains an expression)
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				url = this.getNodeParameter('url', itemIndex, '') as string;
				item = items[itemIndex];

				item.json['url'] = url;
			} catch (error) {
				// This node should never fail but we want to showcase how
				// to handle errors.
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					// Adding `itemIndex` allows other workflows to handle this error
					if (error.context) {
						// If the error thrown already contains the context property,
						// only append the itemIndex
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}
		return this.prepareOutputData(items);
	}
}
