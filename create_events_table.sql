-- Create the events table
create table if not exists public.events (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text,
    image text,
    date timestamptz not null,
    location text,
    latitude double precision,
    longitude double precision,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.events enable row level security;

-- Create policy to allow public read access
create policy "Allow public read access"
    on public.events
    for select
    using (true);

-- Create policy to allow authenticated users to insert
create policy "Allow authenticated create"
    on public.events
    for insert
    with check (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update their own events
create policy "Allow authenticated update own events"
    on public.events
    for update
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete their own events
create policy "Allow authenticated delete own events"
    on public.events
    for delete
    using (auth.role() = 'authenticated');
