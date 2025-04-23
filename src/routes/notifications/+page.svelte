<script lang="ts">
	import { onMount } from 'svelte';
	import { getNotifications } from '$lib/services/notificationService';
	import type { Notification } from '$lib/types/notification';

	let notifications: Notification[] = [];
	let isLoading = true;
	let error: string | null = null;

	// Пагинация
	let currentPage = 1;
	let itemsPerPage = 10;
	let totalItems = 0;

	$: totalPages = Math.ceil(totalItems / itemsPerPage);
	$: startItem = (currentPage - 1) * itemsPerPage + 1;
	$: endItem = Math.min(currentPage * itemsPerPage, totalItems);
	$: paginatedNotifications = notifications.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	onMount(async () => {
		try {
			const data = await getNotifications();
			notifications = data;
			totalItems = data.length;
		} catch (err) {
			error = (err as Error).message;
		} finally {
			isLoading = false;
		}
	});

	const handlePrevious = () => currentPage--;
	const handleNext = () => currentPage++;
</script>

<h1 class="mb-6 text-2xl font-bold">История уведомлений</h1>

{#if isLoading}
	<div class="animate-pulse space-y-4">
		<div class="h-16 rounded bg-gray-200"></div>
		<div class="h-16 rounded bg-gray-200"></div>
	</div>
{:else if error}
	<div class="rounded bg-red-100 p-4 text-red-700">
		Ошибка загрузки: {error}
	</div>
{:else}
	<div class="flex h-[calc(100vh-160px)] flex-col">
		<!-- Панель управления -->
		<div class="mb-4 flex items-center justify-between">
			<div class="flex items-center gap-4">
				<span class="text-sm text-gray-600">Строк на странице:</span>
				<select
					class="cursor-pointer rounded-md border py-2 pl-3 pr-8 text-sm"
					bind:value={itemsPerPage}
				>
					<option value={10}>10</option>
					<option value={25}>25</option>
					<option value={50}>50</option>
					<option value={100}>100</option>
				</select>
			</div>
		</div>
		<!-- Таблица -->
		<div class="flex-1 overflow-auto rounded-lg border shadow-sm">
			<table class="h-full w-full table-fixed">
				<thead class="sticky top-0 bg-gray-50">
					<tr>
						<th
							class="w-1/6 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>Тип</th
						>
						<th
							class="w-1/6 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>Шаблон</th
						>
						<th
							class="w-1/6 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>Пользователь</th
						>
						<th
							class="w-1/6 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>Дата</th
						>
						<th
							class="w-2/6 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>Текст</th
						>
						<th
							class="w-1/6 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>Дополнительно</th
						>
					</tr>
				</thead>

				<tbody class="divide-y divide-gray-200 bg-white">
					{#each paginatedNotifications as notification}
						<tr class="transition-colors hover:bg-gray-50">
							<td
								class="truncate px-6 py-4 text-sm text-gray-900"
								title={notification.notificationTypeName}
							>
								{notification.notificationTypeName}
							</td>
							<td class="truncate px-6 py-4 text-sm text-gray-900" title={notification.patternName}>
								{notification.patternName}
							</td>
							<td
								class="truncate px-6 py-4 text-sm text-gray-900"
								title={notification.userName ?? 'Системное'}
							>
								{notification.userName ?? 'Системное'}
							</td>
							<td class="truncate px-6 py-4 text-sm text-gray-500">
								{notification.formattedDate}
							</td>
							<td class="px-6 py-4 text-sm text-gray-900">
								<p class="line-clamp-2 transition-all hover:line-clamp-none">
									{notification.patternDefaultText}
								</p>
							</td>
							<td class="px-6 py-4 text-sm text-gray-900">
								{#if notification.additionalText}
									<div
										class="line-clamp-2 rounded bg-gray-50 p-2 transition-all hover:line-clamp-none"
									>
										<p class="text-gray-600">
											{notification.additionalText}
										</p>
									</div>
								{:else}
									<span class="text-gray-400">—</span>
								{/if}
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="6" class="px-6 py-8 text-center text-gray-500">
								Нет доступных уведомлений
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Пагинация -->
		<div class="flex items-center justify-between border-t bg-gray-50 px-4 py-3">
			<button
				class="rounded-md border bg-white px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
				disabled={currentPage === 1}
				on:click={handlePrevious}
			>
				Назад
			</button>

			<div class="text-sm text-gray-600">
				Показано {startItem}-{endItem} из {totalItems}
			</div>

			<div class="text-sm text-gray-600">
				Страница {currentPage} из {totalPages}
			</div>

			<button
				class="rounded-md border bg-white px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
				disabled={currentPage === totalPages}
				on:click={handleNext}
			>
				Вперед
			</button>
		</div>
	</div>
{/if}
