import type { Dispatch, ReactNode, SetStateAction } from 'react';

export type AdminLayoutContextValue = {
  setHeaderExtension: Dispatch<SetStateAction<ReactNode | null>>;
};
