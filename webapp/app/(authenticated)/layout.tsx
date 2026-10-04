import Breadcrumbs, { BreadcrumbsProvider } from '@/components/Breadcrumbs'
import Drawer from '@/components/Drawer'
import DrawerController from '@/components/Drawer/DrawerController'
import Header from '@/components/Header'
import { Auth0Provider } from '@auth0/nextjs-auth0'

// The app shell: navigation drawer on the left (a slide-over on mobile), header on top, breadcrumbs above the page.
export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DrawerController>
      <Auth0Provider>
        <BreadcrumbsProvider>
          <Drawer />
          <div className='flex flex-col w-full'>
            <Header />
            <main className='flex-grow p-3'>
              <div className='max-w-[1536px] mx-auto w-full h-full px-4 sm:px-6'>
                <Breadcrumbs className='mb-4' />
                { children }
              </div>
            </main>
          </div>
        </BreadcrumbsProvider>
      </Auth0Provider>
    </DrawerController>
  )
}
