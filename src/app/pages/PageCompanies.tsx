import React, {useCallback, useEffect, useReducer} from "react";
import {AppDispatch} from "../../utils/store.ts";
import {useDispatch} from "react-redux";
import {setAppError, setAppLoading} from "../../slices/appSlice.ts";
import {api} from "../../utils/api.ts";
import Table from "../components/Table.tsx";

interface Item {
    id: number;
    username: string;
    description: string;
    created_at: string | null;
    updated_at: string | null;
}

interface State {
    items: Item[];
}

type Action =
    | { type: 'SET_ITEMS', payload: Item[] }

const initialState: State = {
    items: [],
}

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_ITEMS':
            return {
                ...state,
                items: action.payload,
            }
        default:
            return state;
    }
}

type TypeField = 'String' | 'Integer' | 'Boolean' | 'Date';

interface TableHeaders {
    text: string,
    field: keyof Item,
    width: string,
    type: TypeField,
}

const tableHeaders: TableHeaders[] = [
    {text: 'ID', field: 'id', width: '50px', type: 'Integer'},
    {text: 'Username', field: 'username', width: '200px', type: 'String'},
    {text: 'Description', field: 'description', width: '200px', type: 'String'},
    {text: 'Created at', field: 'created_at', width: '200px', type: 'Date'},
    {text: 'Updated at', field: 'updated_at', width: '200px', type: 'Date'},
]

const PageCompanies: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const [state, localDispatch] = useReducer(reducer, initialState);

    const getItems = useCallback(async () => {
        dispatch(setAppLoading(true));
        try {
            const response = await api.get("/companies/");
            localDispatch({type: "SET_ITEMS", payload: response.data});
        } catch (error: unknown) {
            if (error instanceof Error) {
                dispatch(setAppError(error.message));
            } else {
                dispatch(setAppError("An unknown error occurred"));
            }
        } finally {
            dispatch(setAppLoading(false));
        }
    }, []);

    useEffect(() => {
        getItems().then();
    }, [getItems]);

    return (
        <>
            <Table
                tableHeaders={tableHeaders}
                rows={state.items}
            />
        </>
    )
}

export default PageCompanies;
