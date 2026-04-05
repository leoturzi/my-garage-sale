'use client'

import React, { useEffect } from 'react'

function addToggleButton(input: HTMLInputElement) {
  if (input.dataset.toggleAdded) return
  input.dataset.toggleAdded = 'true'

  const wrapper = input.parentElement
  if (!wrapper) return

  wrapper.style.position = 'relative'

  const btn = document.createElement('button')
  btn.type = 'button'
  btn.tabIndex = -1
  btn.setAttribute('aria-label', 'Toggle password visibility')
  Object.assign(btn.style, {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    color: 'var(--theme-elevation-400)',
  })

  const eyeOpen = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
  const eyeClosed = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`

  btn.innerHTML = eyeOpen

  btn.addEventListener('click', () => {
    const isPassword = input.type === 'password'
    input.type = isPassword ? 'text' : 'password'
    btn.innerHTML = isPassword ? eyeClosed : eyeOpen
  })

  wrapper.appendChild(btn)
  input.style.paddingRight = '40px'
}

export const PasswordToggleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const observer = new MutationObserver(() => {
      document.querySelectorAll<HTMLInputElement>('input[type="password"]').forEach(addToggleButton)
    })

    observer.observe(document.body, { childList: true, subtree: true })

    // Run once for already-present inputs
    document.querySelectorAll<HTMLInputElement>('input[type="password"]').forEach(addToggleButton)

    return () => observer.disconnect()
  }, [])

  return <>{children}</>
}
