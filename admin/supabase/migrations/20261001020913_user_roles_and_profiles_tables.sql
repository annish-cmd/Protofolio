create type public.user_role as enum(
    'admin',
    'owner',
    'staff'
);

create table public.profiles(
    id uuid primary key
        references auth.users(id)
            on delete cascade,
    full_name text,

    role public.user_role not null default 'staff',

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);