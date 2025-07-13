import ResponseModel from "./responseModel.js";

class BaseResponse {
    public data?: any;
    public dataResponse!: ResponseModel;
    constructor(dataResponse: ResponseModel) {
        this.dataResponse = dataResponse;
    }
}
export default BaseResponse;
