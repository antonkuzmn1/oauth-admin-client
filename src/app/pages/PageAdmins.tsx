import React, {useCallback, useEffect, useReducer} from "react";
import {AppDispatch} from "../../utils/store.ts";
import {useDispatch} from "react-redux";
import {setAppError, setAppLoading} from "../../slices/appSlice.ts";
import {api} from "../../utils/api.ts";
import Table from "../components/Table.tsx";

interface Company {
    id: number;
    username: string;
    description: string;
    created_at: string | null;
    updated_at: string | null;
}

interface Item {
    id: number;
    username: string;
    password: string;
    surname: string;
    name: string;
    middlename: string | null;
    department: string | null;
    phone: string | null;
    cellular: string | null;
    post: string | null;
    companies: Company[]
    companyNames: string;
    created_at: string | null;
    updated_at: string | null;
}

interface State {
    items: Item[];
    companies: Company[];
}

type Action =
    | { type: 'SET_ITEMS', payload: Item[] }
    | { type: 'SET_COMPANIES', payload: Company[] }

const initialState: State = {
    items: [],
    companies: [],
}

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_ITEMS':
            return {
                ...state,
                items: action.payload,
            }
        case 'SET_COMPANIES':
            return {
                ...state,
                companies: action.payload,
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
    {text: 'Surname', field: 'surname', width: '200px', type: 'String'},
    {text: 'Name', field: 'name', width: '200px', type: 'String'},
    {text: 'Middlename', field: 'middlename', width: '200px', type: 'String'},
    {text: 'Companies', field: 'companyNames', width: '300px', type: 'String'},
    {text: 'Department', field: 'department', width: '200px', type: 'String'},
    {text: 'Phone', field: 'phone', width: '200px', type: 'String'},
    {text: 'Cellular', field: 'cellular', width: '200px', type: 'String'},
    {text: 'Post', field: 'post', width: '200px', type: 'String'},
    {text: 'Created at', field: 'created_at', width: '200px', type: 'Date'},
    {text: 'Updated at', field: 'updated_at', width: '200px', type: 'Date'},
]

const PageAdmins: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const [state, localDispatch] = useReducer(reducer, initialState);

    const getItems = useCallback(async () => {
        dispatch(setAppLoading(true));
        try {
            const response = await api.get("/admins/");
            const data: Item[] = response.data.map((item: Item) => {
                const companyNamesArray = item.companies.map(company => company.username)
                const companyNames = companyNamesArray.join(', ');
                return {
                    ...item,
                    companyNames,
                }
            });
            localDispatch({type: "SET_ITEMS", payload: data});

            const response2 = await api.get('/companies/');
            localDispatch({type: 'SET_COMPANIES', payload: response2.data});
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

export default PageAdmins;
