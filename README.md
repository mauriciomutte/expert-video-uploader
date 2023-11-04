# Expert Video Upload

> This is an implementation of lessons from [JS Expert Week 8.0](https://github.com/ErickWendel/semana-javascript-expert08)

## Project Overview

This project aims to facilitate the seamless uploading and processing of MP4 video files through a web application. Leveraging a combination of cutting-edge web technologies and APIs, we have created a robust system that ensures efficient video processing while maintaining the responsiveness of the user interface.

https://github.com/mauriciomutte/expert-video-uploader/assets/20569339/1cc43f45-0ec4-4a5e-a3b9-e5610b9385b0

## Key Features

**1. Efficient Video Processing:** The heart of this project lies in its ability to process MP4 video files without freezing or slowing down the user's browser. This is achieved through the utilization of the Web Workers API, which allows video processing to occur in the background without blocking the main thread.

**2. Streaming Video Transformation:** To further enhance the user experience, we employ the Streams API to transform the video while it is still in the process of being uploaded. This means that as your video is being processed, it is also being prepared for subsequent actions, ensuring a smoother and faster upload experience.

**3. MP4 Video Segmentation:** The project employs the powerful MP4Box library to segment MP4 video files. This segmentation process is crucial for efficiently managing and delivering video content. Segmentation simplifies video manipulation, making it easier to perform various operations.

**4. Advanced Video Encoding:** Video encoding is a key aspect of video processing, and the project harnesses the WebCodecs API to achieve this efficiently. By encoding videos in a browser-compatible format, we ensure that the processed videos can be easily accessed and viewed on various devices and platforms.

## How It Works

The user uploads an MP4 video file through the web interface. Once the file is selected, the video processing begins in the background using Web Workers, allowing the user to continue using the application without interruptions. The video is simultaneously transformed and segmented using Streams and MP4Box, making it ready for further actions.

Finally, the processed video is encoded using the WebCodecs API, resulting in a compatible video file that can be easily stored, shared, or played back. This combination of technologies ensures a streamlined and responsive video processing experience, making this project a valuable addition to any web-based video uploading and processing system.

## Resources

- [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)
- [WebCodecs API](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API)
- [MP4Box](https://github.com/gpac/mp4box.js)
