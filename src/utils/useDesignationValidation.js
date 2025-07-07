import { useAsyncDebounce } from "react-table";
import { useDispatch } from 'react-redux';
import { IRTvalidateDupName, setDesignationExist } from '../toolkitStore/Auditvista/orgSlice';
import store from '../store';

/**
 * Custom hook for debounced designation validation
 * @param {number} delay - Debounce delay in milliseconds (default: 500)
 * @returns {Object} Object containing debounced validation function
 */
export const useDesignationValidation = (delay = 500) => {
    const dispatch = useDispatch();

    // Debounced designation name validation function
    const debouncedDesignationValidation = useAsyncDebounce(async (designationName) => {
        if (designationName && designationName.trim() !== "") {
            await dispatch(IRTvalidateDupName(
                store.getState().orgSlice.editDesignationInfo,
                "cln_adt_desgns",
                "desgn_name",
                designationName,
                setDesignationExist
            ));
        }
    }, delay);

    return {
        debouncedDesignationValidation
    };
};