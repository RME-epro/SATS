async function handler({ equipment_id, user_id, start_time, notes }) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  if (!equipment_id || !user_id || !start_time) {
    return { error: "Missing required fields" };
  }

  try {
    const [equipment] = await sql`
      SELECT * FROM equipment 
      WHERE id = ${equipment_id} 
      AND status = 'available'
    `;

    if (!equipment) {
      return { error: "Equipment not found or unavailable" };
    }

    const [tracking] = await sql.transaction([
      sql`
        INSERT INTO equipment_tracking 
        (equipment_id, user_id, start_time, notes) 
        VALUES 
        (${equipment_id}, ${user_id}, ${start_time}, ${notes})
        RETURNING *
      `,
      sql`
        UPDATE equipment 
        SET status = 'in_use' 
        WHERE id = ${equipment_id}
      `,
    ]);

    return { tracking };
  } catch (error) {
    return { error: "Failed to create tracking record" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}