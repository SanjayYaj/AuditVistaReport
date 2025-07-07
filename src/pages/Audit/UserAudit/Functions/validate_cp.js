import _, { repeat } from "lodash";
var moment = require('moment')


let validation = {

    checkpointStatus:(checkpoint,epsInfo) => {
        var getOptionIndex = _.findIndex(checkpoint.rule, {
          is_selected: true,
        });
        var selected_option = checkpoint.rule[getOptionIndex];

      console.log(checkpoint,'checkpoint',selected_option)
      if(checkpoint.checkpoint_type_id !=="6"){
        var optionSelectedStatus = _.some(checkpoint.rule, {
          is_selected: true,
        });
         
          var optionSelectedData = _.find(checkpoint.rule, {
          is_selected: true,
        });
      

        // var Images =
        //   checkpoint.cp_attach_images.length >= checkpoint.cp_noof_images
        //     ? true
        //     : false;
        //  var Videos =
        //     checkpoint.cp_attach_videos.length >= checkpoint.cp_noof_videos
        //       ? true
        //       : false;
        // var Documents =
        //   checkpoint.cp_documents.length >= checkpoint.cp_noof_documents
        //     ? true
        //     : false;

        //  var apln = selected_option?.capa_info?.mandatory && checkpoint.cp_actionplans.length >= 1
        // ? true
        // : false;

          var Images =
         (optionSelectedData.image_info?.camera ||optionSelectedData.image_info?.gallery ) ? checkpoint.cp_attach_images.length >= checkpoint.cp_noof_images
            ? true
            : false : true; 
        var Videos =
         (optionSelectedData.video_info?.camera ||optionSelectedData.video_info?.gallery ) ? checkpoint.cp_attach_videos.length >= checkpoint.cp_noof_videos
            ? true
            : false : true;
        var Documents =
        optionSelectedData.document_info?.length >0 ? checkpoint.cp_documents.length >= checkpoint.cp_noof_documents
            ? true
            : false : true;
          var apln = epsInfo.audit_pbd_users.create_acplan ? selected_option.capa_info?.mandatory ?selected_option.capa_info?.mandatory && checkpoint.cp_actionplans.length >= 1
        ? true
        : false : true : true;


        var validate = [Images, Documents,Videos,apln];
        var validationStatus = _.every(validate);
        console.log(optionSelectedStatus,'optionSelectedStatus')
        var value =
          optionSelectedStatus && validationStatus
            ? "2"
            : optionSelectedStatus
            ? "1"
            : "0";
      
      
        return value;
        }
        else{

           var optionSelectedStatus = _.some(checkpoint.rule, {
          is_selected: true,
        });

           var optionSelectedData = _.find(checkpoint.rule, {
          is_selected: true,
        }); 
        console.log(optionSelectedData,'optionSelectedData')

        var Images =
         (optionSelectedData.image_info?.camera ||optionSelectedData.image_info?.gallery ) ? checkpoint.cp_attach_images.length >= checkpoint.cp_noof_images
            ? true
            : false : true; 
        var Videos =
         (optionSelectedData.video_info?.camera ||optionSelectedData.video_info?.gallery ) ? checkpoint.cp_attach_videos.length >= checkpoint.cp_noof_videos
            ? true
            : false : true;
        var Documents =
        optionSelectedData.document_info?.length >0 ? checkpoint.cp_documents.length >= checkpoint.cp_noof_documents
            ? true
            : false : true;
        //   var apln = selected_option.capa_info?.mandatory ?selected_option.capa_info?.mandatory && checkpoint.cp_actionplans.length >= 1
        // ? true
        // : false : true;

          var apln = epsInfo.audit_pbd_users.create_acplan ? selected_option.capa_info?.mandatory ?selected_option.capa_info?.mandatory && checkpoint.cp_actionplans.length >= 1
        ? true
        : false : true : true;

          var dataInfo = optionSelectedData?.option_text



        var validate = [Images, Documents, Videos,apln];
        var validationStatus = _.every(validate);
        console.log(validationStatus,'validationStatus',optionSelectedStatus)
          var value =
          optionSelectedStatus && validationStatus && dataInfo
            ? "2"
            : (optionSelectedStatus && (Images || Videos || Documents || dataInfo))
            ? "1"
            : "0";
          return value;
        }
      },

}

export default validation;









// import _, { repeat } from "lodash";
// var moment = require('moment')


// let validation = {

//   checkpointStatus: (checkpoint) => {
//     console.log(checkpoint, 'checkpoint')
//     var optionSelectedStatus = _.some(checkpoint.checkpoint_options, {
//       is_selected: true,
//     });


//     var getOptionIndex = _.findIndex(checkpoint.checkpoint_options, {
//       is_selected: true,
//     });

//     var selected_option = checkpoint.checkpoint_options[getOptionIndex];
//     var Images =
//       checkpoint.cp_attach_images.length >= checkpoint.cp_noof_images
//         ? true
//         : false;
//     if (checkpoint.cp_attach_videos !== undefined) {
//       var videos =
//         checkpoint.cp_attach_videos.length >= checkpoint.cp_noof_videos
//           ? true
//           : false;
//     }
//     var Documents =
//       checkpoint.cp_documents.length >= checkpoint.cp_noof_documents
//         ? true
//         : false;
//     var apln = !selected_option.nc_mandatory
//       ? true
//       : selected_option.nc_mandatory && checkpoint.cp_actionplans.length >= 1
//         ? true
//         : false;
//     if (checkpoint.cp_attach_videos !== undefined) {
//       var validate = [Images, videos, Documents, apln];
//     }
//     else {
//       var validate = [Images, Documents, apln];

//     }
//     var validationStatus = _.every(validate);
//     console.log(validationStatus, 'validationStatus', validate)
//     var value =
//       optionSelectedStatus && validationStatus
//         ? "2"
//         : optionSelectedStatus
//           ? "1"
//           : "0";
//     console.log(Images, 'Images', value)

//     return value;
//   },

// }

// export default validation;