/**
 * Database types, a tiny stub for now.
 *
 * Eventually we'll generate this with `supabase gen types typescript` after
 * the schema is live, and replace the stubs below with the auto-generated
 * shape. For now we keep just enough typing to compile.
 */

export type Database = {
  public: {
    Tables: Record<string, { Row: unknown; Insert: unknown; Update: unknown }>;
    Views: Record<string, { Row: unknown }>;
    Functions: Record<string, unknown>;
    Enums: Record<string, string>;
  };
};
