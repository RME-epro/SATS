async function handler({
  method,
  scheduleId,
  equipmentId,
  scheduledDate,
  type,
  description,
  assignedTo,
  priority,
  estimatedDuration,
}) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    switch (method) {
      case "GET": {
        if (scheduleId) {
          const [schedule] = await sql`
            SELECT ms.*, e.name as equipment_name, au.name as assigned_user_name 
            FROM maintenance_schedules ms
            LEFT JOIN equipment e ON e.id = ms.equipment_id
            LEFT JOIN users u ON u.id = ms.assigned_to
            LEFT JOIN auth_users au ON au.id = u.auth_user_id
            WHERE ms.id = ${scheduleId}
          `;
          return { schedule };
        }

        const schedules = await sql`
          SELECT ms.*, e.name as equipment_name, au.name as assigned_user_name 
          FROM maintenance_schedules ms
          LEFT JOIN equipment e ON e.id = ms.equipment_id
          LEFT JOIN users u ON u.id = ms.assigned_to
          LEFT JOIN auth_users au ON au.id = u.auth_user_id
          ORDER BY ms.scheduled_date DESC
        `;
        return { schedules };
      }

      case "POST": {
        const [schedule] = await sql`
          INSERT INTO maintenance_schedules (
            equipment_id, scheduled_date, type, description, 
            assigned_to, status, priority, estimated_duration, created_by
          )
          VALUES (
            ${equipmentId}, ${scheduledDate}, ${type}, ${description},
            ${assignedTo}, 'scheduled', ${priority || "normal"}, 
            ${estimatedDuration}, ${session.user.id}
          )
          RETURNING *
        `;

        if (assignedTo) {
          await sql`
            INSERT INTO notifications (
              user_id, title, message, type, priority
            )
            VALUES (
              ${assignedTo},
              'Tugas Maintenance Baru',
              ${`Anda ditugaskan untuk maintenance ${type} pada ${new Date(
                scheduledDate
              ).toLocaleDateString("id-ID")}`},
              'maintenance_assignment',
              ${priority || "normal"}
            )
          `;
        }

        return { schedule };
      }

      case "PUT": {
        const [existingSchedule] = await sql`
          SELECT assigned_to FROM maintenance_schedules WHERE id = ${scheduleId}
        `;

        const [updatedSchedule] = await sql`
          UPDATE maintenance_schedules
          SET 
            equipment_id = ${equipmentId},
            scheduled_date = ${scheduledDate},
            type = ${type},
            description = ${description},
            assigned_to = ${assignedTo},
            priority = ${priority},
            estimated_duration = ${estimatedDuration}
          WHERE id = ${scheduleId}
          RETURNING *
        `;

        if (assignedTo && existingSchedule.assigned_to !== assignedTo) {
          await sql`
            INSERT INTO notifications (
              user_id, title, message, type, priority
            )
            VALUES (
              ${assignedTo},
              'Perubahan Tugas Maintenance',
              ${`Anda ditugaskan untuk maintenance ${type} pada ${new Date(
                scheduledDate
              ).toLocaleDateString("id-ID")}`},
              'maintenance_update',
              ${priority || "normal"}
            )
          `;
        }

        return { schedule: updatedSchedule };
      }

      case "DELETE": {
        const [deletedSchedule] = await sql`
          DELETE FROM maintenance_schedules 
          WHERE id = ${scheduleId}
          RETURNING *
        `;

        if (deletedSchedule.assigned_to) {
          await sql`
            INSERT INTO notifications (
              user_id, title, message, type
            )
            VALUES (
              ${deletedSchedule.assigned_to},
              'Pembatalan Maintenance',
              'Jadwal maintenance yang ditugaskan kepada Anda telah dibatalkan',
              'maintenance_cancellation'
            )
          `;
        }

        return { success: true };
      }

      default:
        return { error: "Method tidak didukung" };
    }
  } catch (error) {
    console.error("Error:", error);
    return { error: "Terjadi kesalahan dalam memproses permintaan" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}