export default defineNuxtPlugin(() => {
  // Force light mode
  if (process.client) {
    // Set language to Indonesian
    document.documentElement.lang = 'id'
    
    // Force light mode
    document.documentElement.classList.remove('dark')
    document.documentElement.style.colorScheme = 'light'
    
    // Override any system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      document.documentElement.classList.remove('dark')
      document.documentElement.style.colorScheme = 'light'
    }
    
    mediaQuery.addEventListener('change', handleChange)
    
    // Initial call
    handleChange()
  }
})