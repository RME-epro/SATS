async function handler({
  equipmentId,
  startTime,
  endTime,
  notes,
  expectedReturnTime,
}) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const user = await sql`
    SELECT u.id FROM users u 
    WHERE u.auth_user_id = ${session.user.id}
  `;

  if (!user?.[0]?.id) {
    return { error: "User not found" };
  }

  const equipment = await sql`
    SELECT * FROM equipment 
    WHERE id = ${equipmentId} AND status = 'available'
  `;

  if (!equipment?.[0]) {
    return { error: "Equipment not found or unavailable" };
  }

  const tracking = await sql`
    INSERT INTO equipment_tracking (
      equipment_id,
      user_id,
      start_time,
      end_time,
      notes,
      expected_return_time,
      borrowing_status
    ) VALUES (
      ${equipmentId},
      ${user[0].id},
      ${startTime},
      ${endTime},
      ${notes},
      ${expectedReturnTime},
      'pending'
    )
    RETURNING *
  `;

  return {
    success: true,
    tracking: tracking[0],
  };
}
export async function POST(request) {
  return handler(await request.json());
}