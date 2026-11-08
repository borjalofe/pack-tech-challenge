<script lang="ts">
	import {
		RESOURCE_CATEGORIES,
		RESOURCE_CATEGORY_LABELS,
		RESOURCE_LANGUAGE_LABELS,
		RESOURCE_LANGUAGES,
		RESOURCE_PROVIDER_LABELS,
		RESOURCE_PROVIDERS,
		RESOURCE_ROLE_LABELS,
		RESOURCE_ROLES
	} from '#lib/catalog.js';
	import { createResource } from '#lib/api/resources.js';
	import { parseUploadFormWithFile } from '#lib/validation/resource-upload-client.js';
	import { UPLOAD_DIALOG_MAX_WIDTH_PX } from './upload-dialog.js';

	type Props = {
		open?: boolean;
		onClose?: () => void;
		onUploaded?: (id: string) => void;
	};

	let { open = $bindable(false), onClose, onUploaded }: Props = $props();

	let title = $state('');
	let description = $state('');
	let category = $state('');
	let language = $state('');
	let provider = $state('');
	let roles = $state<string[]>([]);
	let file = $state<File | null>(null);
	let fileInput = $state<HTMLInputElement | null>(null);
	let error = $state<string | null>(null);
	let submitting = $state(false);
	let rolesOpen = $state(false);

	const fileLabel = $derived(file?.name || 'No file selected*');

	function reset() {
		title = '';
		description = '';
		category = '';
		language = '';
		provider = '';
		roles = [];
		file = null;
		error = null;
		submitting = false;
		rolesOpen = false;
		if (fileInput) fileInput.value = '';
	}

	function close() {
		open = false;
		rolesOpen = false;
		onClose?.();
	}

	function toggleRole(role: string) {
		if (roles.includes(role)) {
			roles = roles.filter((value) => value !== role);
		} else {
			roles = [...roles, role];
		}
	}

	function onFileChange(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		file = input.files?.[0] ?? null;
	}

	async function submit() {
		error = null;
		const parsed = parseUploadFormWithFile(
			{
				title,
				description,
				category,
				language,
				provider,
				roles
			},
			file
		);

		if (!parsed.success) {
			error = parsed.error.issues[0]?.message ?? 'Validation failed';
			return;
		}

		if (!file) {
			error = 'File is required';
			return;
		}

		const form = new FormData();
		form.set('title', parsed.data.title);
		form.set('description', parsed.data.description);
		form.set('category', parsed.data.category);
		form.set('language', parsed.data.language);
		form.set('provider', parsed.data.provider);
		for (const role of parsed.data.roles) {
			form.append('roles', role);
		}
		form.set('file', file);

		submitting = true;
		try {
			const created = await createResource(form);
			reset();
			close();
			onUploaded?.(created.id);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Upload failed';
		} finally {
			submitting = false;
		}
	}
</script>

