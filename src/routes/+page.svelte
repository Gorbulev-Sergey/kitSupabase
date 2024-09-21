<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { sb } from '$lib/supabase.js';
	import { text } from '@sveltejs/kit';

	class Message {
		id: Number = 0;
		text: String = '';
	}

	let isEditMessage = false;
	let isNewMessage = false;

	export let data;

	$: messages = data.messages;
	let newMessage: Message = new Message();
	let editedMessage: Message = new Message();

	sb.channel('messages')
		.on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
			try {
				invalidateAll();
			} catch (e) {}
		})
		.subscribe();
</script>

{#if isNewMessage}
	<div
		class="position-absolute w-100 start-0 top-0"
		style="height: 100vh; background:rgba(0,0,0,.5)"
	>
		<div class="d-flex align-items-center justify-content-center" style="height: 100vh">
			<div
				class="d-flex flex-column align-items-start gap-3 bg-light p-3 rounded"
				style="width: 50vw"
			>
				<h5>Новое сообщение</h5>
				<input class="form-control" placeholder="Текст сообщения" bind:value={newMessage.text} />
				<div class="d-flex align-items-center justify-content-between w-100">
					<button
						class="btn btn-dark text-light"
						on:click={async () => {
							if (newMessage.text.trim() != '') {
								sb.from('messages')
									.insert({ text: newMessage.text })
									.then((r) => {
										newMessage = new Message();
										isNewMessage = false;
									});
							}
						}}>Отправить</button
					>
					<button
						class="btn btn-light text-dark"
						on:click={() => {
							newMessage = new Message();
							isNewMessage = false;
						}}
					>
						Отмена
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

{#if isEditMessage}
	<div
		class="position-absolute w-100 start-0 top-0"
		style="height: 100vh; background:rgba(0,0,0,.5)"
	>
		<div class="d-flex align-items-center justify-content-center" style="height: 100vh">
			<div
				class="d-flex flex-column align-items-start gap-3 bg-light p-3 rounded"
				style="width: 50vw"
			>
				<h5>Редактировать сообщение</h5>
				<input class="form-control" placeholder="Текст сообщения" bind:value={editedMessage.text} />
				<div class="d-flex align-items-center justify-content-between w-100">
					<button
						class="btn btn-dark text-light"
						on:click={async () => {
							sb.from('messages')
								.update(editedMessage)
								.eq('id', editedMessage.id)
								.then(() => {
									editedMessage = new Message();
									isEditMessage = false;
								});
						}}
					>
						Сохранить
					</button>
					<button
						class="btn btn-light text-dark"
						on:click={() => {
							editedMessage = new Message();
							isEditMessage = false;
						}}
					>
						Отмена
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

{#if messages.length > 0}
	<div class="bg-light text-dark rounded p-3">
		<div class="d-flex align-items-center justify-content-between mb-3">
			<h4 class="mb-0">Список сообщений</h4>
			<button class="btn btn-dark text-light" on:click={() => (isNewMessage = true)}
				>Добавить</button
			>
		</div>
		<div class="d-flex flex-column gap-3">
			{#each messages as message}
				<div class="d-flex align-items-center gap-2 bg-white p-2 rounded">
					<div class="flex-grow-1 d-flex align-items-center gap-2">
						<div class="badge bg-dark">{message.id}</div>
						<div>{message.text}</div>
					</div>
					<div class="d-flex align-items-center gap-2">
						<button
							class="btn btn-sm btn-light text-danger"
							on:click={async () => {
								isEditMessage = true;
								editedMessage = message;
							}}>Редактировать</button
						>
						<button
							class="btn btn-sm btn-light text-danger"
							on:click={async () => {
								await sb.from('messages').delete().eq('id', message.id);
							}}>Удалить</button
						>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}
