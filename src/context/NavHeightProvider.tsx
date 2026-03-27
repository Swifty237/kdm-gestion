import { ReactNode } from 'react';
import { NavHeightContext } from './NavHeightContext';

export default function NavHeightProvider({ children, height }: { children: ReactNode; height: number }) {
    return (
        <NavHeightContext.Provider value={height}>
            {children}
        </NavHeightContext.Provider>
    );
}