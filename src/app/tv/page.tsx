
"use client";

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { getTvChannels, TvChannel } from '@/lib/data';
import { VideoPlayer } from '@/components/video-player';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type Player from 'video.js/dist/types/player';

export default function TvPage() {
    const [allChannels, setAllChannels] = useState<TvChannel[]>([]);
    const [filteredChannels, setFilteredChannels] = useState<TvChannel[]>([]);
    const [selectedCountry, setSelectedCountry] = useState('ES');
    const [nowPlaying, setNowPlaying] = useState<TvChannel | null>(null);
    const [videoOptions, setVideoOptions] = useState<any>(null);
    const [player, setPlayer] = useState<Player | null>(null);

    useEffect(() => {
        async function fetchChannels() {
            const channels = await getTvChannels();
            setAllChannels(channels);
        }
        fetchChannels();
    }, []);

    useEffect(() => {
        const channelsFromCountry = allChannels.filter(c => c.country === selectedCountry);
        setFilteredChannels(channelsFromCountry);

        if (channelsFromCountry.length > 0 && (!nowPlaying || nowPlaying.country !== selectedCountry)) {
            handleChannelSelect(channelsFromCountry[0]);
        } else if (channelsFromCountry.length === 0) {
            setNowPlaying(null);
            setVideoOptions(null);
        }

    }, [selectedCountry, allChannels]);

    const countries = useMemo(() => {
        const countryMap = allChannels.reduce((acc, channel) => {
            if (channel.country && !acc[channel.country]) {
                acc[channel.country] = channel.country; // Using country code as name for now
            }
            return acc;
        }, {} as Record<string, string>);
        return Object.entries(countryMap).sort((a,b) => a[1].localeCompare(b[1]));
    }, [allChannels]);

    const handleChannelSelect = (channel: TvChannel) => {
        if (!channel.url) return;
        setNowPlaying(channel);
        const newOptions = {
            controls: true,
            autoplay: true,
            preload: 'auto',
            fluid: true,
            sources: [{
                src: channel.url,
                type: channel.url.endsWith('.m3u8') ? 'application/x-mpegURL'
                    : channel.url.endsWith('.mpd') ? 'application/dash+xml'
                    : `video/${channel.url.split('.').pop()}`
            }]
        };
        
        if (player) {
            player.src(newOptions.sources);
            player.play();
        } else {
            setVideoOptions(newOptions);
        }
    };
    
    const handlePlayerReady = (p: Player) => {
        setPlayer(p);
        if(videoOptions){
            p.src(videoOptions.sources);
            p.play();
        }
    }


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
                            {countries.map(([code, name]) => (
                                <SelectItem key={code} value={code}>{name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    
                    <Card>
                        <CardContent className="p-2">
                             <ScrollArea className="h-[60vh]">
                                <div className="space-y-2">
                                    {filteredChannels.map(channel => (
                                        <button
                                            key={channel.id}
                                            onClick={() => handleChannelSelect(channel)}
                                            className={cn(
                                                "w-full flex items-center gap-4 p-2 rounded-lg transition-colors text-left",
                                                nowPlaying?.id === channel.id ? "bg-primary/20 text-primary" : "hover:bg-muted"
                                            )}
                                        >
                                            <div className="relative h-10 w-10 flex-shrink-0">
                                                <Image 
                                                    src={channel.logo || '/tvicon.png'} 
                                                    alt={`${channel.name} logo`}
                                                    fill
                                                    sizes="40px"
                                                    className="object-contain rounded-md"
                                                />
                                            </div>
                                            <span className="font-medium truncate">{channel.name}</span>
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
