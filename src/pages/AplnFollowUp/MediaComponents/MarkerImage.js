
import React, { useRef, useEffect } from 'react';
import * as markerjs2 from 'markerjs2';
import { useDispatch, useSelector } from 'react-redux';
import { setMarkerState } from '../../../toolkitStore/Auditvista/actionPlan/Slice/actionplaninfoslice';
import { setMarkerStateChat } from '../../../toolkitStore/Auditvista/actionPlan/Slice/chatInfoSlice';
const MarkerImage = (props) => {
    const dispatch = useDispatch();
    const infoSlice = props.actionPlan ? useSelector((state) => state.infosliceReducer) : useSelector((state) => state.chatInfoSliceReducer);
    const markers = infoSlice.markerState
    const imgRef = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            showMarkerArea()
        }, 1000);
    }, [imgRef])

    const showMarkerArea = () => {
        if (imgRef.current !== null) {
            const markerArea = new markerjs2.MarkerArea(imgRef.current);
            markerArea.uiStyleSettings.redoButtonVisible = true;
            markerArea.uiStyleSettings.notesButtonVisible = true;
            markerArea.uiStyleSettings.zoomButtonVisible = true;
            markerArea.uiStyleSettings.zoomOutButtonVisible = true;
            markerArea.uiStyleSettings.clearButtonVisible = true;
            markerArea.settings.displayMode = "popup";

            markerArea.uiStyleSettings.width = "50vh";
            markerArea.styles.width = "50vh";
            markerArea.uiStyleSettings.zIndex = 2000;

            let maState = markers ? markers : '';

            markerArea.addEventListener('render', async event => {
                if (imgRef.current) {
                    const response = await fetch(event.dataUrl);
                    const blob = await response.blob();

                    const originalFile = new File([blob], 'filename.png', { type: 'image/png' });
                    const previewBlob = new Blob([event.dataUrl], { type: 'image/png' });
                    const fileWithPreview = new File([originalFile, previewBlob], 'filename-with-preview.png', { type: 'image/png' });
                    props.actionPlan ? dispatch(setMarkerState(event.state)) : dispatch(setMarkerStateChat(event.state))
                    props.onEditedImage({
                        preview: true,
                        previewUrl: event.dataUrl,
                        fileUrl: fileWithPreview
                    })
                    props.isEdited(true)
                }
            });

            markerArea.show();
            if (maState) {
                markerArea.restoreState(maState);
            }
            markerArea.addEventListener('close', () => {
                props.isEdited(false)
                props.onCancelModal()
            });
        }
    };


    return (
        <div>
            <img crossOrigin='anonymous' ref={imgRef} src={props.preview_url} alt="Preview" style={{ width: '100%' }} onClick={showMarkerArea} />
        </div>
    )
}


export default MarkerImage;