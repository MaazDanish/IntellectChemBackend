class RequestModel {
    public data!: any;
    public auth_token!: AuthorizationModel;
    constructor() {}
  }
  class AuthorizationModel {
    public userId!: string;
    public fullName!: string;
    public emailId!: string;
    public userName!: string;
    public orgId!: number;
    public isMaster!: number;
  }
  export default RequestModel;
  