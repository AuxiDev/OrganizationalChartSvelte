<script lang="ts">
	let {
		requiered,
		inputValue = $bindable()
	}: { requiered: boolean; inputValue: any; label: string } = $props();

	let imagePreview: string | undefined = $state('');

	const handleFileChange = (event: Event) => {
		const fileInput = event.target as HTMLInputElement;
		const file = fileInput.files ? fileInput.files[0] : null;

		if (file && file.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onload = () => {
				imagePreview = reader.result as string;
				inputValue = imagePreview;
			};
			reader.readAsDataURL(file);
		}
	};
</script>

<div class="input-file-container">
	<div style="height: 70px;">
		{#if imagePreview}
			<div class="preview-container">
				<!-- svelte-ignore a11y_img_redundant_alt -->

				<img src={imagePreview} alt="Image Preview" class="image-preview" />
			</div>
		{/if}
	</div>

	<div class="input-file">
		<svg
			aria-hidden="true"
			stroke="currentColor"
			stroke-width="2"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				stroke-width="2"
				stroke="#fffffff"
				d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H11M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V11.8125"
				stroke-linejoin="round"
				stroke-linecap="round"
			></path>
			<path
				stroke-linejoin="round"
				stroke-linecap="round"
				stroke-width="2"
				stroke="#fffffff"
				d="M17 15V18M17 21V18M17 18H14M17 18H20"
			></path>
		</svg>
		<input required={requiered} type="file" accept="image/*" onchange={handleFileChange} />
		ADD IMAGE
	</div>
</div>

<style>
	.preview-container {
		border: 2px dashed #488aec;
		padding: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 10px;
		background-color: #f0f4f8;
		margin: 0;
	}

	.input-file-container {
		display: flex;
		flex-direction: row;
		gap: 8px;
		max-width: 300px;
		margin: 10px;
		text-align: right;
		align-items: center;
	}

	.image-preview {
		width: 50px;
		height: 50px;
	}

	.input-file {
		height: 25px;
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 10px 20px;
		background-color: #488aec;
		color: #fff;
		font-size: 14px;
		font-weight: bold;
		text-align: center;
		width: 120px;
		border-radius: 5px;
		user-select: none;
		gap: 10px;
		box-shadow:
			0 4px 6px -1px #488aec31,
			0 2px 4px -1px #488aec17;
		transition: all 0.6s ease;
		margin: 0;
	}

	.input-file:hover {
		box-shadow:
			0 10px 15px -3px #488aec4f,
			0 4px 6px -2px #488aec17;
	}

	.input-file input {
		position: absolute;
		width: 160px;
		cursor: pointer;
		left: 0;
		height: 100%;
		opacity: 0;
	}

	.input-file:focus,
	.input-file:active {
		opacity: 0.85;
		box-shadow: none;
	}

	.input-file svg {
		width: 20px;
		height: 20px;
	}
</style>
