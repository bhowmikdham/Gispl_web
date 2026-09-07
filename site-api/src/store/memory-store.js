/* In-process store — no disk, no AWS.

   This exists so the lead path can run on a serverless host that has neither:
   a contact form only needs to reach a human, and with a mail provider
   configured the notification email IS the record. Records are also kept in
   memory for the life of the process so a health check or a local run can see
   them; nothing here survives a restart, and nothing is meant to.

   WHAT THIS IS NOT SAFE FOR: the newsletter double opt-in. Confirming a
   subscription requires the pending record written by one request to still be
   there when the confirmation link is clicked minutes later, in a different
   invocation. Under STORE=memory that lookup misses and the confirmation
   fails, so a deployment that offers the newsletter needs STORE=dynamo (or any
   durable store). getStore() warns about exactly this at boot. */

const MAX_KEPT = 500;

export function createMemoryStore() {
  const leads = [];
  const applications = [];
  const subscribers = new Map();
  const rate = new Map();

  // Bounded: a long-lived process must not grow a list forever just because it
  // is convenient to keep the last few records visible.
  function push(list, item) {
    list.push(item);
    if (list.length > MAX_KEPT) list.splice(0, list.length - MAX_KEPT);
    return item;
  }

  return {
    async ready() {},

    async putLead(lead) {
      return push(leads, lead);
    },

    async putApplication(app) {
      return push(applications, app);
    },

    async getSubscriber(email) {
      return subscribers.get(email) || null;
    },

    async putSubscriber(sub) {
      subscribers.set(sub.email, sub);
      return sub;
    },

    async bumpRate(key, windowSeconds) {
      const now = Math.floor(Date.now() / 1000);
      const windowStart = now - (now % windowSeconds);
      if (rate.size > 5000) {
        for (const [k, v] of rate) if (v.windowStart !== windowStart) rate.delete(k);
      }
      const cur = rate.get(key);
      if (!cur || cur.windowStart !== windowStart) {
        rate.set(key, { windowStart, hits: 1 });
        return 1;
      }
      cur.hits += 1;
      return cur.hits;
    },

    /** Test/diagnostic seam — not exposed over HTTP by any route. */
    _snapshot() {
      return { leads, applications, subscribers: [...subscribers.values()] };
    },
  };
}
