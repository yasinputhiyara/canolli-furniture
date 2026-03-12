import { useState, useCallback } from 'react';

let _showToast = null;

export function useToast() {
    const show = useCallback((msg, icon = '✓') => {
        if (_showToast) _showToast(msg, icon);
    }, []);
    return show;
}

export default function Toast() {
    const [state, setState] = useState({ msg: '', icon: '✓', on: false });
    let timer = null;

    _showToast = (msg, icon = '✓') => {
        setState({ msg, icon, on: true });
        clearTimeout(timer);
        timer = setTimeout(() => setState(s => ({ ...s, on: false })), 2600);
    };

    return (
        <div className={`toast-global${state.on ? ' on' : ''}`}>
            <span>{state.icon}</span>
            <span>{state.msg}</span>
        </div>
    );
}

// Simple standalone helper for pages that import directly
export function showToast(msg, icon = '✓') {
    if (_showToast) _showToast(msg, icon);
}
