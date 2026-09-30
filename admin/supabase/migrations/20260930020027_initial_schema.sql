-- CATEGORIES TABLE --
create table public.categories(
    id bigint generated always as identity primary key,
    name text not null,
    description text,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint categories_name_unique unique (name)
);

-- BRANDS TABLE --
create table public.brands(
    id bigint generated always as identity primary key,
    name text not null,
    description text,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint brands_name_unique unique (name)
);

-- PRODUCTS TABLE --
create table public.products(
    id bigint generated always as identity primary key,
    name text not null,
    description text,
    
    category_id bigint
        references public.categories(id) on delete set null,
    brand_id bigint
        references public.brands(id) on delete set null,

    price numeric(12,2),
    quantity integer not null default 0,

    is_active boolean not null default true,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint products_quantity_check
        check (quantity >=0)
);

-- INDEXING --
create index products_category_id_idx on public.products(category_id);
create index products_brand_id_idx on public.products(brand_id);
create index products_name_idx on public.products(name);
