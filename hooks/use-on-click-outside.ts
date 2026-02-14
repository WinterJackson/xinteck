'use client'

import { RefObject, useEffect } from 'react'

type Handler = (event: MouseEvent | TouchEvent) => void

/*
Purpose: Detect clicks outside a specified element to trigger closure actions (e.g., closing modals/dropdowns).
Decision: We attach listeners to 'mousedown' & 'touchstart' to cover both desktop and mobile interactions robustly.
*/
export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
    ref: RefObject<T> | RefObject<T | null>,
    handler: Handler,
    mouseEvent: 'mousedown' | 'mouseup' = 'mousedown',
): void {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            const el = ref?.current
            // Purpose: Ignore the event if the click originated from within the ref element itself.
            if (!el || el.contains(event.target as Node)) {
                return
            }
            handler(event)
        }

        document.addEventListener(mouseEvent, listener)
        document.addEventListener('touchstart', listener)

        return () => {
            document.removeEventListener(mouseEvent, listener)
            document.removeEventListener('touchstart', listener)
        }
    }, [ref, handler, mouseEvent])
}
