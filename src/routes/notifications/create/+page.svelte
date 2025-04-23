<script lang="ts">
    import { onMount } from 'svelte';
    import { getNotificationTypes, getPatterns, getUsers, createNotification } from '$lib/services/notificationService';
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
        console.log(users);
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
    console.log(selectedUserName,selectedNotificationType,selectedPattern,additionalText);
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
  
  {#if loading}
    <p>Loading...</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else}
    <form on:submit|preventDefault={handleSubmit}>
      <div>
        <label for="user">User:</label>
        <select id="user" bind:value={selectedUserName} required>
          {#each users as user}
            <option value={user.userName}>
              {user.userName}
            </option>
          {/each}
        </select>
      </div>
  
      <div>
        <label for="notificationType">Notification Type:</label>
        <select id="notificationType" bind:value={selectedNotificationType} required>
          {#each notificationTypes as type}
            <option value={type.name}>{type.name}</option>
          {/each}
        </select>
      </div>
  
      <div>
        <label for="pattern">Pattern:</label>
        <select id="pattern" bind:value={selectedPattern} required>
          {#each patterns as pattern}
            <option value={pattern.name}>{pattern.name}</option>
          {/each}
        </select>
      </div>
  
      <div>
        <label for="additionalText">Additional Text:</label>
        <textarea id="additionalText" bind:value={additionalText} rows="4"></textarea>
      </div>
  
      <button type="submit">Create Notification</button>
    </form>
  {/if}
  
  <style>
    form > div {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      font-weight: 600;
      margin-bottom: 0.3rem;
    }
    select, textarea {
      width: 100%;
      padding: 0.5rem;
      font-size: 1rem;
    }
    .error {
      color: red;
    }
  </style>
  