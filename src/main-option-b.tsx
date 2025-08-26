import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppOptionB from './AppOptionB'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<AppOptionB />
	</StrictMode>,
)