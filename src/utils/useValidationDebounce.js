import { useAsyncDebounce } from "react-table";
import { useDispatch } from 'react-redux';
import { validateExistValue, setUserMailIdExist, setUserNumExist } from '../toolkitStore/Auditvista/userSlice';
import { IRTvalidateDupName, setDepartmentExist } from '../toolkitStore/Auditvista/orgSlice';

import store from '../store';


export const useValidationDebounce = (delay = 500) => {
    const dispatch = useDispatch();

    // Debounced email validation function
    const debouncedEmailValidation = useAsyncDebounce(async (email) => {
        if (email && email.trim() !== "") {
            await dispatch(validateExistValue(
                store.getState().userSlice.editUserInfo, 
                "cln_adt_users", 
                "email_id", 
                email, 
                setUserMailIdExist
            ));
        }
    }, delay);

    // Debounced phone validation function
    const debouncedPhoneValidation = useAsyncDebounce(async (phone) => {
        if (phone && phone.trim() !== "") {
            await dispatch(validateExistValue(
                store.getState().userSlice.editUserInfo, 
                "cln_adt_users", 
                "phone_number", 
                phone, 
                setUserNumExist
            ));
        }
    }, delay);



    

    return {
        debouncedEmailValidation,
        debouncedPhoneValidation
    };
};