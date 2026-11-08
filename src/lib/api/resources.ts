export type CreateResourceResponse = {
	id: string;
	title: string;
	description: string;
	category: string;
	language: string;
	provider: string;
	roles: string[];
	fileOriginalName: string;
	fileMimeType: string;
	fileSize: number;
	viewCount: number;
	uploadedBy: string | null;
	createdAt: string;
	updatedAt: string;
};

export async function createResource(form: FormData): Promise<CreateResourceResponse> {
	const response = await fetch('/api/resources', {
		method: 'POST',
		body: form
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(text || `Upload failed (${response.status})`);
	}

	return (await response.json()) as CreateResourceResponse;
}
