import cron from 'node-cron';
import UserMaster from '../models/userMaster'; // your Users collection
import UsersUsage from '../models/userUsageModel';

const dailyResetTime = process.env.DAILY_RESET_TIME || '0 0 * * *'; // Default to midnight if not set

// Runs every day at midnight
cron.schedule(dailyResetTime, async () => {
    try {
        console.log('Cron job started: resetting UsersUsage at midnight');

        // 1️⃣ Mark all existing usage entries as inactive
        await UsersUsage.updateMany({}, { $set: { isActive: 0 } });

        // 2️⃣ Fetch all active users
        const allUsers = await UserMaster.find({ isActive: 1, isAdmin: 0 });

        // 3️⃣ Prepare new usage entries
        const newUsageEntries = allUsers.map((user: any) => ({
            userId: user._id,
            usedSearch: 0,
            remainingSearch: user.dailySearchLimit || 10, // default daily limit
            isActive: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }));

        // 4️⃣ Insert new entries
        if (newUsageEntries.length > 0) {
            await UsersUsage.insertMany(newUsageEntries);
        }

        console.log('UsersUsage reset completed successfully');
    } catch (err) {
        console.error('Error in cron job:', err);
    }
});
