export interface Env {
	FOREFRONT_KEY: string;
}

const url = 'https://shared-api.forefront.link/organization/d5I0q8EinB6I/gpt-j-6b-vanilla/completions/gSy5fjFBDhCz';

export default {
	async fetch(
		request: Request,
		env: Env,
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
			temperature: 0.7,
			repetition_penalty: 1,
			length: 24,
		};

		try {
			const res = await fetch(url, {
				method: 'POST',
				headers,
				body: JSON.stringify(body)
			});

			const data = await res.json();
			return new Response(JSON.stringify(data));
		} catch (error) {
			return new Response("Internal server error: " + error, {
				status: 500,
				statusText: (error as Error).name,
			});
		}
	},
};