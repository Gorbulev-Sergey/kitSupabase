import { createClient } from "@supabase/supabase-js";

export const sb = createClient(
    'https://gshllmjphlceacgiothr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzaGxsbWpwaGxjZWFjZ2lvdGhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY2OTE1MjYsImV4cCI6MjA0MjI2NzUyNn0.zPck0rucaJr7zHHGzhQcv_RqvQvTB4nkxZCQ9ZZuEGE'
);