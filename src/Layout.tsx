import { Outlet, Link, useLocation } from 'react-router-dom'

export default function Layout() {
  const location = useLocation()
  const currentYear = new Date().getFullYear()

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/breath", label: "Breath" },
    { to: "/train", label: "Train" },
  ]

  return (
    <div className="flex flex-col w-full h-full items-center">
      <header className='py-5'>
        <nav className='text-xl space-x-5'>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={location.pathname === link.to ? "font-bold" : ""}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className='w-full h-full'>
        <Outlet />
      </main>

      <footer className='py-8'>
        {/* <p>© {currentYear} Johannes Hofmann</p> */}
      </footer>
    </div>
  )
}
