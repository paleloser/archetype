import Header from '@/components/Header'
import { Auth0Provider } from '@auth0/nextjs-auth0'

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Auth0Provider>
      <div className='flex flex-col w-full min-h-screen'>
        <Header />
        <main className='flex-grow p-3'>
          <div className='max-w-[1536px] mx-auto w-full h-full px-4 sm:px-6 py-4'>
            { children }
          </div>
        </main>
      </div>
    </Auth0Provider>
  )
}
