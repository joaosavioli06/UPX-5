import { createContext, useContext, useState } from "react";

type RegisterData = {
  unit?: string;
  type?: string;
  hasVehicle?: boolean;
  plate?: string;
  model?: string;
  color?: string;
};

type RegisterContextType = {
  data: RegisterData;
  setData: (newData: Partial<RegisterData>) => void;
};

const RegisterContext = createContext<RegisterContextType | undefined>(undefined);

export function RegisterProvider({ children }: any) {
  const [data, setDataState] = useState<RegisterData>({});

  function setData(newData: Partial<RegisterData>) {
    setDataState(prev => ({ ...prev, ...newData }));
  }

  return (
    <RegisterContext.Provider value={{ data, setData }}>
      {children}
    </RegisterContext.Provider>
  );
}

export function useRegister() {
  const context = useContext(RegisterContext);
  if (!context) throw new Error("useRegister must be used within provider");
  return context;
}