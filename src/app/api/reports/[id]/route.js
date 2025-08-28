import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing report ID" }),
        { status: 400 }
      );
    }

    // Delete from Supabase
    const { error } = await supabase.from("reports").delete().eq("id", id);

    if (error) {
      console.error("Supabase delete error:", error);
      return new Response(
        JSON.stringify({ success: false, message: error.message }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("API delete error:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
