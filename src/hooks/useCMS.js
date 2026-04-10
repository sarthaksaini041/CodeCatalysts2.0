import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase-browser';

export const useCMS = () => {
    const [data, setData] = useState({
        siteContent: {},
        chapter1Items: [],
        chapter2Cards: [],
        chapter2Stats: [],
        chapter3Steps: [],
        projects: [],
        chapter5Showcase: [],
        teamMembers: [],
        footerSettings: {},
        loading: true,
        error: null
    });

    const fetchAllContent = async () => {
        try {
            const [
                { data: siteContent },
                { data: chapter1Items },
                { data: chapter2Cards },
                { data: chapter2Stats },
                { data: chapter3Steps },
                { data: projects },
                { data: chapter5Showcase },
                { data: teamMembers },
                { data: footerSettings }
            ] = await Promise.all([
                supabase.from('site_content').select('*'),
                supabase.from('chapter1_items').select('*').order('order_index', { ascending: true }),
                supabase.from('chapter2_cards').select('*').order('order_index', { ascending: true }),
                supabase.from('chapter2_stats').select('*').order('order_index', { ascending: true }),
                supabase.from('chapter3_steps').select('*').order('order_index', { ascending: true }),
                supabase.from('projects').select('*').order('order_index', { ascending: true }),
                supabase.from('chapter5_showcase').select('*').order('order_index', { ascending: true }),
                supabase.from('team_members').select('*').order('order_index', { ascending: true }).order('name', { ascending: true }),
                supabase.from('footer_settings').select('*').maybeSingle()
            ]);

            // Transform site_content array into an object for easier access
            const contentMap = siteContent?.reduce((acc, curr) => {
                acc[curr.key] = curr.content;
                return acc;
            }, {}) || {};

            setData({
                siteContent: contentMap,
                chapter1Items: chapter1Items || [],
                chapter2Cards: chapter2Cards || [],
                chapter2Stats: chapter2Stats || [],
                chapter3Steps: chapter3Steps || [],
                projects: projects || [],
                chapter5Showcase: chapter5Showcase || [],
                teamMembers: teamMembers || [],
                footerSettings: footerSettings || {},
                loading: false,
                error: null
            });
        } catch (err) {
            console.error('CMS: Fetch error:', err);
            setData(prev => ({ ...prev, loading: false, error: err.message }));
        }
    };

    useEffect(() => {
        fetchAllContent();
    }, []);

    return { ...data, refresh: fetchAllContent };
};
