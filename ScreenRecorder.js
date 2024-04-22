let recorder;
let chunks = [];
let recording = false;
  // Your access token can be found at: https://ion.cesium.com/tokens.
  // This is the default access token from your ion account
  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiNDllYWJkNC00ODI3LTQzMWEtOGI1NC01MmJjNjIxNzRmMTYiLCJpZCI6MTQxNDI5LCJpYXQiOjE2ODUwMDU2NTV9.zguq3RG6zdMOmx2oVxpN50BCKRZKeK3S9jbG-zvyACos';
  // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
  const viewer = new Cesium.Viewer("cesiumContainer", {
  baseLayer: Cesium.ImageryLayer.fromProviderAsync(
    Cesium.TileMapServiceImageryProvider.fromUrl(
      Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII")
    )
  ),
  baseLayerPicker: false,
  geocoder: false,
});

viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(14.0685261,40.79480045, 4000000)
    });

const toolbar = document.querySelector("div.cesium-viewer-toolbar");
const modeButton = document.querySelector("span.cesium-sceneModePicker-wrapper");
const myButton = document.createElement("button");
myButton.classList.add("cesium-button", "cesium-toolbar-button");
myButton.innerHTML = "REC";
toolbar.insertBefore(myButton, modeButton);

myButton.addEventListener("click", async () => {
    if (!recording) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                mediaSource: "screen",
                cursor: "always"
            },
            audio:false
        });
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (event) => chunks.push(event.data);
        recorder.onstop = () => {
            stream.getTracks() // get all tracks from the MediaStream
            .forEach( track => track.stop() ); // stop each of them
            const blob = new Blob(chunks, { type: "video/mp4" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            timestamp = new Date().getTime();
            a.download = "RSP_"+timestamp+".mp4";
            a.click();
            URL.revokeObjectURL(url);
            chunks = [];
            myButton.textContent = "REC";
            recording = false;
        };
        recorder.start();
        myButton.textContent = "STOP";
        recording = true;
    } else {
        recorder.stop();
    }
});