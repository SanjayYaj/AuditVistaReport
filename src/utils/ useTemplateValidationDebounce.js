



import { useAsyncDebounce } from "react-table";
import urlSocket from '../helpers/urlSocket';

export const useTemplateValidationDebounce = (delay = 500) => {
    
    // Debounced template name validation function
    const debouncedTemplateNameValidation = useAsyncDebounce(async (templateName, options) => {
        const { 
            isEdit, 
            convertionMode, 
            dbInfo, 
            userInfo, 
            setAuditNameExist,
            setTemplateName 
        } = options;

        // Trim the template name
        console.log('96', templateName,convertionMode)
        const trimmedName = templateName ? templateName.trim() : '';
        console.log('trimmedName', trimmedName)
        
     
         if ((trimmedName !== undefined || trimmedName === '') && (isEdit && convertionMode === "2")) {
                   console.log("Validate name");
              try {
                const response = await urlSocket.post('cog/validate-audit-name', {
                  audit_name: trimmedName,
                  db_url: dbInfo.encrypted_db_url,
                  user_id: userInfo._id
                });
                setTemplateName(trimmedName)
                // console.log(response, 'response');
        
                if (response.data.data.length > 0) {
                  setAuditNameExist(true);
                } else {
                  setAuditNameExist(false);
                }
              } catch (error) {
                console.error("Error during audit name validation:", error);
              }
            } else {
              console.log("Validate questionnaire name");
        
              try {
                const response = await urlSocket.post('webmngtmplt/validate-user-templatemaster', {
                  audit_name: trimmedName,
                  encrypted_db_url: dbInfo.encrypted_db_url,
                  user_id: userInfo.user_data._id
                });
                console.log('response378', response.data)
                if (response.data.response_code === 500 && response.data.data.length > 0) {
                  setAuditNameExist(true);
                } else {
                  setAuditNameExist(false);
                }
              } catch (error) {
                console.error("Error during template validation:", error);
              }
            }
    }, delay);

    return {
        debouncedTemplateNameValidation
    };
};