import * as mongoose from 'mongoose';

import {IModifyDateModel} from '../interfaces/model';

/**
 * Create/Modify date info
 * @param {mongoose.Schema} schema plugin's schema object
 */
export function modifyDate(schema: mongoose.Schema) {
    schema.add({
        createdAt: Date,
        updateAt: Date
    });
    schema.pre<IModifyDateModel>('save', function(next) {
        const now: Date = new Date();
        if (!this.createdAt) {
            this.createdAt = now;
        }
        this.updateAt = now;
        next();
    });
}
