import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Menu, Moon, Sun, X } from 'lucide-react'
import '../resumash.css'

const navigation = [
 { to: '/tailor-resume' as const, label: 'Tailor' },
 { to: '/build-resume' as const, label: 'Build' },
] as const

export default function ResumashShell({children}:{children:React.ReactNode}) {
 const [dark,setDark]=useState(()=> typeof window!=='undefined' && (localStorage.getItem('resumash-theme')==='dark' || (!localStorage.getItem('resumash-theme') && window.location.pathname !== '/')))
 const [menu,setMenu]=useState(false)
 const isWorkspace = typeof window !== 'undefined' && window.location.pathname !== '/'
 useEffect(()=>{document.documentElement.classList.toggle('dark',dark)},[dark])
 const toggleTheme=()=>setDark(value=>{const next=!value;document.documentElement.classList.toggle('dark',next);localStorage.setItem('resumash-theme',next?'dark':'light');return next})
 return <div className={`rs-app ${isWorkspace ? "rs-workspace" : "rs-landing"}`}>
  <header className="rs-site-header">
   <div className="rs-container flex h-[76px] items-center justify-between gap-4">
    <Link to="/" className="text-xl font-semibold tracking-[-.055em]">resumash<span style={{color:'var(--rs-muted)'}}>.</span></Link>
    <nav className="rs-desktop-nav flex items-center gap-9" aria-label="Main navigation">
     {navigation.map(item=><Link key={item.to} to={item.to} className="rs-nav-link" activeProps={{'data-status':'active'}}>{item.label}</Link>)}
     <Link to="/cover-letter" className="rs-nav-link" activeProps={{'data-status':'active'}}>Cover letter</Link>
    </nav>
    <div className="flex items-center gap-3">
     <span className="rs-desktop-nav text-[11px]" style={{color:'var(--rs-muted)'}}>NO ACCOUNT REQUIRED</span>
     <button aria-label={dark?'Switch to light mode':'Switch to dark mode'} onClick={toggleTheme} className="rs-button rs-button-outline !min-h-[38px] !p-[10px]">{dark?<Sun size={17}/>:<Moon size={17}/>}</button>
     <button className="rs-mobile-menu rs-button rs-button-outline !min-h-[38px] !p-[10px]" aria-label={menu?'Close navigation':'Open navigation'} aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X size={18}/>:<Menu size={18}/>}</button>
    </div>
   </div>
   {menu&&<nav className="rs-mobile-menu rs-container pb-5" aria-label="Mobile navigation"><div className="flex flex-col gap-5">{navigation.map(item=><Link key={item.to} to={item.to} className="rs-nav-link" onClick={()=>setMenu(false)}>{item.label}</Link>)}<Link to="/cover-letter" className="rs-nav-link" activeProps={{'data-status':'active'}} onClick={()=>setMenu(false)}>Cover letter</Link></div></nav>}
  </header>
  <main>{children}</main>
  <footer className="rs-footer"><div className="rs-container flex min-h-24 flex-wrap items-center justify-between gap-3 py-5"><span className="text-sm font-semibold" style={{color:'var(--rs-ink)'}}>resumash.</span><span className="text-xs">Build. Tailor. Apply. No account required.</span></div></footer>
 </div>
}