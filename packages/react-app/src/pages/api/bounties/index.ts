import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import Bounty from '../../../models/Bounty';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {
	const { method } = req;
	const status: string = req.query.status as string;
	const search: string = req.query.search as string;
	const minReward: string = req.query.minReward as string;
	const maxReward: string = req.query.maxReward as string;

	await dbConnect();

	switch (method) {
	case 'GET':
		try {
			let bounties = [];
			bounties = await handleFilters(status, search, minReward, maxReward);
			res.status(200).json({ success: true, data: bounties });
		} catch (error) {
			res.status(400).json({ success: false });
		}
		break;
	default:
		res.status(400).json({ success: false });
		break;
	}
}

const handleFilters = async (status: string, search: string, minReward: string, maxReward: string): Promise<any> => {
	let filterQuery: {status?: any, $text?: any, 'reward.amount'?: any};
	if (status == null || status == '' || status == 'All') {
		filterQuery = { status: ['Open', 'In-Progress', 'In-Review', 'Completed'] };
	} else {
		filterQuery = { status: status };
	}

	if (!(search == null || search == '')) {
		filterQuery['$text'] = { $search: search };
	}

	if (!(minReward == null || minReward == '')) {
		const minRewardNumber = parseInt(minReward);
		filterQuery['reward.amount'] = { $gte: minRewardNumber };
	}

	if (!(maxReward == null || maxReward == '')) {
		const maxRewardNumber = parseInt(maxReward);
		filterQuery['reward.amount'] = { $lte: maxRewardNumber };
	}

	const isEmpty: boolean = Object.values(filterQuery).every(x => x === null || x === '');
	filterQuery = isEmpty ? {} : filterQuery;
	return Bounty.find(filterQuery);
};