import {  IExecuteFunctions } from 'n8n-core';
import { INodeType, INodeExecutionData, INodeTypeDescription} from 'n8n-workflow';

import * as http from 'http';

export class HelloWorld implements INodeType {
  description: INodeTypeDescription = {
  displayName: 'Hello World',
  name: 'helloWorld',
  icon: 'file:helloworld.svg',
  group: ['transform'],
  version:  1,
	description: 'EMF-REST API to access the model',
	defaults: {
		name: 'EMF REST',
	},
  inputs: ['main'],
	outputs: ['main'],

  properties:  [
    {
      displayName: 'URL',
      name: 'url',
      type: 'string',
      default: '',
      required: true,
      placeholder: 'https://example.com/api',
			description: 'Use EMF-REST API',
    },
    // Additional properties for headers, body, etc.
    // Add more properties as per your requirements
		{
      displayName: 'Method',
      name: 'method',
      type: 'options',
      options: [
        {
          name: 'GET',
          value: 'GET',
        },
        {
          name: 'POST',
          value: 'POST',
        },
        {
          name: 'DELETE',
          value: 'DELETE',
        },
        {
          name: 'UPDATE',
          value: 'UPDATE',
        },
      ],
      default: 'GET',
      required: true,
    },
  ],
};
async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const url = this.getNodeParameter('url', 0) as string;
	const method = this.getNodeParameter('method', 0) as string;

	const options: http.RequestOptions = {
		method,
		headers: {
			'Content-Type': 'application/json',
		},
	};
 				// Perform the HTTP request
	const responseData = await new Promise<any>((resolve, reject) => {
		const req = http.get(url, options, (res) => {
			let data = '';

			res.on('data', (chunk) => {
				data += chunk;
			});

			res.on('end', () => {
				resolve(JSON.stringify(data));
			});
		});

		req.on('error', (error) => {
			reject(error);
		});
	});

	// Return the response data as output
	return this.prepareOutputData([{ json: responseData }]);
}
}
