async function handler({ trackingId, status, endTime, notes }) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  if (!trackingId || !status || !["troubled", "completed"].includes(status)) {
    return { error: "Invalid parameters" };
  }

  try {
    const result = await sql.transaction(async (sql) => {
      const [tracking] = await sql`
        SELECT * FROM equipment_tracking 
        WHERE id = ${trackingId} AND status = 'active'
      `;

      if (!tracking) {
        throw new Error("Active tracking record not found");
      }

      const [updated] = await sql`
        UPDATE equipment_tracking 
        SET 
          status = ${status},
          end_time = ${endTime || new Date()},
          notes = ${notes || null}
        WHERE id = ${trackingId}
        RETURNING *
      `;

      if (status === "troubled") {
        await sql`
          UPDATE equipment 
          SET status = 'maintenance_needed' 
          WHERE id = ${tracking.equipment_id}
        `;
      } else if (status === "completed") {
        await sql`
          UPDATE equipment 
          SET status = 'available' 
          WHERE id = ${tracking.equipment_id}
        `;
      }

      return updated;
    });

    return { success: true, tracking: result };
  } catch (error) {
    return { error: error.message };
  }
}
export async function POST(request) {
  return handler(await request.json());
}