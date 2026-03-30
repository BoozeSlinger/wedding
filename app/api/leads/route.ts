import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase only if env vars are provided
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.source) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Console log to simulate persistent backend lead capture
    console.log("\n===================================");
    console.log("🚀 NEW LEAD CAPTURED 🚀");
    console.log("Source:", data.source); // 'concierge' or 'budget'
    console.log("Venue:", data.venue);
    console.log("Name:", data.name);
    console.log("Email:", data.email);
    console.log("Details:", JSON.stringify(data.details, null, 2));
    console.log("===================================\n");

    if (supabase) {
      try {
        const { error: dbError } = await supabase.from('leads').insert([{
          name: data.name,
          email: data.email,
          source: data.source,
          venue_preference: data.venue,
          user_preferences: data.details || {},
        }]);

        if (dbError) {
           console.error("❌ Supabase insert error:", dbError);
        } else {
           console.log("✅ Lead successfully persisted to Supabase database.");
        }
      } catch (err) {
         console.error("❌ Exception persisting to Supabase:", err);
      }
    } else {
      console.warn("⚠️ No Supabase connection configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env to persist leads.");
      // Artificial delay to simulate DB write when no DB is connected for premium feel.
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    return NextResponse.json(
      { success: true, message: "Lead captured successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lead capture error:", error);
    return NextResponse.json(
      { error: "Internal server error processing lead" },
      { status: 500 }
    );
  }
}
