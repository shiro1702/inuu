/** Модалка входа гостя (Telegram / MAX) — общая для layout city и страниц афиши. */
export function useCityGuestAuth() {
  const guestAuthModalOpen = useState('city-guest-auth-modal-open', () => false)

  function openGuestAuthModal() {
    guestAuthModalOpen.value = true
  }

  function closeGuestAuthModal() {
    guestAuthModalOpen.value = false
  }

  return {
    guestAuthModalOpen,
    openGuestAuthModal,
    closeGuestAuthModal,
  }
}
