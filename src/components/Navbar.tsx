import { NavLink } from 'react-router-dom'

export default function Navbar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'font-semibold underline' : 'hover:underline'

  return (
    <nav className="border-b border-gray-200 px-4 py-3">
      <div className="max-w-3xl mx-auto flex gap-6 text-sm">
        <NavLink to="/" end className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/projects" className={linkClass}>
          Projects
        </NavLink>
      </div>
    </nav>
  )
}
