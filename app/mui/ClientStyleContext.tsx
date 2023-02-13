import * as React from 'react';

export interface ClientStyleContextData {
  reset: () => void;
}

const ClientStyleContext = React.createContext<ClientStyleContextData>({
  reset: () => {},
});

export { ClientStyleContext };
