async function handler({ requestId, status, approvalNotes }) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const result = await sql.transaction(async (sql) => {
      const [request] = await sql`
        SELECT equipment_id, borrowing_status 
        FROM equipment_tracking 
        WHERE id = ${requestId}
      `;

      if (!request) {
        return { error: "Request not found" };
      }

      if (request.borrowing_status !== "pending") {
        return { error: "Request has already been processed" };
      }

      await sql`
        UPDATE equipment_tracking 
        SET 
          borrowing_status = ${status},
          approval_notes = ${approvalNotes}
        WHERE id = ${requestId}
      `;

      if (status === "approved") {
        await sql`
          UPDATE equipment 
          SET status = 'in-use' 
          WHERE id = ${request.equipment_id}
        `;
      }

      return { success: true };
    });

    return result;
  } catch (error) {
    return { error: "Failed to update borrowing status" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}