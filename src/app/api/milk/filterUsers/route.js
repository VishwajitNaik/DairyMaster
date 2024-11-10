import { Connect } from '@/dbconfig/dbconfig'; // Adjust the import based on your project structure
import User from '@/models/userModel';
import Milk from '@/models/MilkModel';

Connect();

export async function GET(req, res) {
  
    const { currentDate, currentTime } = req.query;

    try {
        // Find users who have already recorded milk for the current session
        const recordedUsers = await Milk.find({
            date: currentDate,
            greetings: currentTime
        }).select('createdBy'); // Get only the user IDs

        const recordedUserIds = recordedUsers.map(record => record.createdBy.toString());

        // Find users who have not recorded milk for the current session
        const users = await User.find({
            _id: { $nin: recordedUserIds }
        });

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
}
