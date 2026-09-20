export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      abandoned_carts: {
        Row: {
          created_at: string
          customer_name: string | null
          email: string | null
          id: string
          items: Json
          last_reminder_at: string | null
          recovered_at: string | null
          reminders_sent: number
          session_id: string | null
          status: string
          total: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          customer_name?: string | null
          email?: string | null
          id?: string
          items?: Json
          last_reminder_at?: string | null
          recovered_at?: string | null
          reminders_sent?: number
          session_id?: string | null
          status?: string
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          customer_name?: string | null
          email?: string | null
          id?: string
          items?: Json
          last_reminder_at?: string | null
          recovered_at?: string | null
          reminders_sent?: number
          session_id?: string | null
          status?: string
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string
          currency: string | null
          environment: string
          event_id: string | null
          event_name: string
          id: string
          order_id: string | null
          params: Json
          session_id: string | null
          user_id: string | null
          value: number | null
          visitor_id: string | null
        }
        Insert: {
          created_at?: string
          currency?: string | null
          environment?: string
          event_id?: string | null
          event_name: string
          id?: string
          order_id?: string | null
          params?: Json
          session_id?: string | null
          user_id?: string | null
          value?: number | null
          visitor_id?: string | null
        }
        Update: {
          created_at?: string
          currency?: string | null
          environment?: string
          event_id?: string | null
          event_name?: string
          id?: string
          order_id?: string | null
          params?: Json
          session_id?: string | null
          user_id?: string | null
          value?: number | null
          visitor_id?: string | null
        }
        Relationships: []
      }
      attribution_sessions: {
        Row: {
          created_at: string
          first_touch: Json
          id: string
          landing_page: string | null
          last_touch: Json
          referrer: string | null
          session_id: string | null
          updated_at: string
          visitor_id: string
        }
        Insert: {
          created_at?: string
          first_touch?: Json
          id?: string
          landing_page?: string | null
          last_touch?: Json
          referrer?: string | null
          session_id?: string | null
          updated_at?: string
          visitor_id: string
        }
        Update: {
          created_at?: string
          first_touch?: Json
          id?: string
          landing_page?: string | null
          last_touch?: Json
          referrer?: string | null
          session_id?: string | null
          updated_at?: string
          visitor_id?: string
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      blog_comments: {
        Row: {
          content: string
          created_at: string
          guest_email: string
          guest_name: string
          id: string
          is_approved: boolean
          post_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          guest_email: string
          guest_name: string
          id?: string
          is_approved?: boolean
          post_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          guest_email?: string
          guest_name?: string
          id?: string
          is_approved?: boolean
          post_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_post_views: {
        Row: {
          created_at: string
          id: string
          post_id: string
          visitor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          visitor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_views_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author: string
          author_avatar: string
          author_bio: string
          author_social: Json
          category: string
          content: string
          cover_alt: string
          cover_image: string
          created_at: string
          excerpt: string
          id: string
          is_featured: boolean
          is_published: boolean
          noindex: boolean
          scheduled_at: string | null
          seo_description: string
          seo_title: string
          slug: string
          sort_order: number
          status: string
          tags: string[]
          title: string
          updated_at: string
          views: number
        }
        Insert: {
          author?: string
          author_avatar?: string
          author_bio?: string
          author_social?: Json
          category?: string
          content?: string
          cover_alt?: string
          cover_image?: string
          created_at?: string
          excerpt?: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          noindex?: boolean
          scheduled_at?: string | null
          seo_description?: string
          seo_title?: string
          slug: string
          sort_order?: number
          status?: string
          tags?: string[]
          title: string
          updated_at?: string
          views?: number
        }
        Update: {
          author?: string
          author_avatar?: string
          author_bio?: string
          author_social?: Json
          category?: string
          content?: string
          cover_alt?: string
          cover_image?: string
          created_at?: string
          excerpt?: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          noindex?: boolean
          scheduled_at?: string | null
          seo_description?: string
          seo_title?: string
          slug?: string
          sort_order?: number
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string
          views?: number
        }
        Relationships: []
      }
      checkout_payment_settings: {
        Row: {
          created_at: string
          id: string
          instructions: string
          is_active: boolean
          number: string
          provider: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          instructions?: string
          is_active?: boolean
          number?: string
          provider: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          instructions?: string
          is_active?: boolean
          number?: string
          provider?: string
          updated_at?: string
        }
        Relationships: []
      }
      cod_district_rules: {
        Row: {
          advance_amount: number
          advance_required: boolean
          cod_allowed: boolean
          created_at: string
          district: string
          id: string
          note: string | null
          updated_at: string
        }
        Insert: {
          advance_amount?: number
          advance_required?: boolean
          cod_allowed?: boolean
          created_at?: string
          district: string
          id?: string
          note?: string | null
          updated_at?: string
        }
        Update: {
          advance_amount?: number
          advance_required?: boolean
          cod_allowed?: boolean
          created_at?: string
          district?: string
          id?: string
          note?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      collections: {
        Row: {
          created_at: string
          description: string
          filter_categories: string[]
          filter_featured: boolean | null
          filter_new_drop: boolean | null
          filter_product_ids: string[]
          filter_subcategories: string[]
          heading: string
          hero_image: string
          id: string
          is_active: boolean
          noindex: boolean
          og_image: string
          seo_description: string
          seo_title: string
          show_in_nav: boolean
          slug: string
          sort_order: number
          subheading: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          filter_categories?: string[]
          filter_featured?: boolean | null
          filter_new_drop?: boolean | null
          filter_product_ids?: string[]
          filter_subcategories?: string[]
          heading?: string
          hero_image?: string
          id?: string
          is_active?: boolean
          noindex?: boolean
          og_image?: string
          seo_description?: string
          seo_title?: string
          show_in_nav?: boolean
          slug: string
          sort_order?: number
          subheading?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          filter_categories?: string[]
          filter_featured?: boolean | null
          filter_new_drop?: boolean | null
          filter_product_ids?: string[]
          filter_subcategories?: string[]
          heading?: string
          hero_image?: string
          id?: string
          is_active?: boolean
          noindex?: boolean
          og_image?: string
          seo_description?: string
          seo_title?: string
          show_in_nav?: boolean
          slug?: string
          sort_order?: number
          subheading?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      conversion_events: {
        Row: {
          attempts: number
          created_at: string
          currency: string | null
          environment: string
          event_id: string
          event_name: string
          id: string
          last_error: string | null
          order_id: string | null
          payload: Json
          provider: string
          sent_at: string | null
          status: string
          updated_at: string
          value: number | null
        }
        Insert: {
          attempts?: number
          created_at?: string
          currency?: string | null
          environment?: string
          event_id: string
          event_name: string
          id?: string
          last_error?: string | null
          order_id?: string | null
          payload?: Json
          provider: string
          sent_at?: string | null
          status?: string
          updated_at?: string
          value?: number | null
        }
        Update: {
          attempts?: number
          created_at?: string
          currency?: string | null
          environment?: string
          event_id?: string
          event_name?: string
          id?: string
          last_error?: string | null
          order_id?: string | null
          payload?: Json
          provider?: string
          sent_at?: string | null
          status?: string
          updated_at?: string
          value?: number | null
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean
          max_uses: number | null
          min_order_amount: number
          name: string
          updated_at: string
          used_count: number
        }
        Insert: {
          code: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean
          max_uses?: number | null
          min_order_amount?: number
          name?: string
          updated_at?: string
          used_count?: number
        }
        Update: {
          code?: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean
          max_uses?: number | null
          min_order_amount?: number
          name?: string
          updated_at?: string
          used_count?: number
        }
        Relationships: []
      }
      custom_pages: {
        Row: {
          banner_url: string
          blocks: Json
          canonical_url: string | null
          created_at: string
          id: string
          is_active: boolean
          meta_keywords: string | null
          noindex: boolean
          og_image: string | null
          product_ids: string[]
          seo_description: string | null
          seo_title: string | null
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          banner_url?: string
          blocks?: Json
          canonical_url?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          meta_keywords?: string | null
          noindex?: boolean
          og_image?: string | null
          product_ids?: string[]
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Update: {
          banner_url?: string
          blocks?: Json
          canonical_url?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          meta_keywords?: string | null
          noindex?: boolean
          og_image?: string | null
          product_ids?: string[]
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      delivery_zones: {
        Row: {
          created_at: string
          description: string | null
          fee: number
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          fee?: number
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          fee?: number
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          metadata: Json
          order_id: string | null
          provider: string
          provider_message_id: string | null
          recipient: string
          status: string
          subject: string | null
          template_key: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          metadata?: Json
          order_id?: string | null
          provider?: string
          provider_message_id?: string | null
          recipient: string
          status?: string
          subject?: string | null
          template_key?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          metadata?: Json
          order_id?: string | null
          provider?: string
          provider_message_id?: string | null
          recipient?: string
          status?: string
          subject?: string | null
          template_key?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          category: string
          created_at: string
          html_body: string
          id: string
          is_active: boolean
          name: string
          subject: string
          template_key: string
          text_body: string | null
          updated_at: string
          variables: Json
        }
        Insert: {
          category?: string
          created_at?: string
          html_body?: string
          id?: string
          is_active?: boolean
          name: string
          subject: string
          template_key: string
          text_body?: string | null
          updated_at?: string
          variables?: Json
        }
        Update: {
          category?: string
          created_at?: string
          html_body?: string
          id?: string
          is_active?: boolean
          name?: string
          subject?: string
          template_key?: string
          text_body?: string | null
          updated_at?: string
          variables?: Json
        }
        Relationships: []
      }
      fraud_checks: {
        Row: {
          cancel_parcel: number
          checked_at: string
          created_at: string
          id: string
          phone: string
          response: Json
          score: number
          source: string
          status: string
          success_parcel: number
          total_parcel: number
          updated_at: string
        }
        Insert: {
          cancel_parcel?: number
          checked_at?: string
          created_at?: string
          id?: string
          phone: string
          response?: Json
          score?: number
          source?: string
          status?: string
          success_parcel?: number
          total_parcel?: number
          updated_at?: string
        }
        Update: {
          cancel_parcel?: number
          checked_at?: string
          created_at?: string
          id?: string
          phone?: string
          response?: Json
          score?: number
          source?: string
          status?: string
          success_parcel?: number
          total_parcel?: number
          updated_at?: string
        }
        Relationships: []
      }
      header_categories: {
        Row: {
          badge: string | null
          banner_desktop: string | null
          banner_mobile: string | null
          canonical_url: string | null
          created_at: string
          cta_link: string | null
          cta_text: string | null
          icon_url: string | null
          id: string
          is_active: boolean
          is_featured: boolean
          long_description: string | null
          mega_columns: number
          menu_type: string
          meta_description: string | null
          meta_keywords: string | null
          name: string
          og_image: string | null
          parent_id: string | null
          seo_title: string | null
          short_description: string | null
          show_in_footer: boolean
          show_in_header: boolean
          show_in_mobile: boolean
          show_on_homepage: boolean
          slug: string
          sort_order: number
          status: string
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          badge?: string | null
          banner_desktop?: string | null
          banner_mobile?: string | null
          canonical_url?: string | null
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          long_description?: string | null
          mega_columns?: number
          menu_type?: string
          meta_description?: string | null
          meta_keywords?: string | null
          name: string
          og_image?: string | null
          parent_id?: string | null
          seo_title?: string | null
          short_description?: string | null
          show_in_footer?: boolean
          show_in_header?: boolean
          show_in_mobile?: boolean
          show_on_homepage?: boolean
          slug: string
          sort_order?: number
          status?: string
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          badge?: string | null
          banner_desktop?: string | null
          banner_mobile?: string | null
          canonical_url?: string | null
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          long_description?: string | null
          mega_columns?: number
          menu_type?: string
          meta_description?: string | null
          meta_keywords?: string | null
          name?: string
          og_image?: string | null
          parent_id?: string | null
          seo_title?: string | null
          short_description?: string | null
          show_in_footer?: boolean
          show_in_header?: boolean
          show_in_mobile?: boolean
          show_on_homepage?: boolean
          slug?: string
          sort_order?: number
          status?: string
          thumbnail_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "header_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "header_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      homepage_sections: {
        Row: {
          config: Json
          created_at: string
          enabled: boolean
          id: string
          section_key: string
          sort_order: number
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          enabled?: boolean
          id?: string
          section_key: string
          sort_order?: number
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          enabled?: boolean
          id?: string
          section_key?: string
          sort_order?: number
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      landing_pages: {
        Row: {
          blocks: Json
          canonical_url: string | null
          created_at: string
          expire_at: string | null
          id: string
          meta_description: string | null
          meta_keywords: string | null
          noindex: boolean
          og_image: string | null
          page_type: string
          publish_at: string | null
          seo_title: string | null
          slug: string
          sort_order: number
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          blocks?: Json
          canonical_url?: string | null
          created_at?: string
          expire_at?: string | null
          id?: string
          meta_description?: string | null
          meta_keywords?: string | null
          noindex?: boolean
          og_image?: string | null
          page_type?: string
          publish_at?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          blocks?: Json
          canonical_url?: string | null
          created_at?: string
          expire_at?: string | null
          id?: string
          meta_description?: string | null
          meta_keywords?: string | null
          noindex?: boolean
          og_image?: string | null
          page_type?: string
          publish_at?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          confirmation_token: string | null
          confirmed_at: string | null
          created_at: string
          email: string
          id: string
          source: string | null
          status: string
          unsubscribed_at: string | null
        }
        Insert: {
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string
          email: string
          id?: string
          source?: string | null
          status?: string
          unsubscribed_at?: string | null
        }
        Update: {
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string
          email?: string
          id?: string
          source?: string | null
          status?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          admin_notes: string | null
          advance_payment: number
          call_attempts: number
          consignment_id: string | null
          coupon_code: string | null
          courier_fee: number
          courier_provider: string | null
          created_at: string
          customer_address: string
          customer_city: string
          customer_email: string | null
          customer_name: string
          customer_note: string | null
          customer_phone: string
          deleted_at: string | null
          delivery_charge: number
          delivery_method: string
          discount: number
          fbclid: string | null
          gateway_txn_id: string | null
          gclid: string | null
          id: string
          items: Json
          landing_page: string | null
          order_token: string | null
          paid_amount: number
          payment_gateway: string | null
          payment_method: string
          payment_sender_number: string | null
          payment_status: string
          referrer_url: string | null
          return_received: boolean
          source: string
          status: string
          total: number
          tracking_code: string | null
          transaction_id: string | null
          ttclid: string | null
          updated_at: string
          user_id: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          admin_notes?: string | null
          advance_payment?: number
          call_attempts?: number
          consignment_id?: string | null
          coupon_code?: string | null
          courier_fee?: number
          courier_provider?: string | null
          created_at?: string
          customer_address: string
          customer_city: string
          customer_email?: string | null
          customer_name: string
          customer_note?: string | null
          customer_phone: string
          deleted_at?: string | null
          delivery_charge?: number
          delivery_method?: string
          discount?: number
          fbclid?: string | null
          gateway_txn_id?: string | null
          gclid?: string | null
          id?: string
          items: Json
          landing_page?: string | null
          order_token?: string | null
          paid_amount?: number
          payment_gateway?: string | null
          payment_method?: string
          payment_sender_number?: string | null
          payment_status?: string
          referrer_url?: string | null
          return_received?: boolean
          source?: string
          status?: string
          total: number
          tracking_code?: string | null
          transaction_id?: string | null
          ttclid?: string | null
          updated_at?: string
          user_id?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          admin_notes?: string | null
          advance_payment?: number
          call_attempts?: number
          consignment_id?: string | null
          coupon_code?: string | null
          courier_fee?: number
          courier_provider?: string | null
          created_at?: string
          customer_address?: string
          customer_city?: string
          customer_email?: string | null
          customer_name?: string
          customer_note?: string | null
          customer_phone?: string
          deleted_at?: string | null
          delivery_charge?: number
          delivery_method?: string
          discount?: number
          fbclid?: string | null
          gateway_txn_id?: string | null
          gclid?: string | null
          id?: string
          items?: Json
          landing_page?: string | null
          order_token?: string | null
          paid_amount?: number
          payment_gateway?: string | null
          payment_method?: string
          payment_sender_number?: string | null
          payment_status?: string
          referrer_url?: string | null
          return_received?: boolean
          source?: string
          status?: string
          total?: number
          tracking_code?: string | null
          transaction_id?: string | null
          ttclid?: string | null
          updated_at?: string
          user_id?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      packaging_options: {
        Row: {
          created_at: string
          description: string | null
          fee: number
          id: string
          is_active: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          fee?: number
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          fee?: number
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      payment_audit_log: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_label: string | null
          entity_type: string
          id: string
          ip_address: string | null
          new_value: Json | null
          old_value: Json | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_label?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          new_value?: Json | null
          old_value?: Json | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_label?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          new_value?: Json | null
          old_value?: Json | null
          user_agent?: string | null
        }
        Relationships: []
      }
      payment_gateways: {
        Row: {
          config: Json
          created_at: string
          credentials: Json
          discount_type: string | null
          discount_value: number
          display_name: string
          extra_charge: number
          gateway: string
          gateway_type: string
          icon: string | null
          id: string
          instructions: string | null
          is_active: boolean
          is_builtin: boolean
          last_payment_at: string | null
          last_test_at: string | null
          last_test_ok: boolean | null
          last_webhook_at: string | null
          manual_config: Json
          max_order_amount: number | null
          min_order_amount: number
          mode: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          credentials?: Json
          discount_type?: string | null
          discount_value?: number
          display_name: string
          extra_charge?: number
          gateway: string
          gateway_type?: string
          icon?: string | null
          id?: string
          instructions?: string | null
          is_active?: boolean
          is_builtin?: boolean
          last_payment_at?: string | null
          last_test_at?: string | null
          last_test_ok?: boolean | null
          last_webhook_at?: string | null
          manual_config?: Json
          max_order_amount?: number | null
          min_order_amount?: number
          mode?: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          credentials?: Json
          discount_type?: string | null
          discount_value?: number
          display_name?: string
          extra_charge?: number
          gateway?: string
          gateway_type?: string
          icon?: string | null
          id?: string
          instructions?: string | null
          is_active?: boolean
          is_builtin?: boolean
          last_payment_at?: string | null
          last_test_at?: string | null
          last_test_ok?: boolean | null
          last_webhook_at?: string | null
          manual_config?: Json
          max_order_amount?: number | null
          min_order_amount?: number
          mode?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      payment_refunds: {
        Row: {
          amount: number
          created_at: string
          gateway: string
          gateway_refund_id: string | null
          id: string
          notes: string | null
          order_id: string | null
          processed_at: string | null
          processed_by: string | null
          reason: string | null
          status: string
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          gateway: string
          gateway_refund_id?: string | null
          id?: string
          notes?: string | null
          order_id?: string | null
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          gateway?: string
          gateway_refund_id?: string | null
          id?: string
          notes?: string | null
          order_id?: string | null
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_refunds_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_refunds_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "payment_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_status_history: {
        Row: {
          changed_by: string | null
          changed_by_email: string | null
          created_at: string
          id: string
          new_status: string
          old_status: string | null
          order_id: string
          reason: string | null
          transaction_id: string | null
        }
        Insert: {
          changed_by?: string | null
          changed_by_email?: string | null
          created_at?: string
          id?: string
          new_status: string
          old_status?: string | null
          order_id: string
          reason?: string | null
          transaction_id?: string | null
        }
        Update: {
          changed_by?: string | null
          changed_by_email?: string | null
          created_at?: string
          id?: string
          new_status?: string
          old_status?: string | null
          order_id?: string
          reason?: string | null
          transaction_id?: string | null
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          admin_note: string | null
          amount: number
          created_at: string
          currency: string
          customer_phone: string | null
          error_message: string | null
          gateway: string
          gateway_txn_id: string | null
          id: string
          is_advance: boolean
          order_id: string | null
          proof_url: string | null
          raw_response: Json
          sender_number: string | null
          status: string
          updated_at: string
          val_id: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          admin_note?: string | null
          amount: number
          created_at?: string
          currency?: string
          customer_phone?: string | null
          error_message?: string | null
          gateway: string
          gateway_txn_id?: string | null
          id?: string
          is_advance?: boolean
          order_id?: string | null
          proof_url?: string | null
          raw_response?: Json
          sender_number?: string | null
          status?: string
          updated_at?: string
          val_id?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          admin_note?: string | null
          amount?: number
          created_at?: string
          currency?: string
          customer_phone?: string | null
          error_message?: string | null
          gateway?: string
          gateway_txn_id?: string | null
          id?: string
          is_advance?: boolean
          order_id?: string | null
          proof_url?: string | null
          raw_response?: Json
          sender_number?: string | null
          status?: string
          updated_at?: string
          val_id?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string | null
          color: string | null
          created_at: string
          id: string
          image_url: string
          product_id: string
          sort_order: number
        }
        Insert: {
          alt_text?: string | null
          color?: string | null
          created_at?: string
          id?: string
          image_url: string
          product_id: string
          sort_order?: number
        }
        Update: {
          alt_text?: string | null
          color?: string | null
          created_at?: string
          id?: string
          image_url?: string
          product_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_size_stock: {
        Row: {
          cancelled_count: number
          created_at: string
          id: string
          product_id: string
          returned_count: number
          size: string
          sold_count: number
          total_stock: number
          updated_at: string
        }
        Insert: {
          cancelled_count?: number
          created_at?: string
          id?: string
          product_id: string
          returned_count?: number
          size: string
          sold_count?: number
          total_stock?: number
          updated_at?: string
        }
        Update: {
          cancelled_count?: number
          created_at?: string
          id?: string
          product_id?: string
          returned_count?: number
          size?: string
          sold_count?: number
          total_stock?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_size_stock_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          alt_text: string | null
          brand: string
          category: string
          colors: Json
          created_at: string
          description: string
          featured: boolean
          id: string
          image_url: string
          is_active: boolean
          is_new_drop: boolean
          name: string
          noindex: boolean
          og_image: string | null
          original_price: number | null
          price: number
          product_info: Json
          seo_description: string | null
          seo_title: string | null
          size_chart: Json | null
          sizes: string[]
          sku: string
          slug: string | null
          stock: number
          subcategory: string | null
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          brand?: string
          category: string
          colors?: Json
          created_at?: string
          description?: string
          featured?: boolean
          id?: string
          image_url?: string
          is_active?: boolean
          is_new_drop?: boolean
          name: string
          noindex?: boolean
          og_image?: string | null
          original_price?: number | null
          price: number
          product_info?: Json
          seo_description?: string | null
          seo_title?: string | null
          size_chart?: Json | null
          sizes?: string[]
          sku?: string
          slug?: string | null
          stock?: number
          subcategory?: string | null
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          brand?: string
          category?: string
          colors?: Json
          created_at?: string
          description?: string
          featured?: boolean
          id?: string
          image_url?: string
          is_active?: boolean
          is_new_drop?: boolean
          name?: string
          noindex?: boolean
          og_image?: string | null
          original_price?: number | null
          price?: number
          product_info?: Json
          seo_description?: string | null
          seo_title?: string | null
          size_chart?: Json | null
          sizes?: string[]
          sku?: string
          slug?: string | null
          stock?: number
          subcategory?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          display_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string
          created_at: string
          email: string | null
          helpful_count: number
          id: string
          name: string
          photo_url: string | null
          photo_urls: string[]
          product_id: string
          rating: number
          title: string | null
          user_id: string | null
          verified: boolean
        }
        Insert: {
          comment?: string
          created_at?: string
          email?: string | null
          helpful_count?: number
          id?: string
          name: string
          photo_url?: string | null
          photo_urls?: string[]
          product_id: string
          rating: number
          title?: string | null
          user_id?: string | null
          verified?: boolean
        }
        Update: {
          comment?: string
          created_at?: string
          email?: string | null
          helpful_count?: number
          id?: string
          name?: string
          photo_url?: string | null
          photo_urls?: string[]
          product_id?: string
          rating?: number
          title?: string | null
          user_id?: string | null
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value?: string
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      stock_logs: {
        Row: {
          change_type: string
          created_at: string
          id: string
          notes: string | null
          order_id: string | null
          product_id: string
          quantity: number
          size: string
        }
        Insert: {
          change_type?: string
          created_at?: string
          id?: string
          notes?: string | null
          order_id?: string | null
          product_id: string
          quantity?: number
          size: string
        }
        Update: {
          change_type?: string
          created_at?: string
          id?: string
          notes?: string | null
          order_id?: string | null
          product_id?: string
          quantity?: number
          size?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_logs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_logs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      store_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value?: string
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      subcategories: {
        Row: {
          badge: string | null
          canonical_url: string | null
          created_at: string
          icon_url: string | null
          id: string
          is_active: boolean
          long_description: string | null
          meta_description: string | null
          meta_keywords: string | null
          name: string
          og_image: string | null
          parent_category: string
          parent_id: string | null
          seo_title: string | null
          short_description: string | null
          slug: string
          sort_order: number
          status: string
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          badge?: string | null
          canonical_url?: string | null
          created_at?: string
          icon_url?: string | null
          id?: string
          is_active?: boolean
          long_description?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          name: string
          og_image?: string | null
          parent_category: string
          parent_id?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug: string
          sort_order?: number
          status?: string
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          badge?: string | null
          canonical_url?: string | null
          created_at?: string
          icon_url?: string | null
          id?: string
          is_active?: boolean
          long_description?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          name?: string
          og_image?: string | null
          parent_category?: string
          parent_id?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug?: string
          sort_order?: number
          status?: string
          thumbnail_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "header_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      tracking_codes: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          enabled: boolean
          id: string
          label: string
          location: Database["public"]["Enums"]["tracking_code_location"]
          sort_order: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          code?: string
          created_at?: string
          created_by?: string | null
          enabled?: boolean
          id?: string
          label: string
          location?: Database["public"]["Enums"]["tracking_code_location"]
          sort_order?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          enabled?: boolean
          id?: string
          label?: string
          location?: Database["public"]["Enums"]["tracking_code_location"]
          sort_order?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      tracking_codes_audit: {
        Row: {
          action: string
          changed_by: string | null
          code_id: string | null
          created_at: string
          id: string
          label: string | null
          location: Database["public"]["Enums"]["tracking_code_location"] | null
          snapshot: Json | null
        }
        Insert: {
          action: string
          changed_by?: string | null
          code_id?: string | null
          created_at?: string
          id?: string
          label?: string | null
          location?:
            | Database["public"]["Enums"]["tracking_code_location"]
            | null
          snapshot?: Json | null
        }
        Update: {
          action?: string
          changed_by?: string | null
          code_id?: string | null
          created_at?: string
          id?: string
          label?: string | null
          location?:
            | Database["public"]["Enums"]["tracking_code_location"]
            | null
          snapshot?: Json | null
        }
        Relationships: []
      }
      tracking_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value?: string
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      trash_users: {
        Row: {
          address: string | null
          city: string | null
          deleted_at: string
          display_name: string | null
          email: string | null
          id: string
          original_user_id: string
          phone: string | null
          role: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          deleted_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          original_user_id: string
          phone?: string | null
          role?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          deleted_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          original_user_id?: string
          phone?: string | null
          role?: string | null
        }
        Relationships: []
      }
      unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          expires_at: string | null
          id: string
          scope: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          expires_at?: string | null
          id?: string
          scope?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string | null
          id?: string
          scope?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      blog_comments_public: {
        Row: {
          content: string | null
          created_at: string | null
          guest_name: string | null
          id: string | null
          is_approved: boolean | null
          post_id: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          guest_name?: string | null
          id?: string | null
          is_approved?: boolean | null
          post_id?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          guest_name?: string | null
          id?: string | null
          is_approved?: boolean | null
          post_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews_public: {
        Row: {
          comment: string | null
          created_at: string | null
          helpful_count: number | null
          id: string | null
          name: string | null
          photo_url: string | null
          photo_urls: string[] | null
          product_id: string | null
          rating: number | null
          title: string | null
          user_id: string | null
          verified: boolean | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string | null
          name?: string | null
          photo_url?: string | null
          photo_urls?: string[] | null
          product_id?: string | null
          rating?: number | null
          title?: string | null
          user_id?: string | null
          verified?: boolean | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string | null
          name?: string | null
          photo_url?: string | null
          photo_urls?: string[] | null
          product_id?: string | null
          rating?: number | null
          title?: string | null
          user_id?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      can_upload_payment_proof: { Args: { _name: string }; Returns: boolean }
      can_upload_review_photo: { Args: { _name: string }; Returns: boolean }
      create_order: {
        Args: { _order: Json }
        Returns: {
          admin_notes: string | null
          advance_payment: number
          call_attempts: number
          consignment_id: string | null
          coupon_code: string | null
          courier_fee: number
          courier_provider: string | null
          created_at: string
          customer_address: string
          customer_city: string
          customer_email: string | null
          customer_name: string
          customer_note: string | null
          customer_phone: string
          deleted_at: string | null
          delivery_charge: number
          delivery_method: string
          discount: number
          fbclid: string | null
          gateway_txn_id: string | null
          gclid: string | null
          id: string
          items: Json
          landing_page: string | null
          order_token: string | null
          paid_amount: number
          payment_gateway: string | null
          payment_method: string
          payment_sender_number: string | null
          payment_status: string
          referrer_url: string | null
          return_received: boolean
          source: string
          status: string
          total: number
          tracking_code: string | null
          transaction_id: string | null
          ttclid: string | null
          updated_at: string
          user_id: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        SetofOptions: {
          from: "*"
          to: "orders"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      finalize_cod_payment: { Args: { _order_id: string }; Returns: Json }
      finalize_payment: {
        Args: { _gateway_ref?: string; _txn_id: string }
        Returns: Json
      }
      get_active_payment_methods: {
        Args: never
        Returns: {
          config: Json
          discount_type: string
          discount_value: number
          display_name: string
          extra_charge: number
          gateway: string
          gateway_type: string
          icon: string
          instructions: string
          manual_config: Json
          max_order_amount: number
          min_order_amount: number
          mode: string
          slug: string
          sort_order: number
        }[]
      }
      get_public_tracking_codes: {
        Args: never
        Returns: {
          code: string
          id: string
          label: string
          location: Database["public"]["Enums"]["tracking_code_location"]
          sort_order: number
        }[]
      }
      get_public_tracking_settings: {
        Args: never
        Returns: {
          key: string
          value: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_review_helpful: {
        Args: { _review_id: string }
        Returns: number
      }
      log_payment_audit: {
        Args: {
          _action: string
          _entity_id?: string
          _entity_label?: string
          _entity_type: string
          _ip_address?: string
          _new_value?: Json
          _old_value?: Json
          _user_agent?: string
        }
        Returns: string
      }
      set_payment_transaction_status: {
        Args: { _new_status: string; _reason?: string; _txn_id: string }
        Returns: Json
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      slugify: { Args: { _text: string }; Returns: string }
      submit_manual_payment: {
        Args: {
          _gateway: string
          _is_advance?: boolean
          _order_id: string
          _proof_url?: string
          _sender_number?: string
          _transaction_id?: string
        }
        Returns: Json
      }
      track_blog_view: {
        Args: { _post_id: string; _visitor_id: string }
        Returns: undefined
      }
      validate_coupon: {
        Args: { _code: string }
        Returns: {
          code: string
          discount_type: string
          discount_value: number
          id: string
          max_uses: number
          min_order_amount: number
          used_count: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      tracking_code_location: "head" | "body_top" | "body_bottom"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      tracking_code_location: ["head", "body_top", "body_bottom"],
    },
  },
} as const
