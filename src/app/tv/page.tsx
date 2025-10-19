
"use client";

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { getTvChannels, TvChannel, getAvailableTvCountries } from '@/lib/data';
import { VideoPlayer } from '@/components/video-player';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type Player from 'video.js/dist/types/player';

export default function TvPage() {
    const [countries, setCountries] = useState<string[]>([]);
    const [filteredChannels, setFilteredChannels] = useState<TvChannel[]>([]);
    const [selectedCountry, setSelectedCountry] = useState('ES');
    const [nowPlaying, setNowPlaying] = useState<TvChannel | null>(null);
    const [videoOptions, setVideoOptions] = useState<any>(null);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const playerRef = useRef<Player | null>(null);

    useEffect(() => {
        async function fetchInitialData() {
            const availableCountries = await getAvailableTvCountries();
            setCountries(availableCountries);
        }
        fetchInitialData();
    }, []);

    useEffect(() => {
        async function fetchChannelsForCountry() {
            if (!selectedCountry) return;
            setNowPlaying(null); // Reset player while loading new country
            setFilteredChannels([]); // Clear old channels
            const channels = await getTvChannels({ countryCode: selectedCountry });
            setFilteredChannels(channels);

            if (channels.length > 0) {
                handleChannelSelect(channels[0]);
            } else {
                setNowPlaying(null);
                setVideoOptions(null);
            }
        }
        fetchChannelsForCountry();
    }, [selectedCountry]);

    const handleChannelSelect = (channel: TvChannel) => {
        if (!channel.url) return;
        setNowPlaying(channel);
        setVideoOptions({
            controls: true,
            autoplay: hasUserInteracted,
            muted: !hasUserInteracted, 
            preload: 'auto',
            fluid: true,
            sources: [{
                src: channel.url,
                type: channel.url.endsWith('.m3u8') ? 'application/x-mpegURL'
                    : channel.url.endsWith('.mpd') ? 'application/dash+xml'
                    : `video/${channel.url.split('.').pop()}`
            }],
            plugins: {
              chromecast: {},
            },
            controlBar: {
              children: [
                'playToggle',
                'progressControl',
                'volumePanel',
                'chromecastButton',
                'fullscreenToggle',
              ],
            },
        });
    };

    const handlePlayerReady = (player: Player) => {
        playerRef.current = player;
        player.on('volumechange', () => {
            if (!player.muted() && !hasUserInteracted) {
                 setHasUserInteracted(true);
            }
        });
        player.on('error', () => {
            console.error('Error al reproducir el canal:', player.error());
        });
    };
    
    const Player = () => {
        if (videoOptions) {
            return <VideoPlayer options={videoOptions} onReady={handlePlayerReady} />;
        }
        return (
            <div className="aspect-video bg-black flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                    <p>Selecciona un canal para reproducir.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
             <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="overflow-hidden">
                        <CardContent className="p-0">
                           <Player />
                        </CardContent>
                    </Card>
                     <div>
                        <h1 className="text-4xl font-bold tracking-tight">{nowPlaying?.name || 'Televisión en Directo'}</h1>
                        <p className="text-lg text-muted-foreground">{nowPlaying?.country}</p>
                    </div>
                </div>

                 <div className="lg:col-span-1 space-y-4">
                    <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar país" />
                        </SelectTrigger>
                        <SelectContent>
                            {countries.map((code) => (
                                <SelectItem key={code} value={code}>{code}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    
                    <Card>
                        <CardContent className="p-2">
                             <ScrollArea className="h-[60vh]">
                                <div className="grid grid-cols-4 gap-2">
                                    {filteredChannels.map(channel => (
                                        <button
                                            key={channel.id}
                                            onClick={() => handleChannelSelect(channel)}
                                            className={cn(
                                                "flex flex-col items-center justify-start gap-2 p-2 rounded-lg transition-colors text-center",
                                                nowPlaying?.id === channel.id ? "bg-primary/20 text-primary" : "hover:bg-muted"
                                            )}
                                        >
                                            <div className="relative h-14 w-full bg-black/20 rounded-md flex items-center justify-center">
                                                <Image 
                                                    src={channel.logo || '/tvicon.png'} 
                                                    alt={`${channel.name} logo`}
                                                    width={56}
                                                    height={56}
                                                    className="object-contain rounded-sm"
                                                />
                                            </div>
                                            <span className="text-xs font-medium w-full overflow-hidden text-ellipsis whitespace-nowrap">{channel.name}</span>
                                        </button>
                                    ))}
                                </div>
                             </ScrollArea>
                        </CardContent>
                    </Card>

                 </div>
             </div>
        </div>
    );
}