{#if open}
	<div class="backdrop" data-slot="upload-resource-backdrop">
		<div
			class="dialog"
			role="dialog"
			aria-modal="true"
			aria-labelledby="upload-resource-heading"
			data-slot="upload-resource-dialog"
			style={`--upload-dialog-max-width: ${UPLOAD_DIALOG_MAX_WIDTH_PX}px`}
		>
			<header class="head">
				<h2 id="upload-resource-heading">Upload Resource</h2>
				<button
					type="button"
					class="close"
					aria-label="Close"
					data-slot="upload-resource-close"
					onclick={close}
				>
					×
				</button>
			</header>

			<form
				class="form"
				onsubmit={(event) => {
					event.preventDefault();
					void submit();
				}}
			>
				<input
					id="upload-resource-title"
					data-slot="upload-resource-title"
					placeholder="Title*"
					bind:value={title}
					required
				/>
				<textarea
					id="upload-resource-description"
					data-slot="upload-resource-description"
					placeholder="Description*"
					rows="3"
					bind:value={description}
					required></textarea>

				<label class="select-wrap">
					<span class="sr-only">Category</span>
					<select
						id="upload-resource-category"
						data-slot="upload-resource-category"
						bind:value={category}
						required
					>
						<option value="" disabled>Category*</option>
						{#each RESOURCE_CATEGORIES as value (value)}
							<option {value}>{RESOURCE_CATEGORY_LABELS[value]}</option>
						{/each}
					</select>
					<span class="chevron" aria-hidden="true">▾</span>
				</label>

				<label class="select-wrap">
					<span class="sr-only">Language</span>
					<select
						id="upload-resource-language"
						data-slot="upload-resource-language"
						bind:value={language}
						required
					>
						<option value="" disabled>Language*</option>
						{#each RESOURCE_LANGUAGES as value (value)}
							<option {value}>{RESOURCE_LANGUAGE_LABELS[value]}</option>
						{/each}
					</select>
					<span class="chevron" aria-hidden="true">▾</span>
				</label>

				<label class="select-wrap">
					<span class="sr-only">Provider</span>
					<select
						id="upload-resource-provider"
						data-slot="upload-resource-provider"
						bind:value={provider}
						required
					>
						<option value="" disabled>Provider*</option>
						{#each RESOURCE_PROVIDERS as value (value)}
							<option {value}>{RESOURCE_PROVIDER_LABELS[value]}</option>
						{/each}
					</select>
					<span class="chevron" aria-hidden="true">▾</span>
				</label>

				<div class="role" data-slot="upload-resource-role">
					<button
						type="button"
						class="role-trigger"
						aria-expanded={rolesOpen}
						onclick={() => (rolesOpen = !rolesOpen)}
					>
						<span>
							{roles.length
								? roles
										.map((role) => RESOURCE_ROLE_LABELS[role as keyof typeof RESOURCE_ROLE_LABELS])
										.join(', ')
								: 'Role'}
						</span>
						<span class="chevron" aria-hidden="true">▾</span>
					</button>
					{#if rolesOpen}
						<div class="role-menu" role="listbox" aria-label="Role">
							{#each RESOURCE_ROLES as role (role)}
								<label class="role-option">
									<input
										type="checkbox"
										checked={roles.includes(role)}
										onchange={() => toggleRole(role)}
									/>
									{RESOURCE_ROLE_LABELS[role]}
								</label>
							{/each}
						</div>
					{/if}
				</div>

				<div class="file-row" data-slot="upload-resource-file">
					<span class="file-name">{fileLabel}</span>
					<button
						type="button"
						class="select-file"
						data-slot="upload-resource-select-file"
						onclick={() => fileInput?.click()}
					>
						Select file
					</button>
					<input bind:this={fileInput} class="file-input" type="file" onchange={onFileChange} />
				</div>

				{#if error}
					<p class="error" role="alert">{error}</p>
				{/if}

				<button
					type="submit"
					class="submit"
					data-slot="upload-resource-submit"
					disabled={submitting}
				>
					{submitting ? 'Uploading…' : 'Upload'}
				</button>
			</form>
		</div>
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 40;
		display: grid;
		place-items: center;
		padding: var(--space-4);
		background: rgba(26, 26, 26, 0.45);
	}

	.dialog {
		width: min(50vw, var(--upload-dialog-max-width));
		max-width: var(--upload-dialog-max-width);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-soft);
		padding: var(--space-6);
	}

	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-4);
	}

	.head h2 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 650;
	}

	.close {
		appearance: none;
		border: 0;
		background: transparent;
		font-size: 1.5rem;
		line-height: 1;
		cursor: pointer;
		color: var(--color-muted);
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.form input:not([type='checkbox']):not([type='file']),
	.form textarea,
	.form select,
	.role-trigger {
		width: 100%;
		padding: 0.7rem 0.85rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		color: var(--color-foreground);
	}

	.select-wrap {
		position: relative;
		display: block;
	}

	.select-wrap select {
		appearance: none;
		padding-right: 2rem;
	}

	.chevron {
		position: absolute;
		right: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		color: var(--color-muted);
		pointer-events: none;
	}

	.role {
		position: relative;
	}

	.role-trigger {
		display: flex;
		align-items: center;
		justify-content: space-between;
		cursor: pointer;
		text-align: left;
	}

	.role-menu {
		position: absolute;
		z-index: 2;
		left: 0;
		right: 0;
		top: calc(100% + 0.25rem);
		display: grid;
		gap: 0.35rem;
		padding: 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		box-shadow: var(--shadow-soft);
	}

	.role-option {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.925rem;
	}

	.file-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		padding: 0.55rem 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
	}

	.file-name {
		color: var(--color-muted);
		font-size: 0.925rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.select-file {
		appearance: none;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		padding: 0.4rem 0.75rem;
		cursor: pointer;
		font-weight: 500;
		white-space: nowrap;
	}

	.file-input {
		display: none;
	}

	.submit {
		appearance: none;
		border: 0;
		border-radius: var(--radius-sm);
		background: var(--color-primary);
		color: var(--color-primary-foreground);
		padding: 0.7rem 1rem;
		font-weight: 650;
		cursor: pointer;
	}

	.submit:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.error {
		margin: 0;
		color: #b42318;
		font-size: 0.875rem;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
