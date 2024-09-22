<script lang="ts">
	export let isShow = true;
	export let title = 'Заголовок диалога';
	export let textBtnOk = 'Ок';
	export let textBtnCancel = 'Отмена';
	export let onOk = () => {};
	export let onCancel = () => {};
</script>

<svelte:body
	on:keydown={e => {
		if (isShow && e.code == 'Escape') {
			onCancel();
		}
	}} />

{#if isShow}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="position-absolute w-100 start-0 top-0" style="height: 100vh; background:rgba(0,0,0,.5)">
		<div class="d-flex align-items-center justify-content-center" style="height: 100vh">
			<div class="d-flex flex-column align-items-start gap-3 bg-light p-3 rounded" style="width: 40vw">
				<h5>{title}</h5>
				<slot />
				<div class="d-flex align-items-center justify-content-between w-100">
					<button class="btn btn-light text-dark" on:click={() => onCancel()}>{textBtnCancel}</button>
					<button class="btn btn-dark text-light" on:click={() => onOk()}>{textBtnOk}</button>
				</div>
			</div>
		</div>
	</div>
{/if}
