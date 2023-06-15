import {  IExecuteFunctions } from 'n8n-core';
import { INodeType, INodeExecutionData, INodeTypeDescription} from 'n8n-workflow';

import * as http from 'http';

export class EmfRest implements INodeType {
  description: INodeTypeDescription = {
  displayName: 'EMF REST',
  name: 'EmfRest',
  icon: 'file:emfmodel.svg',
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
		const req = http.request(url, options, (res) => {
			let data = '';

			res.on('data', (chunk) => {
				data += chunk;
			});

			res.on('end', () => {
        //additional
        try {
          const responseJson = JSON.parse(data);
          resolve([responseJson]); // Wrap the response in an array
        } catch (error) {
          reject('Error parsing response JSON: ${error}');
        }
				//resolve(JSON.parse(data));
			});
		});

		req.on('error', (error) => {
			reject(error);
		});

		// Add request body for POST and UPDATE methods
		if (method === 'POST' || method === 'UPDATE') {
			const body = {}; // Replace with your desired request body
			req.write(JSON.stringify(body));
		}

		req.end();
	});

	// Return the response data as output
	return this.prepareOutputData(responseData);
}
}
