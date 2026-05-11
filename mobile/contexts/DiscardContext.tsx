import { createContext, useContext, useState } from "react";

interface DiscardData {
    itemName: string;
    category: string;
    observations: string;
}

interface DiscardContextType {
    data: DiscardData;

    updateData: (
        values: Partial<DiscardData>
    ) => void;
}

const DiscardContext = createContext(
    {} as DiscardContextType
);

export function DiscardProvider({
    children
}: {
    children: React.ReactNode;
}) {

    const [data, setData] = useState<DiscardData>({
        itemName: '',
        category: '',
        observations: '',
    });

    function updateData(
        values: Partial<DiscardData>
    ) {
        setData((prev) => ({
            ...prev,
            ...values,
        }));
    }

    return (
        <DiscardContext.Provider
            value={{
                data,
                updateData
            }}
        >
            {children}
        </DiscardContext.Provider>
    );
}

export function useDiscard() {
    return useContext(DiscardContext);
}