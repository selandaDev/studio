
"use client";
import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '@silvermine/videojs-chromecast';

// This is needed for http-streaming to work with video.js
import '@videojs/http-streaming';

export const VideoPlayer = (props: { options: any, onReady?: (player: any) => void }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const { options, onReady } = props;

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs a video element, so create one here.
      const videoElement = document.createElement("video-js");
      
      // We need to add the Chromecast button to the control bar
      videojs.options.controlBar = {
        children: [
            'playToggle',
            'volumePanel',
            'progressControl',
            'currentTimeDisplay',
            'timeDivider',
            'durationDisplay',
            'pictureInPictureToggle',
            'fullscreenToggle',
            'chromecastButton',
        ],
      };

      videoElement.classList.add('vjs-big-play-centered');
      if (videoRef.current) {
        videoRef.current.appendChild(videoElement);
      }

      const player = playerRef.current = videojs(videoElement, options, () => {
        player.log('player is ready');
        onReady && onReady(player);
      });
      
    // You can update player in the `else` block here, for example:
    } else {
        const player = playerRef.current;
        player.autoplay(options.autoplay);
        player.src(options.sources);
    }
  }, [options, videoRef, onReady]);

  // Dispose the Video.js player when the component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoPlayer;
