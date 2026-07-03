-- Run this in your Supabase SQL Editor

-- 1. Create Tables
create table if not exists tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  completed boolean default false,
  date date,
  priority text,
  checklist jsonb default '[]'::jsonb
);

create table if not exists expenses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  description text not null,
  amount numeric not null,
  category text not null,
  type text,
  payment_method text,
  date date
);

create table if not exists budgets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  category text not null,
  limit_amount numeric not null,
  unique(user_id, category)
);

create table if not exists reminders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  text text not null,
  date date,
  time time,
  notified boolean default false
);

-- 2. Enable Row Level Security
alter table tasks enable row level security;
alter table expenses enable row level security;
alter table budgets enable row level security;
alter table reminders enable row level security;

-- 3. Create RLS Policies
create policy "Users can manage their own tasks" on tasks for all using (auth.uid() = user_id);
create policy "Users can manage their own expenses" on expenses for all using (auth.uid() = user_id);
create policy "Users can manage their own budgets" on budgets for all using (auth.uid() = user_id);
create policy "Users can manage their own reminders" on reminders for all using (auth.uid() = user_id);

-- Alternative: Single JSON State Table (for easy syncing)
create table if not exists user_data (
  user_id uuid references auth.users primary key,
  app_state jsonb default '{}'::jsonb
);
alter table user_data enable row level security;
create policy "Users can manage their own data" on user_data for all using (auth.uid() = user_id);
