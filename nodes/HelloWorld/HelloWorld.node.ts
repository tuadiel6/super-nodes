import { IExecuteFunctions } from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class HelloWorld implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Hello World',
		name: 'helloWorld',
		icon: 'file:helloworld.svg',
		group: ['output'],
		version: 1,
		description: 'Outputs a Hello World message',
		defaults: {
			name: 'Hello World',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			// Node properties which the user gets displayed and
			// can change on the node.
			//{
			//	displayName: 'My String',
			//	name: 'myString',
			//	type: 'string',
			//	default: '',
			//	placeholder: 'Placeholder value',
			//	description: 'The description text',
			//},
		],
	};
	// The function below is responsible for actually doing whatever this node
	// is supposed to do. In this case, we're just appending the `myString` property
	// with whatever the user has entered.
	// You can make async calls and use `await`.
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    console.log('Hello World!');
    return [[]];
	}
}
