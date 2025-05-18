async function handler({ equipment_id, template_id, items, notes }) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const [user] = await sql`
      SELECT id FROM users WHERE auth_user_id = ${session.user.id}
    `;

    if (!user) {
      return { error: "User not found" };
    }

    const result = await sql.transaction(async (sql) => {
      const [checklist] = await sql`
        INSERT INTO completed_checklists 
        (equipment_id, template_id, user_id, notes)
        VALUES 
        (${equipment_id}, ${template_id}, ${user.id}, ${notes})
        RETURNING id
      `;

      const itemValues = items.map((item) => ({
        completed_checklist_id: checklist.id,
        checklist_item_id: item.checklist_item_id,
        status: item.status,
        notes: item.notes,
      }));

      const completedItems = await sql`
        INSERT INTO completed_checklist_items 
        (completed_checklist_id, checklist_item_id, status, notes)
        SELECT 
          ${checklist.id},
          x.checklist_item_id,
          x.status,
          x.notes
        FROM jsonb_to_recordset(${JSON.stringify(itemValues)}::jsonb) 
        AS x(completed_checklist_id int, checklist_item_id int, status text, notes text)
        RETURNING *
      `;

      return { checklist, items: completedItems };
    });

    return { success: true, data: result };
  } catch (error) {
    return { error: error.message };
  }
}
export async function POST(request) {
  return handler(await request.json());
}