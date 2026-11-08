import { error } from '@sveltejs/kit';
import { createReadStream } from 'node:fs';
import { Readable } from 'node:stream';
import type { RequestHandler } from './$types';
import {
	attachmentContentDisposition,
	openResourceFile
} from '#lib/server/resources/open-resource.js';

export const GET: RequestHandler = async ({ params }) => {
	const opened = await openResourceFile(params.id);
	if (!opened) {
		error(404, 'Resource file not found');
	}

	const nodeStream = createReadStream(opened.absolutePath);
	const body = Readable.toWeb(nodeStream) as ReadableStream;

	return new Response(body, {
		status: 200,
		headers: {
			'Content-Type': opened.mimeType,
			'Content-Length': String(opened.size),
			'Content-Disposition': attachmentContentDisposition(opened.originalName),
			'X-Content-Type-Options': 'nosniff'
		}
	});
};
