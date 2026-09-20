-- =====================================================================
-- FULL DATABASE SCHEMA — for your personal Supabase project
-- Run this ONCE in the SQL Editor of a FRESH Supabase project.
-- Generated from the live database.
-- NOTE: auth.users is managed by Supabase Auth (already exists).
--       Create your admin user via the Auth dashboard, then add a row
--       in public.user_roles with role = 'admin'.
-- =====================================================================

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;

-- ============ Extensions ============
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS supabase_vault;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============ Enum types ============
DO $$ BEGIN CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE public.tracking_code_location AS ENUM ('head', 'body_top', 'body_bottom'); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ============ Tables ============
CREATE TABLE IF NOT EXISTS public.abandoned_carts (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "email" text,
  "customer_name" text,
  "user_id" uuid,
  "session_id" text,
  "items" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "total" integer DEFAULT 0 NOT NULL,
  "status" text DEFAULT 'open'::text NOT NULL,
  "reminders_sent" integer DEFAULT 0 NOT NULL,
  "last_reminder_at" timestamp with time zone,
  "recovered_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.analytics_events (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "event_id" text,
  "event_name" text NOT NULL,
  "environment" text DEFAULT 'production'::text NOT NULL,
  "session_id" text,
  "visitor_id" text,
  "user_id" uuid,
  "order_id" uuid,
  "value" numeric,
  "currency" text DEFAULT 'BDT'::text,
  "params" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.attribution_sessions (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "visitor_id" text NOT NULL,
  "session_id" text,
  "first_touch" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "last_touch" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "landing_page" text,
  "referrer" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.blog_categories (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "slug" text NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.blog_comments (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "post_id" uuid NOT NULL,
  "guest_name" text NOT NULL,
  "guest_email" text NOT NULL,
  "content" text NOT NULL,
  "is_approved" boolean DEFAULT false NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.blog_post_views (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "post_id" uuid NOT NULL,
  "visitor_id" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "slug" text NOT NULL,
  "title" text NOT NULL,
  "excerpt" text DEFAULT ''::text NOT NULL,
  "content" text DEFAULT ''::text NOT NULL,
  "cover_image" text DEFAULT ''::text NOT NULL,
  "cover_alt" text DEFAULT ''::text NOT NULL,
  "seo_title" text DEFAULT ''::text NOT NULL,
  "seo_description" text DEFAULT ''::text NOT NULL,
  "is_published" boolean DEFAULT true NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "noindex" boolean DEFAULT false NOT NULL,
  "category" text DEFAULT 'General'::text NOT NULL,
  "tags" text[] DEFAULT '{}'::text[] NOT NULL,
  "author" text DEFAULT 'EIDLIP Editorial'::text NOT NULL,
  "author_bio" text DEFAULT ''::text NOT NULL,
  "author_avatar" text DEFAULT ''::text NOT NULL,
  "author_social" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "status" text DEFAULT 'published'::text NOT NULL,
  "scheduled_at" timestamp with time zone,
  "is_featured" boolean DEFAULT false NOT NULL,
  "views" integer DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS public.checkout_payment_settings (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "provider" text NOT NULL,
  "number" text DEFAULT ''::text NOT NULL,
  "instructions" text DEFAULT ''::text NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.cod_district_rules (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "district" text NOT NULL,
  "cod_allowed" boolean DEFAULT true NOT NULL,
  "advance_required" boolean DEFAULT false NOT NULL,
  "advance_amount" integer DEFAULT 0 NOT NULL,
  "note" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.collections (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "slug" text NOT NULL,
  "title" text NOT NULL,
  "heading" text DEFAULT ''::text NOT NULL,
  "subheading" text DEFAULT ''::text NOT NULL,
  "description" text DEFAULT ''::text NOT NULL,
  "hero_image" text DEFAULT ''::text NOT NULL,
  "seo_title" text DEFAULT ''::text NOT NULL,
  "seo_description" text DEFAULT ''::text NOT NULL,
  "og_image" text DEFAULT ''::text NOT NULL,
  "filter_categories" text[] DEFAULT '{}'::text[] NOT NULL,
  "filter_subcategories" text[] DEFAULT '{}'::text[] NOT NULL,
  "filter_product_ids" uuid[] DEFAULT '{}'::uuid[] NOT NULL,
  "filter_featured" boolean,
  "filter_new_drop" boolean,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "noindex" boolean DEFAULT false NOT NULL,
  "show_in_nav" boolean DEFAULT false NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.conversion_events (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "event_id" text NOT NULL,
  "event_name" text NOT NULL,
  "provider" text NOT NULL,
  "environment" text DEFAULT 'production'::text NOT NULL,
  "order_id" uuid,
  "value" numeric,
  "currency" text DEFAULT 'BDT'::text,
  "status" text DEFAULT 'queued'::text NOT NULL,
  "attempts" integer DEFAULT 0 NOT NULL,
  "last_error" text,
  "payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "sent_at" timestamp with time zone
);

CREATE TABLE IF NOT EXISTS public.coupons (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "name" text DEFAULT ''::text NOT NULL,
  "code" text NOT NULL,
  "discount_type" text DEFAULT 'fixed'::text NOT NULL,
  "discount_value" integer DEFAULT 0 NOT NULL,
  "min_order_amount" integer DEFAULT 0 NOT NULL,
  "max_uses" integer,
  "used_count" integer DEFAULT 0 NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.custom_pages (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "slug" text NOT NULL,
  "title" text DEFAULT ''::text NOT NULL,
  "banner_url" text DEFAULT ''::text NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "product_ids" uuid[] DEFAULT '{}'::uuid[] NOT NULL,
  "seo_title" text,
  "seo_description" text,
  "og_image" text,
  "noindex" boolean DEFAULT false NOT NULL,
  "blocks" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "meta_keywords" text,
  "canonical_url" text
);

CREATE TABLE IF NOT EXISTS public.delivery_zones (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "fee" integer DEFAULT 0 NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.email_logs (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "recipient" text NOT NULL,
  "template_key" text,
  "subject" text,
  "status" text DEFAULT 'queued'::text NOT NULL,
  "provider" text DEFAULT 'lovable'::text NOT NULL,
  "provider_message_id" text,
  "error_message" text,
  "order_id" uuid,
  "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.email_templates (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "template_key" text NOT NULL,
  "name" text NOT NULL,
  "subject" text NOT NULL,
  "html_body" text DEFAULT ''::text NOT NULL,
  "text_body" text,
  "category" text DEFAULT 'transactional'::text NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "variables" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.fraud_checks (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "phone" text NOT NULL,
  "status" text DEFAULT 'Unknown'::text NOT NULL,
  "score" integer DEFAULT 0 NOT NULL,
  "total_parcel" integer DEFAULT 0 NOT NULL,
  "success_parcel" integer DEFAULT 0 NOT NULL,
  "cancel_parcel" integer DEFAULT 0 NOT NULL,
  "response" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "source" text DEFAULT 'LIVE'::text NOT NULL,
  "checked_at" timestamp with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.header_categories (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "slug" text NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "parent_id" uuid,
  "menu_type" text DEFAULT 'dropdown'::text NOT NULL,
  "mega_columns" integer DEFAULT 3 NOT NULL,
  "banner_desktop" text,
  "banner_mobile" text,
  "cta_text" text,
  "cta_link" text,
  "icon_url" text,
  "thumbnail_url" text,
  "show_in_header" boolean DEFAULT true NOT NULL,
  "show_in_mobile" boolean DEFAULT true NOT NULL,
  "show_in_footer" boolean DEFAULT false NOT NULL,
  "badge" text,
  "seo_title" text,
  "meta_description" text,
  "meta_keywords" text,
  "og_image" text,
  "canonical_url" text,
  "short_description" text,
  "long_description" text,
  "is_featured" boolean DEFAULT false NOT NULL,
  "show_on_homepage" boolean DEFAULT false NOT NULL,
  "status" text DEFAULT 'published'::text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.homepage_sections (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "section_key" text NOT NULL,
  "title" text NOT NULL,
  "type" text NOT NULL,
  "enabled" boolean DEFAULT true NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "config" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.landing_pages (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "title" text NOT NULL,
  "slug" text NOT NULL,
  "blocks" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "seo_title" text,
  "meta_description" text,
  "og_image" text,
  "status" text DEFAULT 'draft'::text NOT NULL,
  "publish_at" timestamp with time zone,
  "expire_at" timestamp with time zone,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "page_type" text DEFAULT 'landing'::text NOT NULL,
  "noindex" boolean DEFAULT false NOT NULL,
  "meta_keywords" text,
  "canonical_url" text
);

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "email" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "source" text DEFAULT 'general'::text,
  "status" text DEFAULT 'pending'::text NOT NULL,
  "confirmation_token" text,
  "confirmed_at" timestamp with time zone,
  "unsubscribed_at" timestamp with time zone
);

CREATE TABLE IF NOT EXISTS public.orders (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid,
  "items" jsonb NOT NULL,
  "total" integer NOT NULL,
  "customer_name" text NOT NULL,
  "customer_phone" text NOT NULL,
  "customer_address" text NOT NULL,
  "customer_city" text NOT NULL,
  "delivery_method" text DEFAULT 'standard'::text NOT NULL,
  "payment_method" text DEFAULT 'cod'::text NOT NULL,
  "status" text DEFAULT 'Pending'::text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "consignment_id" text,
  "tracking_code" text,
  "courier_provider" text,
  "transaction_id" text,
  "payment_sender_number" text,
  "customer_note" text,
  "deleted_at" timestamp with time zone,
  "order_token" text DEFAULT encode(extensions.gen_random_bytes(32), 'hex'::text),
  "customer_email" text,
  "discount" integer DEFAULT 0 NOT NULL,
  "delivery_charge" integer DEFAULT 0 NOT NULL,
  "courier_fee" integer DEFAULT 0 NOT NULL,
  "source" text DEFAULT 'website'::text NOT NULL,
  "advance_payment" integer DEFAULT 0 NOT NULL,
  "call_attempts" integer DEFAULT 0 NOT NULL,
  "admin_notes" text,
  "return_received" boolean DEFAULT false NOT NULL,
  "coupon_code" text,
  "payment_status" text DEFAULT 'unpaid'::text NOT NULL,
  "paid_amount" integer DEFAULT 0 NOT NULL,
  "payment_gateway" text,
  "gateway_txn_id" text,
  "utm_source" text,
  "utm_medium" text,
  "utm_campaign" text,
  "utm_term" text,
  "utm_content" text,
  "gclid" text,
  "fbclid" text,
  "ttclid" text,
  "landing_page" text,
  "referrer_url" text
);

CREATE TABLE IF NOT EXISTS public.packaging_options (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "fee" numeric DEFAULT 0 NOT NULL,
  "description" text,
  "is_active" boolean DEFAULT true NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.payment_audit_log (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "action" text NOT NULL,
  "entity_type" text NOT NULL,
  "entity_id" uuid,
  "entity_label" text,
  "actor_id" uuid,
  "actor_email" text,
  "ip_address" text,
  "user_agent" text,
  "old_value" jsonb,
  "new_value" jsonb,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.payment_gateways (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "gateway" text NOT NULL,
  "display_name" text NOT NULL,
  "is_active" boolean DEFAULT false NOT NULL,
  "mode" text DEFAULT 'sandbox'::text NOT NULL,
  "credentials" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "config" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "instructions" text,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "slug" text NOT NULL,
  "icon" text,
  "gateway_type" text DEFAULT 'automated'::text NOT NULL,
  "is_builtin" boolean DEFAULT false NOT NULL,
  "manual_config" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "min_order_amount" integer DEFAULT 0 NOT NULL,
  "max_order_amount" integer,
  "extra_charge" integer DEFAULT 0 NOT NULL,
  "discount_type" text,
  "discount_value" integer DEFAULT 0 NOT NULL,
  "last_payment_at" timestamp with time zone,
  "last_webhook_at" timestamp with time zone,
  "last_test_at" timestamp with time zone,
  "last_test_ok" boolean
);

CREATE TABLE IF NOT EXISTS public.payment_refunds (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "order_id" uuid,
  "transaction_id" uuid,
  "gateway" text NOT NULL,
  "amount" integer NOT NULL,
  "reason" text,
  "status" text DEFAULT 'requested'::text NOT NULL,
  "gateway_refund_id" text,
  "notes" text,
  "processed_by" uuid,
  "processed_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.payment_status_history (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "order_id" uuid NOT NULL,
  "transaction_id" uuid,
  "old_status" text,
  "new_status" text NOT NULL,
  "reason" text,
  "changed_by" uuid,
  "changed_by_email" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.payment_transactions (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "order_id" uuid,
  "gateway" text NOT NULL,
  "amount" integer NOT NULL,
  "currency" text DEFAULT 'BDT'::text NOT NULL,
  "status" text DEFAULT 'pending'::text NOT NULL,
  "is_advance" boolean DEFAULT false NOT NULL,
  "gateway_txn_id" text,
  "val_id" text,
  "sender_number" text,
  "customer_phone" text,
  "error_message" text,
  "raw_response" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "verified_by" uuid,
  "verified_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "proof_url" text,
  "admin_note" text
);

CREATE TABLE IF NOT EXISTS public.product_images (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "product_id" uuid NOT NULL,
  "image_url" text NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "alt_text" text,
  "color" text
);

CREATE TABLE IF NOT EXISTS public.product_size_stock (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "product_id" uuid NOT NULL,
  "size" text NOT NULL,
  "total_stock" integer DEFAULT 0 NOT NULL,
  "sold_count" integer DEFAULT 0 NOT NULL,
  "cancelled_count" integer DEFAULT 0 NOT NULL,
  "returned_count" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.products (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "price" integer NOT NULL,
  "original_price" integer,
  "image_url" text DEFAULT ''::text NOT NULL,
  "category" text NOT NULL,
  "description" text DEFAULT ''::text NOT NULL,
  "sizes" text[] DEFAULT ARRAY['S'::text, 'M'::text, 'L'::text, 'XL'::text] NOT NULL,
  "colors" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "stock" integer DEFAULT 0 NOT NULL,
  "featured" boolean DEFAULT false NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "brand" text DEFAULT ''::text NOT NULL,
  "sku" text DEFAULT ''::text NOT NULL,
  "size_chart" jsonb DEFAULT '[]'::jsonb,
  "subcategory" text,
  "is_new_drop" boolean DEFAULT false NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "slug" text,
  "alt_text" text,
  "seo_title" text,
  "seo_description" text,
  "og_image" text,
  "noindex" boolean DEFAULT false NOT NULL,
  "product_info" jsonb DEFAULT '{}'::jsonb NOT NULL
);

CREATE TABLE IF NOT EXISTS public.profiles (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "display_name" text,
  "phone" text,
  "address" text,
  "city" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.reviews (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "product_id" uuid NOT NULL,
  "user_id" uuid,
  "name" text NOT NULL,
  "rating" integer NOT NULL,
  "comment" text DEFAULT ''::text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "email" text,
  "photo_url" text,
  "title" text,
  "verified" boolean DEFAULT false NOT NULL,
  "helpful_count" integer DEFAULT 0 NOT NULL,
  "photo_urls" text[] DEFAULT '{}'::text[] NOT NULL
);

CREATE TABLE IF NOT EXISTS public.seo_settings (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "key" text NOT NULL,
  "value" text DEFAULT ''::text NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.stock_logs (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "product_id" uuid NOT NULL,
  "size" text NOT NULL,
  "change_type" text DEFAULT 'manual'::text NOT NULL,
  "quantity" integer DEFAULT 0 NOT NULL,
  "order_id" uuid,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.store_settings (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "key" text NOT NULL,
  "value" text DEFAULT ''::text NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.subcategories (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "parent_category" text NOT NULL,
  "name" text NOT NULL,
  "slug" text NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "parent_id" uuid,
  "icon_url" text,
  "thumbnail_url" text,
  "badge" text,
  "seo_title" text,
  "meta_description" text,
  "meta_keywords" text,
  "og_image" text,
  "canonical_url" text,
  "short_description" text,
  "long_description" text,
  "status" text DEFAULT 'published'::text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.tracking_codes (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "label" text NOT NULL,
  "location" public.tracking_code_location DEFAULT 'head'::tracking_code_location NOT NULL,
  "code" text DEFAULT ''::text NOT NULL,
  "enabled" boolean DEFAULT true NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "created_by" uuid,
  "updated_by" uuid,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.tracking_codes_audit (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "code_id" uuid,
  "action" text NOT NULL,
  "label" text,
  "location" public.tracking_code_location,
  "changed_by" uuid,
  "snapshot" jsonb,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.tracking_settings (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "key" text NOT NULL,
  "value" text DEFAULT ''::text NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.trash_users (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "original_user_id" uuid NOT NULL,
  "email" text,
  "display_name" text,
  "phone" text,
  "city" text,
  "address" text,
  "role" text DEFAULT 'user'::text,
  "deleted_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.unsubscribe_tokens (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "email" text NOT NULL,
  "token" text NOT NULL,
  "scope" text DEFAULT 'all'::text NOT NULL,
  "expires_at" timestamp with time zone,
  "used_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "role" public.app_role NOT NULL
);

CREATE TABLE IF NOT EXISTS public.wishlist_items (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "product_id" uuid NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- ============ Constraints ============
ALTER TABLE abandoned_carts ADD CONSTRAINT abandoned_carts_pkey PRIMARY KEY (id);
ALTER TABLE analytics_events ADD CONSTRAINT analytics_events_pkey PRIMARY KEY (id);
ALTER TABLE attribution_sessions ADD CONSTRAINT attribution_sessions_visitor_id_key UNIQUE (visitor_id);
ALTER TABLE attribution_sessions ADD CONSTRAINT attribution_sessions_pkey PRIMARY KEY (id);
ALTER TABLE blog_categories ADD CONSTRAINT blog_categories_slug_key UNIQUE (slug);
ALTER TABLE blog_categories ADD CONSTRAINT blog_categories_pkey PRIMARY KEY (id);
ALTER TABLE blog_comments ADD CONSTRAINT blog_comments_pkey PRIMARY KEY (id);
ALTER TABLE blog_post_views ADD CONSTRAINT blog_post_views_post_id_visitor_id_key UNIQUE (post_id, visitor_id);
ALTER TABLE blog_post_views ADD CONSTRAINT blog_post_views_pkey PRIMARY KEY (id);
ALTER TABLE blog_posts ADD CONSTRAINT blog_posts_slug_key UNIQUE (slug);
ALTER TABLE blog_posts ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);
ALTER TABLE checkout_payment_settings ADD CONSTRAINT checkout_payment_settings_provider_unique UNIQUE (provider);
ALTER TABLE checkout_payment_settings ADD CONSTRAINT checkout_payment_settings_pkey PRIMARY KEY (id);
ALTER TABLE cod_district_rules ADD CONSTRAINT cod_district_rules_district_key UNIQUE (district);
ALTER TABLE cod_district_rules ADD CONSTRAINT cod_district_rules_pkey PRIMARY KEY (id);
ALTER TABLE collections ADD CONSTRAINT collections_slug_key UNIQUE (slug);
ALTER TABLE collections ADD CONSTRAINT collections_pkey PRIMARY KEY (id);
ALTER TABLE conversion_events ADD CONSTRAINT conversion_events_event_id_provider_key UNIQUE (event_id, provider);
ALTER TABLE conversion_events ADD CONSTRAINT conversion_events_pkey PRIMARY KEY (id);
ALTER TABLE coupons ADD CONSTRAINT coupons_code_key UNIQUE (code);
ALTER TABLE coupons ADD CONSTRAINT coupons_pkey PRIMARY KEY (id);
ALTER TABLE coupons ADD CONSTRAINT coupons_discount_type_check CHECK ((discount_type = ANY (ARRAY['fixed'::text, 'percentage'::text, 'free_shipping'::text])));
ALTER TABLE custom_pages ADD CONSTRAINT custom_pages_slug_key UNIQUE (slug);
ALTER TABLE custom_pages ADD CONSTRAINT custom_pages_pkey PRIMARY KEY (id);
ALTER TABLE delivery_zones ADD CONSTRAINT delivery_zones_pkey PRIMARY KEY (id);
ALTER TABLE email_logs ADD CONSTRAINT email_logs_pkey PRIMARY KEY (id);
ALTER TABLE email_templates ADD CONSTRAINT email_templates_template_key_key UNIQUE (template_key);
ALTER TABLE email_templates ADD CONSTRAINT email_templates_pkey PRIMARY KEY (id);
ALTER TABLE fraud_checks ADD CONSTRAINT fraud_checks_phone_key UNIQUE (phone);
ALTER TABLE fraud_checks ADD CONSTRAINT fraud_checks_pkey PRIMARY KEY (id);
ALTER TABLE header_categories ADD CONSTRAINT header_categories_slug_key UNIQUE (slug);
ALTER TABLE header_categories ADD CONSTRAINT header_categories_pkey PRIMARY KEY (id);
ALTER TABLE homepage_sections ADD CONSTRAINT homepage_sections_section_key_key UNIQUE (section_key);
ALTER TABLE homepage_sections ADD CONSTRAINT homepage_sections_pkey PRIMARY KEY (id);
ALTER TABLE landing_pages ADD CONSTRAINT landing_pages_slug_key UNIQUE (slug);
ALTER TABLE landing_pages ADD CONSTRAINT landing_pages_pkey PRIMARY KEY (id);
ALTER TABLE newsletter_subscribers ADD CONSTRAINT newsletter_subscribers_email_key UNIQUE (email);
ALTER TABLE newsletter_subscribers ADD CONSTRAINT newsletter_subscribers_pkey PRIMARY KEY (id);
ALTER TABLE orders ADD CONSTRAINT orders_order_token_key UNIQUE (order_token);
ALTER TABLE orders ADD CONSTRAINT orders_pkey PRIMARY KEY (id);
ALTER TABLE packaging_options ADD CONSTRAINT packaging_options_pkey PRIMARY KEY (id);
ALTER TABLE payment_audit_log ADD CONSTRAINT payment_audit_log_pkey PRIMARY KEY (id);
ALTER TABLE payment_gateways ADD CONSTRAINT payment_gateways_gateway_key UNIQUE (gateway);
ALTER TABLE payment_gateways ADD CONSTRAINT payment_gateways_pkey PRIMARY KEY (id);
ALTER TABLE payment_refunds ADD CONSTRAINT payment_refunds_pkey PRIMARY KEY (id);
ALTER TABLE payment_status_history ADD CONSTRAINT payment_status_history_pkey PRIMARY KEY (id);
ALTER TABLE payment_transactions ADD CONSTRAINT payment_transactions_pkey PRIMARY KEY (id);
ALTER TABLE product_images ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);
ALTER TABLE product_size_stock ADD CONSTRAINT product_size_stock_product_id_size_key UNIQUE (product_id, size);
ALTER TABLE product_size_stock ADD CONSTRAINT product_size_stock_pkey PRIMARY KEY (id);
ALTER TABLE products ADD CONSTRAINT products_pkey PRIMARY KEY (id);
ALTER TABLE profiles ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);
ALTER TABLE profiles ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);
ALTER TABLE reviews ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);
ALTER TABLE reviews ADD CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)));
ALTER TABLE seo_settings ADD CONSTRAINT seo_settings_key_key UNIQUE (key);
ALTER TABLE seo_settings ADD CONSTRAINT seo_settings_pkey PRIMARY KEY (id);
ALTER TABLE stock_logs ADD CONSTRAINT stock_logs_pkey PRIMARY KEY (id);
ALTER TABLE store_settings ADD CONSTRAINT store_settings_key_key UNIQUE (key);
ALTER TABLE store_settings ADD CONSTRAINT store_settings_pkey PRIMARY KEY (id);
ALTER TABLE subcategories ADD CONSTRAINT subcategories_pkey PRIMARY KEY (id);
ALTER TABLE tracking_codes ADD CONSTRAINT tracking_codes_pkey PRIMARY KEY (id);
ALTER TABLE tracking_codes_audit ADD CONSTRAINT tracking_codes_audit_pkey PRIMARY KEY (id);
ALTER TABLE tracking_settings ADD CONSTRAINT tracking_settings_key_key UNIQUE (key);
ALTER TABLE tracking_settings ADD CONSTRAINT tracking_settings_pkey PRIMARY KEY (id);
ALTER TABLE trash_users ADD CONSTRAINT trash_users_pkey PRIMARY KEY (id);
ALTER TABLE unsubscribe_tokens ADD CONSTRAINT unsubscribe_tokens_token_key UNIQUE (token);
ALTER TABLE unsubscribe_tokens ADD CONSTRAINT unsubscribe_tokens_pkey PRIMARY KEY (id);
ALTER TABLE user_roles ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);
ALTER TABLE user_roles ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);
ALTER TABLE wishlist_items ADD CONSTRAINT wishlist_items_user_id_product_id_key UNIQUE (user_id, product_id);
ALTER TABLE wishlist_items ADD CONSTRAINT wishlist_items_pkey PRIMARY KEY (id);

-- Foreign keys
ALTER TABLE blog_comments ADD CONSTRAINT blog_comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE;
ALTER TABLE blog_post_views ADD CONSTRAINT blog_post_views_post_id_fkey FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE;
ALTER TABLE header_categories ADD CONSTRAINT header_categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES header_categories(id) ON DELETE SET NULL;
ALTER TABLE orders ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE payment_refunds ADD CONSTRAINT payment_refunds_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL;
ALTER TABLE payment_refunds ADD CONSTRAINT payment_refunds_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES payment_transactions(id) ON DELETE SET NULL;
ALTER TABLE payment_transactions ADD CONSTRAINT payment_transactions_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL;
ALTER TABLE product_images ADD CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
ALTER TABLE product_size_stock ADD CONSTRAINT product_size_stock_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
ALTER TABLE profiles ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE reviews ADD CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
ALTER TABLE reviews ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE stock_logs ADD CONSTRAINT stock_logs_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL;
ALTER TABLE stock_logs ADD CONSTRAINT stock_logs_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
ALTER TABLE subcategories ADD CONSTRAINT subcategories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES header_categories(id) ON DELETE CASCADE;
ALTER TABLE tracking_codes ADD CONSTRAINT tracking_codes_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE tracking_codes ADD CONSTRAINT tracking_codes_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE user_roles ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE wishlist_items ADD CONSTRAINT wishlist_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
ALTER TABLE wishlist_items ADD CONSTRAINT wishlist_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- ============ Indexes ============
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_status ON public.abandoned_carts USING btree (status);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON public.analytics_events USING btree (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON public.analytics_events USING btree (event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON public.analytics_events USING btree (session_id);
CREATE INDEX IF NOT EXISTS idx_attribution_visitor ON public.attribution_sessions USING btree (visitor_id);
CREATE INDEX IF NOT EXISTS blog_comments_post_idx ON public.blog_comments USING btree (post_id, is_approved, created_at DESC);
CREATE INDEX IF NOT EXISTS blog_posts_published_idx ON public.blog_posts USING btree (is_published, sort_order DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_checkout_payment_settings_provider ON public.checkout_payment_settings USING btree (provider);
CREATE INDEX IF NOT EXISTS idx_conversion_created ON public.conversion_events USING btree (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversion_status ON public.conversion_events USING btree (status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created ON public.email_logs USING btree (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON public.email_logs USING btree (status);
CREATE INDEX IF NOT EXISTS header_categories_parent_id_idx ON public.header_categories USING btree (parent_id);
CREATE INDEX IF NOT EXISTS idx_payment_audit_log_created_at ON public.payment_audit_log USING btree (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_audit_log_entity ON public.payment_audit_log USING btree (entity_type, entity_id);
CREATE UNIQUE INDEX IF NOT EXISTS payment_gateways_slug_key ON public.payment_gateways USING btree (slug);
CREATE INDEX IF NOT EXISTS idx_payment_refunds_order ON public.payment_refunds USING btree (order_id);
CREATE INDEX IF NOT EXISTS idx_payment_status_history_order ON public.payment_status_history USING btree (order_id, created_at);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_created ON public.payment_transactions USING btree (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order ON public.payment_transactions USING btree (order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON public.payment_transactions USING btree (status);
CREATE UNIQUE INDEX IF NOT EXISTS payment_success_unique ON public.payment_transactions USING btree (order_id) WHERE ((status = 'success'::text) AND (is_advance = false));
CREATE UNIQUE INDEX IF NOT EXISTS uniq_order_success_payment ON public.payment_transactions USING btree (order_id) WHERE ((status = 'success'::text) AND (is_advance = false));
CREATE INDEX IF NOT EXISTS idx_product_images_product_color ON public.product_images USING btree (product_id, color);
CREATE INDEX IF NOT EXISTS idx_products_brand_trgm ON public.products USING gin (brand gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_category_trgm ON public.products USING gin (category gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products USING btree (is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_new_drop ON public.products USING btree (is_new_drop) WHERE (is_new_drop = true);
CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON public.products USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON public.products USING btree (subcategory);
CREATE INDEX IF NOT EXISTS idx_products_subcategory_trgm ON public.products USING gin (subcategory gin_trgm_ops);
CREATE UNIQUE INDEX IF NOT EXISTS products_slug_unique_idx ON public.products USING btree (slug) WHERE (slug IS NOT NULL);
CREATE INDEX IF NOT EXISTS idx_subcategories_parent ON public.subcategories USING btree (parent_category);
CREATE INDEX IF NOT EXISTS idx_subcategories_parent_active_order ON public.subcategories USING btree (parent_category, is_active, sort_order);
CREATE INDEX IF NOT EXISTS subcategories_parent_category_idx ON public.subcategories USING btree (parent_category);
CREATE INDEX IF NOT EXISTS subcategories_parent_id_idx ON public.subcategories USING btree (parent_id);
CREATE UNIQUE INDEX IF NOT EXISTS subcategories_slug_key ON public.subcategories USING btree (slug);
CREATE INDEX IF NOT EXISTS idx_unsubscribe_tokens_token ON public.unsubscribe_tokens USING btree (token);

-- ============ Functions ============
CREATE OR REPLACE FUNCTION public.can_upload_payment_proof(_name text)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE f text;
BEGIN
  f := (storage.foldername(_name))[1];
  IF f IS NULL OR f !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' THEN
    RETURN false;
  END IF;
  IF lower(coalesce(storage.extension(_name),'')) NOT IN ('jpg','jpeg','png','webp','gif','pdf') THEN
    RETURN false;
  END IF;
  RETURN EXISTS (SELECT 1 FROM public.orders WHERE id = f::uuid);
END;
$function$;

CREATE OR REPLACE FUNCTION public.can_upload_review_photo(_name text)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE f text;
BEGIN
  f := (storage.foldername(_name))[1];
  IF f IS NULL OR f !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' THEN
    RETURN false;
  END IF;
  IF lower(coalesce(storage.extension(_name),'')) NOT IN ('jpg','jpeg','png','webp','gif') THEN
    RETURN false;
  END IF;
  RETURN EXISTS (SELECT 1 FROM public.products WHERE id = f::uuid);
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_order(_order jsonb)
 RETURNS orders
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  inserted public.orders;
  v_item jsonb;
  v_items_in jsonb;
  v_items_out jsonb := '[]'::jsonb;
  v_product RECORD;
  v_qty int;
  v_subtotal int := 0;
  v_line_total int;
  v_delivery_method text;
  v_delivery_charge int := 0;
  v_zone RECORD;
  v_coupon_code text;
  v_coupon RECORD;
  v_coupon_id uuid := NULL;
  v_discount int := 0;
  v_is_free_shipping boolean := false;
  v_total int;
  v_payment_method text;
  v_attr jsonb;
BEGIN
  v_items_in := COALESCE(_order->'items', '[]'::jsonb);
  IF jsonb_typeof(v_items_in) <> 'array' OR jsonb_array_length(v_items_in) = 0 THEN
    RAISE EXCEPTION 'Order must contain at least one item';
  END IF;

  FOR v_item IN SELECT * FROM jsonb_array_elements(v_items_in)
  LOOP
    v_qty := COALESCE((v_item->>'quantity')::int, 0);
    IF v_qty <= 0 OR v_qty > 100 THEN
      RAISE EXCEPTION 'Invalid item quantity';
    END IF;

    SELECT id, name, price, is_active
      INTO v_product
      FROM public.products
     WHERE id = NULLIF(v_item->>'product_id','')::uuid;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product not found: %', v_item->>'product_id';
    END IF;

    IF v_product.is_active = false THEN
      RAISE EXCEPTION 'Product is not available: %', v_product.name;
    END IF;

    v_line_total := v_product.price * v_qty;
    v_subtotal := v_subtotal + v_line_total;

    v_items_out := v_items_out || jsonb_build_array(jsonb_build_object(
      'product_id', v_product.id,
      'name',       v_product.name,
      'quantity',   v_qty,
      'price',      v_product.price,
      'size',       COALESCE(v_item->>'size',''),
      'color',      COALESCE(v_item->>'color','')
    ));
  END LOOP;

  v_coupon_code := UPPER(TRIM(COALESCE(_order->>'coupon_code','')));
  IF v_coupon_code <> '' THEN
    SELECT * INTO v_coupon FROM public.coupons WHERE code = v_coupon_code AND is_active = true;
    IF NOT FOUND THEN RAISE EXCEPTION 'Invalid or inactive coupon'; END IF;
    v_coupon_id := v_coupon.id;
    IF v_coupon.max_uses IS NOT NULL AND v_coupon.used_count >= v_coupon.max_uses THEN
      RAISE EXCEPTION 'Coupon usage limit reached';
    END IF;
    IF v_subtotal < COALESCE(v_coupon.min_order_amount, 0) THEN
      RAISE EXCEPTION 'Minimum order ৳% required for this coupon', v_coupon.min_order_amount;
    END IF;
    IF v_coupon.discount_type = 'percentage' THEN
      v_discount := LEAST(v_subtotal, ROUND(v_subtotal * v_coupon.discount_value / 100.0)::int);
    ELSIF v_coupon.discount_type = 'fixed' THEN
      v_discount := LEAST(v_subtotal, GREATEST(0, v_coupon.discount_value));
    ELSIF v_coupon.discount_type = 'free_shipping' THEN
      v_is_free_shipping := true; v_discount := 0;
    ELSE v_discount := 0; END IF;
  END IF;

  v_delivery_method := COALESCE(_order->>'delivery_method', '');
  IF v_delivery_method = '' THEN RAISE EXCEPTION 'Delivery method is required'; END IF;

  SELECT fee INTO v_zone FROM public.delivery_zones WHERE name = v_delivery_method AND is_active = true LIMIT 1;

  IF FOUND THEN
    v_delivery_charge := v_zone.fee;
  ELSE
    v_delivery_charge := CASE v_delivery_method
      WHEN 'Inside Dhaka'        THEN 70
      WHEN 'Sub - Urban Dhaka'   THEN 90
      WHEN 'Outside Dhaka'       THEN 110
      WHEN 'standard'            THEN 70
      WHEN 'express'             THEN 110
      ELSE -1
    END;
    IF v_delivery_charge < 0 THEN RAISE EXCEPTION 'Unknown delivery method: %', v_delivery_method; END IF;
  END IF;

  IF v_is_free_shipping THEN v_delivery_charge := 0; END IF;

  v_total := GREATEST(0, v_subtotal + v_delivery_charge - v_discount);

  v_payment_method := COALESCE(_order->>'payment_method', 'cod');

  -- Attribution snapshot (server-side capture; trimmed + length-capped).
  v_attr := COALESCE(_order->'attribution', '{}'::jsonb);

  INSERT INTO public.orders (
    customer_name, customer_phone, customer_address, customer_city,
    customer_email, customer_note, items, total, delivery_method,
    payment_method, payment_sender_number, transaction_id,
    discount, delivery_charge, user_id, source, coupon_code,
    payment_gateway, payment_status,
    utm_source, utm_medium, utm_campaign, utm_term, utm_content,
    gclid, fbclid, ttclid, landing_page, referrer_url
  ) VALUES (
    _order->>'customer_name', _order->>'customer_phone', _order->>'customer_address', _order->>'customer_city',
    NULLIF(_order->>'customer_email', ''), NULLIF(_order->>'customer_note', ''),
    v_items_out, v_total, v_delivery_method,
    v_payment_method,
    NULLIF(_order->>'payment_sender_number', ''), NULLIF(_order->>'transaction_id', ''),
    v_discount, v_delivery_charge, NULLIF(_order->>'user_id','')::uuid, 'website', NULLIF(v_coupon_code, ''),
    CASE WHEN v_payment_method = 'cod' THEN 'cod' ELSE NULL END,
    CASE WHEN v_payment_method = 'cod' THEN 'pending' ELSE 'unpaid' END,
    LEFT(NULLIF(TRIM(COALESCE(v_attr->>'utm_source','')),   ''), 255),
    LEFT(NULLIF(TRIM(COALESCE(v_attr->>'utm_medium','')),   ''), 255),
    LEFT(NULLIF(TRIM(COALESCE(v_attr->>'utm_campaign','')), ''), 255),
    LEFT(NULLIF(TRIM(COALESCE(v_attr->>'utm_term','')),     ''), 255),
    LEFT(NULLIF(TRIM(COALESCE(v_attr->>'utm_content','')),  ''), 255),
    LEFT(NULLIF(TRIM(COALESCE(v_attr->>'gclid','')),        ''), 512),
    LEFT(NULLIF(TRIM(COALESCE(v_attr->>'fbclid','')),       ''), 512),
    LEFT(NULLIF(TRIM(COALESCE(v_attr->>'ttclid','')),       ''), 512),
    LEFT(NULLIF(TRIM(COALESCE(v_attr->>'landing_page','')), ''), 1024),
    LEFT(NULLIF(TRIM(COALESCE(v_attr->>'referrer_url','')), ''), 1024)
  ) RETURNING * INTO inserted;

  -- Record a pending COD transaction so cash-on-delivery orders are tracked.
  IF v_payment_method = 'cod' THEN
    INSERT INTO public.payment_transactions (
      order_id, gateway, amount, currency, status, is_advance, customer_phone
    ) VALUES (
      inserted.id, 'cod', v_total, 'BDT', 'pending', false, inserted.customer_phone
    );
  END IF;

  IF v_coupon_id IS NOT NULL THEN
    UPDATE public.coupons SET used_count = COALESCE(used_count, 0) + 1 WHERE id = v_coupon_id;
  END IF;

  RETURN inserted;
END;
$function$;

CREATE OR REPLACE FUNCTION public.finalize_cod_payment(_order_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_txn_id uuid;
BEGIN
  SELECT id INTO v_txn_id
  FROM public.payment_transactions
  WHERE order_id = _order_id
    AND gateway = 'cod'
    AND status = 'pending'
  ORDER BY created_at
  LIMIT 1;

  IF v_txn_id IS NULL THEN
    RETURN jsonb_build_object('ok', true, 'skipped', true);
  END IF;

  RETURN public.finalize_payment(v_txn_id, NULL);
END;
$function$;

CREATE OR REPLACE FUNCTION public.finalize_payment(_txn_id uuid, _gateway_ref text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_txn      public.payment_transactions;
  v_order    public.orders;
  v_existing uuid;
  v_paid     integer;
  v_status   text;
BEGIN
  -- Lock this transaction row to serialize concurrent callbacks/refreshes/tabs.
  SELECT * INTO v_txn FROM public.payment_transactions WHERE id = _txn_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'transaction not found');
  END IF;

  -- Already finalized -> idempotent no-op (handles duplicate IPN/webhook/double click).
  IF v_txn.status = 'success' THEN
    RETURN jsonb_build_object('ok', true, 'already', true, 'order_id', v_txn.order_id);
  END IF;

  -- Lock the order row to prevent concurrent paid_amount updates.
  IF v_txn.order_id IS NOT NULL THEN
    SELECT * INTO v_order FROM public.orders WHERE id = v_txn.order_id FOR UPDATE;
  END IF;

  -- For final (non-advance) payments, ensure no other success row already exists.
  IF v_txn.is_advance = false THEN
    SELECT id INTO v_existing
    FROM public.payment_transactions
    WHERE order_id = v_txn.order_id
      AND status = 'success'
      AND is_advance = false
      AND id <> _txn_id
    LIMIT 1;

    IF v_existing IS NOT NULL THEN
      -- Order is already paid; mark this duplicate and DO NOT increment paid_amount again.
      UPDATE public.payment_transactions
        SET status = 'cancelled',
            error_message = 'duplicate: order already paid',
            gateway_txn_id = COALESCE(_gateway_ref, gateway_txn_id)
      WHERE id = _txn_id;
      RETURN jsonb_build_object('ok', true, 'already', true, 'order_id', v_txn.order_id);
    END IF;
  END IF;

  -- Mark this transaction successful (guarded by uniq_order_success_payment index).
  UPDATE public.payment_transactions
    SET status = 'success',
        gateway_txn_id = COALESCE(_gateway_ref, gateway_txn_id)
  WHERE id = _txn_id;

  -- Increment paid_amount exactly once.
  IF v_order.id IS NOT NULL THEN
    v_paid := COALESCE(v_order.paid_amount, 0) + COALESCE(v_txn.amount, 0);
    v_status := CASE WHEN v_paid >= v_order.total THEN 'paid' ELSE 'partial' END;
    UPDATE public.orders
      SET paid_amount = v_paid,
          payment_status = v_status,
          payment_gateway = v_txn.gateway,
          gateway_txn_id = COALESCE(_gateway_ref, gateway_txn_id)
    WHERE id = v_order.id;
  END IF;

  RETURN jsonb_build_object('ok', true, 'already', false, 'order_id', v_txn.order_id,
                            'paid_amount', v_paid, 'payment_status', v_status);

EXCEPTION
  WHEN unique_violation THEN
    -- Lost the race for the success slot: treat as already paid, no double counting.
    UPDATE public.payment_transactions
      SET status = 'cancelled', error_message = 'duplicate: concurrent success'
    WHERE id = _txn_id AND status <> 'success';
    RETURN jsonb_build_object('ok', true, 'already', true, 'order_id', v_txn.order_id);
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_active_payment_methods()
 RETURNS TABLE(gateway text, slug text, display_name text, gateway_type text, icon text, mode text, instructions text, sort_order integer, manual_config jsonb, min_order_amount integer, max_order_amount integer, extra_charge integer, discount_type text, discount_value integer, config jsonb)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT
    gateway, slug, display_name, gateway_type, icon, mode, instructions, sort_order,
    -- manual_config holds the customer-facing send-money details (safe to expose)
    COALESCE(manual_config, '{}'::jsonb) AS manual_config,
    min_order_amount, max_order_amount, extra_charge, discount_type, discount_value,
    -- only expose non-sensitive automated-gateway config keys
    jsonb_build_object(
      'logo_color', config->'logo_color',
      'merchant_number', config->'merchant_number'
    ) AS config
  FROM public.payment_gateways
  WHERE is_active = true
  ORDER BY sort_order;
$function$;

CREATE OR REPLACE FUNCTION public.get_public_tracking_codes()
 RETURNS TABLE(id uuid, label text, location tracking_code_location, code text, sort_order integer)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT id, label, location, code, sort_order
  FROM public.tracking_codes
  WHERE enabled = true
  ORDER BY location, sort_order, created_at;
$function$;

CREATE OR REPLACE FUNCTION public.get_public_tracking_settings()
 RETURNS TABLE(key text, value text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT key, value FROM public.tracking_settings
  WHERE key IN (
    'gtm_container_id',
    'gtm_enabled',
    'ga4_measurement_id',
    'meta_pixel_id',
    'tiktok_pixel_id',
    'environment',
    'consent_default_analytics',
    'consent_default_ad',
    'consent_default_ad_user_data',
    'consent_default_ad_personalization',
    'consent_region_defaults',
    'server_side_meta_enabled',
    'server_side_tiktok_enabled',
    'server_side_ga4_enabled',
    -- Site verification meta tags (non-sensitive)
    'fb_domain_verification',
    'google_site_verification',
    'bing_verification',
    'pinterest_verification',
    'yandex_verification',
    -- Custom code injection (admin-managed)
    'custom_head_scripts',
    'custom_head_enabled',
    'custom_body_scripts',
    'custom_body_enabled',
    'custom_footer_scripts',
    'custom_footer_enabled'
  );
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$function$;

CREATE OR REPLACE FUNCTION public.increment_review_helpful(_review_id uuid)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE new_count integer;
BEGIN
  UPDATE public.reviews SET helpful_count = helpful_count + 1
  WHERE id = _review_id RETURNING helpful_count INTO new_count;
  RETURN COALESCE(new_count, 0);
END; $function$;

CREATE OR REPLACE FUNCTION public.log_payment_audit(_action text, _entity_type text, _entity_id uuid DEFAULT NULL::uuid, _entity_label text DEFAULT NULL::text, _old_value jsonb DEFAULT NULL::jsonb, _new_value jsonb DEFAULT NULL::jsonb, _ip_address text DEFAULT NULL::text, _user_agent text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_id uuid;
  v_email text;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can write to the payment audit log';
  END IF;

  SELECT email INTO v_email FROM auth.users WHERE id = auth.uid();

  INSERT INTO public.payment_audit_log (
    action, entity_type, entity_id, entity_label,
    actor_id, actor_email, ip_address, user_agent, old_value, new_value
  ) VALUES (
    _action, _entity_type, _entity_id, _entity_label,
    auth.uid(), v_email,
    LEFT(NULLIF(TRIM(COALESCE(_ip_address,'')),''), 64),
    LEFT(NULLIF(TRIM(COALESCE(_user_agent,'')),''), 512),
    _old_value, _new_value
  ) RETURNING id INTO v_id;

  RETURN v_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_payment_transaction_status(_txn_id uuid, _new_status text, _reason text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_txn    public.payment_transactions;
  v_order  public.orders;
  v_old    text;
  v_paid   integer := 0;
  v_status text;
  v_latest text;
  v_email  text;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can change payment status';
  END IF;

  IF _new_status NOT IN ('success','failed','submitted','pending','cancelled') THEN
    RAISE EXCEPTION 'Invalid payment status: %', _new_status;
  END IF;

  SELECT * INTO v_txn FROM public.payment_transactions WHERE id = _txn_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Transaction not found'; END IF;
  v_old := v_txn.status;

  SELECT email INTO v_email FROM auth.users WHERE id = auth.uid();

  UPDATE public.payment_transactions
     SET status = _new_status,
         verified_by = auth.uid(),
         verified_at = now(),
         admin_note = COALESCE(_reason, admin_note),
         error_message = CASE WHEN _new_status = 'failed'
                              THEN COALESCE(_reason, 'rejected by admin')
                              ELSE error_message END
   WHERE id = _txn_id;

  INSERT INTO public.payment_status_history (
    order_id, transaction_id, old_status, new_status, reason, changed_by, changed_by_email
  ) VALUES (
    v_txn.order_id, _txn_id, v_old, _new_status, _reason, auth.uid(), v_email
  );

  IF v_txn.order_id IS NOT NULL THEN
    SELECT * INTO v_order FROM public.orders WHERE id = v_txn.order_id FOR UPDATE;

    SELECT COALESCE(SUM(amount), 0) INTO v_paid
      FROM public.payment_transactions
     WHERE order_id = v_txn.order_id AND status = 'success';

    SELECT status INTO v_latest
      FROM public.payment_transactions
     WHERE order_id = v_txn.order_id
     ORDER BY created_at DESC LIMIT 1;

    IF v_paid >= v_order.total AND v_order.total > 0 THEN v_status := 'paid';
    ELSIF v_paid > 0 THEN v_status := 'partial';
    ELSIF v_latest = 'submitted' THEN v_status := 'submitted';
    ELSIF v_latest = 'failed' THEN v_status := 'unpaid';
    ELSIF v_latest = 'cancelled' THEN v_status := 'cancelled';
    ELSE v_status := 'pending';
    END IF;

    UPDATE public.orders
       SET paid_amount = v_paid,
           payment_status = v_status,
           payment_gateway = COALESCE(v_txn.gateway, payment_gateway)
     WHERE id = v_order.id;
  END IF;

  RETURN jsonb_build_object('ok', true, 'order_id', v_txn.order_id,
                            'old', v_old, 'new', _new_status,
                            'paid_amount', v_paid, 'payment_status', v_status);
END;
$function$;

CREATE OR REPLACE FUNCTION public.slugify(_text text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO 'public'
AS $function$
  SELECT trim(both '-' from regexp_replace(
    regexp_replace(lower(coalesce(_text,'')), '[^a-z0-9]+', '-', 'g'),
    '-+', '-', 'g'
  ));
$function$;

CREATE OR REPLACE FUNCTION public.submit_manual_payment(_order_id uuid, _gateway text, _sender_number text DEFAULT NULL::text, _transaction_id text DEFAULT NULL::text, _proof_url text DEFAULT NULL::text, _is_advance boolean DEFAULT false)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_order public.orders;
  v_gw    public.payment_gateways;
  v_cfg   jsonb;
  v_amount integer;
  v_txn_id uuid;
BEGIN
  SELECT * INTO v_order FROM public.orders WHERE id = _order_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found';
  END IF;

  SELECT * INTO v_gw FROM public.payment_gateways
   WHERE gateway = _gateway AND is_active = true AND gateway_type = 'manual';
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Selected payment method is not available';
  END IF;

  v_cfg := COALESCE(v_gw.manual_config, '{}'::jsonb);

  IF COALESCE((v_cfg->>'require_txn_id')::boolean, false)
     AND COALESCE(NULLIF(TRIM(_transaction_id), ''), '') = '' THEN
    RAISE EXCEPTION 'Transaction ID is required for this payment method';
  END IF;

  IF COALESCE((v_cfg->>'require_screenshot')::boolean, false)
     AND COALESCE(NULLIF(TRIM(_proof_url), ''), '') = '' THEN
    RAISE EXCEPTION 'Payment screenshot is required for this payment method';
  END IF;

  v_amount := CASE WHEN _is_advance THEN GREATEST(0, v_order.total - COALESCE(v_order.paid_amount, 0))
                   ELSE GREATEST(0, v_order.total - COALESCE(v_order.paid_amount, 0)) END;
  IF v_amount = 0 THEN v_amount := v_order.total; END IF;

  INSERT INTO public.payment_transactions (
    order_id, gateway, amount, currency, status, is_advance,
    sender_number, gateway_txn_id, customer_phone, proof_url
  ) VALUES (
    _order_id, _gateway, v_amount, 'BDT', 'submitted', _is_advance,
    LEFT(NULLIF(TRIM(COALESCE(_sender_number, '')), ''), 20),
    LEFT(NULLIF(TRIM(COALESCE(_transaction_id, '')), ''), 50),
    v_order.customer_phone,
    LEFT(NULLIF(TRIM(COALESCE(_proof_url, '')), ''), 1024)
  ) RETURNING id INTO v_txn_id;

  UPDATE public.orders
     SET payment_status = 'submitted',
         payment_gateway = _gateway,
         payment_method = _gateway,
         transaction_id = COALESCE(LEFT(NULLIF(TRIM(COALESCE(_transaction_id,'')),''),50), transaction_id),
         payment_sender_number = COALESCE(LEFT(NULLIF(TRIM(COALESCE(_sender_number,'')),''),20), payment_sender_number)
   WHERE id = _order_id;

  RETURN jsonb_build_object('ok', true, 'transaction_id', v_txn_id, 'order_id', _order_id);
END;
$function$;

CREATE OR REPLACE FUNCTION public.track_blog_view(_post_id uuid, _visitor_id text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.blog_posts SET views = COALESCE(views, 0) + 1 WHERE id = _post_id;
  INSERT INTO public.blog_post_views (post_id, visitor_id)
  VALUES (_post_id, _visitor_id)
  ON CONFLICT (post_id, visitor_id) DO NOTHING;
END;
$function$;

CREATE OR REPLACE FUNCTION public.tracking_codes_audit_log()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.tracking_codes_audit (code_id, action, label, location, changed_by, snapshot)
    VALUES (OLD.id, 'deleted', OLD.label, OLD.location, auth.uid(), to_jsonb(OLD));
    RETURN OLD;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.tracking_codes_audit (code_id, action, label, location, changed_by, snapshot)
    VALUES (NEW.id, 'created', NEW.label, NEW.location, auth.uid(), to_jsonb(NEW));
    RETURN NEW;
  ELSE
    INSERT INTO public.tracking_codes_audit (code_id, action, label, location, changed_by, snapshot)
    VALUES (NEW.id, 'updated', NEW.label, NEW.location, auth.uid(), to_jsonb(NEW));
    RETURN NEW;
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.tracking_codes_set_updated()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  NEW.updated_by = auth.uid();
  IF TG_OP = 'INSERT' AND NEW.created_by IS NULL THEN
    NEW.created_by = auth.uid();
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.validate_coupon(_code text)
 RETURNS TABLE(id uuid, code text, discount_type text, discount_value integer, min_order_amount integer, max_uses integer, used_count integer)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT id, code, discount_type, discount_value, min_order_amount, max_uses, used_count
  FROM public.coupons
  WHERE code = upper(btrim(_code)) AND is_active = true
  LIMIT 1;
$function$;


-- ============ Triggers ============
CREATE TRIGGER trg_abandoned_carts_updated BEFORE UPDATE ON public.abandoned_carts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_cod_district_rules_updated BEFORE UPDATE ON public.cod_district_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_email_logs_updated BEFORE UPDATE ON public.email_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_email_templates_updated BEFORE UPDATE ON public.email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_payment_gateways_updated BEFORE UPDATE ON public.payment_gateways FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_payment_refunds_updated BEFORE UPDATE ON public.payment_refunds FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_payment_transactions_updated BEFORE UPDATE ON public.payment_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_tracking_codes_audit AFTER INSERT OR DELETE OR UPDATE ON public.tracking_codes FOR EACH ROW EXECUTE FUNCTION tracking_codes_audit_log();
CREATE TRIGGER trg_tracking_codes_set_updated BEFORE INSERT OR UPDATE ON public.tracking_codes FOR EACH ROW EXECUTE FUNCTION tracking_codes_set_updated();
CREATE TRIGGER update_attribution_sessions_updated_at BEFORE UPDATE ON public.attribution_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_categories_updated_at BEFORE UPDATE ON public.blog_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_comments_updated_at BEFORE UPDATE ON public.blog_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_checkout_payment_settings_updated_at BEFORE UPDATE ON public.checkout_payment_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON public.collections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversion_events_updated_at BEFORE UPDATE ON public.conversion_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON public.coupons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_custom_pages_updated_at BEFORE UPDATE ON public.custom_pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_header_categories_updated_at BEFORE UPDATE ON public.header_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_homepage_sections_updated_at BEFORE UPDATE ON public.homepage_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_landing_pages_updated_at BEFORE UPDATE ON public.landing_pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_packaging_options_updated_at BEFORE UPDATE ON public.packaging_options FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_size_stock_updated_at BEFORE UPDATE ON public.product_size_stock FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seo_settings_updated_at BEFORE UPDATE ON public.seo_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subcategories_updated_at BEFORE UPDATE ON public.subcategories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============ Row Level Security ============
ALTER TABLE public.abandoned_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attribution_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkout_payment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cod_district_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversion_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.header_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packaging_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_gateways ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_size_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_codes_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trash_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unsubscribe_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

-- ============ Policies ============
CREATE POLICY "Admins view abandoned carts" ON public.abandoned_carts FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can read analytics_events" ON public.analytics_events FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can read attribution_sessions" ON public.attribution_sessions FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete blog categories" ON public.blog_categories FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert blog categories" ON public.blog_categories FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update blog categories" ON public.blog_categories FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Public can view blog categories" ON public.blog_categories FOR SELECT TO public USING (true);
CREATE POLICY "Admins can delete comments" ON public.blog_comments FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update comments" ON public.blog_comments FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can view all comments" ON public.blog_comments FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can submit a comment" ON public.blog_comments FOR INSERT TO public WITH CHECK ((((char_length(TRIM(BOTH FROM guest_name)) >= 1) AND (char_length(TRIM(BOTH FROM guest_name)) <= 80)) AND ((char_length(TRIM(BOTH FROM guest_email)) >= 3) AND (char_length(TRIM(BOTH FROM guest_email)) <= 160)) AND ((char_length(TRIM(BOTH FROM content)) >= 1) AND (char_length(TRIM(BOTH FROM content)) <= 2000)) AND (is_approved = false)));
CREATE POLICY "Public can view approved comments" ON public.blog_comments FOR SELECT TO anon, authenticated USING ((is_approved = true));
CREATE POLICY "Admins can read blog views" ON public.blog_post_views FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete blog posts" ON public.blog_posts FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert blog posts" ON public.blog_posts FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update blog posts" ON public.blog_posts FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can view all blog posts" ON public.blog_posts FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Public can view published blog posts" ON public.blog_posts FOR SELECT TO public USING ((is_published = true));
CREATE POLICY "Admins can delete checkout payment settings" ON public.checkout_payment_settings FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert checkout payment settings" ON public.checkout_payment_settings FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update checkout payment settings" ON public.checkout_payment_settings FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Checkout payment settings are viewable by everyone" ON public.checkout_payment_settings FOR SELECT TO public USING (true);
CREATE POLICY "Admins manage cod rules" ON public.cod_district_rules FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can view cod rules" ON public.cod_district_rules FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage collections" ON public.collections FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Collections viewable by everyone" ON public.collections FOR SELECT TO public USING (true);
CREATE POLICY "Admins can read conversion_events" ON public.conversion_events FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete coupons" ON public.coupons FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert coupons" ON public.coupons FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update coupons" ON public.coupons FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can view all coupons" ON public.coupons FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete custom pages" ON public.custom_pages FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert custom pages" ON public.custom_pages FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update custom pages" ON public.custom_pages FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Custom pages viewable by everyone" ON public.custom_pages FOR SELECT TO public USING (true);
CREATE POLICY "Admins can delete delivery zones" ON public.delivery_zones FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert delivery zones" ON public.delivery_zones FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update delivery zones" ON public.delivery_zones FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Delivery zones are viewable by everyone" ON public.delivery_zones FOR SELECT TO public USING (true);
CREATE POLICY "Admins view email logs" ON public.email_logs FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage email templates" ON public.email_templates FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert fraud checks" ON public.fraud_checks FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update fraud checks" ON public.fraud_checks FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can view fraud checks" ON public.fraud_checks FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete header categories" ON public.header_categories FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert header categories" ON public.header_categories FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update header categories" ON public.header_categories FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Header categories are viewable by everyone" ON public.header_categories FOR SELECT TO public USING (true);
CREATE POLICY "Admins can delete homepage sections" ON public.homepage_sections FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert homepage sections" ON public.homepage_sections FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update homepage sections" ON public.homepage_sections FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can view homepage sections" ON public.homepage_sections FOR SELECT TO public USING (true);
CREATE POLICY "Admins can delete landing pages" ON public.landing_pages FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert landing pages" ON public.landing_pages FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update landing pages" ON public.landing_pages FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can view all landing pages" ON public.landing_pages FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Published landing pages viewable by everyone" ON public.landing_pages FOR SELECT TO public USING ((status = 'published'::text));
CREATE POLICY "Admins can delete newsletter subscribers" ON public.newsletter_subscribers FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can view newsletter subscribers" ON public.newsletter_subscribers FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK ((((char_length(btrim(email)) >= 3) AND (char_length(btrim(email)) <= 254)) AND (POSITION(('@'::text) IN (email)) > 1)));
CREATE POLICY "Admins can delete orders" ON public.orders FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT TO authenticated USING ((auth.uid() = user_id));
CREATE POLICY "Admins manage packaging options" ON public.packaging_options FOR ALL TO public USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Packaging options viewable by everyone" ON public.packaging_options FOR SELECT TO public USING (true);
CREATE POLICY "Admins can insert payment audit log" ON public.payment_audit_log FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can read payment audit log" ON public.payment_audit_log FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage payment gateways" ON public.payment_gateways FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage refunds" ON public.payment_refunds FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert payment status history" ON public.payment_status_history FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can view payment status history" ON public.payment_status_history FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage payment transactions" ON public.payment_transactions FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete product images" ON public.product_images FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert product images" ON public.product_images FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update product images" ON public.product_images FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Product images are viewable by everyone" ON public.product_images FOR SELECT TO public USING (true);
CREATE POLICY "Admins can delete stock" ON public.product_size_stock FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert stock" ON public.product_size_stock FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update stock" ON public.product_size_stock FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Stock viewable by everyone" ON public.product_size_stock FOR SELECT TO public USING (true);
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT TO public USING (true);
CREATE POLICY "Admins can delete profiles" ON public.profiles FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING ((auth.uid() = user_id));
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING ((auth.uid() = user_id));
CREATE POLICY "Admins can delete reviews" ON public.reviews FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can view all reviews" ON public.reviews FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can create reviews" ON public.reviews FOR INSERT TO anon, authenticated WITH CHECK (((rating >= 1) AND (rating <= 5) AND ((char_length(btrim(name)) >= 1) AND (char_length(btrim(name)) <= 100)) AND ((char_length(btrim(comment)) >= 1) AND (char_length(btrim(comment)) <= 5000)) AND ((email IS NULL) OR (char_length(btrim(email)) <= 254)) AND (verified = false)));
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage seo_settings" ON public.seo_settings FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "SEO settings viewable by everyone" ON public.seo_settings FOR SELECT TO public USING (true);
CREATE POLICY "Admins can insert stock logs" ON public.stock_logs FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can view stock logs" ON public.stock_logs FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete store settings" ON public.store_settings FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert store settings" ON public.store_settings FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update store settings" ON public.store_settings FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Store settings viewable by everyone" ON public.store_settings FOR SELECT TO public USING (true);
CREATE POLICY "Admins can delete subcategories" ON public.subcategories FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert subcategories" ON public.subcategories FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update subcategories" ON public.subcategories FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Subcategories viewable by everyone" ON public.subcategories FOR SELECT TO public USING (true);
CREATE POLICY "Admins manage tracking codes" ON public.tracking_codes FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins read tracking codes audit" ON public.tracking_codes_audit FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage tracking_settings" ON public.tracking_settings FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can read tracking_settings" ON public.tracking_settings FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage trash_users" ON public.trash_users FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins view unsubscribe tokens" ON public.unsubscribe_tokens FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete user roles" ON public.user_roles FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert user roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update user roles" ON public.user_roles FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT TO authenticated USING ((auth.uid() = user_id));
CREATE POLICY "Admins can view all wishlist items" ON public.wishlist_items FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can add to wishlist" ON public.wishlist_items FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Users can remove from wishlist" ON public.wishlist_items FOR DELETE TO authenticated USING ((auth.uid() = user_id));
CREATE POLICY "Users can view own wishlist" ON public.wishlist_items FOR SELECT TO authenticated USING ((auth.uid() = user_id));

-- ============ Grants ============
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.abandoned_carts TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.abandoned_carts TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.abandoned_carts TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.analytics_events TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.analytics_events TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.analytics_events TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.attribution_sessions TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.attribution_sessions TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.attribution_sessions TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.blog_categories TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.blog_categories TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.blog_categories TO service_role;
GRANT DELETE, INSERT, REFERENCES, TRIGGER, TRUNCATE, UPDATE ON public.blog_comments TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.blog_comments TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.blog_comments TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.blog_post_views TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.blog_post_views TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.blog_post_views TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.blog_posts TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.blog_posts TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.blog_posts TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.checkout_payment_settings TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.checkout_payment_settings TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.checkout_payment_settings TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.cod_district_rules TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.cod_district_rules TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.cod_district_rules TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.collections TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.collections TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.collections TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.conversion_events TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.conversion_events TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.conversion_events TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.coupons TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.coupons TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.coupons TO service_role;
GRANT REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.custom_pages TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.custom_pages TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.custom_pages TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.delivery_zones TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.delivery_zones TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.delivery_zones TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.email_logs TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.email_logs TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.email_logs TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.email_templates TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.email_templates TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.email_templates TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.fraud_checks TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.fraud_checks TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.fraud_checks TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.header_categories TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.header_categories TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.header_categories TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.homepage_sections TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.homepage_sections TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.homepage_sections TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.landing_pages TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.landing_pages TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.landing_pages TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.newsletter_subscribers TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.newsletter_subscribers TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.newsletter_subscribers TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.orders TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.orders TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.orders TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.packaging_options TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.packaging_options TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.packaging_options TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.payment_audit_log TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.payment_audit_log TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.payment_audit_log TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.payment_gateways TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.payment_gateways TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.payment_gateways TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.payment_refunds TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.payment_refunds TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.payment_refunds TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.payment_status_history TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.payment_status_history TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.payment_status_history TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.payment_transactions TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.payment_transactions TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.payment_transactions TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.product_images TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.product_images TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.product_images TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.product_size_stock TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.product_size_stock TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.product_size_stock TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.products TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.products TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.products TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.profiles TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.profiles TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.profiles TO service_role;
GRANT DELETE, INSERT, REFERENCES, TRIGGER, TRUNCATE, UPDATE ON public.reviews TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.reviews TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.reviews TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.seo_settings TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.seo_settings TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.seo_settings TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.stock_logs TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.stock_logs TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.stock_logs TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.store_settings TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.store_settings TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.store_settings TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.subcategories TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.subcategories TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.subcategories TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.tracking_codes TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.tracking_codes TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.tracking_codes TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.tracking_codes_audit TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.tracking_codes_audit TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.tracking_codes_audit TO service_role;
GRANT DELETE, INSERT, REFERENCES, TRIGGER, TRUNCATE, UPDATE ON public.tracking_settings TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.tracking_settings TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.tracking_settings TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.trash_users TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.trash_users TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.trash_users TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.unsubscribe_tokens TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.unsubscribe_tokens TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.unsubscribe_tokens TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.user_roles TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.user_roles TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.user_roles TO service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.wishlist_items TO anon;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.wishlist_items TO authenticated;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.wishlist_items TO service_role;

-- ============ Storage buckets ============
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-proofs', 'payment-proofs', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('review-photos', 'review-photos', true) ON CONFLICT (id) DO NOTHING;

-- Storage object policies (recreate as needed for your buckets)
CREATE POLICY "Admins can delete payment proofs" ON storage.objects FOR DELETE TO authenticated USING (((bucket_id = 'payment-proofs'::text) AND has_role(auth.uid(), 'admin'::app_role)));
CREATE POLICY "Admins can delete product images" ON storage.objects FOR DELETE TO authenticated USING (((bucket_id = 'product-images'::text) AND has_role(auth.uid(), 'admin'::app_role)));
CREATE POLICY "Admins can read payment proofs" ON storage.objects FOR SELECT TO authenticated USING (((bucket_id = 'payment-proofs'::text) AND has_role(auth.uid(), 'admin'::app_role)));
CREATE POLICY "Admins can update product images" ON storage.objects FOR UPDATE TO authenticated USING (((bucket_id = 'product-images'::text) AND has_role(auth.uid(), 'admin'::app_role)));
CREATE POLICY "Admins can upload product images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (((bucket_id = 'product-images'::text) AND has_role(auth.uid(), 'admin'::app_role)));
CREATE POLICY "Admins can view payment proofs" ON storage.objects FOR SELECT TO authenticated USING (((bucket_id = 'payment-proofs'::text) AND has_role(auth.uid(), 'admin'::app_role)));
CREATE POLICY "Anyone can upload review photos for real products" ON storage.objects FOR INSERT TO authenticated, anon WITH CHECK (((bucket_id = 'review-photos'::text) AND can_upload_review_photo(name)));
CREATE POLICY "Customers can upload payment proofs for real orders" ON storage.objects FOR INSERT TO authenticated, anon WITH CHECK (((bucket_id = 'payment-proofs'::text) AND can_upload_payment_proof(name)));


-- ============ Auth trigger (auto-create profile on signup) ============
-- This trigger lives on auth.users (managed by Supabase Auth).
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ After running this file ============
-- 1) Create your admin account from Supabase Auth (Authentication > Users, or sign up in the app).
-- 2) Grant it the admin role (replace the email):
--    INSERT INTO public.user_roles (user_id, role)
--    SELECT id, 'admin'::public.app_role FROM auth.users WHERE email = 'you@example.com'
--    ON CONFLICT (user_id, role) DO NOTHING;
-- 3) Set the frontend env vars to your project: VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, VITE_SUPABASE_PROJECT_ID.
-- 4) Redeploy your edge functions and re-add their secrets (payment gateways, courier, email, etc.).
