// Enums for Table Type
export enum eReturnCodes {
  R_SUCCESS = 0,
  R_DB_ERROR = 1,
  R_NOT_FOUND = 2,
  R_AUTHENTICATION_FAILED = 3,
  R_INVALID_REQUEST = 4,
}

export enum eGender {
  MALE = 1,
  FEMALE = 2,
  OTHER = 3
}

/**
 * Enum for commonly used honorific titles.
 */
export enum eHonorifics {
  MR = 1,        // Mr. - Male honorific
  MS = 2,        // Ms. - Female honorific, used regardless of marital status
  MRS = 3,       // Mrs. - Married female honorific
  DR = 4,        // Dr. - Doctor (medical or academic)
  PROF = 5,      // Prof. - Professor (academic title)
  MISS = 6,      // Miss - Unmarried female honorific
  MX = 7,        // Mx. - Gender-neutral honorific
  SIR = 8,       // Sir - Male honorific, also used for knights in the UK
  MADAM = 9,     // Madam - Female honorific, formal or official contexts
  REV = 10,      // Rev. - Reverend (religious title)
  FR = 11,       // Fr. - Father (Catholic priest or religious leader)
  LADY = 12,     // Lady - Female nobility title in British usage
  LORD = 13      // Lord - Male nobility title in British usage
}


export enum eLeadType {
  BOOK_DEMO = 1,
  CONTACT_US = 2,
  SUBSCRIBE = 3
}


export enum eImportExportType {
  IMPORT = 1,
  EXPORT = 2
}

export enum eSearchType {
  SIMPLE_SEARCH = 1,
  ADVANCED_SEARCH = 2,
  SYNONYM_SEARCH = 3,
  CAS_NUMBER_SEARCH = 4
}

export enum eDatabase {
  TRADE_ANALYTICS = 1
}