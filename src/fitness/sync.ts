import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * The entire fitness app state, stored opaquely as one JSON document — the same
 * "whole doc in a row" approach the trip planner uses for its plan. The app owns
 * the shape; the sync layer only moves the blob around.
 */
export type FitnessDoc = Record<string, unknown>;

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
/** Personal code — every device using the same code shares one private log. */
const FITNESS_ID = (import.meta.env.VITE_FITNESS_ID as string | undefined) ?? 'my-fitness';

const TABLE = 'fitness';

export function isFitnessSyncConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export interface FitnessSync {
  load(): Promise<FitnessDoc | null>;
  save(doc: FitnessDoc): Promise<void>;
  subscribe(cb: (doc: FitnessDoc) => void): () => void;
}

/**
 * Cross-device persistence backed by Supabase: the whole document lives in a
 * single `fitness` row keyed by the personal code, with Postgres Realtime
 * fanning changes out to every connected device. Mirrors the trip planner's
 * SupabaseSyncProvider — last write wins.
 */
class SupabaseFitnessSync implements FitnessSync {
  private client: SupabaseClient;

  constructor() {
    this.client = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      realtime: { params: { eventsPerSecond: 5 } },
    });
  }

  async load(): Promise<FitnessDoc | null> {
    const { data, error } = await this.client
      .from(TABLE)
      .select('doc')
      .eq('id', FITNESS_ID)
      .maybeSingle();
    if (error || !data) return null;
    return data.doc as FitnessDoc;
  }

  async save(doc: FitnessDoc): Promise<void> {
    await this.client
      .from(TABLE)
      .upsert({ id: FITNESS_ID, doc, updated_at: new Date().toISOString() });
  }

  subscribe(cb: (doc: FitnessDoc) => void): () => void {
    const channel = this.client
      .channel(`fitness-${FITNESS_ID}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLE, filter: `id=eq.${FITNESS_ID}` },
        (payload) => {
          const next = (payload.new as { doc?: FitnessDoc } | null)?.doc;
          if (next) cb(next);
        },
      )
      .subscribe();

    return () => {
      void this.client.removeChannel(channel);
    };
  }
}

/**
 * Returns the Supabase-backed sync when keys are configured, otherwise null —
 * in which case the app persists locally to this browser only (see app.js).
 */
export function createFitnessSync(): FitnessSync | null {
  return isFitnessSyncConfigured() ? new SupabaseFitnessSync() : null;
}
