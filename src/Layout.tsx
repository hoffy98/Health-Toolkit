import { useEffect, useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'

import { IoMenu } from "react-icons/io5";
import Modal from '@/components/Modal'

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const location = useLocation()

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/breath', label: 'Breath' },
    { to: '/train', label: 'Train' },
    { to: '/timer', label: 'Timer' },
    { to: '/hiit', label: 'HIIT' },
  ]

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  return (
    <div className="flex flex-col w-full h-full items-center">
      <header
        onClick={() => setIsMenuOpen(true)}
        className="flex justify-center text-4xl w-full py-5 hover:cursor-pointer"
      >
        <IoMenu />
      </header>

      <Modal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
        <nav className="text-2xl space-x-5">
          <div className="flex flex-col items-center space-y-5">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={location.pathname === link.to ? 'font-bold' : ''}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </Modal>

      <main className="w-full h-full">
        <Outlet />
      </main>
    </div>
  )
}
