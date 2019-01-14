'use strict';

class DataModel {
  /**
   *Creates an instance of DataModel.
   * @param {*} schema
   * @memberof DataModel
   * @module models
   */
  constructor(schema){
    this.schema = schema; 
  }

  /**
   * get model
   * @param {*} _id
   * @returns
   * @memberof DataModel
   */
  get(_id) {
    let queryObject = _id ? {_id} : {};
    return this.schema.find(queryObject);
  }
      
  /**
   * post model
   * @param {*} record
   * @returns
   * @memberof DataModel
   */
  post(record) {
    let newRecord = new this.schema(record);
    return newRecord.save();
  }
    
  /**
   * put model
   * @param {*} _id
   * @param {*} record
   * @returns
   * @memberof DataModel
   */
  put(_id, record) {
    return this.schema.findByIdAndUpdate(_id, record, {new:true});
  }
    
  /**
   * delete model
   * @param {*} _id
   * @returns
   * @memberof DataModel
   */
  delete(_id) {
    return this.schema.findByIdAndDelete(_id);
  }
    
}

module.exports = DataModel;
