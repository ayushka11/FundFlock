import cron from "node-cron";
import CommunityService from "../services/communityService";

async function bulkUpdateCommunityStatusJob() {
  try {
    console.log("🔄 Running scheduled job to update community statuses...");

    const today = new Date();
    const communities = await CommunityService.getAllCommunities();

    if (!communities || communities.length === 0) {
      console.log("✅ No communities found for status update.");
      return;
    }

    const pendingToActive: string[] = [];
    const activeToCompleted: string[] = [];
    const activeToDead: string[] = [];

    communities.forEach((community) => {
      const expiring_date = new Date(community.expiring_date);
      const communityId = community._id.toString(); 

      if (community.status === "pending" && today >= expiring_date) {
        pendingToActive.push(communityId);
      } else if (community.status === "active") {
        if (today >= expiring_date) {
          activeToCompleted.push(communityId);
        } else if (
          community.last_activity && 
          isInactiveTooLong(new Date(community.last_activity), today) 
        ) {
          activeToDead.push(communityId);
        }
      }
    });

    // Bulk update all at once with proper logging
    await updateCommunityStatuses(pendingToActive, "active");
    await updateCommunityStatuses(activeToCompleted, "completed");
    await updateCommunityStatuses(activeToDead, "dead");

  } catch (error) {
    console.error("❌ Error in cron job:", error);
  }
}

// Function to update communities and log modifiedCount
async function updateCommunityStatuses(communityIds: string[], status: string) {
  if (!communityIds.length) return;

  try {
    const result = await CommunityService.bulkUpdateCommunityStatus(communityIds, status);
    console.log(`✅ Updated ${result.modifiedCount} communities to "${status}".`);
  } catch (error) {
    console.error(`❌ Failed to update communities to "${status}":`, error);
  }
}

// Function to check if a community is inactive for too long
function isInactiveTooLong(lastActivity: Date, today: Date): boolean {
  const inactiveThreshold = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
  return today.getTime() - lastActivity.getTime() > inactiveThreshold;
}

// Schedule the cron job (runs every day at midnight)
cron.schedule("0 0 * * *", bulkUpdateCommunityStatusJob, {
  timezone: "Asia/Kolkata",
});

console.log("✅ Cron job scheduled: Bulk updating community statuses daily at midnight.");
