import { useAsyncDebounce } from "react-table";
import urlSocket from "helpers/urlSocket";


export const useGroupValidation = (setGroupNameExist, userInfo, dbInfo, delay = 500) => {

    const debouncedGroupValidation = useAsyncDebounce(async (groupName) => {
        if (groupName && groupName.trim() !== "" && userInfo && dbInfo) {
            try {
                const api_data = {
                    group_name: groupName.trim(),
                    encrypted_db_url: dbInfo.encrypted_db_url,
                    user_id: userInfo.user_data._id
                };

                const response = await urlSocket.post('userSettings/validate-user-group', api_data);
                console.log('response17', response)
                
                if (response.data.data.length > 0) {
                    setGroupNameExist(true);
                } else {
                    setGroupNameExist(false);
                }
            } catch (error) {
                console.error('Error validating group name:', error);
                setGroupNameExist(false);
            }
        } else {
            setGroupNameExist(false);
        }
    }, delay);

    return {
        debouncedGroupValidation
    };
};