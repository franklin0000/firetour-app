import React, { createContext, useContext } from 'react';
import type { Tour } from '../types';

export interface ServerData {
  tour?: Tour | null;
  tours?: Tour[];
}

const ServerDataContext = createContext<ServerData>({});

export const ServerDataProvider = ServerDataContext.Provider;
export const useServerData = () => useContext(ServerDataContext);
