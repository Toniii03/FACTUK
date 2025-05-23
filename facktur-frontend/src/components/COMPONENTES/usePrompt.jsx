import { useContext, useEffect, useRef } from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";

export function usePrompt(message, when, showModalCallback) {
    const navigator = useContext(NavigationContext).navigator;
    const blockerRef = useRef();

    useEffect(() => {
        if (!when) return;

        const push = navigator.push;
        navigator.push = (...args) => {
            blockerRef.current = () => {
                navigator.push = push;
                push(...args);
            };
            showModalCallback();
        };

        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = message;
        };
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            navigator.push = push;
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [message, when, navigator, showModalCallback]);

    return {
        confirmNavigation() {
            if (blockerRef.current) {
                blockerRef.current();
                blockerRef.current = null;
            }
        },
        cancelNavigation() {
            blockerRef.current = null;
        }
    };
}
