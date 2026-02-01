import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("Authorization") ?? "";

    // Verify caller
    const userClient = createClient(supabaseUrl, anonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = userData.user.id;

    const admin = createClient(supabaseUrl, serviceKey);

    // Delete conversation messages first (FK-like dependency)
    const { data: conversations } = await admin
      .from("ai_conversations")
      .select("id")
      .eq("user_id", userId);

    if (conversations?.length) {
      const ids = conversations.map((c: any) => c.id);
      await admin.from("ai_messages").delete().in("conversation_id", ids);
    }

    // Delete user-owned rows (best-effort)
    await Promise.allSettled([
      admin.from("ai_conversations").delete().eq("user_id", userId),
      admin.from("bookmarks").delete().eq("user_id", userId),
      admin.from("dua_bookmarks").delete().eq("user_id", userId),
      admin.from("hadith_bookmarks").delete().eq("user_id", userId),
      admin.from("reading_progress").delete().eq("user_id", userId),
      admin.from("last_viewed_surah").delete().eq("user_id", userId),
      admin.from("ayah_interactions").delete().eq("user_id", userId),
      admin.from("user_zakat_data").delete().eq("user_id", userId),
      admin.from("user_stats").delete().eq("user_id", userId),
      admin.from("profiles").delete().eq("user_id", userId),
      admin.from("user_settings").delete().eq("user_id", userId),
    ]);

    // Delete avatar files
    try {
      const { data: files } = await admin.storage.from("avatars").list(userId, {
        limit: 100,
      });
      if (files?.length) {
        await admin.storage
          .from("avatars")
          .remove(files.map((f: any) => `${userId}/${f.name}`));
      }
    } catch {
      // ignore
    }

    // Finally delete the auth user
    const { error: delErr } = await admin.auth.admin.deleteUser(userId);
    if (delErr) throw delErr;

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : String(e) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
