export const useToastMessages = () => {
  const toast = useToast()

  const showSuccess = (message: string) => {
    toast.add({
      title: 'Success',
      description: message,
      color: 'green'
    })
  }

  const showError = (error: any) => {
    toast.add({
      title: 'Error',
      description: error.response?.data?.message || error.message || 'An error occurred',
      color: 'red'
    })
  }

  return {
    showSuccess,
    showError,
    // Action specific messages
    created: (item: string) => showSuccess(`${item} created successfully`),
    updated: (item: string) => showSuccess(`${item} updated successfully`),
    deleted: (item: string) => showSuccess(`${item} deleted successfully`),
    error: showError
  }
}