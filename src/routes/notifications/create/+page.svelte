<script lang="ts">
	import { onMount } from 'svelte';
	import {
		getNotificationTypes,
		getPatterns,
		getUsers,
		createNotification
	} from '$lib/services/notificationService';
	import type { Notification_typeDTO, PatternDTO, UserDTO } from '$lib/types/notification';
	import { goto } from '$app/navigation';

	let notificationTypes: Notification_typeDTO[] = [];
	let patterns: PatternDTO[] = [];
	let users: UserDTO[] = [];

	let selectedUserName: string = '';
	let selectedNotificationType: string = '';
	let selectedPattern: string = '';
	let additionalText: string = '';

	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			[notificationTypes, patterns, users] = await Promise.all([
				getNotificationTypes(),
				getPatterns(),
				getUsers()
			]);
			if (notificationTypes.length > 0) selectedNotificationType = notificationTypes[0].name;
			if (patterns.length > 0) selectedPattern = patterns[0].name;
		} catch (e) {
			error = (e as Error).message;
		} finally {
			loading = false;
		}
	});

	async function handleSubmit() {
		try {
			await createNotification({
				userName: selectedUserName,
				notificationTypeName: selectedNotificationType,
				patternName: selectedPattern,
				additionalText: additionalText
			});
			alert('Notification created successfully');
			goto('/notifications');
		} catch (e) {
			alert('Failed to create notification: ' + (e as Error).message);
		}
	}
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-6 text-2xl font-bold">Создание уведомления</h1>

	{#if loading}
		<p>Загрузка...</p>
	{:else if error}
		<div class="rounded bg-red-100 p-4 text-red-700">
			{error}
		</div>
	{:else}
		<form class="rounded-lg border bg-white p-6 shadow-sm" on:submit|preventDefault={handleSubmit}>
			<div class="mb-4">
				<label class="mb-2 block font-medium text-gray-700" for="user">Пользователь:</label>
				<select
					class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
					id="user"
					bind:value={selectedUserName}
					required
				>
					{#each users as user}
						<option value={user.userName}>{user.userName}</option>
					{/each}
				</select>
			</div>

			<div class="mb-4">
				<label class="mb-2 block font-medium text-gray-700" for="notificationType"
					>Тип уведомления:</label
				>
				<select
					class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
					id="notificationType"
					bind:value={selectedNotificationType}
					required
				>
					{#each notificationTypes as type}
						<option value={type.name}>{type.name}</option>
					{/each}
				</select>
			</div>

			<div class="mb-4">
				<label class="mb-2 block font-medium text-gray-700" for="pattern">Шаблон:</label>
				<select
					class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
					id="pattern"
					bind:value={selectedPattern}
					required
				>
					{#each patterns as pattern}
						<option value={pattern.name}>{pattern.name}</option>
					{/each}
				</select>
			</div>

			<div class="mb-4">
				<label class="mb-2 block font-medium text-gray-700" for="additionalText"
					>Дополнительный текст:</label
				>
				<textarea
					class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
					id="additionalText"
					bind:value={additionalText}
					rows="4"
				></textarea>
			</div>

			<button class="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-700" type="submit">
				Создать уведомление
			</button>
		</form>
	{/if}
</div>
