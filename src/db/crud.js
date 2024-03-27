const { eq } = require('drizzle-orm');
const { getDrizzleDbClient } = require('./client');
const schema = require('./schema');

async function newLead(data) {
  const db = await getDrizzleDbClient();
  const result = await db.insert(schema.LeadTable).values(data).returning();

  if (result.length) {
    return result.at(0);
  }
}

async function listLeads() {
  const db = await getDrizzleDbClient();
  const result = await db.select().from(schema.LeadTable);
  return result;
}

async function getLead(id) {
  const db = await getDrizzleDbClient();
  const result = await db
    .select()
    .from(schema.LeadTable)
    .where(eq(schema.LeadTable.id, id));

  if (result.length === 1) {
    return result.at(0);
  }
  return null;
}

module.exports.newLead = newLead;
module.exports.listLeads = listLeads;
module.exports.getLead = getLead;
