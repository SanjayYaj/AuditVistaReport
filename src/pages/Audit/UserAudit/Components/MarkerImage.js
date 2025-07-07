
import React, { useRef, useEffect } from 'react';
import * as markerjs2 from 'markerjs2';

const MarkerImage = (props) => {
    const imgRef = useRef(null);

    useEffect(() => {
        console.log('imgRef', imgRef)
        setTimeout(() => {
        showMarkerArea()            
        }, 1000);
    }, [imgRef])

    const showMarkerArea = () => {
        console.log('save16',props)
        if (imgRef.current !== null) {
            const markerArea = new markerjs2.MarkerArea(imgRef.current);
            markerArea.uiStyleSettings.redoButtonVisible = true;
            markerArea.uiStyleSettings.notesButtonVisible = true;
            markerArea.uiStyleSettings.zoomButtonVisible = true;
            markerArea.uiStyleSettings.zoomOutButtonVisible = true;
            markerArea.uiStyleSettings.clearButtonVisible = true;
            markerArea.settings.displayMode = "popup";
    
            markerArea.uiStyleSettings.width = "50vh"; // Adjust as needed
            markerArea.styles.width = "50vh"; // Adjust as needed
            markerArea.uiStyleSettings.zIndex = 2000;
    
            let maState= props.markers? props.markers :'';      
            console.log('dataUrl', imgRef.current.src, maState)

            markerArea.addEventListener('render', async event => {
                if (imgRef.current) {
                    console.log(event.dataUrl,'event.dataUrl',event,event.state)
                    const response = await fetch(event.dataUrl);
                    console.log(response,'response')
                    const blob = await response.blob();
            
                    const originalFile = new File([blob], 'filename.png', { type: 'image/png' });
                    const previewBlob = new Blob([event.dataUrl], { type: 'image/png' });
                    const fileWithPreview = new File([originalFile, previewBlob],'filename-with-preview.png', { type: 'image/png' });
                    props.onUploadMarkerFile(fileWithPreview,event);
                }                
            });
    
            markerArea.show();
            if (maState) {
                markerArea.restoreState(maState);
            }
            markerArea.addEventListener('close', () => {
                props.onCancelModal()
            });

            document.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' &&  event.target.classList.contains('dz-message')) {
                    event.stopPropagation();
                    event.preventDefault();
                }
            });
        }
    };
    

    return (
    <div >
        {
            console.log(props,'props')
        }
        <img crossOrigin='anonymous' ref={imgRef} src={props.preview_url} alt="Preview" style={{ width: '100%'}} />
    </div>
    )
}


export default MarkerImage;
