import React, { useState, useEffect } from 'react'

export default function Progressbar(params) {
	const [filled, setFilled] = useState(0);
	const [isRunning, setIsRunning] = useState(false);

	useEffect(() => {
		if (filled < 100 && isRunning) {
			setTimeout(() => setFilled(prev => prev += 10), 50)
		}
	}, [filled, isRunning])

	useEffect(() => {
		if (params.progress) {
			setIsRunning(true)
		} else {
			setFilled(0)
		}
	})

	return (
		<div style={{ width: '100%', height: '14px'}} className="progressbar">
			<div className='rounded' style={{ height: "30%", width: `${filled}%`, backgroundColor: "#4040ff", transition: "width 0.5s"}} >	
			</div>
		</div>
	)
}