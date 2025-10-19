
"use client";
import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';
import '@videojs/http-streaming';

// Importar el plugin de Chromecast y sus estilos
import '@silvermine/videojs-chromecast/dist/silvermine-videojs-chromecast.css';
import chromecast from '@silvermine/videojs-chromecast';

// Registrar el plugin de forma segura
try {
  if (videojs.getPlugin('chromecast') === undefined) {
    // La función 'chromecast' espera 'videojs' como primer argumento
    chromecast(videojs);
  }
} catch (error) {
  console.error('Error al registrar el plugin de Chromecast:', error);
}


export const VideoPlayer = (props: { options: any, onReady?: (player: Player) => void }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const { options, onReady } = props;

  useEffect(() => {
    // Asegurarse de que solo inicializamos el reproductor una vez
    if (!playerRef.current && videoRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current.appendChild(videoElement);

      const player = playerRef.current = videojs(videoElement, options, () => {
        player.log('player is ready');
        onReady && onReady(player);
      });
    } else {
      // Si el reproductor ya existe, simplemente actualiza las opciones
      const player = playerRef.current;
      if (player) {
        player.autoplay(options.autoplay);
        player.src(options.sources);
      }
    }
  }, [options, onReady]); // Depender de las opciones para recrear/actualizar si cambian

  // Limpieza al desmontar el componente
  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoPlayer;
