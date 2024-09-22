<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Dialog from '$lib/components/Dialog.svelte';
	import { sb } from '$lib/supabase.js';

	class Message {
		id: Number;
		text: String;

		constructor(id: Number = 0, text: String = '') {
			this.id = id;
			this.text = text;
		}
	}

	let isEditMessage = false;
	let isNewMessage = false;
	let isDeleteMessage = false;

	export let data;

	$: messages = data.messages;
	let newMessage: Message = new Message();
	let editedMessage: Message = new Message();
	let deletedMessage: Message = new Message();

	sb.channel('messages')
		.on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, payload => {
			try {
				invalidateAll();
			} catch (e) {}
		})
		.subscribe();
</script>

<Dialog
	title="Новое сообщение"
	textBtnOk="Отправить"
	textBtnCancel="Отмена"
	isShow={isNewMessage}
	onOk={async () => {
		if (newMessage.text.trim() != '') {
			sb.from('messages')
				.insert({ text: newMessage.text })
				.then(r => {
					newMessage = new Message();
					isNewMessage = false;
				});
		}
	}}
	onCancel={() => {
		newMessage = new Message();
		isNewMessage = false;
	}}>
	<input class="form-control" placeholder="Текст сообщения" bind:value={newMessage.text} />
</Dialog>

<Dialog
	title="Редактировать сообщение"
	textBtnOk="Сохранить"
	textBtnCancel="Отмена"
	isShow={isEditMessage}
	onOk={async () => {
		sb.from('messages')
			.update(editedMessage)
			.eq('id', editedMessage.id)
			.then(() => {
				editedMessage = new Message();
				isEditMessage = false;
			});
	}}
	onCancel={() => {
		editedMessage = new Message();
		isEditMessage = false;
	}}>
	<input class="form-control" placeholder="Текст сообщения" bind:value={editedMessage.text} />
</Dialog>

<Dialog
	title="Удалить сообщение"
	textBtnOk="Удалить"
	textBtnCancel="Отмена"
	isShow={isDeleteMessage}
	onOk={async () => {
		await sb.from('messages').delete().eq('id', deletedMessage.id);
		isDeleteMessage = false;
	}}
	onCancel={() => {
		deletedMessage = new Message();
		isDeleteMessage = false;
	}}>
	<div class="flex-grow-1 d-flex align-items-center gap-2">
		<div class="badge bg-dark">{deletedMessage.id}</div>
		<div>{deletedMessage.text}</div>
	</div>
</Dialog>

{#if messages.length > 0}
	<div class="bg-light text-dark rounded p-3">
		<div class="d-flex align-items-center justify-content-between mb-3">
			<h4 class="mb-0">Список сообщений</h4>
			<button class="btn btn-dark text-light" on:click={() => (isNewMessage = true)}>Добавить</button>
		</div>
		<div class="d-flex flex-column gap-3">
			{#each messages.sort((v1, v2) => v1.id - v2.id) as message}
				<div class="d-flex align-items-center gap-2 bg-white p-2 rounded">
					<div class="flex-grow-1 d-flex align-items-center gap-2">
						<div class="badge bg-dark">{message.id}</div>
						<div>{message.text}</div>
					</div>
					<div class="d-flex align-items-center gap-1">
						<button
							class="btn btn-sm btn-light text-dark"
							on:click={async () => {
								editedMessage = message;
								isEditMessage = true;
							}}><i class="fa-solid fa-pen"></i></button>
						<button
							class="btn btn-sm btn-light text-danger"
							on:click={async () => {
								deletedMessage = message;
								isDeleteMessage = true;
							}}><i class="fa-solid fa-delete-left"></i></button>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}
