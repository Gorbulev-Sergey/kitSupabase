import { sb } from "$lib/supabase";

async function getMessages() {
    const { data, error } = await sb
        .from('messages')
        .select();
    return data
}

export async function GET() {
    return new Response(JSON.stringify(await getMessages()))
}