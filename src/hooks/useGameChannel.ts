'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { BroadcastEvent } from '@/types/game';

export function useGameChannel(
  sessionCode: string | null,
  onEvent: (event: BroadcastEvent) => void
) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const onEventRef = useRef(onEvent);
  const [ready, setReady] = useState(false);

  // Keep callback ref fresh without re-subscribing
  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    if (!sessionCode) return;

    setReady(false);

    const channel = supabase.channel(`game:${sessionCode}`, {
      config: { broadcast: { self: true } },
    });

    channel
      .on('broadcast', { event: 'game_event' }, ({ payload }) => {
        onEventRef.current(payload as BroadcastEvent);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setReady(true);
        }
      });

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
      setReady(false);
    };
  }, [sessionCode]);

  const broadcast = useCallback(
    (event: BroadcastEvent) => {
      if (!channelRef.current) return;
      channelRef.current.send({
        type: 'broadcast',
        event: 'game_event',
        payload: event,
      });
    },
    []
  );

  return { broadcast, ready };
}
