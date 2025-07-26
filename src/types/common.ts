import { eReturnCodes } from "../enums/commonEnums.js";

export type TRequest = {
    orgId?: number;
    requestDateTime: Date;
    requestSource?: number;
    request: string;
    ipAddress: string;
    originName: string;
    isDeleted: number;
};

export type TResponse = {
    resultCode: eReturnCodes;
    responseDateTime: Date;
};

export type TAuthorizationModel = {
    userId: number;
    isAdmin: number;
    emailId: string;
    mobileNumber: string;
};

export type TEmailOptions = {
    receiverEmail?: string;
    password?: string;
    emailPurpose: string;
    email?: string;
    name?: string;
    phone?: string;
    subject?: string;
    message?: string;
    company?: string;
    date?: string | any;
    time?: string | any;
    emailType?: string;
};

export type TMenuHierarchy = {
    id: number;
    name: string;
    dispName: string;
    parentId: number;
    entityUrl: string;
    description: string;
    isActive: number;
    orgId: number;
    iconName: string;
    displayOrder: number;
    children: TMenuHierarchy[];
    privileges: TPrivilege[];
};

export type TPrivilege = {
    id?: number;
    name: string;
    groupId: string;
    menuId: number;
};

export type TRolePrivilege = {
    id?: number;
    roleId: number;
    privilegeId: number;
};

export type TAttendanceViewByDate = {
    employeeId: number;
    employeeUniqueId: string;
    attendanceDate: Date | null;
    attendanceStatus: number;
    shiftStartTime: Date | null;
    shiftEndTime: Date | null;
    shiftName: string;
    actualInTime: Date | null;
    actualOutTime: Date | null;
    effectiveWorkedMinutes: number;
    lateInMinutes: number;
    earlyOutMinutes: number;
    payDay: number;
    isRegularized: number;
    regularizedRemark: string;
    punchIns: string[];
};
