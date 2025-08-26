import React from 'react'

export default function HeaderOptionB() {
	return (
		<header className="sticky top-0 z-50 bg-white/90 backdrop-blur">
			<div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
				<div className="text-2xl font-extrabold tracking-tight">Web2Speech</div>
				<nav className="hidden md:flex gap-4 text-sm">
					<a href="#input">Input</a>
					<a href="#voices">Voices</a>
					<a href="#mode">Mode</a>
				</nav>
				<button className="btn btn-ghost">About</button>
			</div>
		</header>
	)
}