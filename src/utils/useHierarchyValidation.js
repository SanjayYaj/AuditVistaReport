import { useAsyncDebounce } from "react-table";
import urlSocket from 'helpers/urlSocket';


export const useHierarchyValidation = (setHierarchyNameExist, delay = 500) => {

    const debouncedHierarchyValidation = useAsyncDebounce(async (hierarchyName, isEdit = false) => {
        if (hierarchyName && hierarchyName.trim() !== "") {
            const authUser = JSON.parse(sessionStorage.getItem("authUser"));
            
            try {
                const responseData = await urlSocket.post('cog/validate-hierarchy-name', {
                    encrypted_db_url: authUser.db_info.encrypted_db_url,
                    hname: hierarchyName.trim(),
                    created_by: authUser.user_data._id,
                    create: !isEdit
                });
                console.log('responseData18', responseData)

                if (responseData.data.data.length > 0) {
                    setHierarchyNameExist(true);
                } else {
                    setHierarchyNameExist(false);
                }
            } catch (error) {
                console.error('Error validating hierarchy name:', error);
                setHierarchyNameExist(false);
            }
        } else {
            setHierarchyNameExist(false);
        }
    }, delay);

    return {
        debouncedHierarchyValidation
    };
};