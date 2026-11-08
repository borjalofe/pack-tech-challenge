/** Public resource fields as returned by the JSON API (dates are ISO strings). */
export type PublicResourceDto = {
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

export type CreateResourceResponse = PublicResourceDto;

export type ListResourcesResponse = {
	items: PublicResourceDto[];
	total: number;
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

export async function listResources(): Promise<ListResourcesResponse> {
	const response = await fetch('/api/resources');

	if (!response.ok) {
		const text = await response.text();
		throw new Error(text || `List failed (${response.status})`);
	}

	return (await response.json()) as ListResourcesResponse;
}
