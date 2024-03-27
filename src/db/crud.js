const { getDrizzleDbClient } = require('./client');
const schema = require('./schema');

async function newLead(eMail) {
  const db = await getDrizzleDbClient();
  const result = await db
    .insert(schema.LeadTable)
    .values({
      email,
    })
    .returning();

  return result;
}

async function listLeads() {}

module.exports.newLead = newLead;
module.exports.listLeads = listLeads;
