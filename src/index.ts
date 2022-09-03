/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
}

const url = 'https://shared-api.forefront.link/organization/d5I0q8EinB6I/gpt-j-6b-vanilla/completions/4fVl6eeEs021';

export default {
	async fetch(
		request: Request,
		env: Env & { FOREFRONT_KEY: string },
		ctx: ExecutionContext
	): Promise<Response> {
		const headers = {
			"Authorization": "Bearer " + env.FOREFRONT_KEY,
			"Content-Type": "application/json"
		};

  	const query = new URL(request.url).searchParams;
  	const id = query.get('id') || '20000';
  	const msg = query.get('msg');
		if (!msg)
			return new Response("Bad request: Message required", {
				status: 400,
				statusText: "Message required",
			});

		console.log(id, msg);

		const body = {
			text: `The following is an interaction between two people, identified by the numbers 0 and ${id}. ${id} begins and 0 responds.\n\n${id}: ${msg}\n0:`,
			top_p: 1,
			top_k: 40,
			temperature: 0.9,
			repetition_penalty: 1,
			length: 24,
		};

		const res = await fetch(url, {
			method: 'POST',
			headers,
			body: JSON.stringify(body)
		});

		const data = await res.json();
		return new Response(JSON.stringify(data));
	},
};