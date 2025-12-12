import { db } from '../../config/database';
import { visibilityDataItems, visibilityRules } from '../../db/schema';

export const visibilityService = {
    async getItems() {
        return await db.select().from(visibilityDataItems);
    },

    async getRules() {
        return await db.select().from(visibilityRules);
    }
};
