<script lang="ts">
    export let direction: 'asc' | 'desc' = 'asc';
  </script>
  
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    stroke-width="2" 
    stroke-linecap="round" 
    stroke-linejoin="round"
    class="w-4 h-4 ml-1 transition-transform"
    class:rotate-180={direction === 'desc'}
  >
    <path d="M12 19V5M5 12l7-7 7 7"/>
  </svg>
  