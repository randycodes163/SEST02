import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zwwtvcuofvawnigfldvm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3d3R2Y3VvZnZhd25pZ2ZsZHZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NDE4MDEsImV4cCI6MjA2NDUxNzgwMX0.Jyff1I8Y4871EyRmyaa-JTIsiHkaWVK1Hr6DbvjdSXs';

export const supabase = createClient(supabaseUrl, supabaseKey);


