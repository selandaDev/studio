
"use client";
import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

// Import Chromecast for its side effects to register the plugin
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
      const videoElement = document.createElement("video-js");
      videoElement.classList.add('vjs-big-play-centered');
      if (videoRef.current) {
        videoRef.current.appendChild(videoElement);
      }

      // Combine the passed options with the required Chromecast plugin configuration
      const finalOptions = {
        ...options,
        controlBar: {
          children: [
            'playToggle',
            'volumePanel',
            'progressControl',
            'currentTimeDisplay',
            'timeDivider',
            'durationDisplay',
            'pictureInPictureToggle',
            'fullscreenToggle',
            'chromecastButton', // Ensure button is in the control bar
          ],
        },
        plugins: {
          ...options.plugins,
          chromecast: {}, // Explicitly enable the chromecast plugin
        },
      };

      const player = playerRef.current = videojs(videoElement, finalOptions, () => {
        player.log('player is ready');
        onReady && onReady(player);
      });
      
    } else {
        // If player already exists, just update the source
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
