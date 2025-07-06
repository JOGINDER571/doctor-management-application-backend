export type ErrorDetail = {
  status_code: number; // Http status code
  error_code: string; // Custom error code
  message: string;
};

type ErrorCategories = {
  GENERAL_ERROR: ErrorDetail;
  INVALID_INPUT: ErrorDetail;
  RESOURCE: any;
  AUTHENTICATION: {
    INVALID_CREDENTIALS: ErrorDetail;
    UNAUTHORIZED: ErrorDetail;
    INVALID_CODE: ErrorDetail;
    CODE_EXPIRED: ErrorDetail;
    NOT_FOUND: ErrorDetail;
  };
  AUTHORIZATION: {
    FORBIDDEN: ErrorDetail;
    TOKEN_EXPIRED: ErrorDetail;
    INVALID_TOKEN: ErrorDetail;
  };
  VALIDATION: {
    MISSING_FIELD: ErrorDetail;
    INVALID_DATA_FORMAT: ErrorDetail;
    INVALID_QUERY_PARAM: ErrorDetail;
  };
  DATABASE: {
    CONFLICT: ErrorDetail;
    OPERATION_FAILED: ErrorDetail;
    NOT_FOUND: ErrorDetail;
  };
  SERVICE: {
    OPERATION_FAILED: ErrorDetail;
    MFA: ErrorDetail;
  };
  GENERAL: {
    NOT_FOUND: ErrorDetail;
    SERVER_ERROR: ErrorDetail;
    BAD_REQUEST: ErrorDetail;
    CONFLICT: ErrorDetail;
  };
  APPOINTMENTS: {
    ALREADY_FILLED: ErrorDetail;
  };
};

export const ERROR_CODES: ErrorCategories = {
  AUTHENTICATION: {
    INVALID_CREDENTIALS: {
      status_code: 401,
      error_code: "ERR-AUTH-001",
      message: "Invalid username or password.",
    },
    UNAUTHORIZED: {
      status_code: 401,
      error_code: "ERR-AUTH-002",
      message: "Unauthorized access.",
    },
    INVALID_CODE: {
      status_code: 401,
      error_code: "ERR-AUTH-003",
      message: "Invalid code",
    },
    CODE_EXPIRED: {
      status_code: 401,
      error_code: "ERR-AUTH-004",
      message: "Code expired.",
    },
    NOT_FOUND: {
      status_code: 404,
      error_code: "ERR-AUTH-005",
      message: "User not found.",
    },
  },
  AUTHORIZATION: {
    FORBIDDEN: {
      status_code: 403,
      error_code: "ERR-AUTHZ-001",
      message: "Unauthorized access.",
    },
    TOKEN_EXPIRED: {
      status_code: 403,
      error_code: "ERR-AUTHZ-002",
      message: "Expired token.",
    },
    INVALID_TOKEN: {
      status_code: 403,
      error_code: "ERR-AUTHZ-003",
      message: "Invalid token.",
    },
  },
  VALIDATION: {
    MISSING_FIELD: {
      status_code: 400,
      error_code: "ERR-VAL-001",
      message: "Missing required field.",
    },
    INVALID_DATA_FORMAT: {
      status_code: 400,
      error_code: "ERR-VAL-002",
      message: "Invalid data.",
    },
    INVALID_QUERY_PARAM: {
      status_code: 400,
      error_code: "ERR-VAL-003",
      message: "Invalid Query Param.",
    },
  },
  DATABASE: {
    OPERATION_FAILED: {
      status_code: 500,
      error_code: "ERR-DB-001",
      message: "Internal server error. Please try again later.",
    },
    NOT_FOUND: {
      status_code: 404,
      error_code: "ERR-DB-002",
      message: "Data not found.",
    },
    CONFLICT: {
      status_code: 409,
      error_code: "ERR-DB-002",
      message: "Data conflict occurred.",
    },
  },
  SERVICE: {
    MFA: {
      status_code: 500,
      error_code: "ERR-MFA-001",
      message: "Failed to send MFA code.",
    },
    OPERATION_FAILED: {
      status_code: 500,
      error_code: "ERR-SVC-001",
      message: "Internal server error. Please try again later.",
    },
  },

  GENERAL: {
    SERVER_ERROR: {
      status_code: 500,
      error_code: "ERR-GEN-001",
      message: "Internal server error. Please try again later.",
    },
    BAD_REQUEST: {
      status_code: 400,
      error_code: "ERR-GEN-002",
      message: "Bad Request.",
    },
    CONFLICT: {
      status_code: 409,
      error_code: "ERR-GEN-003",
      message: "Resource already exists.",
    },
    NOT_FOUND: {
      status_code: 404,
      error_code: "ERR-GEN-004",
      message: "Resource not found.",
    },
  },
  INVALID_INPUT: {
    status_code: 400,
    error_code: "ERR-VAL-004",
    message: "Invalid input provided.",
  },

  GENERAL_ERROR: {
    status_code: 500,
    error_code: "ERR-GEN-005",
    message: "An unexpected error occurred. Please try again later.",
  },
  RESOURCE: undefined,
  APPOINTMENTS: {
    ALREADY_FILLED: {
      status_code: 409,
      error_code: "APP-GEN-001",
      message: "Slot is already booked",
    },
  },
};
