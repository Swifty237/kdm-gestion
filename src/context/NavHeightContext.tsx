import { createContext, useContext } from 'react';

export const NavHeightContext = createContext<number>(0);

export const useNavHeight = () => useContext(NavHeightContext);