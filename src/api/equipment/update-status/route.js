async function handler({ equipmentId, status }) {
  if (!equipmentId || !status) {
    return { error: "Equipment ID and status are required" };
  }

  const validStatuses = ["available", "in_use", "maintenance"];
  if (!validStatuses.includes(status)) {
    return {
      error: "Invalid status. Must be: available, in_use, or maintenance",
    };
  }

  try {
    const [equipment] = await sql`
      UPDATE equipment 
      SET status = ${status}
      WHERE id = ${equipmentId}
      RETURNING *
    `;

    if (!equipment) {
      return { error: "Equipment not found" };
    }

    return { equipment };
  } catch (error) {
    return { error: "Failed to update equipment status" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}