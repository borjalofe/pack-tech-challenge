import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createResourceFromMultipart } from '#lib/server/resources/create-resource.js';

function asOptionalString(value: FormDataEntryValue | null): string | undefined {
	if (value == null) {
		return undefined;
	}
	return String(value);
}

export const POST: RequestHandler = async ({ request }) => {
	const form = await request.formData();
	const fileEntry = form.get('file');

	let uploaded:
		| {
				originalName: string;
				mimeType: string;
				size: number;
				bytes: Buffer;
		  }
		| undefined;

	if (fileEntry instanceof File) {
		const bytes = Buffer.from(await fileEntry.arrayBuffer());
		uploaded = {
			originalName: fileEntry.name || 'upload.bin',
			mimeType: fileEntry.type || 'application/octet-stream',
			size: bytes.byteLength,
			bytes
		};
	}

	const roles = form.getAll('roles').map(String);
	const rolesField =
		roles.length > 1 ? roles : roles.length === 1 ? roles[0] : asOptionalString(form.get('roles'));

	const created = await createResourceFromMultipart(
		{
			title: asOptionalString(form.get('title')),
			description: asOptionalString(form.get('description')),
			category: asOptionalString(form.get('category')),
			language: asOptionalString(form.get('language')),
			provider: asOptionalString(form.get('provider')),
			roles: rolesField
		},
		uploaded
	);

	// Clients get the resource id; storagePath stays server-internal in later list APIs.
	const { storagePath: _storagePath, ...safe } = created;
	return json(safe, { status: 201 });
};
