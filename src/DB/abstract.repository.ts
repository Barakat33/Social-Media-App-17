import { promises } from "dns";
import { Model, RootFilterQuery,ProjectionType, QueryOptions, MongooseUpdateQueryOptions, UpdateQuery, Document } from "mongoose";

export abstract class AbstractRepostory<T>{ 
    constructor(protected model:Model<T>) {}

    async create(item:Partial <T>) {
        const doc = new this.model(item);
        return await doc.save() as Document<T>;
    }

    async getOne(
        filter:RootFilterQuery<T>,
        Projection?:ProjectionType<T>,
        Options?:QueryOptions<T>

    ) {
        return await this.model.findOne(filter,Projection,Options); 
    }


    async exist(
        filter:RootFilterQuery<T>,
        Projection?:ProjectionType<T>,
        Options?:QueryOptions<T>

    ) {
        return await this.model.findOne(filter,Projection,Options); 
    }

    async update(
        filter:RootFilterQuery<T>,
        update:UpdateQuery<T>,
        Options?:MongooseUpdateQueryOptions<T>
    ) {
    this.model.updateOne(filter,update,Options)
    }

    async delete(filter:RootFilterQuery<T>) {
        await this.model.deleteOne(filter);
    }

    
}
    