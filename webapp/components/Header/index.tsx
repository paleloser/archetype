import Profile from './Profile'
import MobileMenuButton from './MobileMenuButton'

// Top bar of the authenticated area: the drawer toggle on mobile, then the actions, right-aligned. Add product actions
// (notifications, a "create" menu...) to the nav, before the profile.
export default function Header() {
  return (
    <header className='flex flex-row items-center justify-between w-full px-4 h-[64px] border-b border-gray-200 dark:border-neutral-800'>
      <MobileMenuButton />
      <nav
        className='flex flex-row flex-grow items-center justify-end gap-4'>
        <Profile />
      </nav>
    </header>
  )
}
