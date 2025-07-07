import { useAsyncDebounce } from "react-table";
import { useDispatch } from 'react-redux';
import { IRTvalidateDupName, setDepartmentExist } from '../toolkitStore/Auditvista/orgSlice';
import store from '../store';

export const useDepartmentValidation = (delay = 500) => {
    const dispatch = useDispatch();

    // Debounced department name validation function
    const debouncedDepartmentValidation = useAsyncDebounce(async (deptName) => {
        if (deptName && deptName.trim() !== "") {
            await dispatch(IRTvalidateDupName(
                store.getState().orgSlice.editDeptInfo,
                "cln_adt_departs",
                "dept_name",
                deptName,
                setDepartmentExist
            ));
        }
    }, delay);

    return {
        debouncedDepartmentValidation
    };
};