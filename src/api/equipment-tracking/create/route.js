async function handler({ equipment_id, user_id, start_time, notes }) {
  try {
    if (!equipment_id || !user_id || !start_time) {
      return {
        error:
          "Missing required fields: equipment_id, user_id, and start_time are required",
      };
    }

    const [equipment] = await sql`
      SELECT status FROM equipment WHERE id = ${equipment_id}
    `;

    if (!equipment) {
      return {
        error: "Equipment not found",
      };
    }

    if (equipment.status !== "available") {
      return {
        error: "Equipment is not available for tracking",
      };
    }

    const [tracking] = await sql.transaction([
      sql`
        INSERT INTO equipment_tracking 
        (equipment_id, user_id, start_time, notes, status)
        VALUES 
        (${equipment_id}, ${user_id}, ${start_time}, ${notes || null}, 'active')
        RETURNING id
      `,
      sql`
        UPDATE equipment 
        SET status = 'in_use' 
        WHERE id = ${equipment_id}
      `,
    ]);

    return {
      success: true,
      tracking_id: tracking.id,
    };
  } catch (error) {
    return {
      error: "Failed to create equipment tracking",
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}