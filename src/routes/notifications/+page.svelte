<script lang="ts">
	import { onMount } from 'svelte';
	import { deleteNotification, getNotifications } from '$lib/services/notificationService';
	import SortArrow from '$lib/components/SortArrow.svelte';
	import type { Notification } from '$lib/types/notification';
	import Trash from '$lib/components/Trash.svelte';
	import CreateLink from '$lib/components/CreateLink.svelte';

	let notifications: Notification[] = [];
	let isLoading = true;
	let error: string | null = null;
	let isPending = false;
	let deletingId: number | null = null;
	let deleteError: string | null = null;

	let currentPage = 1;
	let itemsPerPage = 10;
	let totalItems = 0;

	type SortField = Exclude<keyof Notification, 'formattedDate'>;
	let sortField: SortField = 'dispatchDateTime';
	let sortDirection: 'asc' | 'desc' = 'desc';

	$: totalPages = Math.ceil(totalItems / itemsPerPage);
	$: startItem = (currentPage - 1) * itemsPerPage + 1;
	$: endItem = Math.min(currentPage * itemsPerPage, totalItems);
	$: paginatedNotifications = notifications.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const handleSort = async (field: SortField) => {
		if (isPending) return;
		try {
			isPending = true;
			sortDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
			sortField = field;
			currentPage = 1;

			notifications = await getNotifications(field, sortDirection);
			totalItems = notifications.length;
		} catch (err) {
			error = (err as Error).message;
		} finally {
			isPending = false;
		}
	};

	onMount(async () => {
		try {
			notifications = await getNotifications();
			totalItems = notifications.length;
		} catch (err) {
			error = (err as Error).message;
		} finally {
			isLoading = false;
		}
	});

	const handlePrevious = () => currentPage--;
	const handleNext = () => currentPage++;

	const handleDelete = async (id: number) => {
		if (confirm('Вы уверены, что хотите удалить это уведомление?')) {
			try {
				deletingId = id;
				deleteError = null;

				await deleteNotification(id);

				notifications = await getNotifications(sortField, sortDirection);
				totalItems = notifications.length;

				if (paginatedNotifications.length === 0 && currentPage > 1) {
					currentPage--;
				}
			} catch (err) {
				deleteError = (err as Error).message;
			} finally {
				deletingId = null;
			}
		}
	};
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
	<div class="relative flex h-[calc(100vh-160px)] flex-col">
		{#if isPending}
			<div class="absolute inset-0 z-10 flex items-center justify-center bg-white/50">
				<div class="h-8 w-8 animate-spin rounded-full border-t-2 border-blue-500"></div>
			</div>
		{/if}

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
			<CreateLink></CreateLink>
		</div>

		<div class="flex-1 overflow-auto rounded-lg border shadow-sm">
			<table class="h-full w-full table-fixed">
				<thead class="sticky top-0 bg-gray-50">
					<tr>
						<th
							class="w-[100px] cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 transition-colors hover:bg-gray-100"
							on:click={() => handleSort('id')}
						>
							<div class="flex items-center gap-1">
								ID
								{#if sortField === 'id'}
									<SortArrow direction={sortDirection} />
								{/if}
							</div>
						</th>

						<th
							class="w-1/6 cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 transition-colors hover:bg-gray-100"
							on:click={() => handleSort('notificationTypeName')}
						>
							<div class="flex items-center gap-1">
								Тип
								{#if sortField === 'notificationTypeName'}
									<SortArrow direction={sortDirection} />
								{/if}
							</div>
						</th>

						<th
							class="w-1/6 cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 transition-colors hover:bg-gray-100"
							on:click={() => handleSort('patternName')}
						>
							<div class="flex items-center gap-1">
								Шаблон
								{#if sortField === 'patternName'}
									<SortArrow direction={sortDirection} />
								{/if}
							</div>
						</th>

						<th
							class="w-1/6 cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 transition-colors hover:bg-gray-100"
							on:click={() => handleSort('userName')}
						>
							<div class="flex items-center gap-1">
								Пользователь
								{#if sortField === 'userName'}
									<SortArrow direction={sortDirection} />
								{/if}
							</div>
						</th>

						<th
							class="w-1/6 cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 transition-colors hover:bg-gray-100"
							on:click={() => handleSort('dispatchDateTime')}
						>
							<div class="flex items-center gap-1">
								Дата
								{#if sortField === 'dispatchDateTime'}
									<SortArrow direction={sortDirection} />
								{/if}
							</div>
						</th>

						<th
							class="w-2/6 cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 transition-colors hover:bg-gray-100"
							on:click={() => handleSort('patternDefaultText')}
						>
							<div class="flex items-center gap-1">
								Текст
								{#if sortField === 'patternDefaultText'}
									<SortArrow direction={sortDirection} />
								{/if}
							</div>
						</th>

						<th
							class="w-1/6 cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 transition-colors hover:bg-gray-100"
							on:click={() => handleSort('additionalText')}
						>
							<div class="flex items-center gap-1">
								Дополнительно
								{#if sortField === 'additionalText'}
									<SortArrow direction={sortDirection} />
								{/if}
							</div>
						</th>
						<th
							class="w-[100px] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>
							Действия
						</th>
					</tr>
				</thead>

				<tbody class="divide-y divide-gray-200 bg-white">
					{#each paginatedNotifications as notification}
						<tr class="transition-colors hover:bg-gray-50">
							<td
								class="truncate px-6 py-4 text-sm text-gray-900"
								title={notification.id.toString()}
							>
								{notification.id}
							</td>
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
								{notification.dispatchDateTime.toLocaleString()}
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
							<td class="px-6 py-4 text-sm">
								<button
									class="relative rounded p-2 text-red-600 transition-colors hover:bg-red-50"
									on:click={() => handleDelete(notification.id)}
									disabled={deletingId === notification.id}
								>
									{#if deletingId === notification.id}
										<div class="absolute inset-0 flex items-center justify-center bg-white/50">
											<div
												class="h-4 w-4 animate-spin rounded-full border-t-2 border-red-600"
											></div>
										</div>
									{/if}

									<Trash></Trash>
								</button>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="7" class="px-6 py-8 text-center text-gray-500">
								Нет доступных уведомлений
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="flex items-center justify-between border-t bg-gray-50 px-4 py-3">
			<button
				class="rounded-md border bg-white px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
				disabled={currentPage === 1}
				on:click={handlePrevious}
			>
				Назад
			</button>

			<div class="text-sm text-gray-600">
				Страница {currentPage} из {totalPages}
			</div>

			<div class="text-sm text-gray-600">
				Показано {startItem}-{endItem} из {totalItems}
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
