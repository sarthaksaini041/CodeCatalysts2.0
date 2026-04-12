import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { supabase } from '../lib/supabase-browser';

const CMSContext = createContext({
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
    error: null,
    refresh: () => {}
});

export const CMSProvider = ({ children, initialData = {} }) => {
    const [data, setData] = useState({
        siteContent: initialData.siteContent || {},
        chapter1Items: initialData.chapter1Items || [],
        chapter2Cards: initialData.chapter2Cards || [],
        chapter2Stats: initialData.chapter2Stats || [],
        chapter3Steps: initialData.chapter3Steps || [],
        projects: initialData.projects || [],
        chapter5Showcase: initialData.chapter5Showcase || [],
        teamMembers: initialData.teamMembers || [],
        footerSettings: initialData.footerSettings || {},
        loading: !initialData.siteContent, // Don't show loading if we have initial data
        error: null
    });

    const fetchAllContent = useCallback(async (isInitial = false) => {
        // If it's the initial call and we already have data, skip the fetch to stay "static"
        if (isInitial && Object.keys(data.siteContent).length > 0) return;

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
    }, []);

    useEffect(() => {
        fetchAllContent(true);
    }, [fetchAllContent]);

    return (
        <CMSContext.Provider value={{ ...data, refresh: fetchAllContent }}>
            {children}
        </CMSContext.Provider>
    );
};

export const useCMS = () => {
    const context = useContext(CMSContext);
    if (!context) {
        throw new Error('useCMS must be used within a CMSProvider');
    }
    return context;
};

