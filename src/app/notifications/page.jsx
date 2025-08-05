'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Notifications({ userId }) {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Fetch initial notifications
        const fetchNotifications = async () => {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });
            if (error) console.error('Error fetching notifications:', error);
            else setNotifications(data);
        };
        fetchNotifications();

        // Subscribe to real-time updates
        const subscription = supabase
            .channel('notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    setNotifications((prev) => [payload.new, ...prev]);
                }
            )
            .subscribe();

        // Cleanup subscription on unmount
        return () => {
            supabase.removeChannel(subscription);
        };
    }, [userId]);

    return (
        <div>
            <h2>Notifications</h2>
            {notifications.map((notification) => (
                <div key={notification.id}>
                    <p>{notification.message}</p>
                    <small>{new Date(notification.created_at).toLocaleString()}</small>
                </div>
            ))}
        </div>
    );
}